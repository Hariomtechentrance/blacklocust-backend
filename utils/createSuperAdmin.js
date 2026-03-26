import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const createSuperAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'super admin' });

    if (existingAdmin) {
      console.log("✅ Super admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Super Admin",
      email: "superadmin@blacklocust.com",
      password: hashedPassword,
      role: "super admin",
      isEmailVerified: true,
      isActive: true,
      accountLocked: false,
      loginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("🚀 Super Admin Created Successfully");
    console.log("📧 Email: superadmin@blacklocust.com");
    console.log("🔑 Password: Admin@123");
  } catch (error) {
    console.error("❌ Super admin creation error:", error);
  }
};

export default createSuperAdmin;
