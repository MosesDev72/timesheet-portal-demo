import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ReviewPage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem('timesheet');
    if (!raw) navigate('/');
    else setData(JSON.parse(raw));
  }, [navigate]);

  if (!data) return null;

  const total = (parseFloat(data.week1 || 0) + parseFloat(data.week2 || 0)).toFixed(1);

  return (
    <div style={{ padding: 24 }}>
      <h2>Review Submission</h2>
      <ul>
        <li><b>Client:</b> {data.client}</li>
        <li><b>State:</b> {data.state}</li>
        <li><b>Week 1:</b> {data.week1} hrs</li>
        <li><b>Week 2:</b> {data.week2} hrs</li>
        <li><b>Total:</b> {total} hrs</li>
        <li><b>Period:</b> {data.periodStart || '—'} → {data.periodEnd || '—'}</li>
      </ul>
      <div style={{ marginTop: 16 }}>
        <Link to="/"><button>Edit</button></Link>
        <Link to="/confirm"><button>Confirm</button></Link>
      </div>
    </div>
  );
}

export default ReviewPage;
