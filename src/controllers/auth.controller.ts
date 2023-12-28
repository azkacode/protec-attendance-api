import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import EmployeeModel from '../models/employee.model';

export default class AuthController  {
  async login(req:Request, res:Response){
    const { email, password } = req.body;
    try {
      // check credentials
      const employeeModel = new EmployeeModel;
      const user = await employeeModel.employeeDetail(email);
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
      res.status(500).json({message : error.message});
    }
  }
}
