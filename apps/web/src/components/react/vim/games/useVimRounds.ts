import { EditorState, type Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { vim } from "@replit/codemirror-vim";
import { useCallback, useEffect, useRef, useState } from "react";
import { useVimSuspend } from "../../useVimSuspend";

export type Phase = "idle" | "playing" | "done";

export interface RoundResult {
  /** ms from the editor appearing to the round being solved */
  time: number;
  /** keys pressed inside the editor (modifier keys alone are not counted) */
  keys: number;
  arrows: boolean;
}

export interface RoundSpec<I> {
  doc: string;
  cursor?: number;
  extensions?: Extension[];
  solved: (state: EditorState) => boolean;
  /** shown by the game while the round runs (target, goal, hint...) */
  info: I;
}

const MODIFIERS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock"]);
const ARROWS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

export function gameTheme(height: string, fontSize = "14px", gutters = false) {
  return EditorView.theme({
    "&": { backgroundColor: "#18181b", color: "#e4e4e7", fontSize, height },
    ".cm-content": { fontFamily: '"JetBrains Mono", monospace', caretColor: "#14b8a6", padding: "12px 0" },
    ".cm-line": { padding: "0 12px" },
    ".cm-cursor": { borderLeftColor: "#14b8a6" },
    ".cm-gutters": gutters ? { backgroundColor: "#09090b", color: "#52525b", border: "none" } : { display: "none" },
    ".cm-activeLine": { backgroundColor: "#14b8a614" },
    ".cm-activeLineGutter": { backgroundColor: "#14b8a622", color: "#14b8a6" },
    ".cm-vim-target": { backgroundColor: "#f59e0b33", outline: "1px solid #f59e0b", borderRadius: "2px" },
    ".cm-vim-target-line": { backgroundColor: "#f59e0b1f" },
  });
}

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Round engine shared by the vim games.
 * Each round mounts a fresh vim editor, counts the keys pressed inside it and
 * records exactly one result when `solved` first becomes true; the next round
 * starts after a short pause.
 */
export function useVimRounds<I>(totalRounds: number, makeRound: (index: number) => RoundSpec<I>) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [info, setInfo] = useState<I | null>(null);
  const [keys, setKeys] = useState(0);
  const [arrows, setArrows] = useState(false);
  const [results, setResults] = useState<RoundResult[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const makeRef = useRef(makeRound);
  makeRef.current = makeRound;
  useVimSuspend(phase === "playing");

  useEffect(() => {
    if (phase !== "playing" || !editorRef.current) return;
    const spec = makeRef.current(round);
    setInfo(spec.info);
    setKeys(0);
    setArrows(false);

    let solved = false;
    let count = 0;
    let usedArrows = false;
    let next: ReturnType<typeof setTimeout> | undefined;
    const started = Date.now();

    const finish = () => {
      solved = true;
      const result = { time: Date.now() - started, keys: Math.max(count, 1), arrows: usedArrows };
      next = setTimeout(() => {
        setResults((prev) => [...prev, result]);
        if (round + 1 < totalRounds) setRound(round + 1);
        else setPhase("done");
      }, 350);
    };

    const view = new EditorView({
      parent: editorRef.current,
      state: EditorState.create({
        doc: spec.doc,
        selection: { anchor: spec.cursor ?? 0 },
        extensions: [
          vim(),
          EditorState.allowMultipleSelections.of(true),
          EditorView.contentAttributes.of({ "aria-label": "vim editor" }),
          ...(spec.extensions ?? []),
          EditorView.updateListener.of((u) => {
            if (!solved && (u.docChanged || u.selectionSet) && spec.solved(u.state)) finish();
          }),
        ],
      }),
    });
    viewRef.current = view;

    const onKey = (e: KeyboardEvent) => {
      if (solved || MODIFIERS.has(e.key)) return;
      count += 1;
      setKeys(count);
      if (ARROWS.has(e.key)) {
        usedArrows = true;
        setArrows(true);
      }
    };
    view.dom.addEventListener("keydown", onKey, true);
    view.dispatch({ effects: EditorView.scrollIntoView(spec.cursor ?? 0, { y: "center" }) });
    view.focus();

    return () => {
      clearTimeout(next);
      view.dom.removeEventListener("keydown", onKey, true);
      view.destroy();
      viewRef.current = null;
    };
  }, [phase, round, totalRounds]);

  const start = useCallback(() => {
    setResults([]);
    setRound(0);
    setPhase("playing");
  }, []);

  const reset = useCallback(() => {
    setPhase("idle");
    setResults([]);
    setRound(0);
  }, []);

  return { phase, round, info, keys, arrows, results, editorRef, viewRef, start, reset };
}
