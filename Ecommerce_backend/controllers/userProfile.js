const User = require("../models/User");
exports.getProfile = async (req, res) => {
    const user =
    await User.findById(
      req.user._id
    ).select("-password");
  res.json(user);
};

exports.updateProfile = async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true
      }
    ).select("-password");
  res.json(user);
};

exports.deleteProfile = async (req, res) => {
  await User.findByIdAndDelete(
    req.user._id
  );
  res.json({
    message:
      "Profile Deleted"
  });
};

