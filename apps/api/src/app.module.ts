import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { DealsModule } from './deals/deals.module';

@Module({
  imports: [HealthModule, ContactsModule, UsersModule, CompaniesModule, DealsModule],
})
export class AppModule {}