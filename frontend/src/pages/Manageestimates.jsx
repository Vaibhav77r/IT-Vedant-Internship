import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  chainId: '', groupName: '', brandName: '', zoneName: '',
  service: '', qty: '', costPerUnit: '', deliveryDate: '', deliveryDetails: ''
};

export default function ManageEstimates() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [estimates, setEstimates] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [brands, setBrands] = useState([]);
  const [zones, setZones] = useState([]);
  const [total, setTotal] = useState(0);

  const [view, setView] = useState('list');
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  // 🔥 FETCH ALL DATA
  const fetchAll = async () => {
    try {
      setLoading(true);

      const [estRes, chainRes, groupRes, brandRes, zoneRes] = await Promise.all([
        API.get('/api/estimates'),
        API.get('/api/chains'),
        API.get('/api/groups'),
        API.get('/api/brands'),
        API.get('/api/zones'),
      ]);

      setEstimates(estRes.data || []);
      setTotal(estRes.data?.length || 0);
      setChains(chainRes.data || []);
      setGroups(groupRes.data || []);
      setBrands(brandRes.data || []);
      setZones(zoneRes.data || []);

    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 TOTAL CALC
  const totalCost = form.qty && form.costPerUnit
    ? (Number(form.qty) * Number(form.costPerUnit)).toFixed(2)
    : '0.00';

  // 🔥 FILTER LOGIC
  const filteredBrands = form.chainId
    ? brands.filter(b => String(b.chainId) === String(form.chainId))
    : brands;

  const filteredZones = form.brandName
    ? zones.filter(z => z.brandName === form.brandName)
    : zones;

  // 🔥 VALIDATION
  const validate = () => {
    if (!form.chainId) return 'Select company';
    if (!form.groupName) return 'Select group';
    if (!form.brandName) return 'Select brand';
    if (!form.zoneName) return 'Select zone';
    if (!form.service.trim()) return 'Service required';
    if (!form.qty || form.qty <= 0) return 'Invalid quantity';
    if (!form.costPerUnit || form.costPerUnit <= 0) return 'Invalid cost';
    if (!form.deliveryDate) return 'Select date';
    return null;
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const err = validate();
    if (err) return setError(err);

    try {
      setLoading(true);

      const payload = {
        chainId: Number(form.chainId),
        groupName: form.groupName,
        brandName: form.brandName,
        zoneName: form.zoneName,
        service: form.service,
        qty: Number(form.qty),
        costPerUnit: Number(form.costPerUnit),
        deliveryDate: form.deliveryDate,
        deliveryDetails: form.deliveryDetails,
      };

      if (editId) {
        await API.put(`/api/estimates/${editId}`, payload);
        setSuccess('Updated successfully');
      } else {
        await API.post('/api/estimates', payload);
        setSuccess('Created successfully');
      }

      setForm(emptyForm);
      setEditId(null);
      await fetchAll();
      setTimeout(() => setView('list'), 1000);

    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (e) => {
    setEditId(e.estimatedId);
    setForm(e);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this estimate?')) return;

    try {
      await API.delete(`/api/estimates/${id}`);
      await fetchAll();
    } catch {
      alert('Delete failed');
    }
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
          <div style={{ ...styles.navItem, ...styles.active }}>Estimates</div>
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
          <h1 style={styles.title}>Manage Estimates</h1>
          <button style={styles.primaryBtn} onClick={() => setView('form')}>
            + Create Estimate
          </button>
        </div>

        {/* STAT */}
        <div style={styles.statCard}>
          <p>Total Estimates</p>
          <h2>{total}</h2>
        </div>

        {/* TABLE */}
        {view === 'list' && (
          <div style={styles.tableBox}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th>#</th>
                  <th>Group</th>
                  <th>Brand</th>
                  <th>Zone</th>
                  <th>Service</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan="10" style={styles.center}>Loading...</td></tr>
                ) : estimates.length === 0 ? (
                  <tr><td colSpan="10" style={styles.center}>No data found</td></tr>
                ) : (
                  estimates.map((e, i) => (
                    <tr key={e.estimatedId} style={styles.row}>
                      <td>{i + 1}</td>
                      <td>{e.groupName}</td>
                      <td>{e.brandName}</td>
                      <td>{e.zoneName}</td>
                      <td>{e.service}</td>
                      <td>{e.qty}</td>
                      <td>₹{e.costPerUnit}</td>
                      <td style={{ color: '#059669', fontWeight: 'bold' }}>₹{e.totalCost}</td>
                      <td><button style={styles.editBtn} onClick={() => handleEdit(e)}>Edit</button></td>
                      <td><button style={styles.deleteBtn} onClick={() => handleDelete(e.estimatedId)}>Delete</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* FORM */}
        {view === 'form' && (
          <div style={styles.formCard}>
            <h2>{editId ? 'Update Estimate' : 'Create Estimate'}</h2>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <div style={styles.formGrid}>

              <select style={styles.input}
                value={form.chainId}
                onChange={e => setForm({ ...form, chainId: e.target.value })}>
                <option value="">Select Company</option>
                {chains.map(c => <option key={c.chainId} value={c.chainId}>{c.companyName}</option>)}
              </select>

              <select style={styles.input}
                value={form.groupName}
                onChange={e => setForm({ ...form, groupName: e.target.value })}>
                <option value="">Select Group</option>
                {groups.map(g => <option key={g.groupId}>{g.groupName}</option>)}
              </select>

              <select style={styles.input}
                value={form.brandName}
                onChange={e => setForm({ ...form, brandName: e.target.value })}>
                <option value="">Select Brand</option>
                {filteredBrands.map(b => <option key={b.brandId}>{b.brandName}</option>)}
              </select>

              <select style={styles.input}
                value={form.zoneName}
                onChange={e => setForm({ ...form, zoneName: e.target.value })}>
                <option value="">Select Zone</option>
                {filteredZones.map(z => <option key={z.zoneId}>{z.zoneName}</option>)}
              </select>

              <input style={styles.input} placeholder="Service"
                value={form.service}
                onChange={e => setForm({ ...form, service: e.target.value })} />

              <input style={styles.input} type="number" placeholder="Quantity"
                value={form.qty}
                onChange={e => setForm({ ...form, qty: e.target.value })} />

              <input style={styles.input} type="number" placeholder="Cost per unit"
                value={form.costPerUnit}
                onChange={e => setForm({ ...form, costPerUnit: e.target.value })} />

              <input style={styles.input} type="date"
                value={form.deliveryDate}
                onChange={e => setForm({ ...form, deliveryDate: e.target.value })} />

            </div>

            <div style={styles.totalBox}>
              Total Amount: ₹{totalCost}
            </div>

            <div style={styles.btnRow}>
              <button style={styles.primaryBtn}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button style={styles.cancelBtn} onClick={() => setView('list')}>
                Cancel
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#f3f4f6', fontFamily: 'Segoe UI' },
  sidebar: { width: 230, background: '#1e293b', color: '#fff', padding: 20 },
  logo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  navItem: { padding: 10, cursor: 'pointer' },
  active: { color: '#4f46e5' },
  footer: { marginTop: 40 },
  logout: { marginTop: 10, background: '#ef4444', color: '#fff', border: 'none', padding: 6 },
  main: { flex: 1, padding: 20 },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 22 },
  primaryBtn: { background: '#4f46e5', color: '#fff', padding: '8px 15px', border: 'none', borderRadius: 6 },
  statCard: { background: '#4f46e5', color: '#fff', padding: 15, borderRadius: 10, width: 200, marginBottom: 20 },
  tableBox: { background: '#fff', borderRadius: 10, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f1f5f9' },
  row: { borderTop: '1px solid #ddd' },
  center: { textAlign: 'center', padding: 20 },
  editBtn: { background: '#f59e0b', color: '#fff', border: 'none', padding: 5 },
  deleteBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: 5 },
  formCard: { background: '#fff', padding: 20, borderRadius: 10, maxWidth: 700 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  input: { padding: 8, border: '1px solid #ddd', borderRadius: 6 },
  totalBox: { marginTop: 10, fontWeight: 'bold', color: '#059669' },
  btnRow: { marginTop: 10, display: 'flex', gap: 10 },
  cancelBtn: { background: '#6b7280', color: '#fff', border: 'none', padding: 8 },
  error: { color: 'red' },
  success: { color: 'green' }
};