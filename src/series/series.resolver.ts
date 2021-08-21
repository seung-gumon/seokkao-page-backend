import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {SeriresService} from "./serires.service";
import {Series} from "./entities/series.entity";
import {CoreOutput} from "../common/dtos/core.dto";
import {CreateSeriesInput} from "./dtos/create-series.dto";


@Resolver()
export class SeriesResolver {
    constructor(
        private readonly seriesService: SeriresService
    ) {
    }

    @Mutation(() => CoreOutput)
    async CreateSeries(
        @Args('input') CreateSeriesInput : CreateSeriesInput
    ) : Promise<CoreOutput> {
        return await this.seriesService.createSeries(CreateSeriesInput);
    }


    @Query(() => [Series])
    async MainBanner(): Promise<Series[]> {
        return await this.seriesService.getMainPage();
    }

}