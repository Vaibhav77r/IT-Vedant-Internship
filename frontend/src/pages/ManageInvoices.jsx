import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ManageInvoices() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const [editInvoice, setEdit] = useState(null);
  const [emailId, setEmailId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ================= FETCH =================
  const fetchInvoices = async () => {
    try {
      const res = await API.get("/api/invoices");
      setInvoices(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load invoices");
    }
  };

  // ================= SEARCH =================
  const filteredInvoices = invoices.filter((inv) =>
    `${inv.invoiceNo} ${inv.chainId} ${inv.companyName}`
      .toLowerCase()
      .includes(searchQ.toLowerCase())
  );

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;

    try {
      await API.delete(`/api/invoices/${id}`);
      fetchInvoices();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ================= EDIT =================
  const openEdit = (inv) => {
    setEdit(inv);
    setEmailId(inv.emailId || "");
    setError("");
    setSuccess("");
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/api/invoices/${editInvoice.id}`, {
        emailId,
      });

      setSuccess("Updated successfully");
      setEdit(null);
      fetchInvoices();
    } catch {
      setError("Update failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={ui.page}>
      {/* SIDEBAR */}
      <aside style={ui.sidebar}>
        <h2>IMS</h2>
        <p onClick={() => navigate("/dashboard")}>Dashboard</p>
        <p onClick={() => navigate("/estimates")}>Estimates</p>
        <p style={ui.active}>Invoices</p>
        <p onClick={handleLogout}>Logout</p>
      </aside>

      {/* MAIN */}
      <main style={ui.main}>
        <h2>Manage Invoices</h2>

        {error && <p style={ui.error}>{error}</p>}
        {success && <p style={ui.success}>{success}</p>}

        {/* SEARCH */}
        <input
          placeholder="Search by invoice no / chain / company"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          style={ui.search}
        />

        {/* TABLE */}
        <table style={ui.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice No</th>
              <th>Company</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.map((inv, i) => (
              <tr key={inv.id}>
                <td>{i + 1}</td>
                <td>{inv.invoiceNo}</td>
                <td>{inv.companyName}</td>
                <td>₹{inv.amountPayable}</td>
                <td>₹{inv.amountPaid}</td>
                <td>₹{inv.balance}</td>

                <td>
                  <button onClick={() => openEdit(inv)}>Edit</button>
                  <button onClick={() => handleDelete(inv.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EDIT MODAL */}
        {editInvoice && (
          <div style={ui.modal}>
            <div style={ui.card}>
              <h3>Edit Invoice Email</h3>

              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                style={ui.input}
              />

              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setEdit(null)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ================= UI =================
const ui = {
  page: { display: "flex", minHeight: "100vh", background: "#f4f6f9" },
  sidebar: { width: 220, background: "#111", color: "#fff", padding: 20 },
  main: { flex: 1, padding: 30 },
  table: { width: "100%", background: "#fff", borderRadius: 10 },
  search: { padding: 10, marginBottom: 10, width: "100%" },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
  },
  card: { background: "#fff", padding: 20, margin: "100px auto", width: 300 },
  input: { width: "100%", padding: 10, marginBottom: 10 },
  error: { color: "red" },
  success: { color: "green" },
  active: { color: "#22c55e" },
};