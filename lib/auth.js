import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "autocare_secret_key";

export const generateToken = (entity) => {
  return jwt.sign(
    {
      id: entity._id || entity.id,
      email: entity.email,
      role: entity.role || "admin",
      name: entity.name || entity.fullName || "",
      phone: entity.phone || "",
    },
    SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id || admin.id,
      email: admin.email,
      role: "admin",
    },
    SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const generateUserToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: "customer",
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