import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return existingAdmin;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
      isActive: true,
      accountLocked: false,
      loginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("🚀 Admin User Created Successfully");
    console.log("📧 Email: admin@test.com");
    console.log("🔑 Password: Admin@123");
    console.log("🔐 Role: admin");

    return admin;
  } catch (error) {
    console.error("❌ Admin creation error:", error);
    throw error;
  }
};

export default createAdmin;
