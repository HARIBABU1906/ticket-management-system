const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomNumber: {
        type: String,
        required: true
    },
    block: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Block'
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Department'
    },
    programme: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Programme'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);
