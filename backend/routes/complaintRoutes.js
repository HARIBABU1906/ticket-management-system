const express = require('express');
const { createComplaint, getComplaints, getComplaintStats, assignComplaint, updateComplaintStatus, getComplaintStatuses } = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.post('/', upload.single('attachment'), createComplaint);
router.get('/', getComplaints);
router.get('/stats', getComplaintStats);
router.put('/:id/assign', protect, admin, assignComplaint);
router.put('/:id/status', protect, updateComplaintStatus);
router.get('/statuses', getComplaintStatuses);

module.exports = router;
