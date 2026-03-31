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
  const { user, logout } = useAuth();
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  // ================= FIXED FETCH =================
  const fetchAll = async () => {
    try {
      const [est, ch, gr, br, zo] = await Promise.all([
        API.get("/api/estimates"),
        API.get("/api/chains"),
        API.get("/api/groups"),
        API.get("/api/brands"),
        API.get("/api/zones"),
      ]);

      setEstimates(est.data || []);
      setChains(ch.data || []);
      setGroups(gr.data || []);
      setBrands(br.data || []);
      setZones(zo.data || []);
    } catch (err) {
      console.log(err);
      setError("Backend not responding (fix API / DB)");
    }
  };

  // ================= TOTAL =================
  const total =
    form.qty && form.costPerUnit
      ? (Number(form.qty) * Number(form.costPerUnit)).toFixed(2)
      : "0.00";

  // ================= VALIDATION =================
  const validate = () => {
    if (!form.chainId) return "Select Company";
    if (!form.groupName) return "Select Group";
    if (!form.brandName) return "Select Brand";
    if (!form.zoneName) return "Select Zone";
    if (!form.service) return "Enter Service";
    if (!form.qty || form.qty <= 0) return "Invalid Qty";
    if (!form.costPerUnit || form.costPerUnit <= 0) return "Invalid Cost";
    return null;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        chainId: Number(form.chainId),
        groupName: form.groupName,
        brandName: form.brandName,
        zoneName: form.zoneName,
        service: form.service,
        qty: Number(form.qty),
        costPerUnit: Number(form.costPerUnit),
        deliveryDate: form.deliveryDate,
        deliveryDetails: form.deliveryDetails,
      };

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
      setView("list");
    } catch (err) {
      console.log(err);
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (e) => {
    setEditId(e.estimatedId);
    setForm({
      chainId: e.chainId,
      groupName: e.groupName,
      brandName: e.brandName,
      zoneName: e.zoneName,
      service: e.service,
      qty: e.qty,
      costPerUnit: e.costPerUnit,
      deliveryDate: e.deliveryDate,
      deliveryDetails: e.deliveryDetails || "",
    });
    setView("form");
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await API.delete(`/api/estimates/${id}`);
    fetchAll();
  };

  // ================= FILTER =================
  const filteredBrands = form.chainId
    ? brands.filter((b) => b.chainId == form.chainId)
    : [];

  const filteredZones = form.brandName
    ? zones.filter((z) => z.brandName === form.brandName)
    : [];

  // ================= UI =================
  return (
    <div style={ui.page}>
      {/* SIDEBAR */}
      <aside style={ui.sidebar}>
        <h2>IMS</h2>
        <p onClick={() => navigate("/dashboard")}>Dashboard</p>
        <p style={ui.active}>Estimates</p>
        <p onClick={() => navigate("/invoices")}>Invoices</p>
        <p onClick={logout}>Logout</p>
      </aside>

      {/* MAIN */}
      <main style={ui.main}>
        <h2>Manage Estimates</h2>

        {error && <p style={ui.error}>{error}</p>}
        {success && <p style={ui.success}>{success}</p>}

        {/* LIST */}
        {view === "list" && (
          <>
            <button style={ui.btn} onClick={() => setView("form")}>
              + Create
            </button>

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
                {estimates.map((e, i) => (
                  <tr key={e.estimatedId}>
                    <td>{i + 1}</td>
                    <td>{e.brandName}</td>
                    <td>{e.zoneName}</td>
                    <td>₹{e.totalCost}</td>

                    <td>
                      <button onClick={() => handleEdit(e)}>Edit</button>
                      <button onClick={() => handleDelete(e.estimatedId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* FORM */}
        {view === "form" && (
          <form onSubmit={handleSubmit} style={ui.card}>
            <h3>Create Estimate</h3>

            <select
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
              <option>Select Company</option>
              {chains.map((c) => (
                <option key={c.chainId} value={c.chainId}>
                  {c.companyName}
                </option>
              ))}
            </select>

            <select
              value={form.groupName}
              onChange={(e) =>
                setForm({ ...form, groupName: e.target.value })
              }
            >
              <option>Select Group</option>
              {groups.map((g) => (
                <option key={g.groupId}>{g.groupName}</option>
              ))}
            </select>

            <select
              value={form.brandName}
              onChange={(e) =>
                setForm({
                  ...form,
                  brandName: e.target.value,
                  zoneName: "",
                })
              }
            >
              <option>Select Brand</option>
              {filteredBrands.map((b) => (
                <option key={b.brandId}>{b.brandName}</option>
              ))}
            </select>

            <select
              value={form.zoneName}
              onChange={(e) =>
                setForm({ ...form, zoneName: e.target.value })
              }
            >
              <option>Select Zone</option>
              {filteredZones.map((z) => (
                <option key={z.zoneId}>{z.zoneName}</option>
              ))}
            </select>

            <input
              placeholder="Service"
              value={form.service}
              onChange={(e) =>
                setForm({ ...form, service: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Qty"
              value={form.qty}
              onChange={(e) =>
                setForm({ ...form, qty: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Cost"
              value={form.costPerUnit}
              onChange={(e) =>
                setForm({ ...form, costPerUnit: e.target.value })
              }
            />

            <input
              type="date"
              value={form.deliveryDate}
              onChange={(e) =>
                setForm({ ...form, deliveryDate: e.target.value })
              }
            />

            <p>Total: ₹{total}</p>

            <button disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>

            <button type="button" onClick={() => setView("list")}>
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
  page: { display: "flex" },
  sidebar: { width: 200, background: "#000", color: "#fff", padding: 20 },
  main: { flex: 1, padding: 20 },
  table: { width: "100%" },
  btn: { background: "green", color: "#fff", padding: 10 },
  card: { background: "#fff", padding: 20 },
  error: { color: "red" },
  success: { color: "green" },
  active: { color: "lime" },
};