const RANGE_TO_INTERVAL = {
  '1d': '5m',
  '5d': '15m',
  '1mo': '1d',
  '3mo': '1d',
  '6mo': '1wk',
  '1y': '1wk',
  '2y': '1mo',
  '5y': '1mo',
}

const YAHOO_BASE = 'https://query1.finance.yahoo.com'
const CORS_PROXY = 'https://corsproxy.io/?'

export async function fetchStockData(symbol, range = '1mo') {
  const interval = RANGE_TO_INTERVAL[range] || '1d'
  const path = `/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=false`
  const url = import.meta.env.PROD
    ? `${CORS_PROXY}${encodeURIComponent(YAHOO_BASE + path)}`
    : `/api/yahoo${path}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTPエラー: ${res.status}`)
  }

  const data = await res.json()
  const result = data?.chart?.result?.[0]

  if (!result) {
    const errMsg = data?.chart?.error?.description || '銘柄が見つかりません'
    throw new Error(errMsg)
  }

  const timestamps = result.timestamp
  const closes = result.indicators?.quote?.[0]?.close
  const highs = result.indicators?.quote?.[0]?.high
  const lows = result.indicators?.quote?.[0]?.low
  const opens = result.indicators?.quote?.[0]?.open
  const volumes = result.indicators?.quote?.[0]?.volume
  const meta = result.meta

  const chartData = timestamps.map((ts, i) => ({
    date: formatDate(ts, range),
    close: closes?.[i] != null ? +closes[i].toFixed(2) : null,
    high: highs?.[i] != null ? +highs[i].toFixed(2) : null,
    low: lows?.[i] != null ? +lows[i].toFixed(2) : null,
    open: opens?.[i] != null ? +opens[i].toFixed(2) : null,
    volume: volumes?.[i] ?? null,
  })).filter(d => d.close != null)

  return {
    symbol: meta.symbol,
    currency: meta.currency,
    name: meta.shortName || meta.symbol,
    exchangeName: meta.exchangeName,
    currentPrice: meta.regularMarketPrice,
    previousClose: meta.chartPreviousClose,
    chartData,
  }
}

function formatDate(timestamp, range) {
  const d = new Date(timestamp * 1000)
  if (range === '1d' || range === '5d') {
    return d.toLocaleString('ja-JP', {
      month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }
  return d.toLocaleDateString('ja-JP', {
    year: range === '5y' || range === '2y' ? 'numeric' : undefined,
    month: 'numeric',
    day: 'numeric',
  })
}
