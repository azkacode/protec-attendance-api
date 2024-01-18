import LeaveModel from '../models/leave.model';
import { LeaveLib } from '../lib/leave';
import { LeaveLogInterface } from '../interfaces/leave.interface';
import { create } from 'ts-node';

export default class LeaveController
{
  async getDetail(req:any, res:any) {
    try {
      // get eligible leave
      // get leave logs
      // count leave log for leaves
      // return remaining number of leaves
      const leaveLib = new LeaveLib;
      return res.json(await leaveLib.getRemainingLeave(req.data.id, null));
    } catch (error:any) {
      console.error(error);
      return res.status(500).json(error.message);
    }
  }
  async leaveRequest(req:any, res:any) {
    try {
      const leaveLib = new LeaveLib;
      const leaveModel = new LeaveModel;
      const {
        leave_id, start_date, end_date, reason
      } = req.body;

      let startDate : Date = new Date(start_date);
      let endDate : Date = new Date(end_date);

      if(startDate > endDate){
        throw new Error("Tanggal awal harus lebih awal dari tanggal akhir");
      }
      let leaveData = await leaveLib.getRemainingLeave(req.data.id, leave_id);
      if(leaveData.length <= 0) {
        throw new Error("Data cuti tidak ditemukan");
      }
      leaveData = leaveData.shift();

      const numberOfDays = leaveLib.countDays(startDate, endDate) + 1;
      if(numberOfDays > leaveData.remaining_leaves) {
        throw new Error("Jumlah pengajuan melebihi sisa cuti");
      }

      // check date available

      
      const listOfDate = leaveLib.createDateRange(startDate, endDate);
      const dateUnvailable = await leaveModel.checkLeaveLogExists(leaveData.id, req.data.id, listOfDate);
      if(dateUnvailable.length > 0) {
        throw new Error("Sudah ada pengajuan cuti di tanggal-tanggal tersebut");
      }
      for (const date of listOfDate) {
        const createData: LeaveLogInterface = {
          employee_id : req.data.id,
          date : date,
          end_date : date,
          leave_id : leaveData.id,
          reason,
        }
        await leaveModel.createLeaveLogs(createData)
      }

      return res.json("ok");

    } catch (error:any) {
      console.error(error);
      return res.status(500).json(error.message);
    }
  }
}
