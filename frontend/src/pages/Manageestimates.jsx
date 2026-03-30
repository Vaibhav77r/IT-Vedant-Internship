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
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [brands, setBrands] = useState([]);
  const [zones, setZones] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [view, setView] = useState("list");
  const [editId, setEditId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [e, c, g, b, z] = await Promise.all([
        API.get("/api/estimates"),
        API.get("/api/chains"),
        API.get("/api/groups"),
        API.get("/api/brands"),
        API.get("/api/zones"),
      ]);

      setEstimates(e.data || []);
      setChains(c.data || []);
      setGroups(g.data || []);
      setBrands(b.data || []);
      setZones(z.data || []);
    } catch {
      setError("Failed to load data");
    }
  };

  // ================= FILTER =================
  const filteredBrands = form.chainId
    ? brands.filter((b) => String(b.chainId) === String(form.chainId))
    : [];

  const filteredZones = form.brandName
    ? zones.filter((z) => z.brandName === form.brandName)
    : [];

  // ================= TOTAL =================
  const total =
    form.qty && form.costPerUnit
      ? (Number(form.qty) * Number(form.costPerUnit)).toFixed(2)
      : "0.00";

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.chainId || !form.brandName || !form.zoneName) {
      return setError("Please fill all required fields");
    }

    const payload = {
      ...form,
      chainId: Number(form.chainId),
      qty: Number(form.qty),
      costPerUnit: Number(form.costPerUnit),
    };

    try {
      if (editId) {
        await API.put(`/api/estimates/${editId}`, payload);
        setSuccess("Updated successfully");
      } else {
        await API.post("/api/estimates", payload);
        setSuccess("Created successfully");
      }

      setForm(emptyForm);
      setEditId(null);
      fetchAll();

      // Prevent crash by delaying view change
      setTimeout(() => {
        setView("list");
      }, 300);
    } catch {
      setError("Save failed");
    }
  };

  // ================= EDIT (FIXED) =================
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this estimate?")) return;
    await API.delete(`/api/estimates/${id}`);
    fetchAll();
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
        <p onClick={handleLogout}>Logout</p>
      </aside>

      {/* MAIN */}
      <main style={ui.main}>
        <div style={ui.header}>
          <h2>Manage Estimates</h2>
          <button style={ui.primaryBtn} onClick={() => setView("form")}>
            + Create
          </button>
        </div>

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
                </tr>
              </thead>

              <tbody>
                {(estimates || []).map((e, i) => (
                  <tr key={e.estimatedId}>
                    <td>{i + 1}</td>
                    <td>{e.brandName || "-"}</td>
                    <td>{e.zoneName || "-"}</td>
                    <td style={{ color: "green" }}>₹{e.totalCost || 0}</td>
                    <td>
                      <button style={ui.editBtn} onClick={() => handleEdit(e)}>
                        Edit
                      </button>
                      <button
                        style={ui.deleteBtn}
                        onClick={() => handleDelete(e.estimatedId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= FORM ================= */}
        {view === "form" && (
          <form onSubmit={handleSubmit} style={ui.card}>
            <h3>Create Estimate</h3>

            {error && <p style={ui.error}>{error}</p>}
            {success && <p style={ui.success}>{success}</p>}

            <div style={ui.grid}>
              <select
                style={ui.input}
                value={form.chainId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    chainId: e.target.value,
                    brandName: "",
                    zoneName: "",
                  })
                }
              >
                <option value="">Select Company</option>
                {chains.map((c) => (
                  <option key={c.chainId} value={c.chainId}>
                    {c.companyName}
                  </option>
                ))}
              </select>

              <select
                style={ui.input}
                value={form.groupName}
                onChange={(e) =>
                  setForm({ ...form, groupName: e.target.value })
                }
              >
                <option value="">Select Group</option>
                {groups.map((g) => (
                  <option key={g.groupId} value={g.groupName}>
                    {g.groupName}
                  </option>
                ))}
              </select>

              <select
                style={ui.input}
                value={form.brandName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    brandName: e.target.value,
                    zoneName: "",
                  })
                }
              >
                <option value="">Select Brand</option>
                {filteredBrands.map((b) => (
                  <option key={b.brandId} value={b.brandName}>
                    {b.brandName}
                  </option>
                ))}
              </select>

              <select
                style={ui.input}
                value={form.zoneName}
                onChange={(e) =>
                  setForm({ ...form, zoneName: e.target.value })
                }
              >
                <option value="">Select Zone</option>
                {filteredZones.map((z) => (
                  <option key={z.zoneId} value={z.zoneName}>
                    {z.zoneName}
                  </option>
                ))}
              </select>

              <input
                style={ui.input}
                placeholder="Service"
                value={form.service}
                onChange={(e) =>
                  setForm({ ...form, service: e.target.value })
                }
              />

              <input
                style={ui.input}
                type="number"
                placeholder="Qty"
                value={form.qty}
                onChange={(e) =>
                  setForm({ ...form, qty: e.target.value })
                }
              />

              <input
                style={ui.input}
                type="number"
                placeholder="Cost"
                value={form.costPerUnit}
                onChange={(e) =>
                  setForm({ ...form, costPerUnit: e.target.value })
                }
              />

              <input
                style={ui.input}
                type="date"
                value={form.deliveryDate}
                onChange={(e) =>
                  setForm({ ...form, deliveryDate: e.target.value })
                }
              />
            </div>

            <div style={ui.total}>Total: ₹{total}</div>

            <button style={ui.primaryBtn}>Save</button>
            <button
              type="button"
              style={ui.cancelBtn}
              onClick={() => setView("list")}
            >
              Cancel
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

// ================= UI =================
const ui = {
  container: { display: "flex", background: "#f4f6f9", minHeight: "100vh" },
  sidebar: { width: 220, background: "#111", color: "#fff", padding: 20 },
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
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  input: { padding: 10, borderRadius: 6, border: "1px solid #ccc" },
  primaryBtn: {
    background: "#22c55e",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 6,
    marginTop: 10,
  },
  cancelBtn: { background: "#6b7280", color: "#fff", padding: 10, marginLeft: 10 },
  total: { marginTop: 10, color: "green", fontWeight: "bold" },
  table: { width: "100%" },
  editBtn: { marginRight: 5 },
  deleteBtn: { color: "red" },
  error: { color: "red" },
  success: { color: "green" },
};