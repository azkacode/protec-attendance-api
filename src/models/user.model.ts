import Model from './model';

export default class AuthModel extends Model{
  async customerDetail(email:string) {
    try {
      const connection = await this.pool.getConnection();
      const q = `
        SELECT id, name, email, password
        FROM employees
        WHERE email = ?
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
  async signup(userData:any) {
    const connection = await this.pool.getConnection();
    try {
      const {
        name, email, password
      } = userData;
      await connection.beginTransaction();
      const [rows] = await connection.query(`insert into users (name, email, password) values (?, ?, ?)`, [name, email, password]);
      await connection.commit();
      connection.release();
      return rows;
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.log(error);
      throw error;
    }
  }
}
