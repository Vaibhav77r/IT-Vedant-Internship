import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ManageGroups() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [groups, setGroups]         = useState([]);
  const [totalGroups, setTotal]     = useState(0);
  const [view, setView]             = useState('list'); // 'list' | 'add' | 'edit'
  const [editGroup, setEditGroup]   = useState(null);
  const [groupName, setGroupName]   = useState('');
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [loading, setLoading]       = useState(false);

  // Fetch all groups on load
  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try {
      const res = await API.get('/groups');
      setGroups(res.data);
      setTotal(res.data.length);
    } catch {
      setError('Failed to load groups');
    }
  };

  // Add group
  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!groupName.trim()) { setError('Group name is required'); return; }
    setLoading(true);
    try {
      await API.post('/groups', { groupName });
      setSuccess('Group added successfully!');
      setGroupName('');
      await fetchGroups();
      setTimeout(() => { setView('list'); setSuccess(''); }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add group');
    } finally { setLoading(false); }
  };

  // Edit group
  const handleEdit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!groupName.trim()) { setError('Group name is required'); return; }
    setLoading(true);
    try {
      await API.put(`/groups/${editGroup.groupId}`, { groupName });
      setSuccess('Group updated!');
      setGroupName('');
      await fetchGroups();
      setTimeout(() => { setView('list'); setSuccess(''); }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update group');
    } finally { setLoading(false); }
  };

  // Soft delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this group?')) return;
    try {
      await API.delete(`/groups/${id}`);
      await fetchGroups();
    } catch (err) {
      alert(err.response?.data?.error || 'Cannot delete this group');
    }
  };

  const openEdit = (group) => {
    setEditGroup(group);
    setGroupName(group.groupName);
    setError(''); setSuccess('');
    setView('edit');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>Invoice</div>
        <div style={s.sideSection}>Manage Group Section</div>
        <nav>
          <div style={s.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div style={{...s.navItem, ...s.navActive}}>Manage Groups</div>
          <div style={s.navItem}>Manage Chain</div>
          <div style={s.navItem}>Manage Brands</div>
          <div style={s.navItem}>Manage SubZones</div>
          <div style={s.navItem}>Manage Estimate</div>
          <div style={s.navItem}>Manage Invoices</div>
        </nav>
        <div style={s.sideBottom}>
          <span style={s.hiUser}>Hi {user?.fullName}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>

        {/* --- LIST VIEW --- */}
        {view === 'list' && (
          <>
            <div style={s.statCard}>
              <div style={s.statLabel}>Total Groups</div>
              <div style={s.statValue}>{totalGroups}</div>
            </div>

            <button style={s.addBtn} onClick={() => { setGroupName(''); setError(''); setView('add'); }}>
              + Add Group
            </button>

            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Sr.No</th>
                  <th style={s.th}>Group Name</th>
                  <th style={s.th}>Edit</th>
                  <th style={s.th}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {groups.length === 0 ? (
                  <tr><td colSpan={4} style={s.noData}>No groups found. Add your first group!</td></tr>
                ) : (
                  groups.map((g, i) => (
                    <tr key={g.groupId} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                      <td style={s.td}>{i + 1}</td>
                      <td style={s.td}>{g.groupName}</td>
                      <td style={s.td}>
                        <button style={s.editBtn} onClick={() => openEdit(g)}>Edit</button>
                      </td>
                      <td style={s.td}>
                        <button style={s.deleteBtn} onClick={() => handleDelete(g.groupId)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {/* --- ADD VIEW --- */}
        {view === 'add' && (
          <div style={s.formCard}>
            <h3 style={s.formTitle}>Enter Group Name:</h3>
            {error   && <div style={s.errorBox}>{error}</div>}
            {success && <div style={s.successBox}>{success}</div>}
            <form onSubmit={handleAdd}>
              <input
                style={s.input}
                placeholder="Enter Unique Group Name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
              />
              <div style={s.btnRow}>
                <button style={s.addBtn} type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Group'}
                </button>
                <button style={s.cancelBtn} type="button" onClick={() => setView('list')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- EDIT VIEW --- */}
        {view === 'edit' && (
          <div style={s.formCard}>
            <h3 style={s.formTitle}>Edit Group Name:</h3>
            {error   && <div style={s.errorBox}>{error}</div>}
            {success && <div style={s.successBox}>{success}</div>}
            <form onSubmit={handleEdit}>
              <input
                style={s.input}
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
              />
              <div style={s.btnRow}>
                <button style={s.updateBtn} type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update'}
                </button>
                <button style={s.cancelBtn} type="button" onClick={() => setView('list')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

const s = {
  page:       { display: 'flex', minHeight: '100vh', background: '#f5f5f5', fontFamily: 'sans-serif' },
  sidebar:    { width: '220px', background: '#fff', borderRight: '1px solid #e0e0e0', padding: '1rem', display: 'flex', flexDirection: 'column' },
  logo:       { fontSize: '1.4rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' },
  sideSection:{ fontSize: '0.75rem', color: '#888', marginBottom: '1.5rem' },
  navItem:    { padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.88rem', color: '#444', marginBottom: '2px' },
  navActive:  { fontWeight: '700', color: '#4f46e5' },
  sideBottom: { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' },
  hiUser:     { fontSize: '0.85rem', color: '#555' },
  logoutBtn:  { padding: '8px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  main:       { flex: 1, padding: '2rem' },
  statCard:   { background: '#4f46e5', color: '#fff', display: 'inline-block', padding: '1rem 2rem', borderRadius: '10px', marginBottom: '1.5rem' },
  statLabel:  { fontSize: '0.85rem', opacity: 0.85 },
  statValue:  { fontSize: '2rem', fontWeight: '700' },
  addBtn:     { background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginBottom: '1rem', fontSize: '0.9rem' },
  updateBtn:  { background: '#059669', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
  cancelBtn:  { background: '#6b7280', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
  table:      { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  thead:      { background: '#f1f5f9' },
  th:         { padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '0.88rem', color: '#374151' },
  td:         { padding: '11px 16px', fontSize: '0.9rem', color: '#374151' },
  trEven:     { background: '#fff' },
  trOdd:      { background: '#f9fafb' },
  editBtn:    { background: '#f59e0b', color: '#fff', border: 'none', padding: '5px 14px', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' },
  deleteBtn:  { background: '#ef4444', color: '#fff', border: 'none', padding: '5px 14px', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' },
  noData:     { textAlign: 'center', padding: '2rem', color: '#888' },
  formCard:   { background: '#fff', padding: '2rem', borderRadius: '10px', maxWidth: '420px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  formTitle:  { margin: '0 0 1rem', fontSize: '1rem', fontWeight: '600' },
  input:      { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.95rem', marginBottom: '1rem', boxSizing: 'border-box' },
  btnRow:     { display: 'flex', gap: '10px' },
  errorBox:   { background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.88rem' },
  successBox: { background: '#dcfce7', color: '#16a34a', padding: '8px 12px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.88rem' },
};