import Model from './model';
import {
    AttendanceFilterInterface,
    CheckInInterface,
    CheckOutInterface
} from '../interfaces/attendance.interface';

export default class AttendanceModel extends Model{
  async getDetail(employeeId : number) {
    try {
      const connection = await this.pool.getConnection();
      const q = `
        SELECT *
        FROM attendances
        WHERE DATE(date) = CURDATE() and employee_id = ?
      `;
      console.log('SQL Query:', connection.format(q, [employeeId]));
      const [[rows]] = await connection.query(q, [employeeId]);
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
        SELECT *
        FROM attendances
        WHERE employee_id = ? 
        and Date(date) between Date(?)
        and Date(?)
      `;
      const params = [filter.employee_id, filter.start_date, filter.end_date];
      console.log('SQL Query:', connection.format(q, params));
      const [[rows]] = await connection.query(q, params);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async submitCheckIn(data : CheckInInterface) {
    try {
      const connection = await this.pool.getConnection();
      const q = `
        insert into attendances
        (date, employee_id, check_in, time_in, map_in, reason, created_at, updated_at) values
        (now(), ?, ?, ?, ?, ?, now(), now())
      `;
      const params = [
          data.employee_id,
          data.check_in,
          data.time_in,
          data.map_in,
          data.reason
      ];
      console.log('SQL Query:', connection.format(q, params));
      await connection.query(q, params);
      connection.release();
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async submitCheckOut(data : CheckOutInterface) {
    try {
      const connection = await this.pool.getConnection();
      const q = `
        update attendances set
        check_out = ?,
        time_out = ?,
        map_out = ?
        where id = ? and employee_id = ?
      `;
      const params = [
          data.check_out,
          data.time_out,
          data.map_out,
          data.attendance_id,
          data.employee_id,
      ];
      console.log('SQL Query:', connection.format(q, params));
      await connection.query(q, params);
      connection.release();
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
