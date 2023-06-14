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

subjectSchema.pre('save', function(next) {
    const subject = this;
    if (subject.year < 0 || subject.year > 5) {
        const err = new Error('El año es no se encuentra entre 1 y 5.');
        return next(err)
    }
    next()
})

module.exports = mongoose.model('Subject', subjectSchema);