import type { Request, Response } from "express";
import { AuthServices } from "./auth.service";


export const signup = async (req: Request, res: Response) => {
    try {
        const newUser = await AuthServices.signupUser(req.body);
        
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });

    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "Registration failed",
            data: null
        });
    }
};


const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthServices.loginUser(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",

      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const AuthControllers = {
  signup,
  login,
};