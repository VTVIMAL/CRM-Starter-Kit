import { 
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get, 
    Post,
    Param, 
    ParseIntPipe, 
    Patch,
    Query 
} from "@nestjs/common";
import { ContactsService } from "./contacts.service";

@Controller('contacts')
export class ContactsController {
    constructor( private readonly contactsService: ContactsService ) {}

    @Get()
    findAll(
        @Query('q') q?: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page? : number, // if no page found use 1
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number, // if no limit found use 10
        @Query('ownerId') ownerId?: string,
        @Query('companyId') companyId?: string,
    ) {
        // Read query parameter from the URL
        return this.contactsService.findAll({
            q, 
            page, 
            limit,
            ownerId: ownerId ? Number(ownerId) : undefined,
            companyId: companyId ? Number(companyId) : undefined,
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

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        body: {
            firstName?: string;
            lastNamme?: string;
            email?: string;
            phone?: string;
            ownedById?: number;
            companyId?: number | null;
        }
    ) {
        return this.contactsService.update(id, body);
    }

    @Post()
    create(
        @Body()
        body: {
            firstName: string;
            lastName: string;
            email: string;
            phone?: string;
            ownedById: number;
            companyID?: number;
        },
    ){
        return this.contactsService.create(body)
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.contactsService.remove(id);
    }
}