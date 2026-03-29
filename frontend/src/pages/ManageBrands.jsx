import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ManageBrands() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [brands, setBrands]       = useState([]);
  const [chains, setChains]       = useState([]);
  const [groups, setGroups]       = useState([]);
  const [totalBrands, setTotal]   = useState(0);
  const [totalChains, setTotalC]  = useState(0);
  const [totalGroups, setTotalG]  = useState(0);
  const [view, setView]           = useState('list');
  const [editBrand, setEditBrand] = useState(null);
  const [form, setForm]           = useState({ brandName: '', chainId: '' });
  const [filterChainId, setFilterChain] = useState('');
  const [filterGroupId, setFilterGroup] = useState('');
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [brandsRes, chainsRes, groupsRes] = await Promise.all([
        API.get('/brands'),
        API.get('/chains'),
        API.get('/groups'),
      ]);
      setBrands(brandsRes.data);
      setTotal(brandsRes.data.length);
      setChains(chainsRes.data);
      setTotalC(chainsRes.data.length);
      setGroups(groupsRes.data);
      setTotalG(groupsRes.data.length);
    } catch { setError('Failed to load data'); }
  };

  const handleFilterChain = async (e) => {
    const val = e.target.value;
    setFilterChain(val);
    setFilterGroup('');
    try {
      const res = val ? await API.get(`/brands/filter/chain?chainId=${val}`) : await API.get('/brands');
      setBrands(res.data);
    } catch { setError('Filter failed'); }
  };

  const handleFilterGroup = async (e) => {
    const val = e.target.value;
    setFilterGroup(val);
    setFilterChain('');
    try {
      const res = val ? await API.get(`/brands/filter/group?groupId=${val}`) : await API.get('/brands');
      setBrands(res.data);
    } catch { setError('Filter failed'); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.brandName.trim()) { setError('Brand name is required'); return; }
    if (!form.chainId)          { setError('Please select a company'); return; }
    setLoading(true);
    try {
      await API.post('/brands', { brandName: form.brandName, chainId: Number(form.chainId) });
      setSuccess('Brand added successfully!');
      setForm({ brandName: '', chainId: '' });
      await fetchAll();
      setTimeout(() => { setView('list'); setSuccess(''); }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add brand');
    } finally { setLoading(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.brandName.trim()) { setError('Brand name is required'); return; }
    if (!form.chainId)          { setError('Please select a company'); return; }
    setLoading(true);
    try {
      await API.put(`/brands/${editBrand.brandId}`, { brandName: form.brandName, chainId: Number(form.chainId) });
      setSuccess('Brand updated!');
      await fetchAll();
      setTimeout(() => { setView('list'); setSuccess(''); }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update brand');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this brand?')) return;
    try {
      await API.delete(`/brands/${id}`);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Cannot delete this brand');
    }
  };

  const openEdit = (brand) => {
    setEditBrand(brand);
    setForm({ brandName: brand.brandName, chainId: brand.chainId });
    setError(''); setSuccess('');
    setView('edit');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>Invoice</div>
        <div style={s.sideSection}>| Manage Brand Section</div>
        <nav>
          <div style={s.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div style={s.navItem} onClick={() => navigate('/groups')}>Manage Groups</div>
          <div style={s.navItem} onClick={() => navigate('/chains')}>Manage Chain</div>
          <div style={{...s.navItem, ...s.navActive}}>Manage Brands</div>
          <div style={s.navItem}>Manage SubZones</div>
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
        {view === 'list' && (
          <>
            {/* Stat Cards */}
            <div style={s.statsRow}>
              <div style={{...s.statCard, background:'#f59e0b'}}>
                <div style={s.statLabel}>Total Groups</div>
                <div style={s.statValue}>{totalGroups}</div>
              </div>
              <div style={{...s.statCard, background:'#4f46e5'}}>
                <div style={s.statLabel}>Total Chains</div>
                <div style={s.statValue}>{totalChains}</div>
              </div>
              <div style={{...s.statCard, background:'#059669'}}>
                <div style={s.statLabel}>Total Brands</div>
                <div style={s.statValue}>{totalBrands}</div>
              </div>
            </div>

            {/* Toolbar */}
            <div style={s.toolbar}>
              <button style={s.addBtn} onClick={() => { setForm({ brandName:'', chainId:'' }); setError(''); setView('add'); }}>
                + Add Brand
              </button>
              <div style={s.filters}>
                {/* Filter by Company */}
                <div style={s.filterBox}>
                  <span style={s.filterLabel}>Filter by Company</span>
                  <select style={s.filterSelect} value={filterChainId} onChange={handleFilterChain}>
                    <option value="">All Companies</option>
                    {chains.map(c => (
                      <option key={c.chainId} value={c.chainId}>{c.companyName}</option>
                    ))}
                  </select>
                </div>
                {/* Filter by Group */}
                <div style={s.filterBox}>
                  <span style={s.filterLabel}>Filter by Group</span>
                  <select style={s.filterSelect} value={filterGroupId} onChange={handleFilterGroup}>
                    <option value="">All Groups</option>
                    {groups.map(g => (
                      <option key={g.groupId} value={g.groupId}>{g.groupName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Sr.No</th>
                  <th style={s.th}>Group</th>
                  <th style={s.th}>Company</th>
                  <th style={s.th}>Brand</th>
                  <th style={s.th}>Edit</th>
                  <th style={s.th}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 ? (
                  <tr><td colSpan={6} style={s.noData}>No brands found. Add your first brand!</td></tr>
                ) : (
                  brands.map((b, i) => (
                    <tr key={b.brandId} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                      <td style={s.td}>{i + 1}</td>
                      <td style={s.td}>{b.groupName}</td>
                      <td style={s.td}>{b.companyName}</td>
                      <td style={s.td}>{b.brandName}</td>
                      <td style={s.td}>
                        <button style={s.editBtn} onClick={() => openEdit(b)}>Edit</button>
                      </td>
                      <td style={s.td}>
                        <button style={s.deleteBtn} onClick={() => handleDelete(b.brandId)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {/* ADD VIEW */}
        {view === 'add' && (
          <div style={s.formCard}>
            {error   && <div style={s.errorBox}>{error}</div>}
            {success && <div style={s.successBox}>{success}</div>}
            <form onSubmit={handleAdd}>
              <div style={s.field}>
                <label style={s.label}>Enter Brand Name:</label>
                <input style={s.input} placeholder="Enter Brand Name"
                  value={form.brandName} onChange={e => setForm({...form, brandName: e.target.value})} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Select Company:</label>
                <select style={s.input} value={form.chainId} onChange={e => setForm({...form, chainId: e.target.value})}>
                  <option value="">-- Select Company --</option>
                  {chains.map(c => (
                    <option key={c.chainId} value={c.chainId}>{c.companyName}</option>
                  ))}
                </select>
              </div>
              <div style={s.btnRow}>
                <button style={s.addBtn} type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Brand'}
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
                <label style={s.label}>Enter Brand Name:</label>
                <input style={s.input} value={form.brandName}
                  onChange={e => setForm({...form, brandName: e.target.value})} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Select Company:</label>
                <select style={s.input} value={form.chainId} onChange={e => setForm({...form, chainId: e.target.value})}>
                  <option value="">-- Select Company --</option>
                  {chains.map(c => (
                    <option key={c.chainId} value={c.chainId}>{c.companyName}</option>
                  ))}
                </select>
              </div>
              <div style={s.btnRow}>
                <button style={s.updateBtn} type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update'}
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
  page:       { display:'flex', minHeight:'100vh', background:'#f5f5f5', fontFamily:'sans-serif' },
  sidebar:    { width:'220px', background:'#fff', borderRight:'1px solid #e0e0e0', padding:'1rem', display:'flex', flexDirection:'column' },
  logo:       { fontSize:'1.4rem', fontWeight:'700', color:'#1a1a2e', marginBottom:'2px' },
  sideSection:{ fontSize:'0.75rem', color:'#888', marginBottom:'1.5rem' },
  navItem:    { padding:'8px 10px', borderRadius:'6px', cursor:'pointer', fontSize:'0.88rem', color:'#444', marginBottom:'2px' },
  navActive:  { fontWeight:'700', color:'#4f46e5' },
  sideBottom: { marginTop:'auto', display:'flex', gap:'4px', alignItems:'center' },
  hiUser:     { fontSize:'0.82rem', color:'#555' },
  main:       { flex:1, padding:'2rem' },
  statsRow:   { display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' },
  statCard:   { color:'#fff', padding:'1rem 2rem', borderRadius:'10px', minWidth:'140px' },
  statLabel:  { fontSize:'0.82rem', opacity:0.9 },
  statValue:  { fontSize:'2rem', fontWeight:'700' },
  toolbar:    { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:'1rem' },
  filters:    { display:'flex', gap:'1rem', flexWrap:'wrap' },
  addBtn:     { background:'#4f46e5', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'0.9rem' },
  updateBtn:  { background:'#059669', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'0.9rem' },
  cancelBtn:  { background:'#6b7280', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'0.9rem' },
  filterBox:  { display:'flex', alignItems:'center', gap:'8px' },
  filterLabel:{ fontSize:'0.88rem', fontWeight:'600', color:'#374151' },
  filterSelect:{ padding:'7px 12px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'0.88rem', cursor:'pointer' },
  table:      { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  thead:      { background:'#f1f5f9' },
  th:         { padding:'12px 16px', textAlign:'left', fontWeight:'600', fontSize:'0.88rem', color:'#374151' },
  td:         { padding:'11px 16px', fontSize:'0.9rem', color:'#374151' },
  trEven:     { background:'#fff' },
  trOdd:      { background:'#f9fafb' },
  editBtn:    { background:'#f59e0b', color:'#fff', border:'none', padding:'5px 14px', borderRadius:'5px', cursor:'pointer', fontWeight:'600', fontSize:'0.82rem' },
  deleteBtn:  { background:'#ef4444', color:'#fff', border:'none', padding:'5px 14px', borderRadius:'5px', cursor:'pointer', fontWeight:'600', fontSize:'0.82rem' },
  noData:     { textAlign:'center', padding:'2rem', color:'#888' },
  formCard:   { background:'#fff', padding:'2rem', borderRadius:'10px', maxWidth:'440px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  field:      { marginBottom:'1rem' },
  label:      { display:'block', fontWeight:'600', marginBottom:'4px', fontSize:'0.9rem' },
  input:      { width:'100%', padding:'9px 12px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'0.95rem', boxSizing:'border-box' },
  btnRow:     { display:'flex', gap:'10px', marginTop:'4px' },
  errorBox:   { background:'#fee2e2', color:'#dc2626', padding:'8px 12px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.88rem' },
  successBox: { background:'#dcfce7', color:'#16a34a', padding:'8px 12px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.88rem' },
};
