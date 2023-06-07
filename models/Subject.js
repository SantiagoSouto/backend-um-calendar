const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = require('./Event');

const subjectSchema = new Schema({
    name: {type: String, required: true, unique: true},
    career: {type: String, default: ''},
    year: {type: Number},
    events: {type: [Schema.Types.ObjectId], default: []}
}, {
    timestamps: true
})

subjectSchema.methods.addEvent = function (event, callback) {
    // event is the _id of the new event created
    this.events = [...this.events, event];
    this.save().then(() => callback(null, 'Success'));
}

module.exports = mongoose.model('Subject', subjectSchema);