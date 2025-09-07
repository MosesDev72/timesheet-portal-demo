import { Link } from 'react-router-dom';

function ConfirmationPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>✅ Submission Complete</h2>
      <p>Your timesheet has been captured (mock only).</p>
      <Link to="/"><button>New Entry</button></Link>
    </div>
  );
}

export default ConfirmationPage;
