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
    const isMatched = bcrypt.compareSync(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        message: "wrong password",
      });
    }
    return res.status(200).json({
      message: "User Logged in",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server error",
    });
  }
};
