import { useState } from 'react'
import { Search } from 'lucide-react'

const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'GOOGL', name: 'Google' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: '7203.T', name: 'トヨタ' },
  { symbol: '9984.T', name: 'ソフトバンクG' },
  { symbol: '6758.T', name: 'ソニーG' },
]

export default function SearchBar({ onSearch, loading }) {
  const [input, setInput] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const sym = input.trim().toUpperCase()
    if (sym) onSearch(sym)
  }

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="ティッカーシンボルを入力 (例: AAPL, 7203.T)"
            className="search-input"
            disabled={loading}
          />
        </div>
        <button type="submit" className="search-btn" disabled={loading || !input.trim()}>
          {loading ? '取得中...' : '検索'}
        </button>
      </form>

      <div className="popular-stocks">
        {POPULAR_STOCKS.map(s => (
          <button
            key={s.symbol}
            className="stock-chip"
            onClick={() => { setInput(s.symbol); onSearch(s.symbol) }}
            disabled={loading}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  )
}
