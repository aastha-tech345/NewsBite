const Agent = require('../models/Agent');

const createAgent = async (req, res, next) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json({ success: true, agent });
  } catch (err) {
    next(err);
  }
};

const getAllAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json({ success: true, agents });
  } catch (err) {
    next(err);
  }
};

const updateAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });
    res.json({ success: true, agent });
  } catch (err) {
    next(err);
  }
};

const deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });
    res.json({ success: true, message: 'Agent deleted' });
  } catch (err) {
    next(err);
  }
};

const toggleAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });
    agent.isActive = !agent.isActive;
    await agent.save();
    res.json({ success: true, isActive: agent.isActive });
  } catch (err) {
    next(err);
  }
};

module.exports = { createAgent, getAllAgents, updateAgent, deleteAgent, toggleAgent };
