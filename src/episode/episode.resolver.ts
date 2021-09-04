import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {EpisodeService} from "./episode.service";
import {Episode} from "../series/entities/episode.entity";



@Resolver()
export class EpisodeResolver {
    constructor(
        private readonly episodeService: EpisodeService
    ) {
    }


    @Query(() => Episode)
    async findByIdEpisode(
        @Args('id') id : number
    ) : Promise<Episode> {
        return await this.episodeService.findByIdEpisode(id)
    }


}