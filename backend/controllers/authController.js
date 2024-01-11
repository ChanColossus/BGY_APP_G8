const User = require("../models/user");
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res, next) => {
    const result = await cloudinary.v2.uploader.upload(
      req.body.avatar,
      {
        folder: "profiles",
        width: 200,
        crop: "scale",
      },
      (err, res) => {
        console.log(err, res);
      }
    );
  
    const { name, email, password, role } = req.body;
  
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: result.public_id,
        url: result.url,
      },
    });
  
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to create an account",
      });
    }
  
    sendToken(user, 200, res);
  };