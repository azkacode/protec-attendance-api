import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import { createClient } from 'redis';
import { Container } from 'typedi';
import { v2 as cloudinary } from 'cloudinary';

import { route } from './routes/route';

export default class Loaders {
  app: any;
  constructor(app:any) {
    this.app = app;
  }

  async setupMySQLPool() {
    const pool = mysql.createPool({
      host: config.mysql.host,
      user: config.mysql.user,
      database: config.mysql.database,
      password: config.mysql.password,
      port: config.mysql.port,
      timezone: "+07.00"
    });
    const connection = pool.promise();
    connection.query('SELECT 1')
    .then(([rows]) => {
      console.log('MySQL is connected!');
    })
    .catch((error) => {
      console.error('Connection error:', error);
    });
    
    Container.set('mysqlpool', connection);
  }

  async setupRedis(){
    const client = createClient({
      url: config.redis.url
    });
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    console.log("Redis client connected");
    Container.set('redis', client);
  }

  async load() {
    try {
      await this.setupMySQLPool();
      await this.setupRedis();
      await this.loadCloudinary();
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      this.app.use(cors());
      route(this.app);
    } catch (error:any) {
      console.log(error);
    }
  }

  async loadCloudinary() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
      shorten: true,
    });
    Container.set('cloudinary', cloudinary);
  }

  


}
