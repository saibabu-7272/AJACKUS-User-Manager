import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/api';
import UserTable from '../../Components/UserTable';
import Pagination from '../../Components/Pagination';
import TopBar from '../../Components/TopBar';
import FilterPopup from '../../Components/FilterPopup';
import UserFormModal from '../../Components/UserFormModal';
import Toasts from '../../Components/Toasts';

// Helper: map JSONPlaceholder user to our UI shape
function mapUser(u) {
  const [firstName = '', lastName = ''] = (u.name || '').split(' ');
  return {
    id: u.id,
    firstName,
    lastName,
    email: u.email || '',
    department: (u.company && u.company.name) ? u.company.name : 'General',
    raw: u,
  };
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // UI state
  // Search with debounce
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ firstName: '', lastName: '', email: '', department: '' });
  const [showFilters, setShowFilters] = useState(false);

  const [sortKey, setSortKey] = useState('id'); // id | firstName | lastName | email | department
  const [sortDir, setSortDir] = useState('asc'); // asc | desc

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form modal state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);
  function pushToast(message, type = 'info', duration = 3000) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type, duration }]);
  }
  function dismissToast(id) { setToasts((t) => t.filter(x => x.id !== id)); }

  // Infinite scroll state
  const [infinite, setInfinite] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(10);

  useEffect(() => {
    const ac = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getUsers(ac.signal);
        setUsers((data || []).map(mapUser));
      } catch (e) {
        setError(e.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => ac.abort();
  }, []);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Derived data: filter + search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q ||
        String(u.id).includes(q) ||
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q);

      const matchFilters =
        (!filters.firstName || u.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) &&
        (!filters.lastName || u.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) &&
        (!filters.email || u.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.department || u.department.toLowerCase().includes(filters.department.toLowerCase()));

      return matchSearch && matchFilters;
    });
  }, [users, search, filters]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageItems = sorted.slice(startIdx, startIdx + pageSize);

  // Infinite list items
  const infiniteItems = sorted.slice(0, itemsToShow);

  // Scroll listener for infinite mode
  useEffect(() => {
    if (!infinite) return;
    function onScroll() {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (nearBottom && itemsToShow < total) {
        setItemsToShow((n) => Math.min(total, n + pageSize));
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [infinite, itemsToShow, total, pageSize]);

  // Reset itemsToShow when filters/search/sort change or when enabling infinite
  useEffect(() => {
    if (infinite) {
      setItemsToShow(pageSize);
    }
  }, [infinite, search, JSON.stringify(filters), sortKey, sortDir, pageSize]);

  function handleSort(nextKey) {
    if (nextKey === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(nextKey);
      setSortDir('asc');
    }
  }

  function handleApplyFilters(values) {
    setFilters(values);
    setShowFilters(false);
    setPage(1);
  }

  // Add/Edit/Delete handlers
  function openAdd() {
    setFormMode('add');
    setEditingId(null);
    setFormOpen(true);
  }

  function openEdit(id) {
    setFormMode('edit');
    setEditingId(id);
    setFormOpen(true);
  }

  function initialValuesForForm() {
    if (formMode === 'edit' && editingId != null) {
      const u = users.find((x) => x.id === editingId);
      if (u) return { firstName: u.firstName, lastName: u.lastName, email: u.email, department: u.department };
    }
    return { firstName: '', lastName: '', email: '', department: '' };
  }

  async function handleSubmitForm(values) {
    try {
      setSubmitting(true);
      setError('');
      if (formMode === 'add') {
        // Construct payload similar to JSONPlaceholder structure; it will echo back an id
        const payload = {
          name: `${values.firstName} ${values.lastName}`.trim(),
          email: values.email,
          company: { name: values.department },
        };
        const created = await createUser(payload);
        // Optimistic: JSONPlaceholder returns id; map to UI shape
        const newUser = mapUser({ id: created.id ?? Math.max(0, ...users.map(u => u.id)) + 1, ...payload });
        setUsers((prev) => [newUser, ...prev]);
        setFormOpen(false);
        setPage(1);
        pushToast('User created', 'success');
      } else if (formMode === 'edit' && editingId != null) {
        const payload = {
          id: editingId,
          name: `${values.firstName} ${values.lastName}`.trim(),
          email: values.email,
          company: { name: values.department },
        };
        await updateUser(editingId, payload);
        setUsers((prev) => prev.map((u) => u.id === editingId ? { ...u, ...{ firstName: values.firstName, lastName: values.lastName, email: values.email, department: values.department } } : u));
        setFormOpen(false);
        pushToast('User updated', 'success');
      }
    } catch (e) {
      setError(e.message || 'Failed to save user');
      pushToast('Failed to save user', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm(`Delete user #${id}?`);
    if (!ok) return;
    try {
      setError('');
      // Optimistic removal
      setUsers((u) => u.filter((x) => x.id !== id));
      await deleteUser(id);
      pushToast('User deleted', 'success');
    } catch (e) {
      setError(e.message || 'Failed to delete user');
      pushToast('Failed to delete user', 'error');
      // On failure, no need to undo since JSONPlaceholder usually succeeds; in real app, restore prev state
    }
  }

  // JSX is returned below in a single block
  return (
    <div className="users-page">
      <TopBar
        search={searchInput}
        onSearchChange={(v) => setSearchInput(v)}
        onAdd={openAdd}
        onOpenFilters={() => setShowFilters(true)}
        infinite={infinite}
        onToggleInfinite={(v) => setInfinite(v)}
      />

      {error && <div className="banner error">{error}</div>}
      {loading && <div className="banner">Loading users...</div>}

      {!loading && (
        <>
          <UserTable
            items={infinite ? infiniteItems : pageItems}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            onEdit={openEdit}
            onDelete={handleDelete}
          />

          {!infinite && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={total}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
            />
          )}
          {infinite && (
            <div className="banner">Showing {infiniteItems.length} of {total}. Scroll to load more.</div>
          )}
        </>
      )}

      <FilterPopup
        open={showFilters}
        initialValues={filters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
      />

      <UserFormModal
        open={formOpen}
        mode={formMode}
        initialValues={initialValuesForForm()}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitForm}
        submitting={submitting}
      />

      <Toasts items={toasts} onDismiss={dismissToast} />
    </div>
  );
}
