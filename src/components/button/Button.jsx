import { useState } from 'react'

const SIZE = {
  xl: { minHeight: '56px', padding: '0 32px', fontSize: '17px', lineHeight: '25px', borderRadius: '14px', spinnerSize: '28px' },
  lg: { minHeight: '48px', padding: '0 24px', fontSize: '17px', lineHeight: '25px', borderRadius: '12px', spinnerSize: '26px' },
  md: { minHeight: '40px', padding: '0 20px', fontSize: '15px', lineHeight: '21px', borderRadius: '10px', spinnerSize: '22px' },
  sm: { minHeight: '32px', padding: '0 14px', fontSize: '13px', lineHeight: '19px', borderRadius: '8px',  spinnerSize: '20px' },
}

const VARIANT = {
  primary: {
    default:  { bg: 'var(--color-primary-500)', color: 'var(--color-neutral-000)', border: 'none' },
    hover:    { bg: 'var(--color-primary-600)', border: 'none' },
    disabled: { bg: 'var(--color-neutral-050)', color: 'var(--color-neutral-400)', border: 'none' },
    fontWeight: 600,
  },
  secondary: {
    default:  { bg: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)', border: 'none' },
    hover:    { bg: 'var(--color-neutral-200)', border: 'none' },
    disabled: { bg: 'var(--color-neutral-050)', color: 'var(--color-neutral-400)', border: 'none' },
    fontWeight: 600,
  },
  outline: {
    default:  { bg: 'transparent', color: 'var(--color-neutral-700)', border: '1px solid var(--color-neutral-100)' },
    hover:    { bg: 'var(--color-neutral-050)', border: '1px solid var(--color-neutral-100)' },
    disabled: { bg: 'var(--color-neutral-050)', color: 'var(--color-neutral-400)', border: 'none' },
    fontWeight: 500,
  },
  ghost: {
    default:  { bg: 'transparent', color: 'var(--color-neutral-700)', border: 'none' },
    hover:    { bg: 'var(--color-neutral-050)', border: 'none' },
    disabled: { bg: 'var(--color-neutral-050)', color: 'var(--color-neutral-400)', border: 'none' },
    fontWeight: 500,
  },
  danger: {
    default:  { bg: 'var(--color-red-500)', color: 'var(--color-neutral-000)', border: 'none' },
    hover:    { bg: 'var(--color-red-600)', border: 'none' },
    disabled: { bg: 'var(--color-neutral-050)', color: 'var(--color-neutral-400)', border: 'none' },
    fontWeight: 600,
  },
}

export function Button({
  variant = 'primary',
  size = 'xl',
  disabled = false,
  loading = false,
  fullWidth = false,
  children = '버튼',
  onClick,
}) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const s = SIZE[size]
  const v = VARIANT[variant]
  const isInactive = disabled || loading

  const current = isInactive
    ? { bg: v.disabled.bg, color: v.disabled.color, border: v.disabled.border }
    : hovered
    ? { bg: v.hover.bg, color: v.default.color, border: v.hover.border }
    : { bg: v.default.bg, color: v.default.color, border: v.default.border }

  return (
    <button
      disabled={isInactive}
      onClick={onClick}
      onMouseEnter={() => !isInactive && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => !isInactive && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: s.minHeight,
        padding: s.padding,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        fontWeight: v.fontWeight,
        fontFamily: 'Pretendard, sans-serif',
        borderRadius: s.borderRadius,
        backgroundColor: current.bg,
        color: current.color,
        border: current.border,
        cursor: isInactive ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : undefined,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        boxSizing: 'border-box',
        outline: 'none',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.1s ease, border-color 0.1s ease',
      }}
    >
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: s.spinnerSize,
            height: s.spinnerSize,
            border: '2.5px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            flexShrink: 0,
          }}
        />
      ) : children}
    </button>
  )
}
