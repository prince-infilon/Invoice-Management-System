require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const clientRoutes = require("./routes/clientRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();

const start = async () => {
	const connected = await connectDB();

	app.use(cors());
	app.use(express.json({ limit: '50mb' }));
	app.use(express.urlencoded({ limit: '50mb', extended: true }));

	app.get("/", (req, res) => res.send("Invoice Management API is running..."));
	app.use("/api/clients", clientRoutes);
	app.use("/api/invoices", invoiceRoutes);

	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
		if (!connected) {
			console.warn('Warning: MongoDB not connected. DB-dependent routes will fail until a connection is available.');
		}
	});
};

start();