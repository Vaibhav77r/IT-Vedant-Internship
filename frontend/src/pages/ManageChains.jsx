import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ManageChains() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [chains, setChains]       = useState([]);
  const [groups, setGroups]       = useState([]);
  const [totalChains, setTotal]   = useState(0);
  const [totalGroups, setTotalG]  = useState(0);
  const [filterGroupId, setFilter]= useState('');
  const [view, setView]           = useState('list'); // list | add | edit
  const [editChain, setEditChain] = useState(null);
  const [form, setForm]           = useState({ companyName: '', gstnNo: '', groupId: '' });
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [chainsRes, groupsRes] = await Promise.all([
        API.get('/chains'),
        API.get('/groups'),
      ]);
      setChains(chainsRes.data);
      setTotal(chainsRes.data.length);
      setGroups(groupsRes.data);
      setTotalG(groupsRes.data.length);
    } catch { setError('Failed to load data'); }
  };

  const fetchFiltered = async (groupId) => {
    try {
      const res = groupId
        ? await API.get(`/chains/filter?groupId=${groupId}`)
        : await API.get('/chains');
      setChains(res.data);
    } catch { setError('Failed to filter'); }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    fetchFiltered(e.target.value);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.companyName.trim()) { setError('Company name is required'); return; }
    if (!form.gstnNo.trim())      { setError('GSTN number is required'); return; }
    if (form.gstnNo.trim().length !== 15) { setError('GSTN must be exactly 15 characters'); return; }
    if (!form.groupId)            { setError('Please select a group'); return; }
    setLoading(true);
    try {
      await API.post('/chains', { ...form, groupId: Number(form.groupId) });
      setSuccess('Company added successfully!');
      setForm({ companyName: '', gstnNo: '', groupId: '' });
      await fetchAll();
      setTimeout(() => { setView('list'); setSuccess(''); }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add company');
    } finally { setLoading(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.companyName.trim()) { setError('Company name is required'); return; }
    if (!form.gstnNo.trim())      { setError('GSTN number is required'); return; }
    if (form.gstnNo.trim().length !== 15) { setError('GSTN must be exactly 15 characters'); return; }
    if (!form.groupId)            { setError('Please select a group'); return; }
    setLoading(true);
    try {
      await API.put(`/chains/${editChain.chainId}`, { ...form, groupId: Number(form.groupId) });
      setSuccess('Company updated!');
      await fetchAll();
      setTimeout(() => { setView('list'); setSuccess(''); }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update company');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this company?')) return;
    try {
      await API.delete(`/chains/${id}`);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Cannot delete this company');
    }
  };

  const openEdit = (chain) => {
    setEditChain(chain);
    setForm({ companyName: chain.companyName, gstnNo: chain.gstnNo, groupId: chain.groupId });
    setError(''); setSuccess('');
    setView('edit');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>Invoice</div>
        <div style={s.sideSection}>| Manage Chain Section</div>
        <nav>
          <div style={s.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div style={s.navItem} onClick={() => navigate('/groups')}>Manage Groups</div>
          <div style={{...s.navItem, ...s.navActive}}>Manage Chain</div>
          <div style={s.navItem}>Manage Brands</div>
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
              <div style={s.statCard}>
                <div style={s.statLabel}>Total Groups</div>
                <div style={s.statValue}>{totalGroups}</div>
              </div>
              <div style={{...s.statCard, background:'#4f46e5'}}>
                <div style={s.statLabel}>Total Chains</div>
                <div style={s.statValue}>{totalChains}</div>
              </div>
            </div>

            {/* Toolbar */}
            <div style={s.toolbar}>
              <button style={s.addBtn} onClick={() => { setForm({ companyName:'', gstnNo:'', groupId:'' }); setError(''); setView('add'); }}>
                + Add Company
              </button>

              {/* Filter by Group */}
              <div style={s.filterBox}>
                <span style={s.filterLabel}>Filter by Group</span>
                <select style={s.filterSelect} value={filterGroupId} onChange={handleFilterChange}>
                  <option value="">All Groups</option>
                  {groups.map(g => (
                    <option key={g.groupId} value={g.groupId}>{g.groupName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Sr.No</th>
                  <th style={s.th}>Group Name</th>
                  <th style={s.th}>Company</th>
                  <th style={s.th}>GSTN</th>
                  <th style={s.th}>Edit</th>
                  <th style={s.th}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {chains.length === 0 ? (
                  <tr><td colSpan={6} style={s.noData}>No companies found. Add your first company!</td></tr>
                ) : (
                  chains.map((c, i) => (
                    <tr key={c.chainId} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                      <td style={s.td}>{i + 1}</td>
                      <td style={s.td}>{c.groupName}</td>
                      <td style={s.td}>{c.companyName}</td>
                      <td style={s.td}>{c.gstnNo}</td>
                      <td style={s.td}>
                        <button style={s.editBtn} onClick={() => openEdit(c)}>Edit</button>
                      </td>
                      <td style={s.td}>
                        <button style={s.deleteBtn} onClick={() => handleDelete(c.chainId)}>Delete</button>
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
                <label style={s.label}>Enter Company Name:</label>
                <input style={s.input} placeholder="Enter Company Name"
                  value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Enter GSTN:</label>
                <input style={s.input} placeholder="Enter GST Number (15 chars)"
                  value={form.gstnNo} onChange={e => setForm({...form, gstnNo: e.target.value})} maxLength={15} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Select Group:</label>
                <select style={s.input} value={form.groupId} onChange={e => setForm({...form, groupId: e.target.value})}>
                  <option value="">-- Select Group --</option>
                  {groups.map(g => (
                    <option key={g.groupId} value={g.groupId}>{g.groupName}</option>
                  ))}
                </select>
              </div>
              <div style={s.btnRow}>
                <button style={s.addBtn} type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Company'}
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
                <label style={s.label}>Enter Company Name:</label>
                <input style={s.input} value={form.companyName}
                  onChange={e => setForm({...form, companyName: e.target.value})} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Enter GSTN:</label>
                <input style={s.input} value={form.gstnNo} maxLength={15}
                  onChange={e => setForm({...form, gstnNo: e.target.value})} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Select Group:</label>
                <select style={s.input} value={form.groupId} onChange={e => setForm({...form, groupId: e.target.value})}>
                  <option value="">-- Select Group --</option>
                  {groups.map(g => (
                    <option key={g.groupId} value={g.groupId}>{g.groupName}</option>
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
  statsRow:   { display:'flex', gap:'1rem', marginBottom:'1.5rem' },
  statCard:   { background:'#f59e0b', color:'#fff', padding:'1rem 2rem', borderRadius:'10px', minWidth:'140px' },
  statLabel:  { fontSize:'0.82rem', opacity:0.9 },
  statValue:  { fontSize:'2rem', fontWeight:'700' },
  toolbar:    { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' },
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
