import { Module } from '@nestjs/common';
import { ServiceModule } from '../../service/service.module';
import { LinkedInController } from './linkedIn.controller';
@Module({
    imports:[
        ServiceModule
    ],
    controllers: [LinkedInController]
})
export class LinkedinModule { }
