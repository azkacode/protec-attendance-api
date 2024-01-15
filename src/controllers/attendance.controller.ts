import AttendanceModel from '../models/attendance.model';
import {
  AttendanceFilterInterface,
  CheckInInterface,
  CheckOutInterface,
  CheckInType
} from '../interfaces/attendance.interface';
import { AttendanceLib } from '../lib/attendance';

export default class AttendanceController  {
  async get(req:any, res:any){
    try {
      const attendanceModel = new AttendanceModel;
      const attendanceLib = new AttendanceLib;
      const data = await attendanceModel.getDetail(req.data.id);
      const dataMock = attendanceLib.getMockList(data);
      return res.json(dataMock);
    } catch (error:any) {
      console.log(error);
      res.status(400).json({message : error.message});
    }
  }
  async history(req:any, res:any) {
    try {
      const currentDate = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(currentDate.getDate() - 30);

      let filter : AttendanceFilterInterface = {
        start_date : req.body.start_date || thirtyDaysAgo,
        end_date : req.body.end_date || currentDate,
        employee_id : req.data.id,
      };

      const attendanceModel = new AttendanceModel;
      const attendanceLib = new AttendanceLib;
      const data = await attendanceModel.getHistory(filter);
      const dataMock = attendanceLib.getMockList(data);
      return res.json(dataMock);
    } catch (error:any) {
      console.log(error);
      res.status(400).json({message : error.message});
    }
  }
  async report(req:any, res:any){
    try {
      res.json({
        data : {
          attendance : 2,
          late : 1,
        }
      })
    } catch (error:any) {
      console.log(error);
      res.status(400).json({message : error.message});
    }
  }
  async checkIn(req:any, res:any){
    try {
      const attendanceModel = new AttendanceModel;
      const currentAttendance = await attendanceModel.getDetail(req.data.id);
      if(currentAttendance.length > 0){
        throw new Error("Anda sudah check in");
      }

      let props : CheckInInterface = {
        type : CheckInType.In,
        employee_id : req.data.id,
        evidence : req.body.check_in,
        map : req.body.map_in,
        time : req.body.time_in,
        reason : req.body.reason,
      };

      if(!props.evidence || !props.map || !props.time) {
        throw new Error("Item Required");
      }
      await attendanceModel.submitCheck(props);

      const data = await attendanceModel.getDetail(req.data.id);
      res.json({
        data
      })
    } catch (error:any) {
      console.log(error);
      res.status(400).json({message : error.message});
    }
  }
  async checkOut(req:any, res:any){
    try {
      const attendanceModel = new AttendanceModel;
      const currentAttendance = await attendanceModel.getDetail(req.data.id);
      if(currentAttendance.length == 0){
        throw new Error("Anda harus check in terlebih dahulu");
      }
      if(currentAttendance.filter((i:any) => i.type == "out").length >= 1){
        throw new Error("Anda sudah check out");
      }

      let props : CheckOutInterface = {
        type : CheckInType.Out,
        employee_id : req.data.id,
        evidence : req.body.check_out,
        map : req.body.map_out,
        time : req.body.time_out,
        reason : req.body.reason,
      };

      await attendanceModel.submitCheck(props);
      const data = await attendanceModel.getDetail(req.data.id);
      res.json({
        data
      })
    } catch (error:any) {
      console.log(error);
      res.status(400).json({message : error.message});
    }
  }
}
