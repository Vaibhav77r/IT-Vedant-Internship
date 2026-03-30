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
      const [e, inv] = await Promise.all([
        API.get("/api/estimates"),
        API.get("/api/invoices"), // ✅ FIXED
      ]);

      setEstimates(e.data || []);
      setInvoices(inv.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load data");
    }
  };

  // ================= CHECK INVOICE =================
  const isInvoiceCreated = (estimateId) => {
    return (invoices || []).some(
      (inv) => inv.estimatedId === estimateId
    );
  };

  // ================= TOTAL =================
  const total =
    form.qty && form.costPerUnit
      ? (Number(form.qty) * Number(form.costPerUnit)).toFixed(2)
      : "0.00";

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (editId) {
        await API.put(`/api/estimates/${editId}`, form);
        setSuccess("Updated successfully");
      } else {
        await API.post("/api/estimates", form);
        setSuccess("Created successfully");
      }

      setForm(emptyForm);
      setEditId(null);
      setView("list");
      fetchData();
    } catch {
      setError("Save failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (e) => {
    setEditId(e.estimatedId);
    setForm({
      chainId: e.chainId || "",
      groupName: e.groupName || "",
      brandName: e.brandName || "",
      zoneName: e.zoneName || "",
      service: e.service || "",
      qty: e.qty || "",
      costPerUnit: e.costPerUnit || "",
      deliveryDate: e.deliveryDate || "",
      deliveryDetails: e.deliveryDetails || "",
    });
    setView("form");
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this estimate?")) return;
    await API.delete(`/api/estimates/${id}`);
    fetchData();
  };

  // ================= GENERATE INVOICE =================
  const handleGenerate = (estimate) => {
    navigate("/create-invoice", {
      state: { estimate },
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={ui.container}>
      {/* SIDEBAR */}
      <aside style={ui.sidebar}>
        <h2 style={ui.logo}>IMS</h2>
        <p onClick={() => navigate("/dashboard")}>Dashboard</p>
        <p style={ui.active}>Estimates</p>
        <p onClick={() => navigate("/invoices")}>Invoices</p>
        <p onClick={handleLogout}>Logout</p>
      </aside>

      {/* MAIN */}
      <main style={ui.main}>
        {/* HEADER */}
        <div style={ui.header}>
          <h2>Manage Estimates</h2>
          <button style={ui.primaryBtn} onClick={() => setView("form")}>
            + Create
          </button>
        </div>

        {/* ================= LIST ================= */}
        {view === "list" && (
          <div style={ui.card}>
            {error && <p style={ui.error}>{error}</p>}

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
                    <td style={{ color: "green", fontWeight: "bold" }}>
                      ₹{e.totalCost}
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <button
                        style={ui.editBtn}
                        onClick={() => handleEdit(e)}
                      >
                        Edit
                      </button>

                      <button
                        style={ui.deleteBtn}
                        onClick={() => handleDelete(e.estimatedId)}
                      >
                        Delete
                      </button>
                    </td>

                    {/* INVOICE */}
                    <td>
                      {isInvoiceCreated(e.estimatedId) ? (
                        <span style={ui.done}>✔ Generated</span>
                      ) : (
                        <button
                          style={ui.invoiceBtn}
                          onClick={() => handleGenerate(e)}
                        >
                          Generate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= FORM ================= */}
        {view === "form" && (
          <div style={ui.formCard}>
            <h3>{editId ? "Edit Estimate" : "Create Estimate"}</h3>

            {error && <p style={ui.error}>{error}</p>}
            {success && <p style={ui.success}>{success}</p>}

            <div style={ui.grid}>
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

            <button style={ui.primaryBtn} onClick={handleSubmit}>
              Save
            </button>
            <button style={ui.cancelBtn} onClick={() => setView("list")}>
              Cancel
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ================= UI =================
const ui = {
  container: { display: "flex", background: "#f4f6f9", minHeight: "100vh" },

  sidebar: {
    width: 220,
    background: "#000",
    color: "#fff",
    padding: 20,
  },

  logo: { fontSize: 22, fontWeight: "bold" },
  active: { color: "#22c55e" },

  main: { flex: 1, padding: 30 },

  header: { display: "flex", justifyContent: "space-between" },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },

  table: { width: "100%", borderCollapse: "collapse" },

  formCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  input: {
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 6,
  },

  primaryBtn: {
    background: "#22c55e",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  cancelBtn: {
    marginLeft: 10,
    padding: 10,
  },

  editBtn: { marginRight: 5 },

  deleteBtn: { color: "red" },

  invoiceBtn: {
    background: "#4f46e5",
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  done: { color: "green", fontWeight: "bold" },

  total: { marginTop: 10, fontWeight: "bold" },

  error: { color: "red" },
  success: { color: "green" },
};