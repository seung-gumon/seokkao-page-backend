import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {SeriresService} from "./serires.service";
import {Series} from "./entities/series.entity";
import {CoreOutput} from "../common/dtos/core.dto";
import {CreateSeriesInput} from "./dtos/create-series.dto";
import {Roles} from "../auth/role.decorator";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../user/entities/user.entity";
import {MainCategoryRole} from "../category/entities/category.entity";


@Resolver()
export class SeriesResolver {
    constructor(
        private readonly seriesService: SeriresService
    ) {
    }

    @Mutation(() => CoreOutput)
    @Roles(['Novelist','Cartoonist','User'])
    async createSeries(
        @AuthUser() user : User,
        @Args('input') CreateSeriesInput : CreateSeriesInput
    ) : Promise<CoreOutput> {
        return await this.seriesService.createSeries(CreateSeriesInput,user);
    }


    @Query(() => [Series])
    async mainBanner(): Promise<Series[]> {
        return await this.seriesService.getMainPage();
    }

    @Query(() => [Series])
    async getSerializationTodayFromMain(
        @Args('today') today: string,
        @Args('mainCategory') mainCategory: MainCategoryRole,
    ): Promise<Series[]> {
        return await this.seriesService.getSerializationToday(today, mainCategory)
    }

}