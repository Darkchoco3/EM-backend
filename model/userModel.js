const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt= require ("jsonwebtoken");

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: [true, 'username already in use'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Email address is required'],
      unique: [true, 'Email already in use'],
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Please enter a password'],
      minlength: [8, 'Minimum password should be 8 character'],
    },
    profilePhoto: {
      type: String,
      default:
        'https://www.istockphoto.com/vector/friends-characters-people-holding-hands-hugging-each-other-and-standing-together-gm1174348875-326567582',
    },
    bio: {
      type: String,
      default: 'Hi, I am new here...',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    location: {
      type: String,
    },
    occupation: {
      type: String,
    },
    x: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// hashing passsword
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// password comparison
userSchema.methods.comparePassword = async function 
(userPassword){
    const isCorrect = await bcrypt.compare(userPassword,this.password);
    return isCorrect;
}
// generate jwt token

userSchema.methods.generateToken = async function (params) {
    let token = jwt.sign({userId:this._id,userName:this.userName},process.env.JWT_SECRET);
    return token;
  };

const USER = mongoose.model('User', userSchema);

module.exports = USER;