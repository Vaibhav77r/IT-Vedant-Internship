import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ManageGroups() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [view, setView] = useState('list');
  const [editGroup, setEditGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await API.get('/api/groups');
      setGroups(res.data);
    } catch {
      alert('Error loading groups');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!groupName) return alert('Enter group name');

    await API.post('/api/groups', { groupName });
    setGroupName('');
    setView('list');
    fetchGroups();
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    await API.put(`/api/groups/${editGroup.groupId}`, { groupName });
    setView('list');
    fetchGroups();
  };

  const handleDelete = async (id) => {
    await API.delete(`/api/groups/${id}`);
    fetchGroups();
  };

  const openEdit = (g) => {
    setEditGroup(g);
    setGroupName(g.groupName);
    setView('edit');
  };

  return (
    <div style={styles.page}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>IMS</h2>

        <div style={styles.nav} onClick={() => navigate('/dashboard')}>Dashboard</div>
        <div style={{ ...styles.nav, ...styles.active }}>Groups</div>

        <div style={{ marginTop: 'auto' }}>
          <p>Hi {user?.fullName}</p>
          <button style={styles.logout} onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>

        {view === 'list' && (
          <>
            <h2>Total Groups: {groups.length}</h2>

            <button style={styles.addBtn} onClick={() => setView('add')}>
              + Add Group
            </button>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Edit</th>
                  <th style={styles.th}>Delete</th>
                </tr>
              </thead>

              <tbody>
                {groups.map((g, i) => (
                  <tr key={g.groupId}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>{g.groupName}</td>

                    <td style={styles.td}>
                      <button style={styles.editBtn} onClick={() => openEdit(g)}>
                        Edit
                      </button>
                    </td>

                    <td style={styles.td}>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(g.groupId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {view === 'add' && (
          <form onSubmit={handleAdd} style={styles.form}>
            <h3>Add Group</h3>

            <input
              style={styles.input}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
            />

            <button style={styles.addBtn}>Add</button>
          </form>
        )}

        {view === 'edit' && (
          <form onSubmit={handleEdit} style={styles.form}>
            <h3>Edit Group</h3>

            <input
              style={styles.input}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            <button style={styles.updateBtn}>Update</button>
          </form>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f4f6f9' },

  sidebar: {
    width: '220px',
    background: '#1e293b',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column'
  },

  logo: { marginBottom: '20px' },

  nav: {
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '6px'
  },

  active: {
    background: '#4f46e5'
  },

  logout: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '8px',
    borderRadius: '6px'
  },

  main: { flex: 1, padding: '30px' },

  addBtn: {
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    marginBottom: '20px',
    cursor: 'pointer'
  },

  updateBtn: {
    background: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '6px'
  },

  table: {
    width: '100%',
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden'
  },

  th: { background: '#eee', padding: '10px' },
  td: { padding: '10px' },

  editBtn: {
    background: '#f59e0b',
    color: '#fff',
    border: 'none',
    padding: '6px',
    borderRadius: '4px'
  },

  deleteBtn: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '6px',
    borderRadius: '4px'
  },

  form: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '400px'
  },

  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px'
  }
};