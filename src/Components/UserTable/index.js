import React from 'react';
import './index.css';

export default function UserTable({ items, sortKey, sortDir, onSort, onEdit, onDelete }) {
  const cols = [
    { key: 'id', label: 'ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'actions', label: 'Actions' },
  ];

  function headerCell(col) {
    const sortable = col.key !== 'actions';
    const isActive = sortKey === col.key;
    const dir = isActive ? (sortDir === 'asc' ? '▲' : '▼') : '';
    return (
      <th
        key={col.key}
        onClick={() => sortable && onSort(col.key)}
        className={sortable ? 'sortable' : ''}
        scope="col"
        aria-sort={isActive ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        <span>{col.label} {dir && <em className="dir">{dir}</em>}</span>
      </th>
    );
  }

  return (
    <div className="user-table-wrap">
      <table className="user-table" role="table">
        <thead>
          <tr>
            {cols.map(headerCell)}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={cols.length} className="empty">No users found.</td>
            </tr>
          )}
          {items.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.firstName}</td>
              <td>{u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.department}</td>
              <td>
                <div className="row-actions">
                  <button className="btn btn-ghost" aria-label={`Edit user ${u.id}`} onClick={() => onEdit(u.id)}>Edit</button>
                  <button className="btn btn-danger" aria-label={`Delete user ${u.id}`} onClick={() => onDelete(u.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
