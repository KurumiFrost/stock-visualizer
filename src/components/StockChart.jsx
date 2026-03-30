import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const RANGES = [
  { label: '1日', value: '1d' },
  { label: '5日', value: '5d' },
  { label: '1ヶ月', value: '1mo' },
  { label: '3ヶ月', value: '3mo' },
  { label: '6ヶ月', value: '6mo' },
  { label: '1年', value: '1y' },
  { label: '2年', value: '2y' },
  { label: '5年', value: '5y' },
]

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="tooltip">
      <div className="tooltip-date">{label}</div>
      <div className="tooltip-row">
        <span>終値</span>
        <strong>{d.close?.toLocaleString()} {currency}</strong>
      </div>
      {d.open != null && (
        <div className="tooltip-row"><span>始値</span><span>{d.open?.toLocaleString()}</span></div>
      )}
      {d.high != null && (
        <div className="tooltip-row"><span>高値</span><span>{d.high?.toLocaleString()}</span></div>
      )}
      {d.low != null && (
        <div className="tooltip-row"><span>安値</span><span>{d.low?.toLocaleString()}</span></div>
      )}
      {d.volume != null && (
        <div className="tooltip-row"><span>出来高</span><span>{d.volume?.toLocaleString()}</span></div>
      )}
    </div>
  )
}

export default function StockChart({ chartData, currency, range, onRangeChange }) {
  if (!chartData?.length) return null

  const prices = chartData.map(d => d.close)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const padding = (maxPrice - minPrice) * 0.05

  const firstPrice = chartData[0].close
  const lastPrice = chartData[chartData.length - 1].close
  const isPositive = lastPrice >= firstPrice
  const strokeColor = isPositive ? '#22c55e' : '#ef4444'
  const fillColor = isPositive ? '#22c55e20' : '#ef444420'

  const tickCount = Math.min(chartData.length, 6)
  const step = Math.floor(chartData.length / tickCount)
  const ticks = chartData
    .filter((_, i) => i % step === 0 || i === chartData.length - 1)
    .map(d => d.date)

  return (
    <div className="chart-section">
      <div className="range-buttons">
        {RANGES.map(r => (
          <button
            key={r.value}
            className={`range-btn ${range === r.value ? 'active' : ''}`}
            onClick={() => onRangeChange(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="date"
            ticks={ticks}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[minPrice - padding, maxPrice + padding]}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
            width={70}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Area
            type="monotone"
            dataKey="close"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 4, fill: strokeColor, stroke: '#0f0f13', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
