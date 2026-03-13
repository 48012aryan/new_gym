import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  InputGroup,
  Row,
  Col,
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Search,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  PieChart,
  User,
  Activity,
  CheckCircle2
} from 'lucide-react';
import api from '../utils/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    memberId: '',
    planId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
  });

  useEffect(() => {
    fetchPayments();
    fetchMembers();
    fetchPlans();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (error) {
      setError('Failed to fetch payments');
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      memberId: '',
      planId: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash',
    });
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlanChange = (e) => {
    const selectedPlan = plans.find((p) => p._id === e.target.value);
    setFormData({
      ...formData,
      planId: e.target.value,
      amount: selectedPlan ? selectedPlan.price : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/payments', formData);
      fetchPayments();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to record payment');
    }
  };

  const filteredPayments = payments.filter((payment) =>
    payment.memberId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.memberId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-5"
    >
      <div className="page-header">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 glass rounded-pill text-primary d-none d-md-flex">
              <CreditCard size={32} />
            </div>
            <div>
              <h2 className="mb-0">Revenue Analytics</h2>
              <p className="mb-0 mt-1">Track payments, subscriptions, and financial growth.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenModal}
            className="btn-premium btn-primary-gradient px-4 border-0 shadow-sm"
          >
            <Plus size={20} />
            RECORD PAYMENT
          </motion.button>
        </div>
      </div>

      <Row className="g-4 mb-5">
        <Col lg={4}>
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-4 h-100 d-flex flex-column justify-content-between border-0 shadow-sm position-relative overflow-hidden"
          >
            <div className="position-absolute top-0 end-0 p-4 opacity-10">
              <TrendingUp size={80} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded-circle text-primary">
                  <DollarSign size={20} />
                </div>
                <span className="small fw-bold text-muted text-uppercase letter-spacing-1">Gross Revenue</span>
              </div>
              <h1 className="fw-black mb-1">₹{totalRevenue.toLocaleString()}</h1>
              <div className="text-success small fw-bold d-flex align-items-center gap-1">
                <Activity size={14} />
                <span>+12.5% from last month</span>
              </div>
            </div>
          </motion.div>
        </Col>
        <Col lg={4}>
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-4 h-100 d-flex flex-column justify-content-between border-0 shadow-sm position-relative overflow-hidden"
          >
            <div className="position-absolute top-0 end-0 p-4 opacity-10">
              <PieChart size={80} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 bg-secondary bg-opacity-10 rounded-circle text-secondary">
                  <Activity size={20} />
                </div>
                <span className="small fw-bold text-muted text-uppercase letter-spacing-1">Transactions</span>
              </div>
              <h1 className="fw-black mb-1">{payments.length}</h1>
              <p className="text-muted small mb-0">Total successful records processed</p>
            </div>
          </motion.div>
        </Col>
        <Col lg={4}>
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-4 h-100 d-flex flex-column justify-content-between border-0 shadow-sm position-relative overflow-hidden"
          >
            <div className="position-absolute top-0 end-0 p-4 opacity-10">
              <User size={80} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 bg-info bg-opacity-10 rounded-circle text-info">
                  <User size={20} />
                </div>
                <span className="small fw-bold text-muted text-uppercase letter-spacing-1">Avg Ticket</span>
              </div>
              <h1 className="fw-black mb-1">₹{(totalRevenue / (payments.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</h1>
              <p className="text-muted small mb-0">Mean revenue per membership card</p>
            </div>
          </motion.div>
        </Col>
      </Row>

      <div className="glass-card p-2 px-3 mb-4">
        <InputGroup className="border-0 bg-transparent">
          <InputGroup.Text className="bg-transparent border-0 text-muted ps-0">
            <Search size={20} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by member name or email identity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-0 shadow-none ps-2"
            style={{ fontSize: '1rem', fontWeight: 500 }}
          />
        </InputGroup>
      </div>

      <div className="table-container glass-card">
        <div className="table-responsive">
          <Table className="premium-table mb-0">
            <thead>
              <tr>
                <th>Member Identity</th>
                <th>Subscribed Tier</th>
                <th>Transaction Amount</th>
                <th className="d-none d-lg-table-cell">Posting Date</th>
                <th>Payment Mode</th>
                <th className="text-end">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <div className="d-flex flex-column align-items-center gap-3">
                        <DollarSign size={48} className="opacity-25" />
                        <span className="fw-bold opacity-50">NO TRANSACTIONS FOUND</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="user-avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                            {payment.memberId?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="fw-bold">{payment.memberId?.name || 'Unknown'}</div>
                            <div className="small text-muted">{payment.memberId?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="glass p-1 px-3 rounded-pill small fw-bold text-primary">
                          {payment.planId?.name || 'No Plan'}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-primary">₹{payment.amount.toLocaleString()}</span>
                      </td>
                      <td className="d-none d-lg-table-cell">
                        <div className="small d-flex align-items-center gap-2 fw-medium text-muted">
                          <Calendar size={14} />
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <span className="small fw-bold text-uppercase opacity-75">{payment.paymentMode}</span>
                      </td>
                      <td className="text-end pe-4">
                        <span className="status-badge badge-active py-1">
                          <CheckCircle2 size={12} className="me-1" />
                          SUCCESS
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered className="premium-modal">
        <Modal.Header closeButton className="glass border-0 p-4">
          <Modal.Title className="fw-bold h4">
            <span className="text-gradient">NEW TRANSACTION RECEIPT</span>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4 pt-0">
            {error && <Alert variant="danger" className="rounded-4">{error}</Alert>}
            <Row className="g-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Member Identity</Form.Label>
                  <Form.Select
                    name="memberId"
                    value={formData.memberId}
                    onChange={handleChange}
                    required
                    className="glass py-2"
                  >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} — {member.email}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Tier Assignment</Form.Label>
                  <Form.Select
                    name="planId"
                    value={formData.planId}
                    onChange={handlePlanChange}
                    required
                    className="glass py-2"
                  >
                    <option value="">Select Plan</option>
                    {plans.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.name} — ₹{plan.price}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Amount Collected (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="glass py-2 fw-bold text-primary"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Transaction Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    required
                    className="glass py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted text-uppercase">Payment Method</Form.Label>
                  <Form.Select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleChange}
                    required
                    className="glass py-2"
                  >
                    <option value="Cash">Cash Currency</option>
                    <option value="UPI">UPI / Digital Wallet</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Transfer">Bank Transfer</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="glass border-0 p-4">
            <Button
              variant="link"
              onClick={handleCloseModal}
              className="text-muted text-decoration-none fw-bold"
            >
              DISCARD
            </Button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn-premium btn-primary-gradient px-4 border-0"
            >
              PROCESS TRANSACTION
            </motion.button>
          </Modal.Footer>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default Payments;

