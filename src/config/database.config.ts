import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'bsrwbcosoti9mfxhvpyp-mysql.services.clever-cloud.com',
  port: 3306,
  username: 'u0eoklpddedc6aib',
  password: 'yQuATz14a5yOqPAt9QBS',
  database: 'bsrwbcosoti9mfxhvpyp',
  entities: ['dist/**/*.entity.{ts,js}'],
  synchronize: true,
};

export default typeOrmConfig;

// type: 'mysql',
// host: 'localhost',
// port: 3306,
// username: 'root',
// password: 'root',
// database: 'tutors',
// entities: ['dist/**/*.entity.{ts,js}'],
// synchronize: true,
