const { blogs, users } = require("../model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const sendEmail = require("../services/sendOtp");
exports.renderRegister = (req, res) => {
  res.render("auth/register");
};

exports.renderadminDashboard = async (req, res) => {
  const blog = await blogs.findAll();
  res.render("admindashboard", { blog });
};

exports.renderLogin = (req, res) => {
  res.render("auth/login");
};

exports.userRegister = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(200).json({
        message: "All the fields are requried",
      });
    }
    const existingUser = await users.findOne({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        message: "user already registered with this eamil address",
      });
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
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "unable to create user",
    });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "both fields are required",
      });
    }
    const user = await users.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "user not found with this email",
      });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        message: "wrong password",
      });
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
    res.redirect("/blogs");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server error",
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

exports.getForgotPassword = (req, res) => {
  res.render("auth/forgotPassword");
};

exports.postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send("please provide email");
    }

    const existingUser = await users.findOne({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      return res.status(400).send("invalid email address");
    }
    const OTP = Math.floor(100000 + Math.random() * 900000);
    existingUser.otp = OTP;
    existingUser.otpExpiry = Date.now();
    existingUser.save();
    await sendEmail({
      email: email,
      subject: "Forgot Password OTP",
      otp: OTP,
    });
    res.redirect("/verifyOtp");
  } catch (error) {
    console.log(error);
    res.status(500).sen("Server Error");
  }
};
exports.getverifyOtp = (req, res) => {
  res.render("auth/verifyOtp");
};
