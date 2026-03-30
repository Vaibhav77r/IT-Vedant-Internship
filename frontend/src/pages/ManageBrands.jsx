import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ManageBrands() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);

  const [view, setView] = useState("list");
  const [editBrand, setEditBrand] = useState(null);

  const [form, setForm] = useState({ brandName: "", chainId: "" });

  const [filterChainId, setFilterChain] = useState("");
  const [filterGroupId, setFilterGroup] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [b, c, g] = await Promise.all([
        API.get("/api/brands"),
        API.get("/api/chains"),
        API.get("/api/groups"),
      ]);
      setBrands(b.data);
      setChains(c.data);
      setGroups(g.data);
    } catch {
      setError("Failed to load data");
    }
  };

  // ================= FILTER =================
  const handleFilterChain = async (e) => {
    const val = e.target.value;
    setFilterChain(val);
    setFilterGroup("");

    const res = val
      ? await API.get(`/api/brands/chain/${val}`)
      : await API.get("/api/brands");

    setBrands(res.data);
  };

  const handleFilterGroup = async (e) => {
    const val = e.target.value;
    setFilterGroup(val);
    setFilterChain("");

    const res = val
      ? await API.get(`/api/brands/group/${val}`)
      : await API.get("/api/brands");

    setBrands(res.data);
  };

  // ================= ADD =================
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.brandName.trim()) return setError("Brand name required");
    if (!form.chainId) return setError("Select company");

    setLoading(true);
    try {
      await API.post("/api/brands", {
        brandName: form.brandName,
        chainId: Number(form.chainId),
      });

      setSuccess("Brand added");
      setForm({ brandName: "", chainId: "" });
      fetchAll();
      setTimeout(() => setView("list"), 800);
    } catch {
      setError("Add failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put(`/api/brands/${editBrand.brandId}`, {
        brandName: form.brandName,
        chainId: Number(form.chainId),
      });

      setSuccess("Updated successfully");
      fetchAll();
      setTimeout(() => setView("list"), 800);
    } catch {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (b) => {
    setEditBrand(b);
    setForm({
      brandName: b.brandName,
      chainId: String(b.chainId),
    });
    setView("edit");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete brand?")) return;
    await API.delete(`/api/brands/${id}`);
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
        <p style={ui.active}>Brands</p>
        <p onClick={handleLogout}>Logout</p>
      </aside>

      {/* MAIN */}
      <main style={ui.main}>
        <h2 style={ui.title}>Manage Brands</h2>

        {error && <p style={ui.error}>{error}</p>}
        {success && <p style={ui.success}>{success}</p>}

        {/* LIST */}
        {view === "list" && (
          <>
            <div style={ui.topBar}>
              <button style={ui.addBtn} onClick={() => setView("add")}>
                + Add Brand
              </button>

              <select style={ui.select} value={filterChainId} onChange={handleFilterChain}>
                <option value="">All Companies</option>
                {chains.map(c => (
                  <option key={c.chainId} value={c.chainId}>
                    {c.companyName}
                  </option>
                ))}
              </select>

              <select style={ui.select} value={filterGroupId} onChange={handleFilterGroup}>
                <option value="">All Groups</option>
                {groups.map(g => (
                  <option key={g.groupId} value={g.groupId}>
                    {g.groupName}
                  </option>
                ))}
              </select>
            </div>

            <div style={ui.card}>
              <table style={ui.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Group</th>
                    <th>Company</th>
                    <th>Brand</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {brands.length === 0 ? (
                    <tr><td colSpan="5">No data</td></tr>
                  ) : (
                    brands.map((b, i) => (
                      <tr key={b.brandId}>
                        <td>{i + 1}</td>
                        <td>{b.groupName || "-"}</td>
                        <td>{b.companyName || "-"}</td>
                        <td>{b.brandName}</td>
                        <td>
                          <button style={ui.editBtn} onClick={() => openEdit(b)}>Edit</button>
                          <button style={ui.deleteBtn} onClick={() => handleDelete(b.brandId)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* FORM */}
        {(view === "add" || view === "edit") && (
          <div style={ui.formCard}>
            <h3>{view === "add" ? "Add Brand" : "Edit Brand"}</h3>

            <form onSubmit={view === "add" ? handleAdd : handleEdit}>
              <input
                style={ui.input}
                placeholder="Brand Name"
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              />

              <select
                style={ui.input}
                value={form.chainId}
                onChange={(e) => setForm({ ...form, chainId: e.target.value })}
              >
                <option value="">Select Company</option>
                {chains.map(c => (
                  <option key={c.chainId} value={c.chainId}>
                    {c.companyName}
                  </option>
                ))}
              </select>

              <button style={ui.saveBtn}>
                {loading ? "Saving..." : "Save"}
              </button>

              <button type="button" style={ui.cancelBtn} onClick={() => setView("list")}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

// ================= UI =================
const ui = {
  container: { display: "flex", height: "100vh", fontFamily: "Segoe UI" },

  sidebar: {
    width: "220px",
    background: "#111827",
    color: "#fff",
    padding: "20px"
  },

  logo: { marginBottom: "20px" },
  active: { fontWeight: "bold", color: "#4CAF50" },

  main: { flex: 1, padding: "25px", background: "#f5f7fb" },

  title: { marginBottom: "20px" },

  topBar: { display: "flex", gap: "10px", marginBottom: "15px" },

  addBtn: {
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px"
  },

  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },

  table: { width: "100%", borderCollapse: "collapse" },

  editBtn: {
    background: "#2196F3",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px"
  },

  deleteBtn: {
    background: "#f44336",
    color: "#fff",
    border: "none",
    padding: "5px 10px"
  },

  formCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "400px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  },

  saveBtn: {
    width: "100%",
    background: "#4CAF50",
    color: "#fff",
    padding: "10px",
    marginBottom: "8px",
    border: "none"
  },

  cancelBtn: {
    width: "100%",
    background: "#777",
    color: "#fff",
    padding: "10px",
    border: "none"
  },

  error: { color: "red" },
  success: { color: "green" }
};