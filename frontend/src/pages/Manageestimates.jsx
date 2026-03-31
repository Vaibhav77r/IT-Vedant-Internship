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
  const [chains, setChains]       = useState([]);
  const [groups, setGroups]       = useState([]);
  const [brands, setBrands]       = useState([]);
  const [zones, setZones]         = useState([]);
  const [total, setTotal]         = useState(0);
  const [view, setView]           = useState('list');
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [estRes, chainRes, groupRes, brandRes, zoneRes] = await Promise.all([
        API.get('/estimates'),
        API.get('/chains'),
        API.get('/groups'),
        API.get('/brands'),
        API.get('/zones'),
      ]);
      setEstimates(estRes.data);
      setTotal(estRes.data.length);
      setChains(chainRes.data);
      setGroups(groupRes.data);
      setBrands(brandRes.data);
      setZones(zoneRes.data);
    } catch { setError('Failed to load data'); }
  };

  // Auto calculate total cost
  const totalCost = form.qty && form.costPerUnit
    ? (parseFloat(form.qty) * parseFloat(form.costPerUnit)).toFixed(2)
    : '0.00';

  const validate = () => {
    if (!form.chainId)         return 'Please select a company';
    if (!form.groupName)       return 'Please select a group';
    if (!form.brandName)       return 'Please select a brand';
    if (!form.zoneName)        return 'Please select a zone';
    if (!form.service.trim())  return 'Service details are required';
    if (!form.qty || form.qty <= 0) return 'Valid quantity is required';
    if (!form.costPerUnit || form.costPerUnit <= 0) return 'Valid cost per unit is required';
    if (!form.deliveryDate)    return 'Delivery date is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const payload = {
        chainId: Number(form.chainId),
        groupName: form.groupName,
        brandName: form.brandName,
        zoneName: form.zoneName,
        service: form.service,
        qty: parseInt(form.qty),
        costPerUnit: parseFloat(form.costPerUnit),
        deliveryDate: form.deliveryDate,
        deliveryDetails: form.deliveryDetails,
      };
      if (editId) {
        await API.put(`/estimates/${editId}`, payload);
        setSuccess('Estimate updated successfully!');
      } else {
        await API.post('/estimates', payload);
        setSuccess('Estimate created successfully!');
      }
      setForm(emptyForm);
      setEditId(null);
      await fetchAll();
      setTimeout(() => { setView('list'); setSuccess(''); }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save estimate');
    } finally { setLoading(false); }
  };

  const handleEdit = (est) => {
    setEditId(est.estimatedId);
    setForm({
      chainId: est.chainId,
      groupName: est.groupName,
      brandName: est.brandName,
      zoneName: est.zoneName,
      service: est.service,
      qty: est.qty,
      costPerUnit: est.costPerUnit,
      deliveryDate: est.deliveryDate,
      deliveryDetails: est.deliveryDetails || '',
    });
    setError(''); setSuccess('');
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this estimate?')) return;
    try {
      await API.delete(`/estimates/${id}`);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete estimate');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  // Filter brands by selected chain
  const filteredBrands = form.chainId
    ? brands.filter(b => b.chainId == form.chainId)
    : brands;

  // Filter zones by selected brand
  const filteredZones = form.brandName
    ? zones.filter(z => z.brandName === form.brandName)
    : zones;

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>Invoice</div>
        <div style={s.sideSection}>| Manage Estimate Section</div>
        <nav>
          <div style={s.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div style={s.navItem} onClick={() => navigate('/groups')}>Manage Groups</div>
          <div style={s.navItem} onClick={() => navigate('/chains')}>Manage Chain</div>
          <div style={s.navItem} onClick={() => navigate('/brands')}>Manage Brands</div>
          <div style={s.navItem} onClick={() => navigate('/zones')}>Manage SubZones</div>
          <div style={{...s.navItem, ...s.navActive}}>Manage Estimate</div>
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
          <div style={s.statCard}>
            <div style={s.statLabel}>Total Estimate</div>
            <div style={s.statValue}>{total}</div>
          </div>

          <button style={s.createBtn} onClick={() => { setForm(emptyForm); setEditId(null); setError(''); setView('form'); }}>
            + Create Estimate
          </button>

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Sr.No</th>
                  <th style={s.th}>Group</th>
                  <th style={s.th}>Chain ID</th>
                  <th style={s.th}>Brand</th>
                  <th style={s.th}>Zone</th>
                  <th style={s.th}>Service Details</th>
                  <th style={s.th}>Total Units</th>
                  <th style={s.th}>Price Per Unit</th>
                  <th style={s.th}>Total</th>
                  <th style={s.th}>Edit</th>
                  <th style={s.th}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {estimates.length === 0 ? (
                  <tr><td colSpan={11} style={s.noData}>No estimates found. Create your first estimate!</td></tr>
                ) : (
                  estimates.map((e, i) => (
                    <tr key={e.estimatedId} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                      <td style={s.td}>{i + 1}</td>
                      <td style={s.td}>{e.groupName}</td>
                      <td style={s.td}>{e.chainId}</td>
                      <td style={s.td}>{e.brandName}</td>
                      <td style={s.td}>{e.zoneName}</td>
                      <td style={s.td}>{e.service}</td>
                      <td style={s.td}>{e.qty}</td>
                      <td style={s.td}>₹{e.costPerUnit}</td>
                      <td style={s.td}>₹{e.totalCost}</td>
                      <td style={s.td}>
                        <button style={s.editBtn} onClick={() => handleEdit(e)}>Edit</button>
                      </td>
                      <td style={s.td}>
                        <button style={s.deleteBtn} onClick={() => handleDelete(e.estimatedId)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>)}

        {/* FORM VIEW (Create + Edit) */}
        {view === 'form' && (
          <div style={s.formCard}>
            <h3 style={s.formTitle}>{editId ? 'Update Estimate' : 'Create Estimate'}</h3>
            {error   && <div style={s.errorBox}>{error}</div>}
            {success && <div style={s.successBox}>{success}</div>}

            <form onSubmit={handleSubmit}>
              <div style={s.formGrid}>
                {/* Left column */}
                <div>
                  <div style={s.field}>
                    <label style={s.label}>Select Group:</label>
                    <select style={s.input} value={form.groupName}
                      onChange={e => setForm({...form, groupName: e.target.value})}>
                      <option value="">-- Select Group --</option>
                      {groups.map(g => (
                        <option key={g.groupId} value={g.groupName}>{g.groupName}</option>
                      ))}
                    </select>
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>Select Chain ID or Company Name:</label>
                    <select style={s.input} value={form.chainId}
                      onChange={e => setForm({...form, chainId: e.target.value, brandName:'', zoneName:''})}>
                      <option value="">-- Select Company --</option>
                      {chains.map(c => (
                        <option key={c.chainId} value={c.chainId}>{c.companyName}</option>
                      ))}
                    </select>
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>Select Brand:</label>
                    <select style={s.input} value={form.brandName}
                      onChange={e => setForm({...form, brandName: e.target.value, zoneName:''})}>
                      <option value="">-- Select Brand --</option>
                      {filteredBrands.map(b => (
                        <option key={b.brandId} value={b.brandName}>{b.brandName}</option>
                      ))}
                    </select>
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>Select Zone:</label>
                    <select style={s.input} value={form.zoneName}
                      onChange={e => setForm({...form, zoneName: e.target.value})}>
                      <option value="">-- Select Zone --</option>
                      {filteredZones.map(z => (
                        <option key={z.zoneId} value={z.zoneName}>{z.zoneName}</option>
                      ))}
                    </select>
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>Service Provided:</label>
                    <input style={s.input} placeholder="Enter Service"
                      value={form.service} onChange={e => setForm({...form, service: e.target.value})} />
                  </div>
                </div>

                {/* Right column */}
                <div>
                  <div style={s.field}>
                    <label style={s.label}>Total Quantity (Units):</label>
                    <input style={s.input} type="number" min="1" placeholder="Enter Total Qty"
                      value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} />
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>Cost Per Quantity:</label>
                    <input style={s.input} type="number" min="0" placeholder="Enter Cost Per Qty"
                      value={form.costPerUnit} onChange={e => setForm({...form, costPerUnit: e.target.value})} />
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>Estimated Amount in Rs:</label>
                    <input style={{...s.input, background:'#f9fafb', color:'#059669', fontWeight:'700'}}
                      value={`₹ ${totalCost}`} readOnly />
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>Expected Delivery Date:</label>
                    <input style={s.input} type="date"
                      value={form.deliveryDate} onChange={e => setForm({...form, deliveryDate: e.target.value})} />
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>Other Delivery Details:</label>
                    <textarea style={{...s.input, height:'80px', resize:'vertical'}}
                      placeholder="Enter delivery details..."
                      value={form.deliveryDetails} onChange={e => setForm({...form, deliveryDetails: e.target.value})} />
                  </div>
                </div>
              </div>

              <div style={s.btnRow}>
                <button style={s.createBtn} type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editId ? 'Update and Save Estimate' : 'Create and Save Estimate'}
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
  main:       { flex:1, padding:'2rem', overflowX:'auto' },
  statCard:   { background:'#4f46e5', color:'#fff', display:'inline-block', padding:'1rem 2rem', borderRadius:'10px', marginBottom:'1.5rem' },
  statLabel:  { fontSize:'0.82rem', opacity:0.9 },
  statValue:  { fontSize:'2rem', fontWeight:'700' },
  createBtn:  { background:'#4f46e5', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'0.9rem', marginBottom:'1rem', display:'inline-block' },
  cancelBtn:  { background:'#6b7280', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'0.9rem' },
  tableWrap:  { overflowX:'auto' },
  table:      { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', minWidth:'900px' },
  thead:      { background:'#f1f5f9' },
  th:         { padding:'12px 14px', textAlign:'left', fontWeight:'600', fontSize:'0.82rem', color:'#374151', whiteSpace:'nowrap' },
  td:         { padding:'10px 14px', fontSize:'0.88rem', color:'#374151' },
  trEven:     { background:'#fff' },
  trOdd:      { background:'#f9fafb' },
  editBtn:    { background:'#f59e0b', color:'#fff', border:'none', padding:'5px 14px', borderRadius:'5px', cursor:'pointer', fontWeight:'600', fontSize:'0.82rem' },
  deleteBtn:  { background:'#ef4444', color:'#fff', border:'none', padding:'5px 14px', borderRadius:'5px', cursor:'pointer', fontWeight:'600', fontSize:'0.82rem' },
  noData:     { textAlign:'center', padding:'2rem', color:'#888' },
  formCard:   { background:'#fff', padding:'2rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  formTitle:  { margin:'0 0 1.5rem', fontSize:'1.1rem', fontWeight:'700', color:'#1a1a2e' },
  formGrid:   { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' },
  field:      { marginBottom:'1rem' },
  label:      { display:'block', fontWeight:'600', marginBottom:'4px', fontSize:'0.88rem', color:'#374151' },
  input:      { width:'100%', padding:'9px 12px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'0.9rem', boxSizing:'border-box' },
  btnRow:     { display:'flex', gap:'10px', marginTop:'1rem' },
  errorBox:   { background:'#fee2e2', color:'#dc2626', padding:'8px 12px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.88rem' },
  successBox: { background:'#dcfce7', color:'#16a34a', padding:'8px 12px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.88rem' },
};