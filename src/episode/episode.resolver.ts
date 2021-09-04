import {Args, Int, Mutation, Query, Resolver} from "@nestjs/graphql";
import {EpisodeService} from "./episode.service";
import {Episode} from "./entities/episode.entity";
import {PurChaseHistoryInput, PurchaseHistoryOutput} from "./dtos/purchase-history.dto";



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


    @Query(() => PurchaseHistoryOutput)
    async seriesDashBoardData(
        @Args('purChaseInput') purChaseHistoryInput : PurChaseHistoryInput
    ) : Promise<PurchaseHistoryOutput> {
        return await this.episodeService.seriesDashBoardData(purChaseHistoryInput)
    }

    @Query(() => Int)
    async totalPurchase(
        @Args('seriesId') seriesId : number
    ) : Promise<number> {
        return await this.episodeService.totalPurchase(seriesId)
    }


}