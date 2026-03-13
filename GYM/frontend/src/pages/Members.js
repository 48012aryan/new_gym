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
  Users,
  Search,
  UserPlus,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import api from '../utils/api';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    planId: '',
    joinDate: '',
    expiryDate: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchMembers();
    fetchPlans();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (error) {
      setError('Failed to fetch members');
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

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member._id);
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        age: member.age,
        gender: member.gender,
        planId: member.planId?._id || member.planId,
        joinDate: member.joinDate.split('T')[0],
        expiryDate: member.expiryDate.split('T')[0],
        status: member.status,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: 'Male',
        planId: '',
        joinDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        status: 'Active',
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
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
      if (editingMember) {
        await api.put(`/members/${editingMember}`, formData);
      } else {
        await api.post('/members', formData);
      }
      fetchMembers();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save member');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/members/${id}`);
        fetchMembers();
      } catch (error) {
        setError('Failed to delete member');
      }
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
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
              <Users size={32} />
            </div>
            <div>
              <h2 className="mb-0">Members Directory</h2>
              <p className="mb-0 mt-1">Efficiently manage and track all your active gym memberships.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="btn-premium btn-primary-gradient px-4 border-0 shadow-sm"
          >
            <UserPlus size={20} />
            ADD NEW MEMBER
          </motion.button>
        </div>
      </div>

      <Row className="mb-4 g-3">
        <Col lg={8}>
          <div className="glass-card p-2 px-3">
            <InputGroup className="border-0 bg-transparent">
              <InputGroup.Text className="bg-transparent border-0 text-muted ps-0">
                <Search size={20} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by name, email, or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-0 shadow-none ps-2"
                style={{ fontSize: '1rem', fontWeight: 500 }}
              />
            </InputGroup>
          </div>
        </Col>
        <Col lg={4}>
          <div className="glass-card p-2 px-3 d-flex align-items-center justify-content-between text-muted">
            <div className="d-flex align-items-center gap-2">
              <Filter size={18} />
              <span className="small fw-bold text-uppercase opacity-75">Status: All</span>
            </div>
            <div className="small fw-bold text-uppercase opacity-75">
              Total: {filteredMembers.length}
            </div>
          </div>
        </Col>
      </Row>

      <div className="table-container glass-card">
        <div className="table-responsive">
          <Table className="premium-table mb-0">
            <thead>
              <tr>
                <th>Member Profile</th>
                <th className="d-none d-lg-table-cell">Contact Info</th>
                <th>Current Plan</th>
                <th className="d-none d-md-table-cell">Expiry Status</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <div className="d-flex flex-column align-items-center gap-3">
                        <Users size={48} className="opacity-25" />
                        <span className="fw-bold opacity-50">NO MEMBERS FOUND</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <motion.tr
                      key={member._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="user-avatar" style={{ width: 40, height: 40, fontSize: '0.9rem' }}>
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-bold">{member.name}</div>
                            <div className="small text-muted">{member.age} yrs • {member.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="d-none d-lg-table-cell">
                        <div className="d-flex flex-column gap-1">
                          <div className="small d-flex align-items-center gap-2">
                            <Mail size={14} className="text-muted" />
                            {member.email}
                          </div>
                          <div className="small d-flex align-items-center gap-2">
                            <Phone size={14} className="text-muted" />
                            {member.phone}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="glass p-2 px-3 rounded-pill small fw-bold text-primary">
                          {member.planId?.name || 'No Plan'}
                        </span>
                      </td>
                      <td className="d-none d-md-table-cell">
                        <div className="small d-flex align-items-center gap-2 fw-medium">
                          <Calendar size={14} className="text-muted" />
                          {new Date(member.expiryDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${member.status === 'Active' ? 'badge-active' : 'badge-expired'}`}>
                          {member.status === 'Active' ? <CheckCircle size={12} className="me-1" /> : <XCircle size={12} className="me-1" />}
                          {member.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleOpenModal(member)}
                            className="p-2 glass rounded-circle text-primary border-0"
                          >
                            <Edit3 size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleDelete(member._id)}
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

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered className="premium-modal">
        <Modal.Header closeButton className="glass border-0 p-4">
          <Modal.Title className="fw-bold h4">
            <span className="text-gradient">
              {editingMember ? 'UPDATE PROFILE' : 'REGISTER NEW MEMBER'}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4 pt-0">
            {error && <Alert variant="danger" className="rounded-4">{error}</Alert>}
            <Row className="g-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">FULL NAME</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="glass py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">EMAIL ADDRESS</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="glass py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">PHONE NUMBER</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="glass py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">AGE</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="1"
                    className="glass py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">GENDER</Form.Label>
                  <Form.Select name="gender" value={formData.gender} onChange={handleChange} required className="glass py-2">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">MEMBERSHIP PLAN</Form.Label>
                  <Form.Select name="planId" value={formData.planId} onChange={handleChange} required className="glass py-2">
                    <option value="">Choose a plan...</option>
                    {plans.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.name} — ₹{plan.price} ({plan.duration})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">JOIN DATE</Form.Label>
                  <Form.Control
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    required
                    className="glass py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">EXPIRY DATE</Form.Label>
                  <Form.Control
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="glass py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">MEMBERSHIP STATUS</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange} required className="glass py-2">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
              CANCEL
            </Button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn-premium btn-primary-gradient px-4 border-0"
            >
              {editingMember ? 'SAVE CHANGES' : 'CREATE ACCOUNT'}
            </motion.button>
          </Modal.Footer>
        </Form >
      </Modal >
    </motion.div >
  );
};

export default Members;

