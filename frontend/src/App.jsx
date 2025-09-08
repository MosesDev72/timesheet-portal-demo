import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import TimesheetForm from './pages/TimesheetForm';
import Review from './pages/Review';
import Confirmation from './pages/Confirmation';

function App() {
  const location = useLocation();
  const hideHeader = location.pathname === '/' || location.pathname === '/confirmation';

  return (
    <div className="min-h-screen bg-white">
      {!hideHeader && <Header />}
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/timesheet" element={<TimesheetForm />} />
          <Route path="/review" element={<Review />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
