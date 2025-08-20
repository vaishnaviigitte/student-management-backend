const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    const {
      fullName,
      email,
      address,
      contactNumber,
      preQualification,
      tenthMarks,
      twelthMarks,
      cgpa,
      certifications,
    } = req.body;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (address) user.address = address;
    if (contactNumber) user.contactNumber = contactNumber;
    if (preQualification) user.preQualification = preQualification;
    if (tenthMarks) user.tenthMarks = tenthMarks;
    if (twelthMarks) user.twelthMarks = twelthMarks;
    if (cgpa) user.cgpa = cgpa;
    if (certifications) user.certifications = certifications;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      address: updatedUser.address,
      contactNumber: updatedUser.contactNumber,
      preQualification: updatedUser.preQualification,
      tenthMarks: updatedUser.tenthMarks,
      twelthMarks: updatedUser.twelthMarks,
      cgpa: updatedUser.cgpa,
      certifications: updatedUser.certifications,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};