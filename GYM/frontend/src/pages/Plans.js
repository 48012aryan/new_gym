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
  ClipboardList,
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  Clock,
  ChevronRight,
  Info
} from 'lucide-react';
import api from '../utils/api';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    duration: '1 month',
    price: '',
    description: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data);
    } catch (error) {
      setError('Failed to fetch plans');
    }
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan._id);
      setFormData({
        name: plan.name,
        duration: plan.duration,
        price: plan.price,
        description: plan.description || '',
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        duration: '1 month',
        price: '',
        description: '',
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingPlan) {
        await api.put(`/plans/${editingPlan}`, formData);
      } else {
        await api.post('/plans', formData);
      }
      fetchPlans();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await api.delete(`/plans/${id}`);
        fetchPlans();
      } catch (error) {
        setError('Failed to delete plan');
      }
    }
  };

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.duration.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <ClipboardList size={32} />
            </div>
            <div>
              <h2 className="mb-0">Membership Plans</h2>
              <p className="mb-0 mt-1">Design and manage high-value membership tiers for your gym.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="btn-premium btn-primary-gradient px-4 border-0 shadow-sm"
          >
            <PlusCircle size={20} />
            CREATE NEW PLAN
          </motion.button>
        </div>
      </div>

      <div className="glass-card p-2 px-3 mb-4">
        <InputGroup className="border-0 bg-transparent">
          <InputGroup.Text className="bg-transparent border-0 text-muted ps-0">
            <Search size={20} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by plan name or duration..."
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
                <th>Subscription Tier</th>
                <th>Validity</th>
                <th>Pricing</th>
                <th className="d-none d-lg-table-cell">Benefits</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredPlans.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <div className="d-flex flex-column align-items-center gap-3">
                        <ClipboardList size={48} className="opacity-25" />
                        <span className="fw-bold opacity-50">NO PLANS DEFINED</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((plan) => (
                    <motion.tr
                      key={plan._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="glass p-2 rounded-3 text-primary">
                            {plan.duration.includes('12') ? <ChevronRight size={24} className="text-warning" /> : <ChevronRight size={24} />}
                          </div>
                          <div>
                            <div className="fw-bold fs-5">{plan.name}</div>
                            <div className="small text-muted text-uppercase letter-spacing-1">Official Member Tier</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Clock size={16} className="text-primary" />
                          <span className="fw-bold">{plan.duration}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="fw-bold fs-5 text-primary">₹{plan.price.toLocaleString()}</span>
                          <span className="small text-muted">Billed per cycle</span>
                        </div>
                      </td>
                      <td className="d-none d-lg-table-cell">
                        <div className="d-flex align-items-center gap-2 text-muted small fw-medium">
                          <Info size={14} />
                          {plan.description || 'Full access to gym facilities.'}
                        </div>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleOpenModal(plan)}
                            className="p-2 glass rounded-circle text-primary border-0"
                          >
                            <Edit3 size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleDelete(plan._id)}
                            className="p-2 glass rounded-circle text-danger border-0"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered className="premium-modal">
        <Modal.Header closeButton className="glass border-0 p-4">
          <Modal.Title className="fw-bold h4">
            <span className="text-gradient">
              {editingPlan ? 'CONFIGURE PLAN' : 'NEW MEMBERSHIP TIER'}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4 pt-0">
            {error && <Alert variant="danger" className="rounded-4">{error}</Alert>}
            <Row className="g-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">PLAN NAME</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Diamond VIP Access"
                    className="glass py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">VALIDITY PERIOD</Form.Label>
                  <Form.Select name="duration" value={formData.duration} onChange={handleChange} required className="glass py-2">
                    <option value="1 month">1 month</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">PRICE (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="glass py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">TIER BENEFITS / DESCRIPTION</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe included amenities, classes, and perks..."
                    className="glass py-2"
                  />
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
              CANCEL
            </Button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn-premium btn-primary-gradient px-4 border-0"
            >
              {editingPlan ? 'SAVE CHANGES' : 'PUBLISH PLAN'}
            </motion.button>
          </Modal.Footer>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default Plans;

