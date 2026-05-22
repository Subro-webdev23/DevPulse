import { pool } from "../../DB";
import type { Issue } from "./issue.interface";

const getAllIssueFromDB = async () => {
  try {
    const issueResult = await pool.query(`SELECT * FROM issues`);
    const issues = issueResult.rows;

    if (issues.length === 0) return [];

    const reporterIds = [...new Set(issues.map(issue => issue.reporter_id).filter(id => id !== null))];

    if (reporterIds.length === 0) {
      return issues.map(issue => ({ ...issue, reporter: null }));
    }

    const userResult = await pool.query(
      `SELECT id, name, role FROM users WHERE id = ANY($1)`,
      [reporterIds]
    );
    const users = userResult.rows;
    const userMap = users.reduce((acc: any, user: any) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const formattedIssues = issues.map((issue: any) => {
      const reporterData = userMap[issue.reporter_id];
      
      const { reporter_id, ...issueWithoutReporterId } = issue;

      return {
        ...issueWithoutReporterId,
        reporter: reporterData ? {
          id: reporterData.id,
          name: reporterData.name,
          role: reporterData.role
        } : null
      };
    });

    return formattedIssues;
  } catch (error: any) {
    console.error(error);
    throw error;
  }  
};

const getReporterfromDB = async (id:string)=>{
  if (!id || id.trim() === "" || id === "null") {
    throw new Error("Cannot query or create a reporter without a valid ID.");
  }
  try {
    
    const result = await pool.query(`SELECT id,name,role FROM users WHERE ID = $1`, [id]);
    if (result.rows.length === 0) {
      throw new Error("Action denied: Only existing database IDs are allowed to create items.");
    }
    return result.rows[0]
  } catch (error:any) {
      console.error(error);
      throw error;
  }
}

const getSingleIssueFromDB = async (issueId: string | number) => {
  try {
    console.log(`Fetching Single Issue without JOIN. ID: ${issueId}`);  

    const issueResult = await pool.query(
      `SELECT * FROM issues WHERE id = $1`, 
      [issueId]
    );

    if (issueResult.rows.length === 0) {
      return null;
    }

    const issue = issueResult.rows[0];

    if (issue.reporter_id) {
      const userResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [issue.reporter_id]
      );

      const reporterData = userResult.rows[0];

      const { reporter_id, ...issueWithoutReporterId } = issue;

      return {
        ...issueWithoutReporterId,
        reporter: reporterData ? {
          id: reporterData.id,
          name: reporterData.name,
          role: reporterData.role
        } : null 
      };
    }

    const { reporter_id, ...issueWithoutReporterId } = issue;
    return {
      ...issueWithoutReporterId,
      reporter: null
    };

  } catch (error: any) {
    console.error("Error in getSingleIssueFromDB:", error);
    throw error;
  }  
};


const createIssueIntoDB = async (payload: Issue, reporterId: string) => {
    try {
        const { title, description, type, status } = payload;

        const result = await pool.query(
            `INSERT INTO issues (title, description, type, status, reporter_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, title, description, type, status, reporter_id, created_at;`,
            [title, description, type, status, reporterId]
        );

        return result.rows[0]; 
    } catch (error) {
        console.error('Error creating issue in DB:', error);
        throw error;
    }
};


const updateIssueFromDB = async (issueId: string | number, updateData: Record<string, any>) => {
  try {
    console.log(`Updating Issue in DB with ID: ${issueId}`);  

    const keys = Object.keys(updateData);
    if (keys.length === 0) {
      throw new Error("No data provided for update");
    }

    const setQuery = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const queryValues = Object.values(updateData);
    queryValues.push(issueId); 

    const query = `
      UPDATE issues 
      SET ${setQuery} 
      WHERE id = $${queryValues.length} 
      RETURNING *;
    `;

    const result = await pool.query(query, queryValues);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error: any) {
    console.error("Error in updateIssueFromDB:", error);
    throw error;
  }  
};


const deleteIssueFromDB = async (issueId: string | number) => {
  try {     
    const result = await pool.query(`DELETE FROM issues WHERE id = $1 RETURNING *`, [issueId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error: any) {
    console.error("Error in deleteIssueFromDB:", error);
    throw error;
  }  
};


export const issueService = {
  createIssueIntoDB,
  getAllIssueFromDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
  deleteIssueFromDB,
  getReporterfromDB
}