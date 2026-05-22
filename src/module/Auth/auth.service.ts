import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../DB";
import config from "../../config";
import type { TUserRole } from "./auth.interface";

const signupUser = async (payload: any) => {
    try {
        const validRoles: TUserRole[] = ["contributor", "maintainer"];
        if (payload.role && !validRoles.includes(payload.role)) {
            throw new Error("Invalid role! Role must be 'contributor' or 'maintainer'.");
        }

        const userRole: TUserRole = payload.role || "contributor";
        const hashedPassword = await bcrypt.hash(payload.password, 10);

        const query = `
            INSERT INTO users(name, email, password, role)
            VALUES($1, $2, $3, $4)
            RETURNING id, name, email, role, created_at, updated_at
        `;

        const values = [
            payload.name,
            payload.email,
            hashedPassword,
            userRole,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];

    } catch (error: any) {
        throw new Error(error.message || "Something went wrong during signup.");
    }
};

const loginUser = async (payload: any) => {
  const query = `
    SELECT * FROM users
    WHERE email=$1
  `;

  const result = await pool.query(query, [payload.email]);

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Password does not match");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  // access token
  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    {
      expiresIn: "1d",
    }
  );

  // refresh token
  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: "30d",
    }
  );

  return {
    accessToken,
    refreshToken,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const AuthServices = {
  signupUser,
  loginUser,
};