import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { PatientController } from '../controllers/patientController';
import { VitalsController } from '../controllers/vitalsController';
import { LabsController } from '../controllers/labsController';
import { PredictionController } from '../controllers/predictionController';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'SepsisSense AI Enterprise Backend v3.2',
    timestamp: new Date().toISOString()
  });
});

// Authentication API
router.post('/auth/login', AuthController.login);
router.post('/auth/create-account', AuthController.createAccount);
router.post('/auth/register-hospital', AuthController.registerHospital);
router.post('/auth/refresh-token', AuthController.refreshToken);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/create-staff-account', authenticateJWT, authorizeRoles('ADMIN'), AuthController.createStaffAccount);
router.patch('/auth/staff-status', authenticateJWT, authorizeRoles('ADMIN'), AuthController.toggleStaffStatus);
router.post('/auth/reset-staff-password', authenticateJWT, authorizeRoles('ADMIN'), AuthController.resetStaffPassword);
router.get('/auth/staff-roster', authenticateJWT, authorizeRoles('ADMIN'), AuthController.getStaffRoster);
router.get('/auth/me', authenticateJWT, AuthController.me);

// Patient Management API
router.get('/patients', authenticateJWT, PatientController.getAll);
router.get('/patients/:id', authenticateJWT, PatientController.getById);
router.post('/patients', authenticateJWT, authorizeRoles('ADMIN', 'DOCTOR', 'NURSE'), PatientController.create);

// Vitals Signs API
router.post('/vitals', authenticateJWT, authorizeRoles('NURSE', 'DOCTOR', 'ADMIN'), VitalsController.addVitals);
router.get('/vitals/history', authenticateJWT, VitalsController.getHistory);

// Laboratory API
router.post('/labs', authenticateJWT, authorizeRoles('LAB_TECH', 'DOCTOR', 'ADMIN'), LabsController.addLabResult);

// AI Sepsis Prediction API (POST /predict)
router.post('/predict', authenticateJWT, PredictionController.predict);

// Hospital Analytics & Metrics API
router.get('/analytics/hospital', authenticateJWT, AnalyticsController.getHospitalMetrics);

export default router;
