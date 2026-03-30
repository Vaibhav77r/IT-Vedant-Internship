import { useState, useEffect } from "react";
import API from "../api/axios";

export default function ManageChains() {

  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filterGroupId, setFilter] = useState("");
  const [view, setView] = useState("list");
  const [editChain, setEditChain] = useState(null);

  const [form, setForm] = useState({
    companyName: "",
    gstnNo: "",
    groupId: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  // ================= FETCH =================
  const fetchAll = async () => {
    try {
      setError("");
      const [chainsRes, groupsRes] = await Promise.all([
        API.get("/api/chains"),
        API.get("/api/groups"),
      ]);

      setChains(chainsRes.data || []);
      setGroups(groupsRes.data || []);

    } catch {
      setError("Failed to load data");
    }
  };

  const fetchFiltered = async (groupId) => {
    try {
      const res = groupId
        ? await API.get(`/api/chains/filter?groupId=${groupId}`)
        : await API.get("/api/chains");

      setChains(res.data || []);
    } catch {
      setError("Filter failed");
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    fetchFiltered(value);
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    if (!form.companyName.trim()) return "Company required";
    if (!form.gstnNo.trim()) return "GST required";
    if (form.gstnNo.trim().length !== 15) return "GST must be 15 chars";
    if (!form.groupId) return "Select group";
    return null;
  };

  // ================= ADD =================
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);

    try {
      const payload = {
        companyName: form.companyName.trim(),
        gstnNo: form.gstnNo.trim(),
        groupId: Number(form.groupId) // 🔥 FIX
      };

      console.log("Sending:", payload); // DEBUG

      await API.post("/api/chains", payload);

      setSuccess("Added successfully!");
      resetForm();
      fetchAll();

      setTimeout(() => setView("list"), 1000);

    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Add failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);

    try {
      const payload = {
        companyName: form.companyName.trim(),
        gstnNo: form.gstnNo.trim(),
        groupId: Number(form.groupId) // 🔥 FIX
      };

      console.log("Updating:", payload);

      await API.put(`/api/chains/${editChain.chainId}`, payload);

      setSuccess("Updated successfully!");
      resetForm();
      fetchAll();

      setTimeout(() => setView("list"), 1000);

    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;

    try {
      await API.delete(`/api/chains/${id}`);
      fetchAll();
    } catch {
      alert("Delete failed");
    }
  };

  // ================= EDIT OPEN =================
  const openEdit = (chain) => {
    setEditChain(chain);
    setForm({
      companyName: chain.companyName || "",
      gstnNo: chain.gstnNo || "",
      groupId: chain.groupId ? String(chain.groupId) : "" // 🔥 FIX
    });
    setView("edit");
  };

  // ================= RESET =================
  const resetForm = () => {
    setForm({ companyName: "", gstnNo: "", groupId: "" });
  };

  // ================= UI =================
  return (
    <div style={ui.page}>

      <div style={ui.header}>
        <h2>Manage Chains</h2>

        <div>
          <button style={ui.addBtn} onClick={() => {
            resetForm();
            setView("add");
          }}>
            + Add Company
          </button>

          <select value={filterGroupId} onChange={handleFilterChange}>
            <option value="">All Groups</option>
            {groups.map(g => (
              <option key={g.groupId} value={g.groupId}>
                {g.groupName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {view === "list" && (
        <div style={ui.card}>
          {error && <p style={ui.error}>{error}</p>}

          <table style={ui.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Group</th>
                <th>Company</th>
                <th>GST</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {chains.length === 0 ? (
                <tr><td colSpan="6">No data</td></tr>
              ) : (
                chains.map((c, i) => (
                  <tr key={c.chainId}>
                    <td>{i + 1}</td>
                    <td>{c.groupName}</td>
                    <td>{c.companyName}</td>
                    <td>{c.gstnNo}</td>
                    <td><button onClick={() => openEdit(c)}>Edit</button></td>
                    <td><button onClick={() => handleDelete(c.chainId)}>Delete</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {(view === "add" || view === "edit") && (
        <div style={ui.formCard}>
          <h3>{view === "add" ? "Add Company" : "Edit Company"}</h3>

          {error && <p style={ui.error}>{error}</p>}
          {success && <p style={ui.success}>{success}</p>}

          <form onSubmit={view === "add" ? handleAdd : handleEdit}>

            <input
              placeholder="Company"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />

            <input
              placeholder="GST"
              value={form.gstnNo}
              onChange={(e) => setForm({ ...form, gstnNo: e.target.value })}
            />

            <select
              value={form.groupId || ""}
              onChange={(e) =>
                setForm({ ...form, groupId: e.target.value })
              }
            >
              <option value="">Select Group</option>
              {groups.map(g => (
                <option key={g.groupId} value={g.groupId}>
                  {g.groupName}
                </option>
              ))}
            </select>

            <button>{loading ? "Saving..." : "Save"}</button>

            <button type="button" onClick={() => {
              resetForm();
              setView("list");
            }}>
              Cancel
            </button>

          </form>
        </div>
      )}
    </div>
  );
}

const ui = {
  page: { padding: 20 },
  header: { display: "flex", justifyContent: "space-between" },
  card: { marginTop: 20, padding: 20, background: "#fff" },
  table: { width: "100%" },
  formCard: { marginTop: 20, padding: 20, background: "#fff" },
  addBtn: { padding: 10, marginRight: 10 },
  error: { color: "red" },
  success: { color: "green" }
};