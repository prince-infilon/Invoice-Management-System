const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        description: {type: String, required:true},
        quantity: {type: Number, required:true},
        price: {type: Number, required:true},
        itemCode: {type: String, default: ""},
        referenceNo: {type: String, default: ""},
        discount: {type: Number, default: 0},
    }
);

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {type: String, required:true, unique:true},
        client: {type: mongoose.Schema.Types.ObjectId, ref: "Client", required:true},
        companyLogo: {type: String, default: ""},
        companyAddress: {type: String, default: "Your Address, City"},
        companyPhone: {type: String, default: "+000 000 000 000"},
        companyEmail: {type: String, default: "sales@yourcompany.com"},
        bankDetails: {type: String, default: "Bank Name: Dummy Bank\nA/C No: 0000000000, SWIFT: DUMMYXXX\nLIPA: Dummy Company, Sort Code: 000000"},
        termsAndConditions: {type: String, default: "1. All goods are subject to our standard conditions of sale\n2. Prices are valid for 7 days\n3. Subject to availability of stock at the time of order\n4. *Highlighted items are “Special Net” products"},
        salesPerson: {type: String, default: "Sales Person"},
        referenceNo: {type: String, default: "Reference"},
        vatRate: {type: Number, default: 0.18},
        items: [itemSchema],
        totalAmount: {type: Number, required:true},
        status: {type: String, enum:["pending", "paid", "overdue"], default:"pending"},
        dueDate: {type: Date, required:true},
    },
    {timestamps:true}
);

module.exports = mongoose.model("Invoice", invoiceSchema);