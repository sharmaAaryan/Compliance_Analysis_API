import jwt from "jsonwebtoken";

export const generateToken = async(id,name,role) => {
  return  await jwt.sign({ id,name,role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};