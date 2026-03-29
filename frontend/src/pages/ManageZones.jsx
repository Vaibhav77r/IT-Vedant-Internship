import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ManageZones() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [zones, setZones]         = useState([]);
  const [brands, setBrands]       = useState([]);
  const [chains, setChains]       = useState([]);
  const [groups, setGroups]       = useState([]);
  const [totals, setTotals]       = useState({ zones:0, brands:0, chains:0, groups:0 });
  const [view, setView]           = useState('list');
  const [editZone, setEditZone]   = useState(null);
  const [form, setForm]           = useState({ zoneName:'', brandId:'' });
  const [filterBrandId, setFB]    = useState('');
  const [filterChainId, setFC]    = useState('');
  const [filterGroupId, setFG]    = useState('');
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [zonesRes, brandsRes, chainsRes, groupsRes] = await Promise.all([
        API.get('/zones'),
        API.get('/brands'),
        API.get('/chains'),
        API.get('/groups'),
      ]);
      setZones(zonesRes.data);
      setBrands(brandsRes.data);
      setChains(chainsRes.data);
      setGroups(groupsRes.data);
      setTotals({
        zones:  zonesRes.data.length,
        brands: brandsRes.data.length,
        chains: chainsRes.data.length,
        groups: groupsRes.data.length,
      });
    } catch { setError('Failed to load data'); }
  };

  const applyFilter = async (type, val) => {
    setFB(''); setFC(''); setFG('');
    if (type === 'brand')   setFB(val);
    if (type === 'chain')   setFC(val);
    if (type === 'group')   setFG(val);
    try {
      const res = val
        ? await API.get(`/zones/filter/${type}?${type}Id=${val}`)
        : await API.get('/zones');
      setZones(res.data);
    } catch { setError('Filter failed'); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.zoneName.trim()) { setError('Zone name is required'); return; }
    if (!form.brandId)         { setError('Please select a brand'); return; }
    setLoading(true);
    try {
      await API.post('/zones', { zoneName: form.zoneName, brandId: Number(form.brandId) });
      setSuccess('Zone added successfully!');
      setForm({ zoneName:'', brandId:'' });
      await fetchAll();
      setTimeout(() => { setView('list'); setSuccess(''); }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add zone');
    } finally { setLoading(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.zoneName.trim()) { setError('Zone name is required'); return; }
    if (!form.brandId)         { setError('Please select a brand'); return; }
    setLoading(true);
    try {
      await API.put(`/zones/${editZone.zoneId}`, { zoneName: form.zoneName, brandId: Number(form.brandId) });
      setSuccess('Zone updated!');
      await fetchAll();
      setTimeout(() => { setView('list'); setSuccess(''); }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update zone');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this zone?')) return;
    try {
      await API.delete(`/zones/${id}`);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Cannot delete this zone');
    }
  };

  const openEdit = (zone) => {
    setEditZone(zone);
    setForm({ zoneName: zone.zoneName, brandId: zone.brandId });
    setError(''); setSuccess('');
    setView('edit');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>Invoice</div>
        <div style={s.sideSection}>| Manage Zone Section</div>
        <nav>
          <div style={s.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div style={s.navItem} onClick={() => navigate('/groups')}>Manage Groups</div>
          <div style={s.navItem} onClick={() => navigate('/chains')}>Manage Chain</div>
          <div style={s.navItem} onClick={() => navigate('/brands')}>Manage Brands</div>
          <div style={{...s.navItem, ...s.navActive}}>Manage SubZones</div>
          <div style={s.navItem}>Manage Estimate</div>
          <div style={s.navItem}>Manage Invoices</div>
        </nav>
        <div style={s.sideBottom}>
          <span style={s.hiUser}>Hi {user?.fullName} | </span>
          <span style={{...s.hiUser, color:'#dc2626', cursor:'pointer'}} onClick={handleLogout}>Logout</span>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>

        {/* LIST VIEW */}
        {view === 'list' && (<>
          {/* Stat Cards */}
          <div style={s.statsRow}>
            <div style={{...s.statCard, background:'#f59e0b'}}>
              <div style={s.statLabel}>Total Groups</div>
              <div style={s.statValue}>{totals.groups}</div>
            </div>
            <div style={{...s.statCard, background:'#4f46e5'}}>
              <div style={s.statLabel}>Total Chains</div>
              <div style={s.statValue}>{totals.chains}</div>
            </div>
            <div style={{...s.statCard, background:'#059669'}}>
              <div style={s.statLabel}>Total Brands</div>
              <div style={s.statValue}>{totals.brands}</div>
            </div>
            <div style={{...s.statCard, background:'#dc2626'}}>
              <div style={s.statLabel}>Total Zones</div>
              <div style={s.statValue}>{totals.zones}</div>
            </div>
          </div>

          <div style={s.mainRow}>
            {/* Left: table area */}
            <div style={{flex:1}}>
              <button style={s.addBtn} onClick={() => { setForm({zoneName:'', brandId:''}); setError(''); setView('add'); }}>
                + Add Zone
              </button>

              <table style={s.table}>
                <thead>
                  <tr style={s.thead}>
                    <th style={s.th}>Sr.No</th>
                    <th style={s.th}>Zone</th>
                    <th style={s.th}>Brand</th>
                    <th style={s.th}>Company</th>
                    <th style={s.th}>Group</th>
                    <th style={s.th}>Edit</th>
                    <th style={s.th}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.length === 0 ? (
                    <tr><td colSpan={7} style={s.noData}>No zones found. Add your first zone!</td></tr>
                  ) : (
                    zones.map((z, i) => (
                      <tr key={z.zoneId} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                        <td style={s.td}>{i + 1}</td>
                        <td style={s.td}>{z.zoneName}</td>
                        <td style={s.td}>{z.brandName}</td>
                        <td style={s.td}>{z.companyName}</td>
                        <td style={s.td}>{z.groupName}</td>
                        <td style={s.td}>
                          <button style={s.editBtn} onClick={() => openEdit(z)}>Edit</button>
                        </td>
                        <td style={s.td}>
                          <button style={s.deleteBtn} onClick={() => handleDelete(z.zoneId)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Right: filter panel */}
            <div style={s.filterPanel}>
              <div style={s.filterSection}>
                <div style={s.filterTitle}>Filter by Brand</div>
                {brands.map(b => (
                  <div key={b.brandId}
                    style={{...s.filterItem, color: filterBrandId == b.brandId ? '#4f46e5' : '#374151'}}
                    onClick={() => applyFilter('brand', filterBrandId == b.brandId ? '' : b.brandId)}>
                    {b.brandName}
                  </div>
                ))}
              </div>
              <div style={s.filterSection}>
                <div style={s.filterTitle}>Filter by Company</div>
                {chains.map(c => (
                  <div key={c.chainId}
                    style={{...s.filterItem, color: filterChainId == c.chainId ? '#4f46e5' : '#374151'}}
                    onClick={() => applyFilter('chain', filterChainId == c.chainId ? '' : c.chainId)}>
                    {c.companyName}
                  </div>
                ))}
              </div>
              <div style={s.filterSection}>
                <div style={s.filterTitle}>Filter by Group</div>
                {groups.map(g => (
                  <div key={g.groupId}
                    style={{...s.filterItem, color: filterGroupId == g.groupId ? '#4f46e5' : '#374151'}}
                    onClick={() => applyFilter('group', filterGroupId == g.groupId ? '' : g.groupId)}>
                    {g.groupName}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>)}

        {/* ADD VIEW */}
        {view === 'add' && (
          <div style={s.formCard}>
            {error   && <div style={s.errorBox}>{error}</div>}
            {success && <div style={s.successBox}>{success}</div>}
            <form onSubmit={handleAdd}>
              <div style={s.field}>
                <label style={s.label}>Enter Zone Name:</label>
                <input style={s.input} placeholder="Enter Zone Name"
                  value={form.zoneName} onChange={e => setForm({...form, zoneName: e.target.value})} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Select Brand:</label>
                <select style={s.input} value={form.brandId} onChange={e => setForm({...form, brandId: e.target.value})}>
                  <option value="">-- Select Brand --</option>
                  {brands.map(b => (
                    <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                  ))}
                </select>
              </div>
              <div style={s.btnRow}>
                <button style={s.addBtn} type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Zone'}
                </button>
                <button style={s.cancelBtn} type="button" onClick={() => setView('list')}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* EDIT VIEW */}
        {view === 'edit' && (
          <div style={s.formCard}>
            {error   && <div style={s.errorBox}>{error}</div>}
            {success && <div style={s.successBox}>{success}</div>}
            <form onSubmit={handleEdit}>
              <div style={s.field}>
                <label style={s.label}>Enter Zone Name:</label>
                <input style={s.input} value={form.zoneName}
                  onChange={e => setForm({...form, zoneName: e.target.value})} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Select Brand:</label>
                <select style={s.input} value={form.brandId} onChange={e => setForm({...form, brandId: e.target.value})}>
                  <option value="">-- Select Brand --</option>
                  {brands.map(b => (
                    <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                  ))}
                </select>
              </div>
              <div style={s.btnRow}>
                <button style={s.updateBtn} type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Brand'}
                </button>
                <button style={s.cancelBtn} type="button" onClick={() => setView('list')}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

const s = {
  page:          { display:'flex', minHeight:'100vh', background:'#f5f5f5', fontFamily:'sans-serif' },
  sidebar:       { width:'220px', background:'#fff', borderRight:'1px solid #e0e0e0', padding:'1rem', display:'flex', flexDirection:'column' },
  logo:          { fontSize:'1.4rem', fontWeight:'700', color:'#1a1a2e', marginBottom:'2px' },
  sideSection:   { fontSize:'0.75rem', color:'#888', marginBottom:'1.5rem' },
  navItem:       { padding:'8px 10px', borderRadius:'6px', cursor:'pointer', fontSize:'0.88rem', color:'#444', marginBottom:'2px' },
  navActive:     { fontWeight:'700', color:'#4f46e5' },
  sideBottom:    { marginTop:'auto', display:'flex', gap:'4px', alignItems:'center' },
  hiUser:        { fontSize:'0.82rem', color:'#555' },
  main:          { flex:1, padding:'2rem' },
  statsRow:      { display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' },
  statCard:      { color:'#fff', padding:'1rem 2rem', borderRadius:'10px', minWidth:'130px' },
  statLabel:     { fontSize:'0.82rem', opacity:0.9 },
  statValue:     { fontSize:'2rem', fontWeight:'700' },
  mainRow:       { display:'flex', gap:'1.5rem', alignItems:'flex-start' },
  addBtn:        { background:'#4f46e5', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'0.9rem', marginBottom:'1rem', display:'block' },
  updateBtn:     { background:'#059669', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'0.9rem' },
  cancelBtn:     { background:'#6b7280', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'0.9rem' },
  table:         { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  thead:         { background:'#f1f5f9' },
  th:            { padding:'12px 16px', textAlign:'left', fontWeight:'600', fontSize:'0.88rem', color:'#374151' },
  td:            { padding:'11px 16px', fontSize:'0.9rem', color:'#374151' },
  trEven:        { background:'#fff' },
  trOdd:         { background:'#f9fafb' },
  editBtn:       { background:'#f59e0b', color:'#fff', border:'none', padding:'5px 14px', borderRadius:'5px', cursor:'pointer', fontWeight:'600', fontSize:'0.82rem' },
  deleteBtn:     { background:'#ef4444', color:'#fff', border:'none', padding:'5px 14px', borderRadius:'5px', cursor:'pointer', fontWeight:'600', fontSize:'0.82rem' },
  noData:        { textAlign:'center', padding:'2rem', color:'#888' },
  filterPanel:   { width:'200px', background:'#fff', borderRadius:'10px', padding:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', flexShrink:0 },
  filterSection: { marginBottom:'1.2rem' },
  filterTitle:   { fontWeight:'700', fontSize:'0.85rem', color:'#374151', marginBottom:'6px', borderBottom:'1px solid #e5e7eb', paddingBottom:'4px' },
  filterItem:    { padding:'4px 0', fontSize:'0.85rem', cursor:'pointer' },
  formCard:      { background:'#fff', padding:'2rem', borderRadius:'10px', maxWidth:'440px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  field:         { marginBottom:'1rem' },
  label:         { display:'block', fontWeight:'600', marginBottom:'4px', fontSize:'0.9rem' },
  input:         { width:'100%', padding:'9px 12px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'0.95rem', boxSizing:'border-box' },
  btnRow:        { display:'flex', gap:'10px', marginTop:'4px' },
  errorBox:      { background:'#fee2e2', color:'#dc2626', padding:'8px 12px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.88rem' },
  successBox:    { background:'#dcfce7', color:'#16a34a', padding:'8px 12px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.88rem' },
};