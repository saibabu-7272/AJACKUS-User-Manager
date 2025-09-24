import React, { useEffect, useState } from 'react';
import './index.css';

export default function FilterPopup({ open, initialValues, onClose, onApply }) {
  const [values, setValues] = useState(initialValues || { firstName: '', lastName: '', email: '', department: '' });
  useEffect(() => { setValues(initialValues || { firstName: '', lastName: '', email: '', department: '' }); }, [initialValues]);
  if (!open) return null;

  function update(field, v) { setValues((s) => ({ ...s, [field]: v })); }
  function reset() { setValues({ firstName: '', lastName: '', email: '', department: '' }); }
  function apply() { onApply(values); }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h3>Filters</h3>
          <button className="icon" onClick={onClose}>×</button>
        </div>
        <div className="content">
          <div className="field">
            <label>First Name</label>
            <input value={values.firstName} onChange={(e) => update('firstName', e.target.value)} />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input value={values.lastName} onChange={(e) => update('lastName', e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={values.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="field">
            <label>Department</label>
            <input value={values.department} onChange={(e) => update('department', e.target.value)} />
          </div>
        </div>
        <div className="footer">
          <button className="btn" onClick={reset}>Reset</button>
          <button className="btn primary" onClick={apply}>Apply</button>
        </div>
      </div>
    </div>
  );
}
