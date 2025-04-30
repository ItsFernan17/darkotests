import { Controller, Get } from '@nestjs/common';
import { MotivoService } from './motivo.service';

@Controller('motivo')
export class MotivoController {
    constructor( private readonly motivoService: MotivoService) {}

    @Get()
    findAll() {
        return this.motivoService.findAll();
    }
}
