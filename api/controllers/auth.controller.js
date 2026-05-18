import { generateToken } from "../../utils/genToken.js";
import { Auth } from "../models/auth.schema.js";

export const signup = async (req, res, next) => {
  try {
    const { userName, email, password, role } = req.body;
    if (!userName || !password || !email) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const isuserExist = await Auth.findOne({ email: email });
    if (isuserExist) {
      return res.status(400).json({
        message: "email is already exist",
      });
    }
    const user = await Auth.create({
      email,
      userName,
      password,
      role,
    });
    return res.status(201).json({
      message: "Registered Successfully",
      data: user._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All files are required",
      });
    }
    const user = await Auth.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "emil not found",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    //token generation
    const token = await generateToken(user._id,user.userName,user.role);
    console.log(token);

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })

      .status(200)
      .json({
        message: "Signin succesfull",
        data: user._id,
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const me = async (req, res, next) => {
  try {
    // req.user is populated by the protect middleware
    const user = await Auth.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User fetched successfully",
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res, next) => {
  try {
    return res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "strict",
        secure: false,
      })
      .status(200)
      .json({
        message: "Logged out successfully",
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
