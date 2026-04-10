import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }
    console.log(decoded, "test");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
