import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StockInfo({ stockData }) {
  if (!stockData) return null

  const { name, symbol, currency, exchangeName, currentPrice, previousClose } = stockData
  const change = currentPrice - previousClose
  const changePct = (change / previousClose) * 100
  const isPositive = change >= 0

  return (
    <div className="stock-info">
      <div className="stock-info-left">
        <div className="stock-name">{name}</div>
        <div className="stock-meta">{symbol} · {exchangeName}</div>
      </div>
      <div className="stock-info-right">
        <div className="stock-price">
          {currentPrice?.toLocaleString('ja-JP', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="currency"> {currency}</span>
        </div>
        <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePct.toFixed(2)}%)</span>
        </div>
      </div>
    </div>
  )
}
