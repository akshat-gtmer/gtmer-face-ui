import React from 'react'

interface GtmerLogoProps {
  width?: number | string
  height?: number | string
  className?: string
  /** Color of the slash. Defaults to accent blue */
  slashColor?: string
  /** Color of the "gtmer" text. Defaults to chalk white */
  textColor?: string
  style?: React.CSSProperties
}

/**
 * Reusable /gtmer logo as an inline SVG component.
 * Uses JetBrains Mono (falls back to Fira Code / monospace).
 */
const GtmerLogo: React.FC<GtmerLogoProps> = ({
  width = 320,
  height = 64,
  className,
  slashColor = '#4da8da',
  textColor = 'rgba(212, 227, 240, 0.92)',
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 64"
    width={width}
    height={height}
    fill="none"
    className={className}
    style={style}
    role="img"
    aria-label="GTMer logo"
  >
    <text
      fontFamily="'JetBrains Mono', 'Fira Code', monospace"
      fontSize="56"
      fontWeight="700"
      letterSpacing="-0.05em"
      y="52"
    >
      <tspan fill={slashColor} opacity={0.8}>/</tspan>
      <tspan fill={textColor}>gtmer</tspan>
    </text>
  </svg>
)

export default GtmerLogo
