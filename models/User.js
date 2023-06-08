const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, lowercase: true, required: true},
    password: {type: String, required: true},
    subjects: {type: [Schema.Types.ObjectId], default: []},
    isAdmin: {type: Boolean, default: false}
}, {
    timestamps: true
})

// encrypt password before saving
userSchema.pre('save', function(next) {
    const user = this;
    // User exists but did not change password
    if (!user.isModified('password')) {
        return next();
    }

    // Generate salt for preventing dict attacks
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            next(err);
        }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                next(err);
            }
            user.password = hash;
            next();
        })
    })
})

userSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, theyMatch) => {
        if (err) {
            return callback(err);
        }
        callback(null, theyMatch);
    })
}

module.exports = mongoose.model('User', userSchema);