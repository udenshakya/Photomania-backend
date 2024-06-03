// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// async function query(sql: string, params?: any[]) {
//   let connection;
//   try {
//     connection = await mysql.createConnection({
//       host: process.env.DB_HOST!,
//       user: process.env.DB_USERNAME!,
//       database: process.env.DB_NAME!,
//       password: process.env.DB_PASSWORD!,
//       port: parseInt(process.env.DB_PORT || "3306"), // Default port is 3306
//     });
//     console.log("Connection successful");

//     const [results] = await connection.query(sql, params);
//     return results;
//   } catch (error) {
//     console.error("Connection error:", error);
//     throw error;
//   } finally {
//     if (connection) {
//       await connection.end();
//     }
//   }
// }

// export { query };
