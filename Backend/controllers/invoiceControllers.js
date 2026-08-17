const Invoice = require ("../model/Invoice");

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

exports.getInvoices = async (req, res) => {
    const invoices = await Invoice.find().populate("client").sort({createdAt: -1});
    const now = new Date();
    const processedInvoices = invoices.map(inv => {
        let currentStatus = inv.status;
        if (currentStatus !== "paid" && new Date(inv.dueDate) < now) {
            currentStatus = "overdue";
        }
        return { ...inv.toObject(), status: currentStatus };
    });
    res.json(processedInvoices);
};

exports.getInvoiceStats = async (req, res) => {
    const invoices = await Invoice.find();
    const totalInvoices = invoices.length;
    const now = new Date();
    
    let pendingCount = 0;
    let overdueCount = 0;
    let revenue = 0;

    invoices.forEach(inv => {
        if (inv.status === "paid") {
            revenue += inv.totalAmount;
        } else if (new Date(inv.dueDate) < now) {
            overdueCount++;
        } else {
            pendingCount++;
        }
    });

    res.json({totalInvoices, revenue, pendingCount, overdueCount});
};

exports.getInvoice = async (req, res) => {
    const invoice = await Invoice.findById(req.params.id).populate("client");
    if (!invoice) return res.status(404).json({message: "Invoice not found"});
    res.json(invoice);
}

exports.createInvoice = async (req, res) => {
    try {
        const items = Array.isArray(req.body.items) ? req.body.items : [];
        const vatRate = Number(req.body.vatRate || 0.18);
        const totals = calculateInvoiceTotals(items, vatRate);
        const invoice = await Invoice.create({ ...req.body, items, vatRate, totalAmount: totals.total });
        res.status(201).json(invoice);
    } catch (err) {
        console.error('createInvoice error:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message, errors: err.errors });
        }
        res.status(500).json({ message: 'Failed to create invoice', error: err.message });
    }
};

exports.updateInvoice = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.status) data.status = data.status.toLowerCase();
        if (data.items) {
            const vatRate = Number(data.vatRate || 0.18);
            const totals = calculateInvoiceTotals(data.items, vatRate);
            data.totalAmount = totals.total;
            data.vatRate = vatRate;
        }
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        console.error('updateInvoice error:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message, errors: err.errors });
        }
        res.status(500).json({ message: 'Failed to update invoice', error: err.message });
    }
};

exports.deleteInvoice = async (req, res) => {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({message: "Invoice deleted successfully"});
};
