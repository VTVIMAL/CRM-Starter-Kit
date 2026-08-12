import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { DealsModule } from './deals/deals.module';
import { TasksModule } from './tasks/tasks.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [HealthModule, ContactsModule, UsersModule, CompaniesModule, DealsModule, TasksModule, ActivitiesModule],
})
export class AppModule {}