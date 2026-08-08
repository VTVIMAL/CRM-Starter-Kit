import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ContactsService } from "./contacts.service";

@Controller('contacts')
export class ContactsController {
    constructor( private readonly contactsService: ContactsService ) {}

    // @Get()
    // findAll() {
    //     return this.contactsService.findAll();
    // }

    @Get()
    findAll(
        @Query('q') q?: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page? : number, // if no page found use 1
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number, // if no limit found use 10
    ) {


        // Read query parameter from the URL
        return this.contactsService.findAll({
            q, 
            page, 
            limit,
        });
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