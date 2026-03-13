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
  Dumbbell,
  Search,
  UserPlus,
  Edit3,
  Trash2,
  Phone,
  Award,
  CheckCircle,
  XCircle,
  Briefcase
} from 'lucide-react';
import api from '../utils/api';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    experience: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/trainers');
      setTrainers(response.data);
    } catch (error) {
      setError('Failed to fetch trainers');
    }
  };

  const handleOpenModal = (trainer = null) => {
    if (trainer) {
      setEditingTrainer(trainer._id);
      setFormData({
        name: trainer.name,
        specialization: trainer.specialization,
        phone: trainer.phone,
        experience: trainer.experience,
        status: trainer.status,
      });
    } else {
      setEditingTrainer(null);
      setFormData({
        name: '',
        specialization: '',
        phone: '',
        experience: '',
        status: 'Active',
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTrainer(null);
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
      if (editingTrainer) {
        await api.put(`/trainers/${editingTrainer}`, formData);
      } else {
        await api.post('/trainers', formData);
      }
      fetchTrainers();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save trainer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await api.delete(`/trainers/${id}`);
        fetchTrainers();
      } catch (error) {
        setError('Failed to delete trainer');
      }
    }
  };

  const filteredTrainers = trainers.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.phone.includes(searchTerm)
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
              <Dumbbell size={32} />
            </div>
            <div>
              <h2 className="mb-0">Expert Trainers</h2>
              <p className="mb-0 mt-1">Manage your professional training staff and their specialties.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="btn-premium btn-primary-gradient px-4 border-0 shadow-sm"
          >
            <UserPlus size={20} />
            ADD NEW TRAINER
          </motion.button>
        </div>
      </div>

      <div className="glass-card p-2 px-3 mb-4">
        <InputGroup className="border-0 bg-transparent">
          <InputGroup.Text className="bg-transparent border-0 text-muted ps-0">
            <Search size={20} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by name, specialization, or phone..."
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
                <th>Trainer Profile</th>
                <th>Expertise</th>
                <th>Experience</th>
                <th className="d-none d-md-table-cell">Contact</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTrainers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <div className="d-flex flex-column align-items-center gap-3">
                        <Dumbbell size={48} className="opacity-25" />
                        <span className="fw-bold opacity-50">NO TRAINERS FOUND</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTrainers.map((trainer) => (
                    <motion.tr
                      key={trainer._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="user-avatar" style={{ width: 40, height: 40, fontSize: '0.9rem', background: 'linear-gradient(45deg, var(--primary), var(--secondary))' }}>
                            {trainer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-bold">{trainer.name}</div>
                            <div className="small text-muted">Professional Trainer</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Award size={16} className="text-primary" />
                          <span className="fw-medium">{trainer.specialization}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Briefcase size={16} className="text-muted" />
                          <span>{trainer.experience} Years Exp.</span>
                        </div>
                      </td>
                      <td className="d-none d-md-table-cell">
                        <div className="small d-flex align-items-center gap-2">
                          <Phone size={14} className="text-muted" />
                          {trainer.phone}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${trainer.status === 'Active' ? 'badge-active' : 'badge-expired'}`}>
                          {trainer.status === 'Active' ? <CheckCircle size={12} className="me-1" /> : <XCircle size={12} className="me-1" />}
                          {trainer.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleOpenModal(trainer)}
                            className="p-2 glass rounded-circle text-primary border-0"
                          >
                            <Edit3 size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleDelete(trainer._id)}
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
              {editingTrainer ? 'UPDATE TRAINER' : 'REGISTER NEW TRAINER'}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4 pt-0">
            {error && <Alert variant="danger" className="rounded-4">{error}</Alert>}
            <Row className="g-4">
              <Col md={12}>
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
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">SPECIALIZATION</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Weight Training, Yoga, Cardio"
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
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">EXPERIENCE (YEARS)</Form.Label>
                  <Form.Control
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    min="0"
                    className="glass py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">ACCOUNT STATUS</Form.Label>
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
              {editingTrainer ? 'SAVE CHANGES' : 'HIRE TRAINER'}
            </motion.button>
          </Modal.Footer>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default Trainers;

