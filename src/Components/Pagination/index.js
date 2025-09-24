import React from 'react';
import './index.css';

export default function Pagination({ page, pageSize, total, pageSizeOptions = [10,25,50,100], onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function prev() { if (page > 1) onPageChange(page - 1); }
  function next() { if (page < totalPages) onPageChange(page + 1); }

  return (
    <div className="pagination">
      <div className="left">
        <button className="btn" disabled={page <= 1} onClick={prev}>Prev</button>
        <div className="page-info">Page {page} of {totalPages}</div>
        <button className="btn" disabled={page >= totalPages} onClick={next}>Next</button>
      </div>
      <div className="right">
        <label htmlFor="page-size">Rows per page:</label>
        <select id="page-size" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          {pageSizeOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="count">{total} total</div>
      </div>
    </div>
  );
}
