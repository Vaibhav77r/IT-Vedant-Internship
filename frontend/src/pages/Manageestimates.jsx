import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  chainId: "",
  groupName: "",
  brandName: "",
  zoneName: "",
  service: "",
  qty: "",
  costPerUnit: "",
  deliveryDate: "",
  deliveryDetails: "",
};

export default function ManageEstimates() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [estimates, setEstimates] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [chains, setChains] = useState([]); // 🔥 NEW

  const [form, setForm] = useState(emptyForm);
  const [view, setView] = useState("list");
  const [editId, setEditId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await API.get("/api/estimates");
      setEstimates(res.data || []);
    } catch {
      setError("Failed to load estimates");
    }

    try {
      const res = await API.get("/api/invoices");
      setInvoices(res.data || []);
    } catch {
      setInvoices([]);
    }

    // 🔥 FETCH CHAINS (IMPORTANT)
    try {
      const res = await API.get("/api/chains");
      setChains(res.data || []);
    } catch (err) {
      console.log("Chains error", err);
    }
  };

  // ================= CHECK =================
  const isInvoiceCreated = (id) =>
    invoices.some((i) => i.estimatedId === id);

  // ================= TOTAL =================
  const total =
    form.qty && form.costPerUnit
      ? (Number(form.qty) * Number(form.costPerUnit)).toFixed(2)
      : "0.00";

  // ================= HANDLE =================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.chainId) {
      setError("Please select company");
      return;
    }

    try {
      if (editId) {
        await API.put(`/api/estimates/${editId}`, form);
      } else {
        await API.post("/api/estimates", form);
      }

      setSuccess("Saved successfully");
      setForm(emptyForm);
      setView("list");
      fetchData();
    } catch (err) {
      console.log(err);
      setError("Save failed");
    }
  };

  // ================= GENERATE =================
  const handleGenerate = (estimate) => {
    navigate("/create-invoice", { state: { estimate } });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={ui.container}>
      {/* SIDEBAR */}
      <aside style={ui.sidebar}>
        <h2>IMS</h2>
        <p onClick={() => navigate("/dashboard")}>Dashboard</p>
        <p style={ui.active}>Estimates</p>
        <p onClick={() => navigate("/invoices")}>Invoices</p>
        <p onClick={handleLogout}>Logout</p>
      </aside>

      <main style={ui.main}>
        <div style={ui.header}>
          <h2>Manage Estimates</h2>
          <button style={ui.primaryBtn} onClick={() => setView("form")}>
            + Create
          </button>
        </div>

        {/* ================= FORM ================= */}
        {view === "form" && (
          <div style={ui.card}>
            <h3>Create Estimate</h3>

            {error && <p style={ui.error}>{error}</p>}
            {success && <p style={ui.success}>{success}</p>}

            <div style={ui.grid}>
              {/* 🔥 COMPANY DROPDOWN */}
              <select
                name="chainId"
                value={form.chainId}
                onChange={handleChange}
                style={ui.input}
              >
                <option value="">Select Company</option>
                {chains.map((c) => (
                  <option key={c.chainId} value={c.chainId}>
                    {c.companyName}
                  </option>
                ))}
              </select>

              <input name="groupName" placeholder="Group" value={form.groupName} onChange={handleChange} style={ui.input} />
              <input name="brandName" placeholder="Brand" value={form.brandName} onChange={handleChange} style={ui.input} />
              <input name="zoneName" placeholder="Zone" value={form.zoneName} onChange={handleChange} style={ui.input} />
              <input name="service" placeholder="Service" value={form.service} onChange={handleChange} style={ui.input} />
              <input name="qty" placeholder="Qty" value={form.qty} onChange={handleChange} style={ui.input} />
              <input name="costPerUnit" placeholder="Cost" value={form.costPerUnit} onChange={handleChange} style={ui.input} />
              <input type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange} style={ui.input} />
              <input name="deliveryDetails" placeholder="Delivery" value={form.deliveryDetails} onChange={handleChange} style={ui.input} />
            </div>

            <p style={ui.total}>Total: ₹{total}</p>

            <button
              style={ui.primaryBtn}
              onClick={handleSubmit}
              disabled={!form.chainId}
            >
              Save
            </button>

            <button style={ui.cancelBtn} onClick={() => setView("list")}>
              Cancel
            </button>
          </div>
        )}

        {/* ================= LIST ================= */}
        {view === "list" && (
          <div style={ui.card}>
            <table style={ui.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Brand</th>
                  <th>Zone</th>
                  <th>Total</th>
                  <th>Actions</th>
                  <th>Invoice</th>
                </tr>
              </thead>

              <tbody>
                {estimates.map((e, i) => (
                  <tr key={e.estimatedId}>
                    <td>{i + 1}</td>
                    <td>{e.brandName}</td>
                    <td>{e.zoneName}</td>
                    <td style={ui.amount}>₹{e.totalCost}</td>

                    <td>
                      <button onClick={() => handleGenerate(e)}>
                        Generate
                      </button>
                    </td>

                    <td>
                      {isInvoiceCreated(e.estimatedId) ? "✔ Done" : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// ================= UI =================
const ui = {
  container: { display: "flex", background: "#f4f6f9", minHeight: "100vh" },
  sidebar: { width: 220, background: "#000", color: "#fff", padding: 20 },
  main: { flex: 1, padding: 30 },
  header: { display: "flex", justifyContent: "space-between" },
  card: { background: "#fff", padding: 20, borderRadius: 10 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  input: { padding: 10, border: "1px solid #ddd", borderRadius: 6 },
  primaryBtn: { background: "#22c55e", color: "#fff", padding: 10 },
  cancelBtn: { marginLeft: 10 },
  amount: { color: "green", fontWeight: "bold" },
  total: { marginTop: 10, fontWeight: "bold" },
  error: { color: "red" },
  success: { color: "green" },
  active: { color: "#22c55e" },
};