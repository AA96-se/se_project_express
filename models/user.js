const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return validator.isURL(value, {
            protocols: ["http", "https"],
            require_protocol: true,
          });
        },
        message: "You must enter a valid URL (http/https).",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(value) {
          return validator.isEmail(value);
        },
        message: "You must enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      select: false, // <-- Step 9: hide password from query results by default
    },
  },
  { versionKey: false }
);

// Step 9: make sure login can still access the password hash
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password") // explicitly include password for comparison
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
