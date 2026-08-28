const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    block: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Block'
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    type: {
        type: String,
        required: true,
        enum: ['PC Hardware', 'PC Software', 'Application Issues', 'Network', 'Electronics', 'Plumbing', 'Other']
    },
    remarks: {
        type: String,
        required: true
    },
    attachment: {
        type: String // URL or path to the file
    },
    raisedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Accepted', 'Assigned', 'In-Progress', 'On-Hold', 'Completed'],
        default: 'Pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
