import { Calendar, TaskTimer } from "./components"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/task-timer/:taskName" element={<TaskTimer />} />
        </Routes>
    </Router>
  )
}

export default App
