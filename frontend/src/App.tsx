import { useState } from 'react'
import StockNewsDashboard from './Dashboard.Page'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-red-100'>
    <StockNewsDashboard />
    </div>
  )
}

export default App
