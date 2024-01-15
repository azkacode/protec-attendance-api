import { isThisTypeNode } from 'typescript';
import EmployeeModel from '../models/employee.model';
import bcrypt from 'bcryptjs';

export default class UserController
{
  async getDetail(req:any, res:any) {
    try {
      const employeeModel = new EmployeeModel;
      const employeeDetail = await employeeModel.employeeDetail(req.data.email);
      if(!employeeDetail) throw new Error("Not Found");
      employeeDetail.warehouse = await employeeModel.warehouseDetail(employeeDetail.warehouse_id);
      employeeDetail.working_hour = await employeeModel.workingHourDetail(employeeDetail.working_hour_id);
      return res.json(employeeDetail);
    } catch (error:any) {
      console.error(error);
      return res.status(500).json(error.message);
    }
  }
  async changeProfile(req:any, res:any) {
    try {
      const employeeModel = new EmployeeModel;
      const employeeData = await employeeModel.changeImage(req.body.url, req.data.id);
      if(!employeeData) throw new Error("Not Found");
      return res.json({ status : "ok" });
    } catch (error:any) {
      console.error(error);
      return res.status(500).json(error.message);
    }
  }
  async updatePassword(req:any, res:any) {
    try {
      const { old_password, new_password, confirm_password } = req.body;
      if(new_password !== confirm_password) {
        throw new Error("Konfirmasi password baru tidak sama");
      }
      const employeeModel = new EmployeeModel;
      const user = await employeeModel.employeeDetail(req.data.email);
      const isMatch = await bcrypt.compare(old_password, user.password);
      if(!isMatch) throw new Error("Password lama tidak tepat");
      let hash : any = await new Promise((resolve, reject) => {
        bcrypt.hash(new_password, 10, function(err, hash) {
          if (err) reject(err);
          resolve(hash);
        });
      })
      await employeeModel.updatePass(hash, req.data.id);
      return res.json({ status : "ok" });
    } catch (error:any) {
      console.error(error);
      return res.status(500).json(error.message);
    }
  }
}
