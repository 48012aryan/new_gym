import React, { useState } from 'react';
import { Navbar, Nav, Container, Offcanvas, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  CreditCard,
  LogOut,
  Menu as MenuIcon,
  X as CloseIcon
} from 'lucide-react';
import { logout, getUser } from '../utils/auth';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/members', label: 'Members', icon: <Users size={20} /> },
    { path: '/trainers', label: 'Trainers', icon: <Dumbbell size={20} /> },
    { path: '/plans', label: 'Plans', icon: <ClipboardList size={20} /> },
    { path: '/payments', label: 'Payments', icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="layout-wrapper">
      <Navbar
        expand="lg"
        className="custom-navbar sticky-top"
      >
        <Container fluid className="px-lg-5">
          <Navbar.Brand
            as={Link}
            to="/dashboard"
            className="d-flex align-items-center gap-2"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="logo-icon"
            >
              <Dumbbell size={24} />
            </motion.div>
            <div className="brand-text">
              <span className="fw-bold brand-title">GYM PRO</span>
              <span className="brand-subtitle d-none d-sm-block">MANAGEMENT</span>
            </div>
          </Navbar.Brand>

          <div className="d-none d-lg-flex flex-grow-1 justify-content-center">
            <Nav className="gap-2">
              {navItems.map((item) => (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  className={`nav-link-custom d-flex align-items-center gap-2 ${isActive(item.path) ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Nav.Link>
              ))}
            </Nav>
          </div>

          <div className="d-flex align-items-center gap-3">
            {user && (
              <div className="d-none d-lg-flex align-items-center gap-3 glass p-2 pe-3 rounded-pill">
                <div className="user-avatar text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <div className="user-name fw-bold">{user.username}</div>
                  <div className="d-flex mt-1">
                    <Badge bg="primary" className="rounded-pill" style={{ fontSize: '0.6rem' }}>ADMINISTRATOR</Badge>
                  </div>
                </div>
                <div className="ms-2">
                  <button
                    onClick={handleLogout}
                    className="logout-btn"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            )}

            <button
              className="d-lg-none btn-premium glass p-2"
              onClick={() => setShow(true)}
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </Container>
      </Navbar>

      <Navbar.Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="end"
        className="glass"
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold text-gradient">MENU</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-4">
          <Nav className="flex-column gap-3">
            {navItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                onClick={() => setShow(false)}
                className={`nav-link-custom fs-5 d-flex align-items-center gap-3 ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.icon}
                {item.label}
              </Nav.Link>
            ))}
            <hr />
            <Nav.Link
              onClick={handleLogout}
              className="nav-link-custom text-danger d-flex align-items-center gap-3"
            >
              <LogOut size={20} />
              Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>

      <motion.main
        className="main-content"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Container fluid>
          {children}
        </Container>
      </motion.main>
    </div>
  );
};

export default Layout;

