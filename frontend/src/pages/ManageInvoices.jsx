import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ManageInvoices() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { estimatedId } = useParams();

  const [invoices, setInvoices]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [view, setView]           = useState(estimatedId ? 'create' : 'list');
  const [editInvoice, setEdit]    = useState(null);
  const [prefill, setPrefill]     = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [emailId, setEmailId]     = useState('');
  const [searchQ, setSearchQ]     = useState('');
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    fetchInvoices();
    if (estimatedId) loadPrefill(estimatedId);
  }, [estimatedId]);

  const fetchInvoices = async () => {
    try {
      const res = await API.get('/invoices');
      setInvoices(res.data);
      setTotal(res.data.length);
    } catch { setError('Failed to load invoices'); }
  };

  const loadPrefill = async (id) => {
    try {
      const res = await API.get(`/invoices/prefill/${id}`);
      setPrefill(res.data);
      setAmountPaid(res.data.amountPayable);
    } catch { setError('Failed to load estimate details'); }
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQ(q);
    try {
      const res = q.trim()
        ? await API.get(`/invoices/search?q=${q}`)
        : await API.get('/invoices');
      setInvoices(res.data);
    } catch {}
  };

  const handleGenerate = async () => {
    setError(''); setSuccess('');
    if (!emailId.trim()) { setError('Email ID is required'); return; }
    setLoading(true);
    try {
      await API.post('/invoices', {
        estimatedId: Number(estimatedId),
        amountPaid: parseFloat(amountPaid),
        dateOfPayment: new Date().toISOString(),
        emailId,
      });
      setSuccess('Invoice generated successfully!');
      await fetchInvoices();
      setTimeout(() => navigate('/invoices'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate invoice');
    } finally { setLoading(false); }
  };

  const handleUpdateEmail = async () => {
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await API.put(`/invoices/${editInvoice.id}`, { emailId });
      setSuccess('Email updated!');
      await fetchInvoices();
      setTimeout(() => { setView('list'); setEdit(null); setSuccess(''); }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await API.delete(`/invoices/${id}`);
      await fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete invoice');
    }
  };

  const openEdit = (inv) => {
    setEdit(inv);
    setEmailId(inv.emailId || '');
    setError(''); setSuccess('');
    setView('edit');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const Field = ({ label, value }) => (
    <div style={s.field}>
      <label style={s.label}>{label}:</label>
      <input style={{...s.input, background:'#f9fafb', color:'#374151'}} value={value || ''} readOnly />
    </div>
  );

  return (
    <div style={s.page}>
      <aside style={s.sidebar}>
        <div style={s.logo}>Invoice</div>
        <div style={s.sideSection}>
          {view === 'create' ? '| Create Invoice Section' :
           view === 'edit'   ? '| Update Invoice Section' :
           '| Manage Invoice Section'}
        </div>
        <nav>
          <div style={s.navItem} onClick={() => navigate('/dashboard')}>Dashboard</div>
          <div style={s.navItem} onClick={() => navigate('/groups')}>Manage Groups</div>
          <div style={s.navItem} onClick={() => navigate('/chains')}>Manage Chain</div>
          <div style={s.navItem} onClick={() => navigate('/brands')}>Manage Brands</div>
          <div style={s.navItem} onClick={() => navigate('/zones')}>Manage SubZones</div>
          <div style={s.navItem} onClick={() => navigate('/estimates')}>Manage Estimate</div>
          <div style={{...s.navItem, ...s.navActive}}>Manage Invoices</div>
        </nav>
        <div style={s.sideBottom}>
          <span style={s.hiUser}>Hi {user?.fullName} | </span>
          <span style={{...s.hiUser, color:'#dc2626', cursor:'pointer'}} onClick={handleLogout}>Logout</span>
        </div>
      </aside>

      <main style={s.main}>

        {/* LIST VIEW */}
        {view === 'list' && (<>
          <div style={s.statCard}>
            <div style={s.statLabel}>Total Invoice</div>
            <div style={s.statValue}>{total}</div>
          </div>

          <div style={s.searchRow}>
            <span style={s.searchLabel}>Search Invoice</span>
            <input style={s.searchInput} placeholder="type invoice number, chain id or company name"
              value={searchQ} onChange={handleSearch} />
          </div>

          {error && <div style={s.errorBox}>{error}</div>}

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Sr.No</th>
                  <th style={s.th}>Invoice No</th>
                  <th style={s.th}>Estimate ID</th>
                  <th style={s.th}>Chain ID</th>
                  <th style={s.th}>Company Name</th>
                  <th style={s.th}>Service Details</th>
                  <th style={s.th}>Total Qty</th>
                  <th style={s.th}>Price Per Qty</th>
                  <th style={s.th}>Total</th>
                  <th style={s.th}>Edit</th>
                  <th style={s.th}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr><td colSpan={11} style={s.noData}>No invoices found. Generate from Manage Estimate page.</td></tr>
                ) : (
                  invoices.map((inv, i) => (
                    <tr key={inv.id} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                      <td style={s.td}>{i + 1}</td>
                      <td style={s.td}>{inv.invoiceNo}</td>
                      <td style={s.td}>{inv.estimatedId}</td>
                      <td style={s.td}>{inv.chainId}</td>
                      <td style={s.td}>{inv.companyName}</td>
                      <td style={s.td}>{inv.serviceDetails}</td>
                      <td style={s.td}>{inv.qty}</td>
                      <td style={s.td}>₹{inv.costPerQty}</td>
                      <td style={s.td}>₹{inv.amountPayable}</td>
                      <td style={s.td}>
                        <button style={s.editBtn} onClick={() => openEdit(inv)}>Edit</button>
                      </td>
                      <td style={s.td}>
                        <button style={s.deleteBtn} onClick={() => handleDelete(inv.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>)}

        {/* CREATE VIEW */}
        {view === 'create' && prefill && (
          <div style={s.formCard}>
            {error   && <div style={s.errorBox}>{error}</div>}
            {success && <div style={s.successBox}>{success}</div>}
            <div style={s.formGrid3}>
              <Field label="Invoice No" value="Auto Generated" />
              <Field label="Estimate ID" value={prefill.estimatedId} />
              <Field label="Chain ID" value={prefill.chainId} />
              <Field label="Service Provided" value={prefill.serviceDetails} />
              <Field label="Quantity" value={prefill.qty} />
              <Field label="Cost per Quantity" value={prefill.costPerQty} />
              <Field label="Amount Payable in Rs" value={`₹${prefill.amountPayable}`} />
              <div style={s.field}>
                <label style={s.label}>Amount Paid in Rs:</label>
                <input style={s.input} type="number" value={amountPaid}
                  onChange={e => setAmountPaid(e.target.value)} />
              </div>
              <Field label="Balance in Rs" value={`₹${(prefill.amountPayable - parseFloat(amountPaid || 0)).toFixed(2)}`} />
              <Field label="Delivery Date" value={prefill.dateOfService} />
              <div style={s.field}>
                <label style={s.label}>Other Delivery Details:</label>
                <textarea style={{...s.input, height:'70px'}} value={prefill.deliveryDetails || ''} readOnly />
              </div>
              <div style={s.field}>
                <label style={s.label}>Enter Email ID:</label>
                <input style={s.input} type="email" placeholder="client@email.com"
                  value={emailId} onChange={e => setEmailId(e.target.value)} />
              </div>
            </div>
            <div style={s.btnRow}>
              <button style={s.genBtn} onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Invoice'}
              </button>
              <button style={s.cancelBtn} onClick={() => navigate('/estimates')}>Cancel</button>
            </div>
          </div>
        )}

        {/* EDIT VIEW */}
        {view === 'edit' && editInvoice && (
          <div style={s.formCard}>
            {error   && <div style={s.errorBox}>{error}</div>}
            {success && <div style={s.successBox}>{success}</div>}
            <div style={s.formGrid3}>
              <Field label="Invoice No" value={editInvoice.invoiceNo} />
              <Field label="Estimate ID" value={editInvoice.estimatedId} />
              <Field label="Chain ID" value={editInvoice.chainId} />
              <Field label="Service Provided" value={editInvoice.serviceDetails} />
              <Field label="Quantity" value={editInvoice.qty} />
              <Field label="Cost per Quantity" value={editInvoice.costPerQty} />
              <Field label="Amount Payable in Rs" value={`₹${editInvoice.amountPayable}`} />
              <Field label="Amount Paid in Rs" value={`₹${editInvoice.amountPaid}`} />
              <Field label="Balance in Rs" value={`₹${editInvoice.balance}`} />
              <Field label="Delivery Date" value={editInvoice.dateOfService} />
              <div style={s.field}>
                <label style={s.label}>Other Delivery Details:</label>
                <textarea style={{...s.input, height:'70px'}} value={editInvoice.deliveryDetails || ''} readOnly />
              </div>
              <div style={s.field}>
                <label style={s.label}>Enter Email ID:</label>
                <input style={s.input} type="email" value={emailId}
                  onChange={e => setEmailId(e.target.value)} />
              </div>
            </div>
            <div style={s.btnRow}>
              <button style={s.genBtn} onClick={handleUpdateEmail} disabled={loading}>
                {loading ? 'Updating...' : 'Update Invoice'}
              </button>
              <button style={s.cancelBtn} onClick={() => { setView('list'); setEdit(null); }}>Cancel</button>
            </div>
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
  statCard:   { background:'#dc2626', color:'#fff', display:'inline-block', padding:'1rem 2rem', borderRadius:'10px', marginBottom:'1.5rem' },
  statLabel:  { fontSize:'0.82rem', opacity:0.9 },
  statValue:  { fontSize:'2rem', fontWeight:'700' },
  searchRow:  { display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' },
  searchLabel:{ fontWeight:'600', fontSize:'0.9rem', color:'#374151', whiteSpace:'nowrap' },
  searchInput:{ flex:1, padding:'9px 14px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'0.9rem' },
  tableWrap:  { overflowX:'auto' },
  table:      { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', minWidth:'900px' },
  thead:      { background:'#f1f5f9' },
  th:         { padding:'12px 14px', textAlign:'left', fontWeight:'600', fontSize:'0.82rem', color:'#374151', whiteSpace:'nowrap' },
  td:         { padding:'10px 14px', fontSize:'0.88rem', color:'#374151' },
  trEven:     { background:'#fff' },
  trOdd:      { background:'#f9fafb' },
  editBtn:    { background:'#f59e0b', color:'#fff', border:'none', padding:'5px 12px', borderRadius:'5px', cursor:'pointer', fontWeight:'600', fontSize:'0.8rem' },
  deleteBtn:  { background:'#ef4444', color:'#fff', border:'none', padding:'5px 12px', borderRadius:'5px', cursor:'pointer', fontWeight:'600', fontSize:'0.8rem' },
  genBtn:     { background:'#059669', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'0.9rem' },
  cancelBtn:  { background:'#6b7280', color:'#fff', border:'none', padding:'8px 18px', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'0.9rem' },
  noData:     { textAlign:'center', padding:'2rem', color:'#888' },
  formCard:   { background:'#fff', padding:'2rem', borderRadius:'10px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', maxWidth:'900px' },
  formGrid3:  { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginBottom:'1rem' },
  field:      { marginBottom:'0.5rem' },
  label:      { display:'block', fontWeight:'600', marginBottom:'4px', fontSize:'0.85rem', color:'#374151' },
  input:      { width:'100%', padding:'8px 12px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'0.88rem', boxSizing:'border-box' },
  btnRow:     { display:'flex', gap:'10px', marginTop:'1rem' },
  errorBox:   { background:'#fee2e2', color:'#dc2626', padding:'8px 12px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.88rem' },
  successBox: { background:'#dcfce7', color:'#16a34a', padding:'8px 12px', borderRadius:'6px', marginBottom:'1rem', fontSize:'0.88rem' },
};