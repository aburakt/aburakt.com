import { Decoration, EditorView, lineNumbers } from "@codemirror/view";
import { useEffect, useState } from "react";
import { saveVimStat } from "../../useAuth";
import { GameFrame, ResultList, StartButton } from "./GameFrame";
import { gameTheme, useVimRounds } from "./useVimRounds";

interface Props {
  locale: string;
}

const lines = [
  "function processData(input) {",
  "  const result = [];",
  "  for (let i = 0; i < input.length; i++) {",
  "    if (input[i] > threshold) {",
  "      result.push(transform(input[i]));",
  "    } else {",
  "      result.push(input[i]);",
  "    }",
  "  }",
  "  return result.filter(Boolean);",
  "}",
  "",
  "const config = {",
  "  timeout: 5000,",
  "  retries: 3,",
  "  debug: false,",
  "  verbose: true,",
  "  maxItems: 100,",
  "};",
  "export default config;",
];
const doc = lines.join("\n");
const offsets: number[] = [];
for (let i = 0, at = 0; i < lines.length; at += lines[i].length + 1, i++) offsets.push(at);

const theme = gameTheme("420px", "14px", true);
const TOTAL = 8;

interface Info {
  start: number;
  target: number;
}

export default function RelativeJump({ locale }: Props) {
  const tr = locale === "tr";
  const [line, setLine] = useState(0);
  const game = useVimRounds<Info>(TOTAL, () => {
    const start = Math.floor(Math.random() * lines.length);
    let target = start;
    while (Math.abs(target - start) < 3) target = Math.floor(Math.random() * lines.length);
    setLine(start);
    return {
      doc,
      cursor: offsets[start],
      extensions: [
        theme,
        lineNumbers(),
        EditorView.decorations.of(
          Decoration.set([Decoration.line({ class: "cm-vim-target-line" }).range(offsets[target])]),
        ),
        EditorView.updateListener.of((u) => {
          if (u.selectionSet) setLine(u.state.doc.lineAt(u.state.selection.main.head).number - 1);
        }),
      ],
      solved: (s) => s.doc.lineAt(s.selection.main.head).number - 1 === target,
      info: { start, target },
    };
  });

  const totalKeys = game.results.reduce((a, r) => a + r.keys, 0);
  const penalties = game.results.filter((r) => r.arrows).length;

  useEffect(() => {
    if (game.phase === "done")
      saveVimStat({ game: "relative-jump", score: totalKeys + penalties * 5, keystrokes: totalKeys });
  }, [game.phase, totalKeys, penalties]);

  const target = game.info?.target ?? 0;
  const diff = target - line;
  return (
    <GameFrame
      title="🎯 Relative Jump"
      description={
        tr
          ? "İşaretli satıra sayılı zıplamayla (5j, 12k) ulaşın. Skor toplam tuş sayısıdır, düşük olan iyidir; ok tuşu kullanılan her tur +5 ceza."
          : "Reach the marked line with counted jumps (5j, 12k). Score is total keystrokes, lower is better; every round that uses arrow keys adds +5."
      }
    >
      {game.phase === "idle" && <StartButton tr={tr} rounds={TOTAL} onClick={game.start} />}

      {game.phase === "playing" && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-green-700">
            <span>
              {tr ? "Tur" : "Round"} {game.round + 1}/{TOTAL}
            </span>
            <span>
              {tr ? "Tuş sayısı" : "Keystrokes"}: {game.keys}
            </span>
          </div>
          <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-400" data-jump>
            {tr ? "Hedef satır" : "Target line"}: <span className="font-mono font-bold">{target + 1}</span>
            {" · "}
            {tr ? "Şu anki satır" : "Current line"}: <span className="font-mono">{line + 1}</span>
            {" · "}
            <span className="font-mono">{diff === 0 ? "✓" : `${Math.abs(diff)}${diff > 0 ? "j" : "k"}`}</span>
          </p>
          <div ref={game.editorRef} className="overflow-hidden rounded-lg border border-green-900/30" />
          {game.arrows && (
            <p className="text-xs text-red-400">
              {tr
                ? "Ok tuşu kullanıldı (+5). Sayılı zıplama deneyin: 5j, 3k."
                : "Arrow keys used (+5). Try counted jumps: 5j, 3k."}
            </p>
          )}
        </div>
      )}

      {game.phase === "done" && (
        <ResultList
          tr={tr}
          headline={`${tr ? "Skor" : "Score"}: ${totalKeys + penalties * 5} (${totalKeys} ${tr ? "tuş" : "keys"}${penalties ? ` + ${penalties}×5 ${tr ? "ceza" : "penalty"}` : ""})`}
          rows={game.results.map((r) => `${r.keys} ${tr ? "tuş" : "keys"}${r.arrows ? " · +5" : ""}`)}
          onAgain={game.start}
        />
      )}
    </GameFrame>
  );
}
