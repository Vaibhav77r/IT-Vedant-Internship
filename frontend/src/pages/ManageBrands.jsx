import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ManageBrands() {
  const { user, logout } = useAuth();
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
        API.get("/brands"),
        API.get("/chains"),
        API.get("/groups"),
      ]);
      setBrands(b.data);
      setChains(c.data);
      setGroups(g.data);
    } catch {
      setError("Failed to load data");
    }
  };

  // ✅ FIXED FILTER
  const handleFilterChain = async (e) => {
    const val = e.target.value;
    setFilterChain(val);
    setFilterGroup("");
    try {
      const res = val
        ? await API.get(`/brands/chain/${val}`)
        : await API.get("/brands");
      setBrands(res.data);
    } catch {
      setError("Filter failed");
    }
  };

  const handleFilterGroup = async (e) => {
    const val = e.target.value;
    setFilterGroup(val);
    setFilterChain("");
    try {
      const res = val
        ? await API.get(`/brands/group/${val}`)
        : await API.get("/brands");
      setBrands(res.data);
    } catch {
      setError("Filter failed");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!form.brandName.trim()) return setError("Brand name required");
    if (!form.chainId) return setError("Select company");

    setLoading(true);
    try {
      await API.post("/brands", {
        brandName: form.brandName,
        chainId: Number(form.chainId),
      });
      setSuccess("Brand added");
      setForm({ brandName: "", chainId: "" });
      fetchAll();
      setTimeout(() => setView("list"), 1000);
    } catch {
      setError("Add failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/brands/${editBrand.brandId}`, {
        brandName: form.brandName,
        chainId: Number(form.chainId),
      });
      setSuccess("Updated");
      fetchAll();
      setTimeout(() => setView("list"), 1000);
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
    await API.delete(`/brands/${id}`);
    fetchAll();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2>IMS Panel</h2>
        <div onClick={() => navigate("/dashboard")}>Dashboard</div>
        <div style={styles.active}>Brands</div>
        <div onClick={handleLogout}>Logout</div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <h2>Manage Brands</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        {/* LIST */}
        {view === "list" && (
          <>
            <div style={styles.topBar}>
              <button style={styles.btn} onClick={() => setView("add")}>
                + Add Brand
              </button>

              <select value={filterChainId} onChange={handleFilterChain}>
                <option value="">All Companies</option>
                {chains.map((c) => (
                  <option key={c.chainId} value={c.chainId}>
                    {c.companyName}
                  </option>
                ))}
              </select>

              <select value={filterGroupId} onChange={handleFilterGroup}>
                <option value="">All Groups</option>
                {groups.map((g) => (
                  <option key={g.groupId} value={g.groupId}>
                    {g.groupName}
                  </option>
                ))}
              </select>
            </div>

            <table style={styles.table}>
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
                        <button onClick={() => openEdit(b)}>Edit</button>
                        <button onClick={() => handleDelete(b.brandId)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {/* FORM */}
        {(view === "add" || view === "edit") && (
          <form onSubmit={view === "add" ? handleAdd : handleEdit} style={styles.form}>
            <input
              placeholder="Brand Name"
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
            />

            <select
              value={form.chainId}
              onChange={(e) => setForm({ ...form, chainId: e.target.value })}
            >
              <option value="">Select Company</option>
              {chains.map((c) => (
                <option key={c.chainId} value={c.chainId}>
                  {c.companyName}
                </option>
              ))}
            </select>

            <button type="submit">
              {loading ? "Saving..." : view === "add" ? "Add" : "Update"}
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

const styles = {
  container: { display: "flex", height: "100vh" },
  sidebar: { width: "200px", background: "#111", color: "#fff", padding: "20px" },
  active: { fontWeight: "bold", margin: "10px 0" },
  main: { flex: 1, padding: "20px" },
  topBar: { display: "flex", gap: "10px", marginBottom: "20px" },
  btn: { padding: "8px 12px", background: "#4f46e5", color: "#fff", border: "none" },
  table: { width: "100%", borderCollapse: "collapse" },
  form: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" },
  error: { color: "red" },
  success: { color: "green" },
};