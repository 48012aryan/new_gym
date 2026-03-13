const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
} = require('../controllers/memberController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getMembers).post(protect, createMember);
router.route('/:id').get(protect, getMember).put(protect, updateMember).delete(protect, deleteMember);

module.exports = router;

