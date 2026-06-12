const { blogs, users } = require("../model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const sendEmail = require("../services/sendOtp");

exports.renderadminDashboard = async (req, res) => {
  const blog = await blogs.findAll();
  const error = req.flash("error");
  const success = req.flash("success");
  res.render("admindashboard", { blog, error, success });
};

exports.renderLogin = (req, res) => {
  const error = req.flash("error");

  const success = req.flash("success");

  res.render("auth/login", { error, success });
};
exports.renderRegister = (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  res.render("auth/register", { error, success });
};
exports.userRegister = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!firstName || !lastName || !userName || !email || !password) {
      // return res.status(200).json({
      //   message: "All the fields are requried",
      // });
      req.flash("error", "All The Fields are required");
      return res.redirect("/register");
    }
    const existingUser = await users.findOne({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      // return res.status(400).json({
      //   message: "user already registered with this eamil address",
      // });
      req.flash("error", "User already registered with this email address");
      return res.redirect("/register");
    }
    const newUser = await users.create({
      firstName,
      lastName,
      userName,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    // res.status(200).json({
    //   message: "user created ",
    // });
    req.flash("success", "User Registration Complete");
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    // res.status(400).json({
    //   message: "unable to create user",
    // });
    req.flash("error", "Unable to Register User");
    return res.redirect("/register");
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // return res.status(400).json({
      //   message: "both fields are required",
      // });
      req.flash("error", "Both fields are required");
      return res.redirect("/login");
    }
    const user = await users.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      // return res.status(400).json({
      //   message: "user not found with this email",
      // });
      req.flash("error", "User not found with this email");
      return res.redirect("/login");
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      // return res.status(401).json({
      //   message: "wrong password",
      // });
      req.flash("error", "Wrong Password !!");
      return res.redirect("/login");
    }
    const token = jwt.sign(
      { id: user.id, userEmail: user.email },
      process.env.JWT_SECRETKEY,
      { expiresIn: "1d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    // console.log(token);
    // return res.status(200).json({
    //   message: "User Logged in",
    // });
    req.flash("success", "User Logged In");
    return res.redirect("/blogs");
  } catch (error) {
    console.log(error);
    // res.status(500).json({
    //   message: "server error",
    // });
    req.flash("error", "Server Error");
    return res.redirect("/login");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
};

exports.getForgotPassword = (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  res.render("auth/forgotPassword", { success, error });
};

exports.postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      // return res.send("please provide email");
      req.flash("error", "Please Provide an email");
      return res.redirect("/forgotPassword");
    }

    const existingUser = await users.findOne({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      // return res.status(400).send("invalid email address");
      req.flash("error", "Invalid email");
      return res.redirect("/forgotPassword");
    }
    const OTP = Math.floor(100000 + Math.random() * 900000);
    existingUser.otp = OTP;
    existingUser.otpExpiry = Date.now();
    existingUser.isOtpverified = false;
    await existingUser.save();
    await sendEmail({
      email: email,
      subject: "Forgot Password OTP",
      otp: OTP,
    });
    req.flash("success", "OTP sent to your gmail");
    return res.redirect("/verifyOtp?email=" + email);
  } catch (error) {
    console.log(error);
    // res.status(500).send("Server Error");
    req.flash("error", "Server Error");
    return res.redirect("/forgotPassword");
  }
};
exports.getverifyOtp = (req, res) => {
  const email = req.query.email;
  const error = req.flash("error");
  const success = req.flash("success");
  res.render("auth/verifyOtp", { email: email, error, success });
};
exports.verifyOtp = async (req, res) => {
  try {
    const otp = req.body.otp;
    const email = req.params.id;

    if (!otp || !email) {
      // return res.send("You need to provide email and otp");
      req.flash("error", "You need to provide otp and email");
      return res.redirect("/verifyOtp");
    }
    const user = await users.findOne({
      where: {
        email: email,
        otp: otp,
      },
    });
    if (!user) {
      // return res.send("Invalid Otp");
      req.flash("error", "Invalide OTP");
      return res.redirect("/verifyOtp");
    } else {
      const currentTime = Date.now();
      const expiryTime = user.otpExpiry;
      if (currentTime - expiryTime >= 2 * 60 * 1000) {
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        // res.send("Your Otp is expired");
        req.flash("error", "Your OTP is expired");
        return res.redirect("/verifyOtp");
      } else {
        // res.send("OTP verified");
        user.isOtpverified = true;
        await user.save();
        req.flash("success", "OTP Verfied");
        return res.redirect("/changePassword?email=" + email);
      }
    }
  } catch (error) {
    console.log(error);
    // res.send("Server Error");
    req.flash("error", "Server Errror");
    return res.redirect("/verifyOtp");
  }
};

exports.getChangePassword = (req, res) => {
  const email = req.query.email;
  const error = req.flash("error");
  const success = req.flash("success");
  res.render("auth/changePassword", { email: email, error, success });
};

exports.handleChangePassword = async (req, res) => {
  try {
    const { email, newPassword, newConfirmPassword } = req.body;
    if (!email || !newPassword || !newConfirmPassword) {
      // return res.send("Please provide email, newPassword and ConfirmPassowrd");
      req.flash("error", "All the feilds are required");
      return res.redirect("/changePassword");
    }
    if (newPassword !== newConfirmPassword) {
      // return res.send("Your password and confirm password is not matching");
      req.flash("error", "password and confirm password do not match");
      return res.redirect("/changePassword");
    }
    const user = await users.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      // return res.send("User do not found");
      req.flash("error", "User is not Found");
      return res.redirect("/changePassword");
    }
    if (!user.isOtpverified) {
      return res.send("Please verify OTP at first");
    }
    user.password = bcrypt.hashSync(newPassword, 8);
    user.otp = null;
    user.otpExpiry = null;
    user.isOtpverified = false;
    await user.save();
    req.flash("success", "Password Changed");
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    // res.status(500).send("Server Error");
    req.flash("error", "Server Error");
    return res.redirect("/changePassword");
  }
};
