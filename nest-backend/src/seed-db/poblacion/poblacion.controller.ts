import { Controller, Get } from '@nestjs/common';
import { PoblacionService } from './poblacion.service';

@Controller('poblacion')
export class PoblacionController {
    constructor( private readonly poblacionService: PoblacionService) {}

    @Get()
    findAll() {
        return this.poblacionService.findAll();
    }
}
