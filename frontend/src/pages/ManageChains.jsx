import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ManageChains() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filterGroupId, setFilter] = useState('');
  const [view, setView] = useState('list');
  const [editChain, setEditChain] = useState(null);

  const [form, setForm] = useState({
    companyName: '',
    gstnNo: '',
    groupId: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  // ✅ Fetch data
  const fetchAll = async () => {
    try {
      const [chainsRes, groupsRes] = await Promise.all([
        API.get('/api/chains'),
        API.get('/api/groups'),
      ]);

      setChains(chainsRes.data);
      setGroups(groupsRes.data);

    } catch {
      setError('Failed to load data');
    }
  };

  // ✅ Filter
  const fetchFiltered = async (groupId) => {
    try {
      const res = groupId
        ? await API.get(`/api/chains/filter?groupId=${groupId}`)
        : await API.get('/api/chains');

      setChains(res.data);
    } catch {
      setError('Filter failed');
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    fetchFiltered(e.target.value);
  };

  // ✅ Add
  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.companyName) return setError('Company required');
    if (!form.gstnNo) return setError('GST required');
    if (form.gstnNo.length !== 15) return setError('GST must be 15 chars');
    if (!form.groupId) return setError('Select group');

    setLoading(true);

    try {
      await API.post('/api/chains', {
        ...form,
        groupId: Number(form.groupId)
      });

      setSuccess('Added successfully!');
      setForm({ companyName: '', gstnNo: '', groupId: '' });

      fetchAll();
      setTimeout(() => setView('list'), 1000);

    } catch (err) {
      setError('Add failed');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit
  const handleEdit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    setLoading(true);

    try {
      await API.put(`/api/chains/${editChain.chainId}`, {
        ...form,
        groupId: Number(form.groupId)
      });

      setSuccess('Updated!');
      fetchAll();
      setTimeout(() => setView('list'), 1000);

    } catch {
      setError('Update failed');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;

    try {
      await API.delete(`/api/chains/${id}`);
      fetchAll();
    } catch {
      alert('Delete failed');
    }
  };

  const openEdit = (chain) => {
    setEditChain(chain);
    setForm({
      companyName: chain.companyName,
      gstnNo: chain.gstnNo,
      groupId: chain.groupId
    });
    setView('edit');
  };

  // ================= UI =================
  return (
    <div style={ui.page}>

      {/* HEADER */}
      <div style={ui.header}>
        <h2 style={ui.title}>Manage Chains</h2>

        <div style={ui.actions}>
          <button style={ui.addBtn} onClick={() => setView('add')}>
            + Add Company
          </button>

          <select style={ui.select} value={filterGroupId} onChange={handleFilterChange}>
            <option value="">All Groups</option>
            {groups.map(g => (
              <option key={g.groupId} value={g.groupId}>
                {g.groupName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LIST */}
      {view === 'list' && (
        <div style={ui.card}>
          <table style={ui.table}>
            <thead>
              <tr>
                <th>Sr</th>
                <th>Group</th>
                <th>Company</th>
                <th>GST</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {chains.length === 0 ? (
                <tr>
                  <td colSpan="6" style={ui.noData}>No data</td>
                </tr>
              ) : (
                chains.map((c, i) => (
                  <tr key={c.chainId}>
                    <td>{i + 1}</td>
                    <td>{c.groupName}</td>
                    <td>{c.companyName}</td>
                    <td>{c.gstnNo}</td>

                    <td>
                      <button style={ui.editBtn} onClick={() => openEdit(c)}>
                        Edit
                      </button>
                    </td>

                    <td>
                      <button style={ui.deleteBtn} onClick={() => handleDelete(c.chainId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD */}
      {view === 'add' && (
        <div style={ui.formCard}>
          <h3>Add Company</h3>

          {error && <p style={ui.error}>{error}</p>}
          {success && <p style={ui.success}>{success}</p>}

          <form onSubmit={handleAdd}>
            <input style={ui.input} placeholder="Company"
              value={form.companyName}
              onChange={e => setForm({ ...form, companyName: e.target.value })}
            />

            <input style={ui.input} placeholder="GST"
              value={form.gstnNo}
              onChange={e => setForm({ ...form, gstnNo: e.target.value })}
            />

            <select style={ui.input}
              value={form.groupId}
              onChange={e => setForm({ ...form, groupId: e.target.value })}
            >
              <option value="">Select Group</option>
              {groups.map(g => (
                <option key={g.groupId} value={g.groupId}>
                  {g.groupName}
                </option>
              ))}
            </select>

            <div style={ui.btnRow}>
              <button style={ui.addBtn}>{loading ? "Adding..." : "Add"}</button>
              <button style={ui.cancelBtn} onClick={() => setView('list')} type="button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT */}
      {view === 'edit' && (
        <div style={ui.formCard}>
          <h3>Edit Company</h3>

          <form onSubmit={handleEdit}>
            <input style={ui.input}
              value={form.companyName}
              onChange={e => setForm({ ...form, companyName: e.target.value })}
            />

            <input style={ui.input}
              value={form.gstnNo}
              onChange={e => setForm({ ...form, gstnNo: e.target.value })}
            />

            <select style={ui.input}
              value={form.groupId}
              onChange={e => setForm({ ...form, groupId: e.target.value })}
            >
              {groups.map(g => (
                <option key={g.groupId} value={g.groupId}>
                  {g.groupName}
                </option>
              ))}
            </select>

            <div style={ui.btnRow}>
              <button style={ui.editBtn}>Update</button>
              <button style={ui.cancelBtn} type="button" onClick={() => setView('list')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

// 🎨 UI Styles
const ui = {
  page: { padding: "30px", background: "#f4f6f9", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  title: { fontSize: "24px", fontWeight: "700" },
  actions: { display: "flex", gap: "10px" },

  addBtn: { background: "#4f46e5", color: "#fff", padding: "10px", borderRadius: "8px", border: "none" },
  select: { padding: "10px", borderRadius: "8px" },

  card: { background: "#fff", padding: "20px", borderRadius: "10px" },
  table: { width: "100%" },

  editBtn: { background: "#f59e0b", color: "#fff", padding: "6px 10px", borderRadius: "6px", border: "none" },
  deleteBtn: { background: "#ef4444", color: "#fff", padding: "6px 10px", borderRadius: "6px", border: "none" },

  formCard: { background: "#fff", padding: "20px", borderRadius: "10px", maxWidth: "400px" },
  input: { width: "100%", padding: "10px", marginBottom: "10px" },

  btnRow: { display: "flex", gap: "10px" },
  cancelBtn: { background: "gray", color: "#fff", padding: "10px", border: "none" },

  error: { color: "red" },
  success: { color: "green" },
  noData: { textAlign: "center" }
};