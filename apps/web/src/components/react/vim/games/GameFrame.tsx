import type { ReactNode } from "react";

export const secs = (ms: number) => `${(ms / 1000).toFixed(2)} s`;

export function GameFrame({
  title,
  description,
  children,
}: {
  title: ReactNode;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-green-900/30 bg-green-950/20 p-6">
      <h2 className="text-lg font-semibold text-green-400">{title}</h2>
      <p className="mt-1 text-sm text-green-600">{description}</p>
      {children}
    </section>
  );
}

export function StartButton({ tr, rounds, onClick }: { tr: boolean; rounds: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-black transition hover:bg-green-500"
    >
      {tr ? "Başla" : "Start"} ({rounds} {tr ? "tur" : "rounds"})
    </button>
  );
}

export function ResultList({
  tr,
  headline,
  rows,
  onAgain,
}: {
  tr: boolean;
  headline: ReactNode;
  rows: ReactNode[];
  onAgain: () => void;
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-lg bg-green-500/10 p-4 text-center">
        <p className="text-lg font-semibold text-green-400" data-game-result>
          {headline}
        </p>
      </div>
      <ol className="space-y-1">
        {rows.map((row, i) => (
          <li key={i} className="flex justify-between text-xs text-green-600">
            <span>
              {tr ? "Tur" : "Round"} {i + 1}
            </span>
            <span>{row}</span>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onAgain}
        className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-black transition hover:bg-green-500"
      >
        {tr ? "Tekrar Oyna" : "Play Again"}
      </button>
    </div>
  );
}
