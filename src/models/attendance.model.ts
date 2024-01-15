import Model from './model';
import {
    AttendanceFilterInterface,
    CheckInInterface
} from '../interfaces/attendance.interface';

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
        SELECT *
        FROM attendances
        WHERE employee_id = ? 
        and Date(date) between Date(?)
        and Date(?)
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
      const q = `
        insert into attendances
        (date, type, employee_id, evidence, time, map, reason, created_at, updated_at) values
        (now(), ?, ?, ?, ?, ?, ?, now(), now())
      `;
      const params = [
          data.type,
          data.employee_id,
          data.evidence,
          data.time,
          data.map,
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
}
