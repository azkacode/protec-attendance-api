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
      const q = `
        SELECT id, name
        FROM warehouses
        WHERE id = ? and deleted_at is null
      `;
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
        SELECT id, name, start_work, end_work
        FROM working_hours
        WHERE id = ? and deleted_at is null
      `;
      console.log('SQL Query:', connection.format(q, [working_hour_id])); 
      const [[rows]] = await connection.query(q, [working_hour_id]);
      connection.release();
      return rows;
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
