import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>IMS</div>
        <nav>
          <div style={styles.navItem} onClick={() => navigate('/dashboard')}>📊 Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate('/groups')}>👥 Manage Groups</div>
          <div style={styles.navItem} onClick={() => navigate('/chains')}>🔗 Manage Chain</div>
          <div style={styles.navItem} onClick={() => navigate('/brands')}>🏷️ Manage Brands</div>
          <div style={styles.navItem}>🗺️ Manage SubZones</div>
          <div style={styles.navItem}>📄 Manage Estimate</div>
          <div style={styles.navItem}>🧾 Manage Invoices</div>
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Welcome, {user?.fullName} 👋</h1>
          <span style={styles.badge}>{user?.role}</span>
        </div>
        <div style={styles.grid}>
          {[
            { label:'Total Groups',  value:'0', icon:'👥', color:'#ede9fe', path:'/groups' },
            { label:'Total Chains',  value:'0', icon:'🔗', color:'#dbeafe', path:'/chains' },
            { label:'Total Brands',  value:'0', icon:'🏷️', color:'#dcfce7', path:'/brands' },
            { label:'Payments',      value:'₹0', icon:'💳', color:'#fef9c3', path:'/dashboard' },
          ].map((card) => (
            <div key={card.label}
              style={{ ...styles.card, background: card.color, cursor:'pointer' }}
              onClick={() => navigate(card.path)}>
              <span style={styles.cardIcon}>{card.icon}</span>
              <div>
                <p style={styles.cardValue}>{card.value}</p>
                <p style={styles.cardLabel}>{card.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.infoBox}>
          <p>✅ Module 1 — Login & Registration</p>
          <p>✅ Module 2 — Group Management</p>
          <p>✅ Module 3 — Chain Management</p>
          <p>✅ Module 4 — Brand Management</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page:      { display:'flex', minHeight:'100vh', background:'#f0f2f5' },
  sidebar:   { width:'220px', background:'#1a1a2e', color:'#fff', padding:'1.5rem 1rem', display:'flex', flexDirection:'column' },
  logo:      { fontSize:'1.8rem', fontWeight:'700', marginBottom:'2rem', color:'#818cf8' },
  navItem:   { padding:'10px 12px', borderRadius:'8px', cursor:'pointer', marginBottom:'4px', fontSize:'0.9rem', color:'#c4c4d4' },
  logoutBtn: { marginTop:'auto', padding:'10px', background:'#dc2626', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600' },
  main:      { flex:1, padding:'2rem' },
  header:    { display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' },
  heading:   { fontSize:'1.5rem', margin:0, color:'#1a1a2e' },
  badge:     { background:'#4f46e5', color:'#fff', padding:'4px 12px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'600' },
  grid:      { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'1rem', marginBottom:'2rem' },
  card:      { padding:'1.2rem', borderRadius:'12px', display:'flex', alignItems:'center', gap:'1rem' },
  cardIcon:  { fontSize:'2rem' },
  cardValue: { fontSize:'1.5rem', fontWeight:'700', margin:0, color:'#1a1a2e' },
  cardLabel: { fontSize:'0.8rem', color:'#555', margin:0 },
  infoBox:   { background:'#fff', padding:'1.2rem', borderRadius:'12px', borderLeft:'4px solid #4f46e5', fontSize:'0.95rem', lineHeight:'2' }
};