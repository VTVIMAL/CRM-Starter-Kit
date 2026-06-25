import { Controller, Get } from "@nestjs/common";
import { ContactsService } from "./contacts.service";

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactService: ContactsService ) {}

    @Get()
    
    findAll() {
        return this.contactService.findAll();
    }

}