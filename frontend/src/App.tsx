import { clearStorage } from '../api/apiClient'
import StockNewsDashboard from './Dashboard.Page'

function App() {
  clearStorage();

  return (
    <>
      <StockNewsDashboard />
    </>
  )
}

export default App
