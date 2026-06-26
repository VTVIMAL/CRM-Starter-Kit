import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ContactsService } from "./contacts.service";

@Controller('contacts')
export class ContactsController {
    constructor( private readonly contactsService: ContactsService ) {}

    // @Get()
    // findAll() {
    //     return this.contactsService.findAll();
    // }

    @Get()
    findAll(@Query('q') q?: string) {
        // Read query parameter from the URL
        return this.contactsService.findAll(q);
    }

    //  CONTROLLER receives the string from the URL
    @Get(':id')
    // Route params comes as strings so we need to convert them.
    // NestJS turns the string "123" into the number 123 right here.
    findOne(@Param("id", ParseIntPipe) id: number){

        // CONTROLLER passes a clean number to the service
        return this.contactsService.findOne(id);
    }
}