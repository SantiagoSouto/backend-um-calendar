const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    name: {type: String, required: true, unique: true},
    career: {type: String, default: ''},
    year: {type: Number},
    events: {type: [Schema.Types.ObjectId], default: []}
}, {
    timestamps: true
})

module.exports = mongoose.model('Subject', subjectSchema);