import { Controller, Get } from '@nestjs/common';
import { ComandoService } from './comando.service';

@Controller('comando')
export class ComandoController {
    constructor( private readonly comandoService: ComandoService) {}

    @Get()
    findAll() {
        return this.comandoService.findAll();
    }
}
