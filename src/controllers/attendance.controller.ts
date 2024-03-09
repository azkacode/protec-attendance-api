import AttendanceModel from '../models/attendance.model';
import {
  AttendanceFilterInterface,
  CheckOutInterface,
  CheckInType,
} from '../interfaces/attendance.interface';
import { AttendanceLib } from '../lib/attendance';
import moment from "moment-timezone";
const timezone = 'Asia/Jakarta';

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
      const attendanceModel = new AttendanceModel;
      const data = await attendanceModel.getReport(req.data.id);
      const attendance = await attendanceModel.getTotalAttendance(req.data.id);
      res.json({
        data : {
          attendance : attendance.length > 0 ? attendance[0]['attendance'] : 0,
          late : data.find(i => i.attendance_status == "dt")?.total || 0,
          early : data.find(i => i.attendance_status == "pc")?.total || 0,
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
      const attendanceLib = new AttendanceLib();
      const currentAttendance = await attendanceModel.getDetail(req.data.id);

      if(currentAttendance.length > 0){
        throw new Error("Anda sudah check in");
      }
      
      const wH = await attendanceLib.getCurrentWorkingHour(req.data.id);
      if(!wH){
        throw new Error("Anda sedang libur");
      }
      await attendanceLib.submitAttendance(req, wH, CheckInType.In);
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
      const attendanceLib = new AttendanceLib();
      const currentAttendance = await attendanceModel.getDetail(req.data.id);
      if(currentAttendance.length == 0){
        throw new Error("Anda harus check in terlebih dahulu");
      }
      if(currentAttendance.filter((i:any) => i.type == "out").length >= 1){
        throw new Error("Anda sudah check out");
      }

      const wH = await attendanceLib.getCurrentWorkingHour(req.data.id);
      if(!wH){
        throw new Error("Anda sedang libur");
      }
      await attendanceLib.submitAttendance(req, wH, CheckInType.Out);
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
