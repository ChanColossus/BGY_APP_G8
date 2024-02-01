const User = require("../models/user");

const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res, next) => {
  console.log(req.body.avatar)

  const result = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: 'avatars',
    width: 150,
    crop: "scale"
  }, (err, res) => {
    console.log(err, res);
  });
  const { name, email, password, role, contact } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    contact,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url
    },

    role,
  })

  // const token = user.getJwtToken();
  if (!user) {
    return res.status(500).json({
      success: false,
      message: 'user not created'
    })
  }
  sendToken(user, 200, res)

}

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter email & password' })
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return res.status(401).json({ message: 'Invalid Email or Password' })
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(401).json({ message: 'Invalid Email or Password' })
  }
  sendToken(user, 200, res)
}

exports.logout = async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: 'Logged out'
  })
}

// exports.forgotPassword = async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });
//   console.log(req.body.email);
//   if (!user) {
//     return res.status(404).json({ error: "User not found with this email" });

//   }

//   const resetToken = user.getResetPasswordToken();
//   await user.save({ validateBeforeSave: false });


//   const resetUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;
//   const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Myrmidons Password Recovery",
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Email sent to: ${user.email}`,
//     });
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     return res.status(500).json({ error: error.message });

//   }
// };

// exports.resetPassword = async (req, res, next) => {
//   // Hash URL token
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");
//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return res
//       .status(400)
//       .json({ message: "Password reset token is invalid or has been expired" });

//   }

//   if (req.body.password !== req.body.confirmPassword) {
//     return res.status(400).json({ message: "Password does not match" });

//   }


//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();
//   sendToken(user, 200, res);
// };