import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Dumbbell, IndianRupee, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalTrainers: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: <Users size={28} />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
    {
      title: 'Active Members',
      value: stats.activeMembers,
      icon: <CheckCircle size={28} />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    },
    {
      title: 'Total Trainers',
      value: stats.totalTrainers,
      icon: <Dumbbell size={28} />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    },
    {
      title: 'Monthly Revenue',
      value: stats.monthlyRevenue.toLocaleString(),
      prefix: '₹',
      icon: <IndianRupee size={28} />,
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pb-5">
      <div className="page-header">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 glass rounded-pill text-primary d-none d-md-flex">
            <TrendingUp size={32} />
          </div>
          <div>
            <h2 className="mb-0">Dashboard Overview</h2>
            <p className="mb-0 mt-1">Transforming results through professional management.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="grow" variant="primary" />
          <p className="mt-3 text-muted fw-bold">Gathering Insights...</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <Row className="g-4">
            {statCards.map((stat, index) => (
              <Col key={index} md={6} lg={3}>
                <motion.div variants={item}>
                  <div className="glass-card h-100 p-4 d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="stat-icon-wrapper" style={{ background: stat.gradient }}>
                        {stat.icon}
                      </div>
                      <div className="text-muted">
                        <TrendingUp size={16} />
                      </div>
                    </div>
                    <div>
                      <div className="stat-label">{stat.title}</div>
                      <div className="stat-value">
                        {stat.prefix}{stat.value}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;

