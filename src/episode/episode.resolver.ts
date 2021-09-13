import {Args, Int, Mutation, Query, Resolver} from "@nestjs/graphql";
import {EpisodeService} from "./episode.service";
import {Episode} from "./entities/episode.entity";
import {PurChaseHistoryInput, PurchaseHistoryOutput} from "./dtos/purchase-history.dto";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../user/entities/user.entity";
import {Roles} from "../auth/role.decorator";



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

    @Roles(['Novelist', 'Cartoonist'])
    @Query(() => PurchaseHistoryOutput)
    async seriesDashBoardData(
        @AuthUser() authUser: User,
        @Args('purChaseInput') purChaseHistoryInput : PurChaseHistoryInput
    ) : Promise<PurchaseHistoryOutput> {
        return await this.episodeService.seriesDashBoardData(purChaseHistoryInput,authUser)
    }

    


}