import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Episode} from "./entities/episode.entity";
import {EpisodeService} from "./episode.service";
import {EpisodeResolver} from "./episode.resolver";
import {PurChaseHistory} from "./entities/purchaseHistory.entity";
import {Series} from "../series/entities/series.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Episode , PurChaseHistory,Series])],
    exports: [],
    providers: [EpisodeResolver,EpisodeService]
})
export class EpisodeModule {}
