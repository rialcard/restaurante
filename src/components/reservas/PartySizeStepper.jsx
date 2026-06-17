export default function PartySizeStepper({ value, min = 1, max = 20, onChange }) {
  function decrement() {
    if (value > min) onChange(value - 1)
  }
  function increment() {
    if (value < max) onChange(value + 1)
  }

  return (
    <div className="flex items-center gap-4 bg-surface-variant rounded-lg p-2 w-fit">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="icon text-xl">remove</span>
      </button>
      <div className="flex flex-col items-center min-w-[3rem]">
        <span className="font-display font-bold text-headline-lg text-on-surface">{value}</span>
        <span className="text-caption text-on-surface-variant font-body">personas</span>
      </div>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="icon text-xl">add</span>
      </button>
    </div>
  )
}
