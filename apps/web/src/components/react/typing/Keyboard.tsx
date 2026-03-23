import { layouts, fingerColors, fingerActiveColors, type Layout, type KeyDef } from './keyboardLayouts'

interface Props {
  layout: Layout
  activeKey?: string
  activeFinger?: number
}

export default function Keyboard({ layout, activeKey, activeFinger }: Props) {
  const rows = layouts[layout]

  function getKeyClass(key: KeyDef) {
    const isActive = activeKey === key.key
    const isFingerActive = activeFinger !== undefined && activeFinger === key.finger && !isActive

    if (isActive) return fingerActiveColors[key.finger]
    if (isFingerActive) return fingerColors[key.finger].replace('/20', '/30').replace('/40', '/60')
    return fingerColors[key.finger]
  }

  return (
    <div className="mx-auto w-full max-w-3xl select-none">
      {rows.map((row, ri) => (
        <div key={ri} className="mb-1 flex justify-center gap-1">
          {row.map((key, ki) => {
            const w = key.width ?? 1
            return (
              <div
                key={ki}
                className={`flex items-center justify-center rounded-md border text-xs font-mono transition-all duration-100 ${getKeyClass(key)}`}
                style={{
                  width: `${w * 2.8}rem`,
                  height: '2.4rem',
                  minWidth: `${w * 2.8}rem`,
                }}
              >
                {key.label}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
