  import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    api.get(`/invoices/${id}`).then((res) => setInvoice(res.data));
  }, [id]);

  if (!invoice) return <div className="p-3">Loading...</div>;

  const exDiscount = (invoice.items || []).reduce(
    (sum, item) => sum + (Number(item.quantity || 0) * Number(item.price || 0) * (Number(item.discount || 0) / 100)),
    0
  );
  const subtotal = (invoice.items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

  const company = {
    name: invoice.companyName || "Your Company Name",
    address: invoice.companyAddress || "Your Address, City",
    phone: invoice.companyPhone || "+000 000 000 000",
    email: invoice.companyEmail || "sales@yourcompany.com",
  };

  const vatRate = Number(invoice.vatRate ?? 0.18);
  const afterDiscount = subtotal - exDiscount;
  const vat = afterDiscount * vatRate;
  const total = afterDiscount + vat;
  const documentDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");

  return (
    <div className="invoice-detail-wrap" style={{ backgroundColor: '#f8f9fa', padding: '20px 0' }}>
      <div className="no-print" style={{ padding: "1.5rem", textAlign: "center" }}>
        <button 
          className="btn btn-primary" 
          onClick={() => window.print()}
          style={{ 
            fontSize: "1rem", 
            padding: "0.75rem 2rem",
            marginRight: "1rem"
          }}
        >
          🖨️ Print Invoice
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => window.history.back()}
          style={{ 
            fontSize: "1rem", 
            padding: "0.75rem 2rem"
          }}
        >
          ← Back
        </button>
      </div>

      <div className="print-area" style={{ 
        maxWidth: '850px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        border: '1px solid #ddd',
        padding: '40px',
        color: 'black',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {invoice.companyLogo ? (
              <img 
                src={invoice.companyLogo} 
                alt="Company Logo" 
                style={{ width: '80px', height: '80px', objectFit: 'contain' }} 
              />
            ) : (
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                border: '4px solid #1a3673', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', 
                position: 'relative', overflow: 'hidden' 
              }}>
                <div style={{ position: 'absolute', width: '120%', height: '120%', border: '2px solid #1a3673', borderRadius: '40%', transform: 'rotate(30deg)' }}></div>
                <div style={{ position: 'absolute', width: '120%', height: '120%', border: '2px solid #1a3673', borderRadius: '40%', transform: 'rotate(60deg)' }}></div>
                <strong style={{ fontSize: '30px', color: '#1a3673', zIndex: 1, fontWeight: '900' }}>
                  {company.name.charAt(0).toUpperCase()}
                </strong>
              </div>
            )}
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a3673', margin: 0 }}>
              {company.name}
            </h1>
          </div>

          <div style={{ borderLeft: '2px solid #ccc', paddingLeft: '20px', fontSize: '12px', lineHeight: '1.6' }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>Company</div>
            <div>{company.address}</div>
            <div>Phone: {company.phone}</div>
            <div>Email: {company.email}</div>
          </div>
        </header>

        {/* Title Bar */}
        <div style={{ 
          backgroundColor: '#e2ebf3', 
          borderTop: '2px solid black', 
          borderBottom: '2px solid black', 
          textAlign: 'center', 
          padding: '12px 0', 
          marginBottom: '20px' 
        }}>
          <h2 style={{ margin: 0, fontWeight: '900', fontSize: '26px', color: '#111' }}>Proforma Invoice</h2>
        </div>

        {/* Client & Document Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ width: '48%', fontSize: '12px', lineHeight: '1.8' }}>
            <h3 style={{ fontWeight: '900', fontSize: '16px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
              {invoice.client?.name || "Customer Name"}
            </h3>
            <div>Phone No. : {invoice.client?.phone || "-"}</div>
            <div>Email : {invoice.client?.email || "-"}</div>
            <div>Address : {invoice.client?.address || "-"}</div>
          </div>

          <div style={{ width: '45%', fontSize: '12px', lineHeight: '1.8' }}>
            <table style={{ border: 'none', width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '0 10px 0 0', color: '#333' }}>Document No. :</td>
                  <td><strong>{invoice.invoiceNumber || "-"}</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '0 10px 0 0', color: '#333' }}>Document Date :</td>
                  <td><strong>{documentDate}</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '0 10px 0 0', color: '#333' }}>Sales Person :</td>
                  <td><strong>{invoice.salesPerson || "Sales Person"}</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '0 10px 0 0', color: '#333' }}>Reference No. :</td>
                  <td><strong>{invoice.referenceNo || "Reference"}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Items Table with Integrated Totals */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#9ab0c4', borderBottom: '1px solid black' }}>
              <th style={{ border: '1px solid black', padding: '10px 4px', textAlign: 'center', fontWeight: '900' }}>Sr.<br/>No</th>
              <th style={{ border: '1px solid black', padding: '10px 4px', textAlign: 'center', fontWeight: '900' }}>Description</th>
              <th style={{ border: '1px solid black', padding: '10px 4px', textAlign: 'center', fontWeight: '900' }}>Item</th>
              <th style={{ border: '1px solid black', padding: '10px 4px', textAlign: 'center', fontWeight: '900' }}>REF#</th>
              <th style={{ border: '1px solid black', padding: '10px 4px', textAlign: 'center', fontWeight: '900' }}>Qty.</th>
              <th style={{ border: '1px solid black', padding: '10px 4px', textAlign: 'center', fontWeight: '900' }}>UoM</th>
              <th style={{ border: '1px solid black', padding: '10px 4px', textAlign: 'center', fontWeight: '900' }}>Unit<br/>Price</th>
              <th style={{ border: '1px solid black', padding: '10px 4px', textAlign: 'center', fontWeight: '900' }}>DISC %</th>
              <th style={{ border: '1px solid black', padding: '10px 4px', textAlign: 'center', fontWeight: '900' }}>Net<br/>Unit<br/>Price</th>
              <th style={{ border: '1px solid black', padding: '10px 4px', textAlign: 'center', fontWeight: '900' }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item, i) => {
              const lineSubtotal = Number(item.quantity || 0) * Number(item.price || 0);
              const discountPercent = Number(item.discount || 0);
              const lineDiscount = lineSubtotal * (discountPercent / 100);
              const lineAmount = lineSubtotal - lineDiscount;
              return (
                <tr key={`${item.description}-${i}`}>
                  <td style={{ border: '1px solid black', padding: '8px 4px', textAlign: 'center' }}>{i + 1}</td>
                  <td style={{ border: '1px solid black', padding: '8px 4px', textAlign: 'center' }}>{item.description}</td>
                  <td style={{ border: '1px solid black', padding: '8px 4px', textAlign: 'center' }}>{item.itemCode || "-"}</td>
                  <td style={{ border: '1px solid black', padding: '8px 4px', textAlign: 'center' }}>{item.referenceNo || "-"}</td>
                  <td style={{ border: '1px solid black', padding: '8px 4px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid black', padding: '8px 4px', textAlign: 'center' }}>PCS</td>
                  <td style={{ border: '1px solid black', padding: '8px 4px', textAlign: 'center' }}>{formatCurrency(item.price)}</td>
                  <td style={{ border: '1px solid black', padding: '8px 4px', textAlign: 'center' }}>{discountPercent.toFixed(2)}</td>
                  <td style={{ border: '1px solid black', padding: '8px 4px', textAlign: 'center' }}>{formatCurrency(Number(item.price) * (1 - discountPercent/100))}</td>
                  <td style={{ border: '1px solid black', padding: '8px 8px', textAlign: 'right' }}>{formatCurrency(lineAmount)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="8" rowSpan="4" style={{ border: '1px solid black', verticalAlign: 'top', padding: '15px' }}>
                <div style={{ fontWeight: '900', fontSize: '13px', marginBottom: '8px' }}>Terms &amp; Conditions:</div>
                <ol style={{ paddingLeft: '20px', margin: '0 0 20px 0', lineHeight: '1.6' }}>
                  {(invoice.termsAndConditions || "1. All goods are subject to our standard conditions of sale\n2. Prices are valid for 7 days\n3. Subject to availability of stock at the time of order\n4. *Highlighted items are “Special Net” products").split('\n').map((term, i) => (
                    <li key={i}>{term.replace(/^\d+\.\s*/, '')}</li>
                  ))}
                </ol>
                <div style={{ borderTop: '1px solid #ccc', margin: '0 -15px', padding: '8px 15px 4px' }}>
                  Proforma Issued By Name : {invoice.salesPerson || "Sales Person"}
                </div>
                <div style={{ borderTop: '1px solid #ccc', margin: '0 -15px', padding: '8px 15px 0' }}>
                  Received By Name :
                </div>
              </td>
              <td style={{ border: '1px solid black', padding: '8px', color: '#333' }}>Sub Total</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>{formatCurrency(subtotal)}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '8px', color: '#333' }}>Ex.Discount</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>
                {formatCurrency(exDiscount)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '8px', color: '#333' }}>VAT @ {(vatRate * 100).toFixed(2)}%</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>{formatCurrency(vat)}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '8px', fontWeight: '900' }}>Total</td>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right', fontWeight: '900' }}>{formatCurrency(total)}</td>
            </tr>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <td colSpan="5" style={{ border: '1px solid black', padding: '15px', borderBottom: '1px solid black' }}>Signature :</td>
              <td colSpan="5" style={{ border: '1px solid black', padding: '15px', borderBottom: '1px solid black' }}>Signature :</td>
            </tr>
          </tfoot>
        </table>

        {/* Payment Options */}
        <div style={{ marginTop: '20px', fontSize: '12px', lineHeight: '1.6' }}>
          <div style={{ fontWeight: '900', fontSize: '14px', marginBottom: '8px' }}>Payment Options</div>
          {(invoice.bankDetails || "Bank Name: Dummy Bank\nA/C No: 0000000000, SWIFT: DUMMYXXX\nLIPA: Dummy Company, Sort Code: 000000").split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
