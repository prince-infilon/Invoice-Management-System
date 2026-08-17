const Client = require("../model/Client");

exports.getClients = async (req, res) => {
    const clients = await Client.find().sort({createdAt: -1});
    res.json(clients);
};

exports.getClient = async (req, res) => {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({message: "Client not found"});
    res.json(client);
};

exports.createClient = async (req, res) => {
    const client = await Client.create(req.body);
    res.status(201).json(client);
};

exports.updateClient = async (req, res) => {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(client);
};

exports.deleteClient = async (req, res) => {
    const client = await Client.findByIdAndDelete(req.params.id);
    res.json({message: "Client deleted successfully"});
};