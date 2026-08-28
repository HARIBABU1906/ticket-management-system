const Complaint = require('../models/Complaint');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
    try {
        const { block, room, type, remarks } = req.body;
        const attachment = req.file ? `/uploads/${req.file.filename}` : '';

        const complaint = await Complaint.create({
            block,
            room,
            type,
            remarks,
            attachment,
            raisedBy: req.user._id
        });

        res.status(201).json(complaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user complaints (Dashboard/List)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    try {
        let query = {};

        // RBAC logic for fetching complaints
        if (req.user.role.name === 'User') {
            query.raisedBy = req.user._id;
        } else if (req.user.role.name === 'Technician' || req.user.role.name === 'Staff') {
            query.assignedTo = req.user._id;
        }
        // SuperAdmin can see all

        const complaints = await Complaint.find(query)
            .populate('block')
            .populate('room')
            .populate('raisedBy', 'name email')
            .populate('assignedTo', 'name');

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/complaints/stats
// @access  Private
const getComplaintStats = async (req, res) => {
    try {
        let query = {};
        if (req.user.role.name === 'User') {
            query.raisedBy = req.user._id;
        } else if (req.user.role.name === 'Technician' || req.user.role.name === 'Staff') {
            query.assignedTo = req.user._id;
        }

        const stats = {
            total: await Complaint.countDocuments(query),
            pending: await Complaint.countDocuments({ ...query, status: 'Pending' }),
            assigned: await Complaint.countDocuments({ ...query, status: 'Assigned' }),
            closed: await Complaint.countDocuments({ ...query, status: 'Completed' })
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get possible complaint statuses
// @route   GET /api/complaints/statuses
// @access  Private
const getComplaintStatuses = async (req, res) => {
    try {
        const statuses = ['Pending', 'Accepted', 'Assigned', 'In-Progress', 'On-Hold', 'Completed'];
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign complaint to staff
// @route   PUT /api/complaints/:id/assign
// @access  Private/Admin
const assignComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (complaint) {
            complaint.assignedTo = req.body.staffId;
            complaint.status = 'Assigned';
            const updatedComplaint = await complaint.save();
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private
const updateComplaintStatus = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (complaint) {
            complaint.status = req.body.status;
            const updatedComplaint = await complaint.save();
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createComplaint, getComplaints, getComplaintStats, assignComplaint, updateComplaintStatus, getComplaintStatuses };
