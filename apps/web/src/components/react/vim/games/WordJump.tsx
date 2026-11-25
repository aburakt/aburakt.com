import { Decoration, EditorView, lineNumbers } from "@codemirror/view";
import { useEffect } from "react";
import { saveVimStat } from "../../useAuth";
import { GameFrame, ResultList, StartButton } from "./GameFrame";
import { gameTheme, useVimRounds } from "./useVimRounds";

interface Props {
  locale: string;
}

const doc = [
  'const express = require("express");',
  "const app = express();",
  "const router = express.Router();",
  "",
  'router.get("/users", async (req, res) => {',
  '  const users = await db.query("SELECT * FROM users");',
  "  res.json({ success: true, data: users });",
  "});",
  "",
  'router.post("/users", async (req, res) => {',
  "  const { name, email } = req.body;",
  "  const result = await db.insert({ name, email });",
  "  res.status(201).json({ id: result.id });",
  "});",
  "",
  'app.use("/api", router);',
  'app.listen(3000, () => console.log("Server running"));',
].join("\n");

const words = Array.from(doc.matchAll(/\b\w{2,}\b/g), (m) => ({
  word: m[0],
  from: m.index,
  to: m.index + m[0].length,
}));
const lineOf = (pos: number) => doc.slice(0, pos).split("\n").length;

const theme = gameTheme("380px", "14px", true);
const TOTAL = 8;

interface Info {
  word: string;
  from: number;
  line: number;
}

export default function WordJump({ locale }: Props) {
  const tr = locale === "tr";
  const game = useVimRounds<Info>(TOTAL, () => {
    // start and target on nearby lines so word motions (w, b, e, f, t) are the natural tool
    const startIdx = Math.floor(Math.random() * words.length);
    const near = words
      .map((w, i) => ({ ...w, i }))
      .filter((w) => Math.abs(w.i - startIdx) >= 2 && Math.abs(w.i - startIdx) <= 8);
    const target = near[Math.floor(Math.random() * near.length)];
    return {
      doc,
      cursor: words[startIdx].from,
      extensions: [
        theme,
        lineNumbers(),
        EditorView.decorations.of(
          Decoration.set([Decoration.mark({ class: "cm-vim-target" }).range(target.from, target.to)]),
        ),
      ],
      solved: (s) => {
        const head = s.selection.main.head;
        return head >= target.from && head < target.to;
      },
      info: { word: target.word, from: target.from, line: lineOf(target.from) },
    };
  });

  const totalKeys = game.results.reduce((a, r) => a + r.keys, 0);

  useEffect(() => {
    if (game.phase === "done") saveVimStat({ game: "word-jump", score: totalKeys, keystrokes: totalKeys });
  }, [game.phase, totalKeys]);

  return (
    <GameFrame
      title="🏃 Word Jump"
      description={
        tr
          ? "İmleci işaretli kelimeye w, b, e, f{karakter}, t{karakter} ile götürün. Skor toplam tuş sayısıdır, düşük olan iyidir."
          : "Move the cursor onto the marked word with w, b, e, f{char}, t{char}. Score is total keystrokes, lower is better."
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
          {game.info && (
            <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-400">
              {tr ? "Hedef" : "Target"}: <span className="font-mono font-bold">{game.info.word}</span>
              {" · "}
              {tr ? "satır" : "line"} <span className="font-mono">{game.info.line}</span>
              <span className="text-green-700"> ({tr ? "editörde işaretli" : "marked in the editor"})</span>
            </p>
          )}
          <div ref={game.editorRef} className="overflow-hidden rounded-lg border border-green-900/30" />
        </div>
      )}

      {game.phase === "done" && (
        <ResultList
          tr={tr}
          headline={`${tr ? "Toplam tuş" : "Total keystrokes"}: ${totalKeys} · ${tr ? "ortalama" : "average"} ${(totalKeys / TOTAL).toFixed(1)}`}
          rows={game.results.map((r) => `${r.keys} ${tr ? "tuş" : "keys"}`)}
          onAgain={game.start}
        />
      )}
    </GameFrame>
  );
}
