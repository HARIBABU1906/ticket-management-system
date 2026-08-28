const mongoose = require('mongoose');

const blockSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
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

module.exports = mongoose.model('Block', blockSchema);
