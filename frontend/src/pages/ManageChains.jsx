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
        groupId: Number(form.groupId)
      };

      await API.post("/api/chains", payload);

      setSuccess("Added successfully!");
      resetForm();
      fetchAll();
      setTimeout(() => setView("list"), 1000);

    } catch (err) {
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
        groupId: Number(form.groupId)
      };

      await API.put(`/api/chains/${editChain.chainId}`, payload);

      setSuccess("Updated successfully!");
      resetForm();
      fetchAll();
      setTimeout(() => setView("list"), 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;

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
      groupId: chain.groupId ? String(chain.groupId) : ""
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

      {/* HEADER */}
      <div style={ui.header}>
        <h2 style={ui.title}>Manage Chains</h2>

        <div style={ui.controls}>
          <button style={ui.addBtn} onClick={() => {
            resetForm();
            setView("add");
          }}>
            + Add Company
          </button>

          <select style={ui.select} value={filterGroupId} onChange={handleFilterChange}>
            <option value="">All Groups</option>
            {groups.map(g => (
              <option key={g.groupId} value={g.groupId}>
                {g.groupName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LIST */}
      {view === "list" && (
        <div style={ui.card}>
          {error && <p style={ui.error}>{error}</p>}

          <table style={ui.table}>
            <thead>
              <tr>
                <th style={ui.th}>#</th>
                <th style={ui.th}>Group</th>
                <th style={ui.th}>Company</th>
                <th style={ui.th}>GST</th>
                <th style={ui.th}>Edit</th>
                <th style={ui.th}>Delete</th>
              </tr>
            </thead>

            <tbody>
              {chains.length === 0 ? (
                <tr><td colSpan="6">No data</td></tr>
              ) : (
                chains.map((c, i) => (
                  <tr key={c.chainId}>
                    <td style={ui.td}>{i + 1}</td>
                    <td style={ui.td}>{c.groupName}</td>
                    <td style={ui.td}>{c.companyName}</td>
                    <td style={ui.td}>{c.gstnNo}</td>

                    <td style={ui.td}>
                      <button style={ui.btnEdit} onClick={() => openEdit(c)}>Edit</button>
                    </td>

                    <td style={ui.td}>
                      <button style={ui.btnDelete} onClick={() => handleDelete(c.chainId)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* FORM */}
      {(view === "add" || view === "edit") && (
        <div style={ui.formCard}>
          <h3 style={ui.formTitle}>
            {view === "add" ? "Add Company" : "Edit Company"}
          </h3>

          {error && <p style={ui.error}>{error}</p>}
          {success && <p style={ui.success}>{success}</p>}

          <form onSubmit={view === "add" ? handleAdd : handleEdit}>

            <input
              style={ui.input}
              placeholder="Company Name"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />

            <input
              style={ui.input}
              placeholder="GST Number"
              value={form.gstnNo}
              onChange={(e) => setForm({ ...form, gstnNo: e.target.value })}
            />

            <select
              style={ui.input}
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

            <button style={ui.saveBtn}>
              {loading ? "Saving..." : "Save"}
            </button>

            <button type="button" style={ui.cancelBtn} onClick={() => {
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

// ================= STYLES =================
const ui = {
  page: {
    padding: "30px",
    background: "#f5f7fb",
    minHeight: "100vh",
    fontFamily: "Segoe UI"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },

  title: {
    fontSize: "24px",
    fontWeight: "600"
  },

  controls: {
    display: "flex",
    gap: "10px"
  },

  addBtn: {
    padding: "10px 16px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    background: "#f0f2f5",
    padding: "12px"
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee"
  },

  btnEdit: {
    background: "#2196F3",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  btnDelete: {
    background: "#f44336",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  formCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    maxWidth: "500px",
    margin: "auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
  },

  formTitle: {
    marginBottom: "15px",
    fontSize: "20px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  saveBtn: {
    width: "100%",
    padding: "10px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    marginBottom: "10px"
  },

  cancelBtn: {
    width: "100%",
    padding: "10px",
    background: "#777",
    color: "#fff",
    border: "none",
    borderRadius: "6px"
  },

  error: {
    color: "red",
    marginBottom: "10px"
  },

  success: {
    color: "green",
    marginBottom: "10px"
  }
};