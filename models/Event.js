const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: {type: String, required: true},
    date: {type: Date, required: true},
    eventType: {type: String, lowercase: true, enum: ['parcial', 'entrega', 'obligatorio', 'recuperacion'], required: true},
    subject: {type: Schema.Types.ObjectId, required: true},
    approved: {type: Boolean, default: false}
}, {
    timestamps: true
})

module.exports = mongoose.model('Event', eventSchema);