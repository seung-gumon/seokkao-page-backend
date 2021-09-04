import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Episode} from "../series/entities/episode.entity";
import {Repository} from "typeorm";


@Injectable()
export class EpisodeService {
    constructor(
        @InjectRepository(Episode)
        private readonly episode : Repository<Episode>
    ) {
    }


    async findByIdEpisode(id: number): Promise<Episode> {
        return await this.episode.findOne({id})
    }
}