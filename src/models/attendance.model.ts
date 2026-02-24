import Model from './model';
import {
    AttendanceFilterInterface,
    CheckInInterface,
    AttendanceLogInterface,
    AttendanceStatus
} from '../interfaces/attendance.interface';
import moment from "moment-timezone";

export default class AttendanceModel extends Model{
  async getDetail(employeeId : number, type : any = null) {
    try {
      const connection = await this.pool.getConnection();
      let q = `
        SELECT *
        FROM attendances
        WHERE DATE(date) = CURDATE() and employee_id = ?
        order by date asc
      `;
      if (type !== null) {
        q += ` and type = ${type} `
      }
      console.log('SQL Query:', connection.format(q, [employeeId]));
      const [rows] = await connection.query(q, [employeeId]);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getHistory(filter : AttendanceFilterInterface) {
    try {
      const connection = await this.pool.getConnection();
      const q = `
        SELECT a.*, app.name as approver, rej.name as rejector
        FROM attendances a
        left join users as app on a.approved_by = app.id
        left join users as rej on a.rejected_by = rej.id
        WHERE employee_id = ? 
        and Date(date) between Date(?)
        and Date(?)
        order by date asc
      `;
      const params = [filter.employee_id, filter.start_date, filter.end_date];
      console.log('SQL Query:', connection.format(q, params));
      const [rows] = await connection.query(q, params);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async submitCheck(data : CheckInInterface) {
    try {
      const connection = await this.pool.getConnection();
      let q = "";
      if(data.attendance_status == AttendanceStatus.OK) {
        q = `
          insert into attendances
          (date, type, employee_id, evidence, time, map, reason, attendance_status, created_at, updated_at) values
          (now(), ?, ?, ?, ?, ?, ?, ?, now(), now())
        `;  
      } else {
        q = `
          insert into attendances
          (date, type, employee_id, evidence, time, map, reason, attendance_status, created_at, updated_at, rejected_by, rejected_at) values
          (now(), ?, ?, ?, ?, ?, ?, ?, now(), now(), 0, now())
        `;
      }
      const params = [
          data.type,
          data.employee_id,
          data.evidence,
          data.time,
          data.map,
          data.reason,
          data.attendance_status
      ];
      console.log('SQL Query:', connection.format(q, params));
      const [rows] = await connection.query(q, params);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getWorkingHour(userId){
    try {
      const connection = await this.pool.getConnection();
      const q = `
        select whi.*, wh.name as name from working_hour_items whi
        left join working_hours wh on whi.working_hour_id = wh.id 
        left join employees e on e.working_hour_id = wh.id 
        where e.id = ? and status = 1;
      `;
      const params = [ userId ];
      console.log('SQL Query:', connection.format(q, params));
      const [rows] = await connection.query(q, params);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async submitAttendanceLog(data : AttendanceLogInterface){
    try {
      const connection = await this.pool.getConnection();
  
      const q = `INSERT INTO attendance_logs set ? `;
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      const props = {
        date : now,
        attendance_id : data.attendance_id,
        employee_id : data.employee_id,
        type : data.type,
        evidence : data.evidence,
        time : data.time,
        map : data.map,
        reason : data.reason,
        attendance_status : data.attendance_status,
        approved_by : data.approved_by,
        rejected_by : data.rejected_by,
        actioned_by : data.actioned_by,
        working_hour_id : data.working_hour_id,
        name : data.name,
        working_hour_item_id : data.working_hour_item_id,
        day : data.day,
        start : data.start,
        end : data.end,
        status : data.status,
        created_at : now,
        updated_at : now,
      }
      console.log('SQL Query:', connection.format(q, props));
      const rows = await connection.query(q, props);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getReport(id : number) {
    try {
      const connection = await this.pool.getConnection();
      const q = `
        select distinct(attendance_status), count(id) as total
        from attendance_logs al
        where employee_id = ?
        and month(CURRENT_DATE()) = month(date)
        group by attendance_status;
      `;
      const params = [ id ];
      console.log('SQL Query:', connection.format(q, params));
      const [rows] = await connection.query(q, params);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTotalAttendance(id : number) {
    try {
      const connection = await this.pool.getConnection();
      const q = `
        SELECT COUNT(DISTINCT date) AS attendance
        FROM attendances
        WHERE type IN ('in', 'out')
        and month(CURRENT_DATE()) = month(date)
        and employee_id = ?
        GROUP BY date
        HAVING COUNT(DISTINCT type) = 2;
      `;
      const params = [ id ];
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