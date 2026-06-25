import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ContactsModule } from './contacts/contacts.module';


@Module({
    imports: [HealthModule, ContactsModule],
})

export class AppModule {}