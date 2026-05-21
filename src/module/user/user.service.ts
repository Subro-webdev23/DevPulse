import { pool } from "../../DB";
import type { User } from "./user.interface";
import bcrypt from "bcrypt";

const getAllUserFromDB = async()=>{
    try {
      const result = await pool.query('SELECT id, name, email, role, created_at, updated_at FROM users;');
      return result.rows; 
    } catch (error) {
      console.error('Error fetching users from DB:', error);
      throw error;
    }
}

const getSingleUserFromDB = async(id: string)=>{
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
    delete result.rows[0].password;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching single user from DB:', error);
    throw error;
  }
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

const updateUserFromDB = async (id: string, updateData: User) => {
    try {        
      const {name, password, role} = updateData;
        const result = await pool.query(
        `
          UPDATE users 
          SET 
          name=COALESCE($1,name),
          password=COALESCE($2,password),
          role=COALESCE($3,role)

          WHERE id=$4 RETURNING name, role, email
        `,
          [name, password, role, id],
        );
      return result.rows[0];

    } catch (error) {
        console.error('Error updating user in DB:', error);
        throw error;
    }
};

const deleteUserFromDB = async (id: string) => {
    try {       
        const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *;`, [id]);
        return result.rows || null;

    } catch (error : any) {
        console.error('Error deleting user from DB:', error);
        throw error;
    }
};

export const userService = {
  createUserIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB
}