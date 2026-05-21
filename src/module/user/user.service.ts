import { pool } from "../../DB";
import type { User } from "./user.interface";
import bcrypt from "bcrypt";

const getAllUserFromDB = async()=>{
  console.log("Get All User From DB");  
}

const getSingleUserFromDB = async()=>{
  console.log("Get All User From DB");  
}

const createUserIntoDB = async(payload: User)=>{
    const {name, email, password, role} = payload;
    const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at
        `,
        [name, email, hashedPassword, role ?? "contributor"]
    );
     return result.rows[0];
}

const updateUserFromDB = async()=>{
  console.log("Get All User From DB");  
}

const deleteUserFromDB = async()=>{
  console.log("Get All User From DB");  
}

export const userService = {
  createUserIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB
}