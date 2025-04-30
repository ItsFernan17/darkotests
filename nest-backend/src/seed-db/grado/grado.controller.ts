import { Controller, Get } from '@nestjs/common';
import { GradoService } from './grado.service';

@Controller('grado')
export class GradoController {
    constructor( private readonly gradoService: GradoService) {}

    @Get()
    findAll() {
        return this.gradoService.findAll();
    }
}
