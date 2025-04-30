import { Controller, Get } from '@nestjs/common';
import { SeedDbService } from './seed-db.service';

@Controller('seed-db')
export class SeedDbController {
    constructor(private readonly seedService: SeedDbService) {}  
    
  @Get()
  executeSeed() {
    return this.seedService.runSeed()
  }
}
