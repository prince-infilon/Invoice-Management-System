import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const loadClients = () =>
    api
      .get("/clients")
      .then((res) => setClients(res.data))
      .catch((err) => console.error(err));

  useEffect(() => {
    loadClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/clients", form);
    setForm({ name: "", email: "", phone: "", address: "" });
    loadClients();
  };

  const handleDelete = async (id) => {
    await api.delete(`/clients/${id}`);
    loadClients();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Clients</h2>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <form onSubmit={handleSubmit} className="row g-2 mb-4 align-items-end">
        <div className="col-md-3">
          <label className="form-label text-muted small mb-1">Name</label>
          <input
            className="form-control"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label text-muted small mb-1">Email</label>
          <input
            className="form-control"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label text-muted small mb-1">Phone</label>
          <input
            className="form-control"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label text-muted small mb-1">Address</label>
          <input
            className="form-control"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">Add Client</button>
        </div>
      </form>
      <table className="table table-bordered">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th></tr></thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td>
              <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      

    </div>
  );
}
