import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ManageZones() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [zones, setZones] = useState([]);
  const [brands, setBrands] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);

  const [totals, setTotals] = useState({ zones: 0, brands: 0, chains: 0, groups: 0 });

  const [view, setView] = useState('list');
  const [editZone, setEditZone] = useState(null);
  const [form, setForm] = useState({ zoneName: '', brandId: '' });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [zonesRes, brandsRes, chainsRes, groupsRes] = await Promise.all([
        API.get('/api/zones'),
        API.get('/api/brands'),
        API.get('/api/chains'),
        API.get('/api/groups'),
      ]);

      setZones(zonesRes.data || []);
      setBrands(brandsRes.data || []);
      setChains(chainsRes.data || []);
      setGroups(groupsRes.data || []);

      setTotals({
        zones: zonesRes.data?.length || 0,
        brands: brandsRes.data?.length || 0,
        chains: chainsRes.data?.length || 0,
        groups: groupsRes.data?.length || 0,
      });

    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.zoneName.trim()) return setError('Zone name required');
    if (!form.brandId) return setError('Select brand');

    try {
      setLoading(true);

      await API.post('/api/zones', {
        zoneName: form.zoneName,
        brandId: Number(form.brandId),
      });

      setSuccess('Zone added!');
      setForm({ zoneName: '', brandId: '' });
      await fetchAll();
      setTimeout(() => setView('list'), 1000);

    } catch (err) {
      setError(err.response?.data?.error || 'Add failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);

      await API.put(`/api/zones/${editZone.zoneId}`, {
        zoneName: form.zoneName,
        brandId: Number(form.brandId),
      });

      setSuccess('Zone updated!');
      await fetchAll();
      setTimeout(() => setView('list'), 1000);

    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this zone?')) return;

    try {
      await API.delete(`/api/zones/${id}`);
      await fetchAll();
    } catch {
      alert('Delete failed');
    }
  };

  const openEdit = (z) => {
    setEditZone(z);
    setForm({ zoneName: z.zoneName, brandId: z.brandId });
    setView('edit');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>IMS</h2>

        <div style={styles.nav}>
          <div onClick={() => navigate('/dashboard')} style={styles.navItem}>Dashboard</div>
          <div style={{ ...styles.navItem, ...styles.active }}>Manage Zones</div>
        </div>

        <div style={styles.footer}>
          <p>Hi {user?.fullName}</p>
          <button onClick={handleLogout} style={styles.logout}>Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>

        {/* HEADER */}
        <div style={styles.header}>
          <h1>Manage Zones</h1>
          <button onClick={() => setView('add')} style={styles.addBtn}>
            + Add Zone
          </button>
        </div>

        {/* STATS */}
        <div style={styles.stats}>
          <div style={{ ...styles.card, background: '#f59e0b' }}>
            <p>Groups</p>
            <h2>{totals.groups}</h2>
          </div>
          <div style={{ ...styles.card, background: '#4f46e5' }}>
            <p>Chains</p>
            <h2>{totals.chains}</h2>
          </div>
          <div style={{ ...styles.card, background: '#059669' }}>
            <p>Brands</p>
            <h2>{totals.brands}</h2>
          </div>
          <div style={{ ...styles.card, background: '#dc2626' }}>
            <p>Zones</p>
            <h2>{totals.zones}</h2>
          </div>
        </div>

        {/* TABLE */}
        <div style={styles.tableBox}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th>#</th>
                <th>Zone</th>
                <th>Brand</th>
                <th>Company</th>
                <th>Group</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={styles.center}>Loading...</td></tr>
              ) : zones.length === 0 ? (
                <tr><td colSpan="7" style={styles.center}>No zones found</td></tr>
              ) : (
                zones.map((z, i) => (
                  <tr key={z.zoneId} style={styles.row}>
                    <td>{i + 1}</td>
                    <td>{z.zoneName}</td>
                    <td>{z.brandName}</td>
                    <td>{z.companyName}</td>
                    <td>{z.groupName}</td>
                    <td>
                      <button style={styles.editBtn} onClick={() => openEdit(z)}>Edit</button>
                    </td>
                    <td>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(z.zoneId)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ADD */}
        {view === 'add' && (
          <form style={styles.form} onSubmit={handleAdd}>
            <h3>Add Zone</h3>
            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <input
              style={styles.input}
              placeholder="Zone Name"
              value={form.zoneName}
              onChange={e => setForm({ ...form, zoneName: e.target.value })}
            />

            <select
              style={styles.input}
              value={form.brandId}
              onChange={e => setForm({ ...form, brandId: e.target.value })}
            >
              <option value="">Select Brand</option>
              {brands.map(b => (
                <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
              ))}
            </select>

            <div style={styles.btnRow}>
              <button style={styles.addBtn}>{loading ? 'Adding...' : 'Add'}</button>
              <button type="button" onClick={() => setView('list')} style={styles.cancel}>Cancel</button>
            </div>
          </form>
        )}

        {/* EDIT */}
        {view === 'edit' && (
          <form style={styles.form} onSubmit={handleEdit}>
            <h3>Edit Zone</h3>

            <input
              style={styles.input}
              value={form.zoneName}
              onChange={e => setForm({ ...form, zoneName: e.target.value })}
            />

            <select
              style={styles.input}
              value={form.brandId}
              onChange={e => setForm({ ...form, brandId: e.target.value })}
            >
              {brands.map(b => (
                <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
              ))}
            </select>

            <div style={styles.btnRow}>
              <button style={styles.update}>{loading ? 'Updating...' : 'Update Zone'}</button>
              <button type="button" onClick={() => setView('list')} style={styles.cancel}>Cancel</button>
            </div>
          </form>
        )}

      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#f3f4f6' },
  sidebar: { width: '220px', background: '#1e293b', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column' },
  logo: { fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' },
  nav: { flex: 1 },
  navItem: { padding: '10px', cursor: 'pointer', borderRadius: '6px', marginBottom: '5px' },
  active: { background: '#4f46e5' },
  footer: {},
  logout: { marginTop: '10px', padding: '6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '5px' },
  main: { flex: 1, padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  addBtn: { background: '#4f46e5', color: '#fff', padding: '8px 15px', border: 'none', borderRadius: '6px' },
  stats: { display: 'flex', gap: '15px', marginBottom: '20px' },
  card: { flex: 1, padding: '15px', color: '#fff', borderRadius: '10px' },
  tableBox: { background: '#fff', borderRadius: '10px', overflow: 'hidden' },
  table: { width: '100%' },
  thead: { background: '#f1f5f9' },
  row: { borderTop: '1px solid #ddd' },
  center: { textAlign: 'center', padding: '20px' },
  editBtn: { background: '#f59e0b', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' },
  deleteBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' },
  form: { marginTop: '20px', background: '#fff', padding: '20px', borderRadius: '10px', maxWidth: '400px' },
  input: { width: '100%', padding: '8px', marginBottom: '10px' },
  btnRow: { display: 'flex', gap: '10px' },
  cancel: { background: '#6b7280', color: '#fff', padding: '8px', border: 'none' },
  update: { background: '#059669', color: '#fff', padding: '8px', border: 'none' },
  error: { color: 'red' },
  success: { color: 'green' }
};