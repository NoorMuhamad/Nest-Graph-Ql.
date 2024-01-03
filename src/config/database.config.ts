import { TypeOrmModuleOptions } from '@nestjs/typeorm';

console.log('=========>', process.env.DB_HOST);

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'tutors',
  entities: ['dist/**/*.entity.{ts,js}'],
  synchronize: true,
  // type: 'mysql',
  // host: process.env.DB_HOST,
  // port: parseInt(process.env.DB_PORT, 10),
  // username: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // entities: ['dist/**/*.entity.{ts,js}'],
  // synchronize: true,
};

export default typeOrmConfig;

// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   username: 'root',
//   password: 'root',
//   database: 'tutors',
//   entities: ['dist/**/*.entity.{ts,js}'],
//   synchronize: true,
// }),
// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: 'bsrwbcosoti9mfxhvpyp-mysql.services.clever-cloud.com',
//   port: 3306,
//   username: 'u0eoklpddedc6aib',
//   password: 'yQuATz14a5yOqPAt9QBS',
//   database: 'bsrwbcosoti9mfxhvpyp',
//   entities: ['dist/**/*.entity.{ts,js}'],
//   synchronize: true,
// }),
