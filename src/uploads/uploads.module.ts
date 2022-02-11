import { Module } from "@nestjs/common";
import { UploadsResolver } from "./uploads.resolver";

@Module({ providers: [UploadsResolver] })
export class UploadsModule { }