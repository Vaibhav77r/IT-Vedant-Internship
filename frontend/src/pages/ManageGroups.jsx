import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ManageGroups() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [totalGroups, setTotal] = useState(0);
  const [view, setView] = useState('list');
  const [editGroup, setEditGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchGroups(); }, []);

  // ✅ FETCH
  const fetchGroups = async () => {
    try {
      const res = await API.get("/api/groups");
      setGroups(res.data);
      setTotal(res.data.length);
    } catch {
      setError('Failed to load groups');
    }
  };

  // ✅ ADD
  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/groups", { groupName });

      setSuccess('Group added successfully!');
      setGroupName('');
      await fetchGroups();

      setTimeout(() => {
        setView('list');
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add group');
    } finally {
      setLoading(false);
    }
  };

  // ✅ EDIT
  const handleEdit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    setLoading(true);
    try {
      await API.put(`/api/groups/${editGroup.groupId}`, { groupName });

      setSuccess('Group updated!');
      setGroupName('');
      await fetchGroups();

      setTimeout(() => {
        setView('list');
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;

    try {
      await API.delete(`/api/groups/${id}`);
      await fetchGroups();
    } catch (err) {
      alert(err.response?.data?.error || 'Cannot delete this group');
    }
  };

  const openEdit = (group) => {
    setEditGroup(group);
    setGroupName(group.groupName);
    setView('edit');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>IMS</div>
        <div style={s.sideSection}>Manage Groups</div>

        <div style={s.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
        <div style={{ ...s.navItem, ...s.navActive }}>Groups</div>

        <div style={s.sideBottom}>
          <span>Hi {user?.fullName}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>

        {/* LIST */}
        {view === 'list' && (
          <>
            <h2>Total Groups: {totalGroups}</h2>

            <button style={s.addBtn} onClick={() => setView('add')}>
              + Add Group
            </button>

            <table style={s.table}>
              <thead>
                <tr>
                  <th>Sr</th>
                  <th>Name</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {groups.map((g, i) => (
                  <tr key={g.groupId}>
                    <td>{i + 1}</td>
                    <td>{g.groupName}</td>
                    <td>
                      <button onClick={() => openEdit(g)}>Edit</button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(g.groupId)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ADD */}
        {view === 'add' && (
          <form onSubmit={handleAdd}>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
            />
            <button type="submit">Add</button>
            <button type="button" onClick={() => setView('list')}>Cancel</button>
          </form>
        )}

        {/* EDIT */}
        {view === 'edit' && (
          <form onSubmit={handleEdit}>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button type="submit">Update</button>
            <button type="button" onClick={() => setView('list')}>Cancel</button>
          </form>
        )}

      </main>
    </div>
  );
}

// 🎨 styles
const s = {
  page: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: '200px', background: '#eee', padding: '1rem' },
  main: { flex: 1, padding: '2rem' },
  navItem: { cursor: 'pointer', marginBottom: '10px' },
  navActive: { fontWeight: 'bold' },
  addBtn: { margin: '10px 0' },
  table: { width: '100%' },
  logoutBtn: { marginTop: '20px' }
};