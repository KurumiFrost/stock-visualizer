import { useState } from 'react'
import { BarChart2 } from 'lucide-react'
import SearchBar from './components/SearchBar'
import StockInfo from './components/StockInfo'
import StockChart from './components/StockChart'
import { fetchStockData } from './services/stockApi'
import './App.css'

export default function App() {
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [range, setRange] = useState('1mo')
  const [currentSymbol, setCurrentSymbol] = useState(null)

  async function handleSearch(symbol) {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchStockData(symbol, range)
      setStockData(data)
      setCurrentSymbol(symbol)
    } catch (e) {
      setError(e.message)
      setStockData(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleRangeChange(newRange) {
    setRange(newRange)
    if (!currentSymbol) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchStockData(currentSymbol, newRange)
      setStockData(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <BarChart2 size={24} />
            <span>株価ビジュアライザー</span>
          </div>
        </div>
      </header>

      <main className="main">
        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner" />
            <span>データ取得中...</span>
          </div>
        )}

        {!loading && stockData && (
          <div className="card">
            <StockInfo stockData={stockData} />
            <StockChart
              chartData={stockData.chartData}
              currency={stockData.currency}
              range={range}
              onRangeChange={handleRangeChange}
            />
          </div>
        )}

        {!loading && !stockData && !error && (
          <div className="empty-state">
            <BarChart2 size={64} opacity={0.2} />
            <p>銘柄を検索して株価グラフを表示</p>
          </div>
        )}
      </main>
    </div>
  )
}
