import jwt from "jsonwebtoken";

export const generateToken = async(id,name) => {
  return  await jwt.sign({ id,name }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};