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

  const [filterBrandId, setFB] = useState('');
  const [filterChainId, setFC] = useState('');
  const [filterGroupId, setFG] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  // 🔥 FETCH ALL DATA
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

    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FILTER
  const applyFilter = async (type, val) => {
    try {
      setLoading(true);

      let url = '/api/zones';
      if (val) {
        url = `/api/zones/filter/${type}?${type}Id=${val}`;
      }

      const res = await API.get(url);
      setZones(res.data || []);

      if (type === 'brand') setFB(val);
      if (type === 'chain') setFC(val);
      if (type === 'group') setFG(val);

    } catch {
      setError('Filter failed');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ADD
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

  // 🔥 EDIT
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

  // 🔥 DELETE
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
    <div style={{ display: 'flex' }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, padding: 20, background: '#fff' }}>
        <h2>IMS</h2>
        <div onClick={() => navigate('/dashboard')}>Dashboard</div>
        <div>Manage Zones</div>
        <div onClick={handleLogout}>Logout</div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: 20 }}>

        {/* LIST */}
        {view === 'list' && (
          <>
            <button onClick={() => setView('add')}>+ Add Zone</button>

            <table border="1" width="100%">
              <thead>
                <tr>
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
                  <tr><td colSpan="7">Loading...</td></tr>
                ) : zones.length === 0 ? (
                  <tr><td colSpan="7">No data</td></tr>
                ) : (
                  zones.map((z, i) => (
                    <tr key={z.zoneId}>
                      <td>{i + 1}</td>
                      <td>{z.zoneName}</td>
                      <td>{z.brandName}</td>
                      <td>{z.companyName}</td>
                      <td>{z.groupName}</td>
                      <td><button onClick={() => openEdit(z)}>Edit</button></td>
                      <td><button onClick={() => handleDelete(z.zoneId)}>Delete</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {/* ADD */}
        {view === 'add' && (
          <form onSubmit={handleAdd}>
            <h3>Add Zone</h3>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}

            <input
              placeholder="Zone Name"
              value={form.zoneName}
              onChange={e => setForm({ ...form, zoneName: e.target.value })}
            />

            <select
              value={form.brandId}
              onChange={e => setForm({ ...form, brandId: e.target.value })}
            >
              <option value="">Select Brand</option>
              {brands.map(b => (
                <option key={b.brandId} value={b.brandId}>
                  {b.brandName}
                </option>
              ))}
            </select>

            <button type="submit">{loading ? 'Adding...' : 'Add'}</button>
            <button type="button" onClick={() => setView('list')}>Cancel</button>
          </form>
        )}

        {/* EDIT */}
        {view === 'edit' && (
          <form onSubmit={handleEdit}>
            <h3>Edit Zone</h3>

            <input
              value={form.zoneName}
              onChange={e => setForm({ ...form, zoneName: e.target.value })}
            />

            <select
              value={form.brandId}
              onChange={e => setForm({ ...form, brandId: e.target.value })}
            >
              {brands.map(b => (
                <option key={b.brandId} value={b.brandId}>
                  {b.brandName}
                </option>
              ))}
            </select>

            <button>{loading ? 'Updating...' : 'Update Zone'}</button>
            <button type="button" onClick={() => setView('list')}>Cancel</button>
          </form>
        )}

      </main>
    </div>
  );
}