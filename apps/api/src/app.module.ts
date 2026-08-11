import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [HealthModule, ContactsModule, UsersModule],
})
export class AppModule {}