/**
 * Seed script to create the initial admin user.
 *
 * Usage:
 *   node scripts/seed-admin.js
 *
 * Make sure you have:
 *   1. Run init_mysql.sql first to create the database and tables
 *   2. Set the environment variables (or edit the defaults below)
 */

const mysql = require("mysql2/promise")
const bcrypt = require("bcryptjs")

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "root",
    database: process.env.MYSQL_DATABASE || "finix_cnc",
  })

  const email = "admin@example.com"
  const password = "admin@123"
  const name = "Admin"

  const hash = await bcrypt.hash(password, 12)

  try {
    // Check if admin already exists
    const [existing] = await connection.execute("SELECT id FROM admins WHERE email = ?", [email])

    if (Array.isArray(existing) && existing.length > 0) {
      console.log(`Admin user with email "${email}" already exists. Skipping.`)
    } else {
      await connection.execute(
        "INSERT INTO admins (id, email, password_hash, name) VALUES (UUID(), ?, ?, ?)",
        [email, hash, name]
      )
      console.log(`Admin user created successfully!`)
      console.log(`  Email: ${email}`)
      console.log(`  Password: ${password}`)
    }
  } catch (err) {
    console.error("Error seeding admin:", err.message)
  } finally {
    await connection.end()
  }
}

seed()
