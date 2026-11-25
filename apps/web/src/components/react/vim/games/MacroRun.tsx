import { useEffect, useState } from "react";
import { saveVimStat } from "../../useAuth";
import { GameFrame, ResultList, StartButton, secs } from "./GameFrame";
import { gameTheme, useVimRounds } from "./useVimRounds";

interface Props {
  locale: string;
}

interface Challenge {
  initial: string;
  goal: string;
  /** a macro that works from any cursor position: it starts with 0 and ends with j */
  macro: string;
}

const challenges: Challenge[] = [
  {
    initial: "foo_bar\nfoo_baz\nfoo_qux\nfoo_quux\nfoo_corge",
    goal: "fooBar\nfooBaz\nfooQux\nfooQuux\nfooCorge",
    macro: "qa 0f_x~j q · 4@a",
  },
  {
    initial: "item1\nitem2\nitem3\nitem4\nitem5",
    goal: "- item1\n- item2\n- item3\n- item4\n- item5",
    macro: "qa I- <Esc>j q · 4@a",
  },
  {
    initial: "let a = 1;\nlet b = 2;\nlet c = 3;\nlet d = 4;\nlet e = 5;",
    goal: "const a = 1;\nconst b = 2;\nconst c = 3;\nconst d = 4;\nconst e = 5;",
    macro: "qa 0cwconst<Esc>j q · 4@a",
  },
  {
    initial: "name: alice\nname: bob\nname: charlie\nname: dave\nname: eve",
    goal: 'name: "alice"\nname: "bob"\nname: "charlie"\nname: "dave"\nname: "eve"',
    macro: 'qa 0f:wi"<Esc>A"<Esc>j q · 4@a',
  },
];

const theme = gameTheme("200px", "14px", true);
const TOTAL = challenges.length;

export default function MacroRun({ locale }: Props) {
  const tr = locale === "tr";
  const [showHint, setShowHint] = useState(false);
  const game = useVimRounds<Challenge>(TOTAL, (i) => {
    const ch = challenges[i];
    setShowHint(false);
    return { doc: ch.initial, extensions: [theme], solved: (s) => s.doc.toString() === ch.goal, info: ch };
  });

  const totalKeys = game.results.reduce((a, r) => a + r.keys, 0);
  const totalTime = game.results.reduce((a, r) => a + r.time, 0);

  useEffect(() => {
    if (game.phase === "done") saveVimStat({ game: "macro-run", score: totalKeys, keystrokes: totalKeys });
  }, [game.phase, totalKeys]);

  const ch = game.info;
  return (
    <GameFrame
      title="🔄 Macro Run"
      description={
        tr
          ? "Aynı düzenlemeyi beş satıra makroyla uygulayın: qa ile kaydedin, q ile durdurun, @a ile tekrarlayın. Skor toplam tuş sayısıdır, düşük olan iyidir."
          : "Apply the same edit to five lines with a macro: record with qa, stop with q, replay with @a. Score is total keystrokes, lower is better."
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
          {ch && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
              <p className="mb-1 text-xs text-green-700">{tr ? "Hedef" : "Goal"}:</p>
              <pre className="whitespace-pre font-mono text-xs text-green-400">{ch.goal}</pre>
            </div>
          )}
          <div ref={game.editorRef} className="overflow-hidden rounded-lg border border-green-900/30" />
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="text-xs text-green-700 hover:text-green-600"
          >
            {showHint ? (tr ? "İpucunu gizle" : "Hide hint") : tr ? "İpucu göster" : "Show hint"}
          </button>
          {showHint && ch && (
            <p className="text-xs text-yellow-400/80">
              {tr ? "Makro" : "Macro"}: <kbd className="font-mono">{ch.macro}</kbd>
            </p>
          )}
        </div>
      )}

      {game.phase === "done" && (
        <ResultList
          tr={tr}
          headline={`${tr ? "Toplam tuş" : "Total keystrokes"}: ${totalKeys} · ${secs(totalTime)}`}
          rows={game.results.map((r) => `${r.keys} ${tr ? "tuş" : "keys"} · ${secs(r.time)}`)}
          onAgain={game.start}
        />
      )}
    </GameFrame>
  );
}
