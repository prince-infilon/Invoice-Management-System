import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);

  const load = () => api.get("/invoices").then((res) => setInvoices(res.data));
  useEffect(() => { load(); }, []);

  const togglePaidStatus = async (inv) => {
    const newStatus = inv.status === "paid" ? "pending" : "paid";
    await api.put(`/invoices/${inv._id}`, { status: newStatus });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/invoices/${id}`);
    load();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h2>Invoices</h2>
        <Link to="/invoices/new" className="btn btn-primary">+ New Invoice</Link>
      </div>
      <table className="table table-bordered mt-3">
        <thead><tr><th>#</th><th>Client</th><th>Total</th><th>Status</th><th>Due</th><th></th></tr></thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td><Link to={`/invoices/${inv._id}`}>{inv.invoiceNumber}</Link></td>
              <td>{inv.client?.name}</td>
              <td>₹{Number(inv.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td className="text-capitalize">{inv.status}</td>
              <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
              <td>
                <button 
                  className={`btn btn-sm me-1 ${inv.status === "paid" ? "btn-outline-secondary" : "btn-success"}`} 
                  onClick={() => togglePaidStatus(inv)}
                  title={inv.status === "paid" ? "Click to mark as unpaid" : "Click to mark as paid"}
                >
                  {inv.status === "paid" ? "Paid" : "Mark Paid"}
                </button>
                <Link className="btn btn-sm btn-secondary text-white me-1" to={`/invoices/${inv._id}/edit`}>Edit</Link>
                <button className="btn btn-sm btn-danger" onClick={() => remove(inv._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
