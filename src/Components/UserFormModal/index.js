import React, { useEffect, useMemo, useState } from 'react';
import './index.css';

export default function UserFormModal({ open, mode = 'add', initialValues, onClose, onSubmit, submitting }) {
  const initial = useMemo(() => ({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    ...(initialValues || {}),
  }), [initialValues]);

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initial);
    setErrors({});
  }, [initial, open]);

  function update(field, v) {
    setValues((s) => ({ ...s, [field]: v }));
  }

  function validate() {
    const e = {};
    if (!values.firstName.trim()) e.firstName = 'First name is required';
    if (!values.lastName.trim()) e.lastName = 'Last name is required';
    if (!values.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Invalid email';
    if (!values.department.trim()) e.department = 'Department is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  }

  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h3>{mode === 'edit' ? 'Edit User' : 'Add User'}</h3>
          <button className="icon" onClick={onClose}>×</button>
        </div>
        <form className="content" onSubmit={submit}>
          <div className="row">
            <div className="field">
              <label>First Name</label>
              <input value={values.firstName} onChange={(e) => update('firstName', e.target.value)} />
              {errors.firstName && <div className="err">{errors.firstName}</div>}
            </div>
            <div className="field">
              <label>Last Name</label>
              <input value={values.lastName} onChange={(e) => update('lastName', e.target.value)} />
              {errors.lastName && <div className="err">{errors.lastName}</div>}
            </div>
          </div>
          <div className="row">
            <div className="field">
              <label>Email</label>
              <input value={values.email} onChange={(e) => update('email', e.target.value)} />
              {errors.email && <div className="err">{errors.email}</div>}
            </div>
            <div className="field">
              <label>Department</label>
              <input value={values.department} onChange={(e) => update('department', e.target.value)} />
              {errors.department && <div className="err">{errors.department}</div>}
            </div>
          </div>
          <div className="footer">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary" disabled={!!submitting}>
              {submitting ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
