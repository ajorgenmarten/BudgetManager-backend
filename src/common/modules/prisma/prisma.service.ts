import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import envs from 'src/common/configs/envs';

@Injectable()
export default class PrismaService extends PrismaClient {
  constructor() {
    super({ adapter: new PrismaPg({ connectionString: envs.DATABASE_URL }) });
  }
}
