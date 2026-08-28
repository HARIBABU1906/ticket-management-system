const mongoose = require('mongoose');

const programmeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Department'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Programme', programmeSchema);
