import { Routes, Route, Navigate } from 'react-router-dom';
import TimesheetForm from './components/TimesheetForm';
import ReviewPage from './components/ReviewPage';
import ConfirmationPage from './components/ConfirmationPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TimesheetForm />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/confirm" element={<ConfirmationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
