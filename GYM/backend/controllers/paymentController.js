const Payment = require('../models/Payment');
const Member = require('../models/Member');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('memberId', 'name email phone')
      .populate('planId', 'name duration price')
      .sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('memberId', 'name email phone')
      .populate('planId', 'name duration price');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    const populatedPayment = await Payment.findById(payment._id)
      .populate('memberId', 'name email phone')
      .populate('planId', 'name duration price');
    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'Active' });
    const totalTrainers = await (await require('../models/Trainer').find()).length;
    
    // Calculate monthly revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyPayments = await Payment.find({
      paymentDate: { $gte: startOfMonth }
    });
    const monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
      totalMembers,
      activeMembers,
      totalTrainers,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  getPayment,
  createPayment,
  getDashboardStats,
};

