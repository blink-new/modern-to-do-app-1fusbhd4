
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskList } from './components/TaskList';
import { TaskPage } from './routes/TaskPage';

export default function App() {
  return (
    <Router>
      <div className="mx-auto max-w-2xl p-4">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/task/:taskId" element={<TaskPage />} />
        </Routes>
      </div>
    </Router>
  );
}