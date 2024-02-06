import { Module } from "@nestjs/common";
import { LinkedinService } from "./linkedIn.service";

@Module({
    imports: [
    ],
    providers: [
        LinkedinService,
    ],
    exports: [
        LinkedinService,
    ]
})
export class ServiceModule { }