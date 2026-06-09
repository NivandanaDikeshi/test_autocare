import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
    },
    SECRET,
    {
      expiresIn: "7d",
    }
  );
};