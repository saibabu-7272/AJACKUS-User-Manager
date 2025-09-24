import React from 'react';
import './index.css';

export default function TopBar({ search, onSearchChange, onAdd, onOpenFilters }) {
  return (
    <div className="topbar">
      <div className="left">
        <h2 className="title">Users</h2>
      </div>
      <div className="middle">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users..."
          className="search"
        />
      </div>
      <div className="right">
        <button className="btn" onClick={onOpenFilters}>Filters</button>
        <button className="btn primary" onClick={onAdd}>Add User</button>
      </div>
    </div>
  );
}
