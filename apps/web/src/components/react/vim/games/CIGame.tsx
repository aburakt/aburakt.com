import { useEffect, useRef } from "react";
import { saveVimStat } from "../../useAuth";
import { GameFrame, ResultList, StartButton, secs } from "./GameFrame";
import { gameTheme, shuffle, useVimRounds } from "./useVimRounds";

interface Props {
  locale: string;
}

interface Challenge {
  content: string;
  goal: string;
  /** the text object to use, e.g. ci" */
  motion: string;
  /** where the cursor starts; at 0 the player first jumps to the pair (f" / f( ...) */
  cursor: number;
}

const challenges: Challenge[] = [
  { content: 'const name = "hello"', goal: 'const name = "world"', motion: 'ci"', cursor: 0 },
  { content: "const arr = ['a', 'b', 'c']", goal: "const arr = ['x', 'y', 'z']", motion: "ci[", cursor: 0 },
  { content: "function foo(bar, baz) {}", goal: "function foo(x, y) {}", motion: "ci(", cursor: 0 },
  // the editor's vim mode has no tag text object (cit), so tags use the href quotes
  { content: '<a href="/old">link</a>', goal: '<a href="/new">link</a>', motion: 'ci"', cursor: 0 },
  { content: 'const obj = {key: "value"}', goal: 'const obj = {name: "test"}', motion: "ci{", cursor: 14 },
  { content: "console.log('debug message')", goal: "console.log('info')", motion: "ci'", cursor: 0 },
  { content: "const x = (a + b) * c", goal: "const x = (x + y) * c", motion: "ci)", cursor: 12 },
  { content: "if (condition) {doSomething()}", goal: "if (condition) {handleClick()}", motion: "ci}", cursor: 18 },
];

const theme = gameTheme("60px", "16px");
const TOTAL = 5;

export default function CIGame({ locale }: Props) {
  const tr = locale === "tr";
  const order = useRef<Challenge[]>([]);
  const game = useVimRounds(TOTAL, (i) => {
    const ch = order.current[i] ?? challenges[0];
    return {
      doc: ch.content,
      cursor: ch.cursor,
      extensions: [theme],
      solved: (s) => s.doc.toString() === ch.goal,
      info: ch,
    };
  });

  const avgTime = game.results.length ? game.results.reduce((a, r) => a + r.time, 0) / game.results.length : 0;
  const totalKeys = game.results.reduce((a, r) => a + r.keys, 0);

  useEffect(() => {
    if (game.phase === "done") saveVimStat({ game: "ci-game", score: Math.round(avgTime), keystrokes: totalKeys });
  }, [game.phase, avgTime, totalKeys]);

  function start() {
    order.current = shuffle(challenges);
    game.start();
  }

  const ch = game.info;
  return (
    <GameFrame
      title="✂️ CI Game"
      description={
        tr
          ? "Tırnak ya da parantez içini ci{karakter} ile değiştirin; metin hedefe eşit olunca tur biter. Skor ortalama süredir, düşük olan iyidir."
          : "Change the text inside quotes or brackets with ci{char}; the round ends when the text matches the goal. Score is the average time, lower is better."
      }
    >
      {game.phase === "idle" && <StartButton tr={tr} rounds={TOTAL} onClick={start} />}

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
              <p className="text-sm text-green-400">
                {tr ? "Komut" : "Command"}: <kbd className="font-mono font-bold">{ch.motion}</kbd>
              </p>
              <p className="mt-1 font-mono text-xs text-green-700">
                {tr ? "Hedef" : "Goal"}:{" "}
                <span className="text-green-400" data-goal>
                  {ch.goal}
                </span>
              </p>
            </div>
          )}
          <div ref={game.editorRef} className="overflow-hidden rounded-lg border border-green-900/30" />
        </div>
      )}

      {game.phase === "done" && (
        <ResultList
          tr={tr}
          headline={`${tr ? "Ortalama süre" : "Average time"}: ${secs(avgTime)} · ${totalKeys} ${tr ? "tuş" : "keys"}`}
          rows={game.results.map((r) => `${secs(r.time)} · ${r.keys} ${tr ? "tuş" : "keys"}`)}
          onAgain={start}
        />
      )}
    </GameFrame>
  );
}
