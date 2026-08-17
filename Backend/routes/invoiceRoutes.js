const express = require("express");
const router = express.Router();
const {getInvoiceStats, getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice} = require("../controllers/invoiceControllers");

router.get("/stats", getInvoiceStats);
router.get("/", getInvoices);
router.get("/:id", getInvoice);
router.post("/", createInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

module.exports = router;