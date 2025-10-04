const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../db/redis");
const { publishToQueue } = require("../broker/broker");

async function registerUser(req, res) {
  try {
    const {
      username,
      email,
      password,
      fullName: { firstName, lastName },
      role,
    } = req.body;

    const isUserAlreadyExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExist) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
      fullName: { firstName, lastName },
      role: role || "user",
    });

    // publish user created event to rabbitmq (with promise.all to optimized it)
    await Promise.all([
      publishToQueue("AUTH_NOTIFICATION.USER_CREATED", {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      }),
      publishToQueue("AUTH_SELLER_DASHBOARD.USER_CREATED", user),
    ]);

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "User registered succesfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.log("registerUserController error : ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await userModel
      .findOne({ $or: [{ email }, { username }] })
      .select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.log("loginUser error: ", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
}

async function getCurrentUser(req, res) {
  return res
    .status(200)
    .json({ message: "User fetched succesfully", user: req.user });
}

async function logoutUser(req, res) {
  const token = req.cookies.token;

  if (token) {
    await redis.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60); //expire in 1 day
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({ message: "Logged out Successfully" });
}

async function getUserAddress(req, res) {
  const id = req.user.id;

  const user = await userModel.findById(id).select("addresses");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    message: "User addreses fetched succesfully",
    addresses: user.addresses,
  });
}

async function addUserAddress(req, res) {
  const id = req.user.id;

  const { street, city, state, zip, country, isDefault } = req.body;

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        street,
        city,
        state,
        zip,
        country,
        isDefault,
      },
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(201).json({
    message: "Address added succesfully",
    address: user.addresses[user.addresses.length - 1],
  });
}

async function deleteUserAddress(req, res) {
  const id = req.user.id;

  const { addressId } = req.params;

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      $pull: {
        addresses: { _id: addressId },
      },
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const addressExists = user.addresses.some(
    (addr) => addr._id.toString() === addressId
  );

  if (addressExists) {
    return res.status(404).json({ message: "Failed to delete address" });
  }

  return res.status(200).json({
    message: "Address deleted succesfully",
    addresses: user.addresses,
  });
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getUserAddress,
  addUserAddress,
  deleteUserAddress,
};
