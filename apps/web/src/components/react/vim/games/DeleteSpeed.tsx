import { useEffect, useRef } from "react";
import { saveVimStat } from "../../useAuth";
import { GameFrame, ResultList, StartButton, secs } from "./GameFrame";
import { gameTheme, shuffle, useVimRounds } from "./useVimRounds";

interface Props {
  locale: string;
}

const sampleLines = [
  "The quick brown fox jumps over the lazy dog.",
  "Lorem ipsum dolor sit amet consectetur.",
  "She sells seashells by the seashore.",
  "How much wood would a woodchuck chuck?",
  "To be or not to be that is the question.",
  "All that glitters is not gold.",
  "A journey of a thousand miles begins with a single step.",
  "The pen is mightier than the sword.",
  "Actions speak louder than words.",
  "Knowledge is power but enthusiasm pulls the switch.",
  "The best way to predict the future is to create it.",
  "In the middle of difficulty lies opportunity.",
  "Stay hungry stay foolish.",
  "Code is like humor when you have to explain it its bad.",
  "First solve the problem then write the code.",
];

const theme = gameTheme("60px", "16px");
const TOTAL = 5;

export default function DeleteSpeed({ locale }: Props) {
  const tr = locale === "tr";
  const order = useRef<string[]>([]);
  const game = useVimRounds(TOTAL, (i) => {
    const line = order.current[i] ?? sampleLines[0];
    return {
      doc: line,
      // start somewhere in the middle of the line so `0D`, `dd`, `S<Esc>` all make sense
      cursor: Math.floor(line.length / 2),
      extensions: [theme],
      solved: (s) => s.doc.toString().trim() === "",
      info: null,
    };
  });

  const avgTime = game.results.length ? game.results.reduce((a, r) => a + r.time, 0) / game.results.length : 0;
  const totalKeys = game.results.reduce((a, r) => a + r.keys, 0);

  useEffect(() => {
    if (game.phase === "done") {
      saveVimStat({ game: "delete-speed", score: Math.round(avgTime), keystrokes: totalKeys });
    }
  }, [game.phase, avgTime, totalKeys]);

  function start() {
    order.current = shuffle(sampleLines);
    game.start();
  }

  return (
    <GameFrame
      title="🗑️ Delete Speed"
      description={
        tr
          ? "Satırı olabildiğince hızlı silin (dd, 0D, S<Esc>...). Skor ortalama süredir, düşük olan iyidir; tuş sayısı ayrıca gösterilir."
          : "Delete the line as fast as you can (dd, 0D, S<Esc>...). Score is the average time, lower is better; keystrokes are shown too."
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
          <p className="text-xs text-green-700">{tr ? "Satırı tamamen silin." : "Delete the whole line."}</p>
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
