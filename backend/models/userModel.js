import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const { ObjectId } = mongoose.Schema.Types;

const followersSchema = mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
});

const followingSchema = mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
});

const musicSchema = mongoose.Schema({
  name: {
    type: String,
  },
  musicId: {
    type: ObjectId,
    ref: 'Music',
  },
});

const movieSchema = mongoose.Schema({
  name: {
    type: String,
  },
  movieId: {
    type: ObjectId,
    ref: 'Movie',
  },
});


const userSchema = mongoose.Schema({
  userId: String,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  file: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
  bio: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  followers: [followersSchema],
  followings: [followingSchema],
  passwordResetToken: String,
  passwordResetExpires: Date,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  // musicPlaylist: [musicSchema],
  // moviePlaylist: [movieSchema],
}, {
  timestamps: true
});


userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
