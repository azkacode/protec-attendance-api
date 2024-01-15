import AuthController from '../controllers/auth.controller';
import { Request, Response, Router } from 'express';
import EmployeeController from '../controllers/employee.controller';
import AttendanceController from '../controllers/attendance.controller';
import MediaController from '../controllers/media.controller';
import authMiddleware from '../middlewares/auth.middleware';
import multer from 'multer';


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


export const route = (router:Router) => {
  const authCon = new AuthController;
  const empCon = new EmployeeController;
  const mediaCon = new MediaController;
  const attCon = new AttendanceController;
  
  router.get("/api/health", (req:Request, res:Response) => { res.send("OK") });

  // Auth
  router.post("/api/auth/login", authCon.login);

  // Media
  router.post("/api/media/upload",  upload.single('image'), mediaCon.upload);

  // Employee
  router.get("/api/employee/me", authMiddleware, empCon.getDetail);
  router.post("/api/employee/change-photo", authMiddleware, empCon.changeProfile);
  router.post("/api/employee/update-password", authMiddleware, empCon.updatePassword);

  // Attendance
  router.get("/api/attendance/get", authMiddleware, attCon.get);
  router.get("/api/attendance/history", authMiddleware, attCon.history);
  router.get("/api/attendance/report", authMiddleware, attCon.report);
  router.post("/api/attendance/checkin", authMiddleware, attCon.checkIn);
  router.post("/api/attendance/checkout", authMiddleware, attCon.checkOut);

  // Leave
  router.get("/api/leave/get", authMiddleware, empCon.getDetail);
  router.get("/api/leave/report", authMiddleware, empCon.getDetail);
  router.post("/api/leave/request", authMiddleware, empCon.getDetail);




};
