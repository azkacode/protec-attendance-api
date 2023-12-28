import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWTSECRET || "secret",
    jwtExpiration: process.env.JWTEXP || '1d',
    mysql : {
      host: process.env.DBHOST || 'localhost',
      user: process.env.DBUSER || 'root',
      database: process.env.DBNAME || 'expressts',
      password: process.env.DBPASS || '',
      port: Number(process.env.DBPORT) || 3306,
    },
    redis: {
      url : process.env.REDISURL,
    },
    cloudinary : {
      cloudName : process.env.CLOUNINARY_CLOUD_NAME,
      apiKey : process.env.CLOUNINARY_API_KEY,
      apiSecret : process.env.CLOUNINARY_API_SECRET,
    }
};
  