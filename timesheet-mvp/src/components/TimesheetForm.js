import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TimesheetForm() {
  const [formData, setFormData] = useState({
    client: '',
    state: '',
    week1: '',
    week2: '',
    periodStart: '',
    periodEnd: '',
  });

  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('timesheet', JSON.stringify(formData));
    navigate('/review');
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Timesheet Form</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 400 }}>
        <input name="client" placeholder="Client" value={formData.client} onChange={onChange} required />
        <input name="state" placeholder="State (e.g., NY)" value={formData.state} onChange={onChange} required />
        <input type="number" name="week1" placeholder="Week 1 Hours" value={formData.week1} onChange={onChange} />
        <input type="number" name="week2" placeholder="Week 2 Hours" value={formData.week2} onChange={onChange} />
        <input type="date" name="periodStart" value={formData.periodStart} onChange={onChange} />
        <input type="date" name="periodEnd" value={formData.periodEnd} onChange={onChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default TimesheetForm;
