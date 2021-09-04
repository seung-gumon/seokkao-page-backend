import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Episode} from "../series/entities/episode.entity";
import {EpisodeService} from "./episode.service";
import {EpisodeResolver} from "./episode.resolver";

@Module({
    imports: [TypeOrmModule.forFeature([Episode])],
    exports: [],
    providers: [EpisodeResolver,EpisodeService]
})
export class EpisodeModule {}
