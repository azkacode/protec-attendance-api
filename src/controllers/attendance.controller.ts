import AttendanceModel from '../models/attendance.model';
import {
  AttendanceFilterInterface,
  CheckInInterface,
  CheckOutInterface
} from '../interfaces/attendance.interface';

export default class AttendanceController  {
  
  async get(req:any, res:any){
    try {
      const attendanceModel = new AttendanceModel;
      const data = await attendanceModel.getDetail(req.data.id);
      res.json({
        data
      })
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
      const data = await attendanceModel.getHistory(filter);
      res.json({ data });
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
      if(currentAttendance){
        throw new Error("Anda sudah check in");
      }

      let props : CheckInInterface = {
        employee_id : req.data.id,
        check_in : req.body.check_in,
        map_in : req.body.map_in,
        time_in : req.body.time_in,
        reason : req.body.reason,
      };

      if(!props.check_in || !props.map_in || !props.time_in) {
        throw new Error("Item Required");
      }
      await attendanceModel.submitCheckIn(props);

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
      if(!currentAttendance){
        throw new Error("Anda harus check in terlebih dahulu");
      }
      if(currentAttendance.check_out != null){
        throw new Error("Anda sudah check out");
      }

      let props : CheckOutInterface = {
        employee_id : req.data.id,
        check_out : req.body.check_out,
        map_out : req.body.map_out,
        time_out : req.body.time_out,
        attendance_id : currentAttendance.id,
      };

      await attendanceModel.submitCheckOut(props);
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
