import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function InvoiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    invoiceNumber: "",
    client: "",
    dueDate: "",
    companyName: "Your Company Name",
    companyLogo: "",
    companyAddress: "Your Address, City",
    companyPhone: "+000 000 000 000",
    companyEmail: "sales@yourcompany.com",
    bankDetails: "Bank Name: Dummy Bank\nA/C No: 0000000000, SWIFT: DUMMYXXX\nLIPA: Dummy Company, Sort Code: 000000",
    termsAndConditions: "1. All goods are subject to our standard conditions of sale\n2. Prices are valid for 7 days\n3. Subject to availability of stock at the time of order\n4. *Highlighted items are “Special Net” products",
    salesPerson: "Sales Person",
    referenceNo: "Reference",
    vatRate: 0.18,
    items: [{ description: "", quantity: 1, price: 0, itemCode: "", referenceNo: "", discount: 0 }],
  });
  const [clients, setClients] = useState([]);

  useEffect(() => {
    api.get("/clients").then((res) => setClients(res.data));
    if (isEdit)
      api.get(`/invoices/${id}`).then((res) => {
        setForm(res.data);
      });
  }, [isEdit, id]);

  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index][field] = value;
    setForm({ ...form, items });
  };

  const addItem = () =>
    setForm({
      ...form,
      items: [...form.items, { description: "", quantity: 1, price: 0, itemCode: "", referenceNo: "", discount: 0 }],
    });

  const calculateInvoiceTotals = (items, vatRate = 0.18) => {
    let subtotal = 0;
    let exDiscount = 0;
    (items || []).forEach(item => {
      const lineSubtotal = Number(item.quantity || 0) * Number(item.price || 0);
      const lineDiscount = lineSubtotal * (Number(item.discount || 0) / 100);
      subtotal += lineSubtotal;
      exDiscount += lineDiscount;
    });
    
    const afterDiscount = subtotal - exDiscount;
    const vat = afterDiscount * Number(vatRate || 0);
    const total = afterDiscount + vat;
    
    return { subtotal, exDiscount, vat, total };
  };

  const totals = calculateInvoiceTotals(form.items, form.vatRate);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, companyLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = form.items
      .map((item) => ({
        ...item,
        description: item.description.trim(),
      }))
      .filter((item) => item.description !== "" && item.quantity > 0 && item.price >= 0);

    if (items.length === 0) {
      return alert("Please add at least one invoice item with a description, quantity, and price.");
    }

    const calculatedTotals = calculateInvoiceTotals(items, form.vatRate);
    const payload = {
      ...form,
      items,
      totalAmount: calculatedTotals.total,
      vatRate: Number(form.vatRate) || 0.18,
    };

    if (isEdit) await api.put(`/invoices/${id}`, payload);
    else await api.post("/invoices", payload);
    navigate("/invoices");
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{isEdit ? "Edit" : "New"} Invoice</h2>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <form onSubmit={handleSubmit}>
        
        {/* COMPANY DETAILS SECTION */}
        <div className="card mb-3 shadow-sm">
          <div className="card-header bg-light"><strong>Company Details</strong></div>
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label text-muted small mb-1">Company Name</label>
                <input
                  className="form-control"
                  placeholder="Company Name"
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small mb-1">Company Logo</label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleLogoUpload}
                  />
                  {form.companyLogo && <img src={form.companyLogo} alt="Logo" style={{height: '38px', maxWidth: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #ccc'}} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INVOICE DETAILS SECTION */}
        <div className="card mb-3 shadow-sm">
          <div className="card-header bg-light"><strong>Invoice Details</strong></div>
          <div className="card-body">
            <div className="row g-2 mb-2">
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1">Invoice Number</label>
                <input
                  className="form-control"
                  placeholder="Invoice Number"
                  required
                  value={form.invoiceNumber}
                  onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1">Client</label>
                <select
                  className="form-control"
                  required
                  value={form.client?._id || form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                >
                  <option value="">Select client</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={form.dueDate ? form.dueDate.substring(0, 10) : ""}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1">Sales Person</label>
                <input
                  className="form-control"
                  placeholder="Sales Person"
                  value={form.salesPerson}
                  onChange={(e) => setForm({ ...form, salesPerson: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1">Reference Number</label>
                <input
                  className="form-control"
                  placeholder="Reference Number"
                  value={form.referenceNo}
                  onChange={(e) => setForm({ ...form, referenceNo: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1">VAT Rate</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="VAT Rate"
                  value={form.vatRate}
                  onChange={(e) => setForm({ ...form, vatRate: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ITEMS SECTION */}
        <div className="card mb-3 shadow-sm">
          <div className="card-header bg-light"><strong>Items</strong></div>
          <div className="card-body">
            {form.items.map((item, i) => (
              <div className="row g-2 mb-2" key={i}>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">Description</label>
                  <input
                    className="form-control"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(i, "description", e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label text-muted small mb-1">Item Code</label>
                  <input
                    className="form-control"
                    placeholder="Item Code"
                    value={item.itemCode || ""}
                    onChange={(e) => updateItem(i, "itemCode", e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label text-muted small mb-1">Ref#</label>
                  <input
                    className="form-control"
                    placeholder="Ref#"
                    value={item.referenceNo || ""}
                    onChange={(e) => updateItem(i, "referenceNo", e.target.value)}
                  />
                </div>
                <div className="col-md-1">
                  <label className="form-label text-muted small mb-1">Qty</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Qty"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateItem(i, "quantity", Number(e.target.value))
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label text-muted small mb-1">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={item.price || ""}
                    onChange={(e) => updateItem(i, "price", Number(e.target.value))}
                  />
                </div>
                <div className="col-md-1">
                  <label className="form-label text-muted small mb-1">Disc%</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Disc%"
                    value={item.discount || ""}
                    onChange={(e) => updateItem(i, "discount", Number(e.target.value))}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary btn-sm mt-2"
              onClick={addItem}
            >
              + Add Item
            </button>
          </div>
        </div>


        <h5>Total: ₹{totals.total}</h5>
        <button className="btn btn-primary">Save Invoice</button>
      </form>
    </div>
  );
}
