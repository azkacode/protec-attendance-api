import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import { createClient } from 'redis';
import { Container } from 'typedi';
import { S3Client } from '@aws-sdk/client-s3';

import { route } from './routes/route';

export default class Loaders {
  app: any;

  constructor(app: any) {
    this.app = app;
  }

  async setupMySQLPool() {
    const pool = mysql.createPool({
      host: config.mysql.host,
      user: config.mysql.user,
      database: config.mysql.database,
      password: config.mysql.password,
      port: config.mysql.port,
      timezone: '+07.00',
    });

    const connection = pool.promise();

    connection
      .query('SELECT 1')
      .then(([rows]) => {
        console.log('MySQL is connected!');
      })
      .catch((error) => {
        console.error('Connection error:', error);
      });

    Container.set('mysqlpool', connection);
  }

  async setupRedis() {
    const client = createClient({
      url: config.redis.url,
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    console.log('Redis client connected');

    Container.set('redis', client);
  }

  async load() {
    try {
      await this.setupMySQLPool();
      await this.setupRedis();
      await this.loadObjectStorage();

      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      this.app.use(cors());

      route(this.app);
    } catch (error: any) {
      console.log(error);
    }
  }

  async loadObjectStorage() {
    if (
      !config.s3.endpoint ||
      !config.s3.region ||
      !config.s3.bucketName ||
      !config.s3.accessKeyId ||
      !config.s3.secretAccessKey
    ) {
      throw new Error('S3 Object Storage configuration is incomplete');
    }

    const s3 = new S3Client({
      region: config.s3.region,
      endpoint: config.s3.endpoint,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
      forcePathStyle: true,
    });

    Container.set('s3', s3);

    console.log('S3 Object Storage is configured');
    console.log(`S3 Endpoint: ${config.s3.endpoint}`);
    console.log(`S3 Region: ${config.s3.region}`);
    console.log(`S3 Bucket: ${config.s3.bucketName}`);
  }
}