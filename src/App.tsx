import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { BoardProvider } from "./context/BoardContext"
import { BoardsPage } from "./pages/BoardsPage"
import { BoardDetailPage } from "./pages/BoardDetailPage"

function App() {
  return (
    <BoardProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/boards" replace />} />
            <Route path="/boards" element={<BoardsPage />} />
            <Route path="/boards/:id" element={<BoardDetailPage />} />
          </Routes>
        </div>
      </Router>
    </BoardProvider>
  )
}

export default App
