import EmployeeModel from '../models/employee.model';

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
}
