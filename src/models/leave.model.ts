import Model from './model';
import { LeaveLogInterface } from '../interfaces/leave.interface';

export default class LeaveModel extends Model{
  async getLeaves(employeeId : number, leaveId : any = null) : Promise<any> {
    try {
      const leaveIdQ = leaveId !== null ? ` and l.id = ${leaveId} ` : '';
      const connection = await this.pool.getConnection();
      let q = `
          select * from leaves l 
          where date(l.cut_off) >= CURDATE() 
          and l.status = "published"
          and date(l.start_at) <= CURDATE()
          ${leaveIdQ}
          and (
            select e.created_at 
            from employees e
            where e.id = ?
            limit 1
          ) <= date(l.start_at);
      `;
      console.log('SQL Query:', connection.format(q, [employeeId]));
      const [rows] = await connection.query(q, [employeeId]);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getLeaveLogs(employeeId : number, leaveId : number) : Promise<any> {
    try {
      const connection = await this.pool.getConnection();
      let q = `
        select * from leave_logs where employee_id = ? and leave_id = ?;
      `;
      console.log('SQL Query:', connection.format(q, [employeeId, leaveId]));
      const [rows] = await connection.query(q, [employeeId, leaveId]);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async createLeaveLogs(leaveData : LeaveLogInterface) : Promise<any> {
    try {
      // const 
      const connection = await this.pool.getConnection();
      let q = `
        insert into leave_logs (employee_id, leave_id, date, end_date, reason, created_at, updated_at)
        values (?, ?, date(?), date(?), ?, now(), now()) ;
      `;
      const params = [
        leaveData.employee_id,
        leaveData.leave_id,
        leaveData.date,
        leaveData.end_date,
        leaveData.reason
      ]
      console.log('SQL Query:', connection.format(q, params));
      const [rows] = await connection.query(q, params);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async checkLeaveLogExists(leaveId : number, employeeId : number, dates : Array<Date>) : Promise<any> {
    try {
      // const 
      const connection = await this.pool.getConnection();
      let q = `
        select * from leave_logs where leave_id = ? and employee_id = ? and date in (?) and rejected_at is null
      `;
      const params = [
        leaveId, employeeId, dates
      ]
      console.log('SQL Query:', connection.format(q, params));
      const [rows] = await connection.query(q, params);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
