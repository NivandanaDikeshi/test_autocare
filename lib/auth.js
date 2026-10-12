import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "autocare_secret_key";

export const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id || admin.id,
      email: admin.email,
      role: admin.role || "admin",
    },
    SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};