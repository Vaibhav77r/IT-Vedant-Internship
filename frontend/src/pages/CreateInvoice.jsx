import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";

export default function CreateInvoice() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const estimate = state?.estimate;

  const [form, setForm] = useState({
    amountPaid: "",
    emailId: "",
  });

  if (!estimate) {
    return <h3>No estimate data found</h3>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/api/invoices", {
        estimateId: estimate.estimatedId,
        amountPaid: Number(form.amountPaid),
        emailId: form.emailId,
      });

      alert("Invoice Created Successfully!");
      navigate("/invoices");
    } catch (err) {
      console.log(err);
      alert("Error creating invoice");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Create Invoice</h2>

      <div style={{ background: "#fff", padding: 20 }}>
        <p><b>Company:</b> {estimate.companyName}</p>
        <p><b>Service:</b> {estimate.service}</p>
        <p><b>Total:</b> ₹{estimate.totalCost}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Amount Paid"
            required
            value={form.amountPaid}
            onChange={(e) =>
              setForm({ ...form, amountPaid: e.target.value })
            }
          />

          <br /><br />

          <input
            type="email"
            placeholder="Email"
            required
            value={form.emailId}
            onChange={(e) =>
              setForm({ ...form, emailId: e.target.value })
            }
          />

          <br /><br />

          <button>Generate Invoice</button>
        </form>
      </div>
    </div>
  );
}