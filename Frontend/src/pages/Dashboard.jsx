import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [invoices, setInvoices] = useState([]); 
    const [statusFilter, setStatusFilter] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        api.get("/invoices/stats").then((res) => setStats(res.data)).catch((err) => console.error(err));
        api.get("/invoices").then((res) => setInvoices(res.data)).catch((err) => console.error(err));
    }, []);

    if (!stats) return <p className="p p-3">Loading...</p>;

    function invoice() {
        navigate("/invoices");
    }

    // 🚨 FIXED: Added safe checking (statusFilter && ...) to prevent crashes on second click
    const filteredInvoices = invoices.filter(item => {
        if (!statusFilter) return false; 
        if (statusFilter === "all") return true;
        return item.status && item.status.toLowerCase() === statusFilter.toLowerCase();
    });

    return (
        <div className="container mt-4">
            <h2>Dashboard</h2>
            <div className="row mt-3">
                <div className="col-md-3" style={{ cursor: "pointer" }} onClick={() => setStatusFilter(statusFilter === "all" ? null : "all")}>
                    <div className="card p-3">Total Invoices<br /><b>{stats.totalInvoices}</b></div>
                </div>
                <div className="col-md-3" style={{ cursor: "pointer" }} onClick={invoice}>
                    <div className="card p-3">Revenue<br /><b>₹{stats.revenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></div>
                </div>
                <div className="col-md-3" style={{ cursor: "pointer" }} onClick={() => setStatusFilter(statusFilter === "pending" ? null : "pending")}>
                    <div className="card p-3">Pending<br /><b>{stats.pendingCount}</b></div>
                </div>
                <div className="col-md-3" style={{ cursor: "pointer" }} onClick={() => setStatusFilter(statusFilter === "overdue" ? null : "overdue")}>
                    <div className="card p-3">Overdue<br /><b>{stats.overdueCount}</b></div>
                </div>
            </div>

            {statusFilter && (
                <div className="mt-4">
                    <h4 className="mt-5 text-capitalize">{statusFilter} Invoices</h4>
                    <table className="table table-bordered mt-3">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Client</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((inv, index) => (
                                <tr key={index}>
                                    <td>{inv.invoiceNumber || index + 1}</td>
                                    <td>{inv.client?.name}</td>
                                    <td>₹{Number(inv.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="text-capitalize">{inv.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}