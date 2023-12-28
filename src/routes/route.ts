import AuthController from '../controllers/auth.controller';
import { Request, Response, Router } from 'express';
import UserController from '../controllers/user.controller';
import MediaController from '../controllers/media.controller';
import authMiddleware from '../middlewares/auth.middleware';
import multer from 'multer';


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


export const route = (router:Router) => {
  const authCon = new AuthController;
  const userCon = new UserController;
  const mediaCon = new MediaController;
  
  router.get("/health", (req:Request, res:Response) => { res.send("OK") });
  // router.post("/api/register", authCon.signup);

  // Auth
  router.post("/api/auth/login", authCon.login);
  router.get("/api/auth/me", authMiddleware, userCon.getDetail);


  // media
  router.post("/api/media/upload",  upload.single('image'), mediaCon.upload);
};
