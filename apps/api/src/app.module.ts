import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import * as Joi from 'joi';
import { ContactsModule } from './contacts/contacts.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { DealsModule } from './deals/deals.module';
import { TasksModule } from './tasks/tasks.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().min(10).required(),
      }),
    }),
    HealthModule, 
    ContactsModule, 
    UsersModule, 
    CompaniesModule, 
    DealsModule, 
    TasksModule, 
    ActivitiesModule
  ],
})
export class AppModule {}