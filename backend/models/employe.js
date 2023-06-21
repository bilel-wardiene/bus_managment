var mongoose = require("mongoose");
const crypto = require("crypto");
const Itinerary = require("./itinerary");

var EmployeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    itinerary:[ {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerary",
      
      
    },],
    

    role: {
      type: String,
      enum: ["employe", "client", "admin"],
      default: "employe",
    },
    needsAuthentication: Boolean,
    isBlocked: Boolean,
    photo: {
      type: String,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Espace",
    },
    hashed_password: { type: String, required: true },
    salt: String,
    registrationNumber: String,
    telephone: Number,
    last_connection: String,
    old_password: String,
    old_salt: String,
    refreshToken: String,
    refreshWebToken: String,
  },

  {
    timestamps: true,
  },
);
EmployeSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.old_salt = this.salt;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
EmployeSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  authenticate_old_password: function (plainText) {
    return this.encryptPassword(plainText) === this.old_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  encryptOldPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.old_salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
  getResetPasswordToken: function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    //hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    //set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
  },
};

EmployeSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Employe", EmployeSchema);
