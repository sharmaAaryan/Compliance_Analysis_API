import jwt from "jsonwebtoken";
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({
        messsage: "Invalid Token",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default protect;

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
    next();
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};