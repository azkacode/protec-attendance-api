import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel from '../models/user.model';

export default class AuthController  {
  async login(req:Request, res:Response){
    const { email, password } = req.body;
    try {
      // check credentials
      const userModel = new UserModel;
      const user = await userModel.customerDetail(email);
      if(!user) throw new Error("Email is not found, please register!");

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) throw new Error("Password does not match!");

      const payload = { id: user.id, email : user.email };

      jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration }, (error, token) => {
        if (error) throw error;
        return res.json({ token });
      });
    } catch (error:any) {
      console.log(error);
      res.status(500).json(error.message);
    }
  }
  // async signup(req:Request, res:Response){
  //   const {
  //     name, email, password, passwordConfirm
  //   } = req.body
  //   try {
  //     if(!name || !email || !password || !passwordConfirm) throw new Error('item required!');
  //     if(password !== passwordConfirm) throw new Error('Password and Password Confirm should be same!');
  //     const userModel = new UserModel;
  //     const user = await userModel.customerDetail(email);
  //     if(user) throw new Error('Already registered!');
  //     const hashedPassword = await bcrypt.hash(password, 0);
  //     await userModel.signup({
  //       name, email, password : hashedPassword,
  //     });
  //     return res.json({ message : 'Register Success' });
  //   } catch (error:any) {
  //     console.error(error);
  //     res.status(500).json({message : error.message });
  //   }
  // }
}
