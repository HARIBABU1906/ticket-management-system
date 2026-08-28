const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    shortName: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
