import Model from './model';

export default class AuthModel extends Model{
  async changeImage(url:string, employee_id : number) {
    try {
      const connection = await this.pool.getConnection();
      const q = `
        update employees set image = ? where id = ?
      `;
      console.log('SQL Query:', connection.format(q, [url, employee_id])); 
      const rows = await connection.query(q, [url, employee_id]);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async employeeDetail(email:string) {
    try {
      const connection = await this.pool.getConnection();
      const q = `
        SELECT id, name, email, password, image, warehouse_id, working_hour_id
        FROM employees
        WHERE email = ? and deleted_at is null
      `;
      console.log('SQL Query:', connection.format(q, [email])); 
      const [[rows]] = await connection.query(q, [email]);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async warehouseDetail(warehouse_id:number) {
    try {
      const connection = await this.pool.getConnection();
      const q = "SELECT id, name, `lat`, `long` FROM warehouses WHERE id = ? and deleted_at is null";
      console.log('SQL Query:', connection.format(q, [warehouse_id])); 
      const [[rows]] = await connection.query(q, [warehouse_id]);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async workingHourDetail(working_hour_id:number) {
    try {
      const connection = await this.pool.getConnection();
      const q = `
        SELECT
          wh.id,
          wh.name,
          wh.start_work,
          wh.end_work,
          whi.day,
          whi.start as item_start,
          whi.end as item_end,
          whi.status as item_status
        FROM working_hours wh
        LEFT JOIN working_hour_items whi ON whi.working_hour_id = wh.id
        WHERE wh.id = ? and wh.deleted_at is null
        ORDER BY whi.id asc
      `;
      console.log('SQL Query:', connection.format(q, [working_hour_id])); 
      const [rows] = await connection.query(q, [working_hour_id]);
      connection.release();

      if (!rows.length) return null;

      const day = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: 'Asia/Jakarta',
      }).format(new Date()).toLowerCase();
      const today = rows.find((row:any) => row.day === day);
      const first = rows[0];

      return {
        id: first.id,
        name: first.name,
        day,
        status: today?.item_status ?? 0,
        start_work: today?.item_start ?? first.start_work,
        end_work: today?.item_end ?? first.end_work,
        schedule: rows
          .filter((row:any) => row.day)
          .map((row:any) => ({
            day: row.day,
            start: row.item_start,
            end: row.item_end,
            status: row.item_status,
          })),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async updatePass(hashed_pass:string, employee_id:number) {
    try {
      const connection = await this.pool.getConnection();
      const q = `
        UPDATE employees set password = ?
        WHERE id = ?
      `;
      console.log('SQL Query:', connection.format(q, [hashed_pass, employee_id])); 
      const [rows] = await connection.query(q, [hashed_pass, employee_id]);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
