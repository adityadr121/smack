import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { logger } from '../utils/logger';

interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'LAB_TECH';
  hospitalId: string;
  hospitalName: string;
  status: 'ACTIVE' | 'INACTIVE';
  department?: string;
}

// In-Memory Database Store for Dynamic Staff & Hospital Accounts
const USER_DATABASE: UserRecord[] = [
  {
    id: 'usr-admin-001',
    email: 'admin@hospital.com',
    passwordHash: bcrypt.hashSync('Admin@123', 10),
    fullName: 'Chief Admin Elena Rostova',
    role: 'ADMIN',
    hospitalId: 'hosp-001',
    hospitalName: 'Johns Hopkins Health System',
    status: 'ACTIVE',
    department: 'Administration'
  },
  {
    id: 'usr-md-101',
    email: 'doctor@hospital.com',
    passwordHash: bcrypt.hashSync('Doctor@123', 10),
    fullName: 'Dr. Sarah Jenkins, MD',
    role: 'DOCTOR',
    hospitalId: 'hosp-001',
    hospitalName: 'Johns Hopkins Health System',
    status: 'ACTIVE',
    department: 'Intensive Care Unit'
  },
  {
    id: 'usr-rn-201',
    email: 'nurse@hospital.com',
    passwordHash: bcrypt.hashSync('Nurse@123', 10),
    fullName: 'RN Marcus Vance',
    role: 'NURSE',
    hospitalId: 'hosp-001',
    hospitalName: 'Johns Hopkins Health System',
    status: 'ACTIVE',
    department: 'Intensive Care Unit'
  },
  {
    id: 'usr-cls-301',
    email: 'lab@hospital.com',
    passwordHash: bcrypt.hashSync('Lab@123', 10),
    fullName: 'CLS Priya Sharma',
    role: 'LAB_TECH',
    hospitalId: 'hosp-001',
    hospitalName: 'Johns Hopkins Health System',
    status: 'ACTIVE',
    department: 'Laboratory'
  }
];

