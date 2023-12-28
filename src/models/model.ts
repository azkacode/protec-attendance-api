import { Container } from 'typedi';

export default class Model
{
    pool: any;
    constructor() {
      this.pool = Container.get('mysqlpool');
    }
}