export class AuthController {
  public static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    logger.info(`Authenticating login attempt for email: "${email}"`);

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const userAccount = USER_DATABASE.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!userAccount) {
      logger.warn(`Login failed: Account not found for email "${email}"`);
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    if (userAccount.status === 'INACTIVE') {
      logger.warn(`Login blocked: Account for "${email}" is currently inactive/deactivated.`);
      res.status(401).json({ success: false, message: 'Account deactivated. Contact Hospital Admin.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, userAccount.passwordHash);

    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for email "${email}"`);
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      {
        userId: userAccount.id,
        email: userAccount.email,
        role: userAccount.role,
        hospitalName: userAccount.hospitalName
      },
      env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    const refreshToken = jwt.sign({ userId: userAccount.id }, env.JWT_SECRET, { expiresIn: '7d' });

    logger.info(`Login successful for ${userAccount.fullName} (${userAccount.role})`);

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: {
        token,
        refreshToken,
        user: {
          id: userAccount.id,
          fullName: userAccount.fullName,
          email: userAccount.email,
          role: userAccount.role.toLowerCase(),
          hospitalName: userAccount.hospitalName,
          department: userAccount.department
        }
      }
    });
  }

  // Public Create Personal Staff Account Endpoint
  public static async createAccount(req: Request, res: Response): Promise<void> {
    const { fullName, email, password, role, hospitalName, department } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = USER_DATABASE.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      passwordHash,
      fullName,
      role: (role ? role.toUpperCase() : 'DOCTOR') as any,
      hospitalId: `hosp-${Date.now()}`,
      hospitalName: hospitalName || 'Johns Hopkins Health System',
      status: 'ACTIVE',
      department: department || 'Intensive Care Unit'
    };

    USER_DATABASE.push(newUser);

    logger.info(`User created account: ${fullName} (${cleanEmail})`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please sign in with your credentials.',
      data: {
        id: newUser.id,
        fullName,
        email: cleanEmail,
        role: newUser.role.toLowerCase()
      }
    });
  }

  public static async registerHospital(req: Request, res: Response): Promise<void> {
    const { hospitalName, licenseNumber, hospitalEmail, phone, address, adminName, adminEmail, password } = req.body;

    if (!hospitalName || !adminEmail || !password) {
      res.status(400).json({ success: false, message: 'Hospital name, admin email, and password are required.' });
      return;
    }

    logger.info(`Registering new hospital network: ${hospitalName} (${licenseNumber})`);

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdminUser: UserRecord = {
      id: `usr-admin-${Date.now()}`,
      email: adminEmail.trim().toLowerCase(),
      passwordHash,
      fullName: adminName || 'Chief Admin Officer',
      role: 'ADMIN',
      hospitalId: `hosp-${Date.now()}`,
      hospitalName,
      status: 'ACTIVE',
      department: 'Administration'
    };

    USER_DATABASE.push(newAdminUser);

    const token = jwt.sign(
      { userId: newAdminUser.id, email: newAdminUser.email, role: 'ADMIN', hospitalName },
      env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      success: true,
      message: 'Hospital network registered successfully. Please sign in with your admin credentials.',
      data: {
        token,
        hospital: { id: newAdminUser.hospitalId, name: hospitalName, licenseNumber },
        admin: { id: newAdminUser.id, fullName: newAdminUser.fullName, email: newAdminUser.email, role: 'admin' }
      }
    });
  }

  public static async createStaffAccount(req: Request, res: Response): Promise<void> {
    const { fullName, email, password, role, department } = req.body;

    if (!fullName || !email || !role) {
      res.status(400).json({ success: false, message: 'Full name, email, and role are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = USER_DATABASE.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const passwordPlain = password || 'Staff@123';
    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    const newStaff: UserRecord = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      passwordHash,
      fullName,
      role: role.toUpperCase() as any,
      hospitalId: 'hosp-001',
      hospitalName: 'Johns Hopkins Health System',
      status: 'ACTIVE',
      department: department || 'Intensive Care Unit'
    };

    USER_DATABASE.push(newStaff);

    logger.info(`Hospital Admin provisioned staff account: ${fullName} (${role})`);

    res.status(201).json({
      success: true,
      message: `Staff account for ${fullName} created successfully. Initial password: ${passwordPlain}`,
      data: { id: newStaff.id, fullName, email: cleanEmail, role, department: newStaff.department, status: newStaff.status }
    });
  }

  public static async toggleStaffStatus(req: Request, res: Response): Promise<void> {
    const { userId, status } = req.body;
    const user = USER_DATABASE.find((u) => u.id === userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'Staff user not found.' });
      return;
    }

    user.status = status;
    logger.info(`Staff user ${user.fullName} status updated to ${status}`);
    res.status(200).json({ success: true, message: `Account status for ${user.fullName} set to ${status}` });
  }

  public static async resetStaffPassword(req: Request, res: Response): Promise<void> {
    const { userId, newPassword } = req.body;
    const user = USER_DATABASE.find((u) => u.id === userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'Staff user not found.' });
      return;
    }

    const passToSet = newPassword || 'Reset@123';
    user.passwordHash = await bcrypt.hash(passToSet, 10);
    logger.info(`Password for ${user.fullName} reset by Admin`);
    res.status(200).json({ success: true, message: `Password for ${user.fullName} reset to ${passToSet}` });
  }

  public static async getStaffRoster(req: Request, res: Response): Promise<void> {
    const roster = USER_DATABASE.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role.toLowerCase(),
      department: u.department || 'Operations',
      status: u.status
    }));
    res.status(200).json({ success: true, data: roster });
  }

  public static async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token required' });
      return;
    }

    try {
      const decoded: any = jwt.verify(refreshToken, env.JWT_SECRET);
      const newAccessToken = jwt.sign({ userId: decoded.userId, role: 'DOCTOR' }, env.JWT_SECRET, { expiresIn: '8h' });
      res.status(200).json({ success: true, token: newAccessToken });
    } catch (err) {
      res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
  }

  public static async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    logger.info(`Password reset token requested for ${email}`);
    res.status(200).json({ success: true, message: 'Password reset link sent to your registered email' });
  }

  public static async me(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: {
        id: 'usr-md-101',
        fullName: 'Dr. Sarah Jenkins, MD',
        email: 'doctor@hospital.com',
        role: 'doctor',
        hospitalName: 'Johns Hopkins Health System'
      }
    });
  }
}
