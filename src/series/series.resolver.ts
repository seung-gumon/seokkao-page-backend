import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {SeriresService} from "./serires.service";
import {Series} from "./entities/series.entity";
import {CoreOutput} from "../common/dtos/core.dto";
import {CreateSeriesInput} from "./dtos/create-series.dto";
import {Roles} from "../auth/role.decorator";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../user/entities/user.entity";
import {OrderByPopularOutput} from "./dtos/order-by-popular.dto";
import {MySeriesOutputDto} from "./dtos/my-series-output.dto";


@Resolver()
export class SeriesResolver {
    constructor(
        private readonly seriesService: SeriresService
    ) {
    }

    @Mutation(() => CoreOutput)
    @Roles(['Novelist', 'Cartoonist', 'User'])
    async createSeries(
        @AuthUser() user: User,
        @Args('input') CreateSeriesInput: CreateSeriesInput
    ): Promise<CoreOutput> {
        return await this.seriesService.createSeries(CreateSeriesInput, user);
    }


    @Query(() => [Series])
    async mainBanner(): Promise<Series[]> {
        return await this.seriesService.getMainPage();
    }

    @Query(() => [Series])
    async getSerializationTodayFromMain(
        @Args('today') today: string,
        @Args('mainCategory') mainCategory: "Cartoon" | "Novel",
    ): Promise<Series[]> {
        return await this.seriesService.getSerializationToday(today, mainCategory)
    }

    @Query(() => OrderByPopularOutput)
    async orderByPopular(
        @Args('today') today : string
    ) : Promise<OrderByPopularOutput> {
        return await this.seriesService.orderByPopular(today)
    }


    @Query(() => MySeriesOutputDto)
    @Roles(['Novelist', 'Cartoonist'])
    async mySeries(
        @AuthUser() authUser: User
    ) : Promise<MySeriesOutputDto> {
        return await this.seriesService.mySeries(authUser)
    }

    @Query(() => Series, {nullable : true})
    async findByIdSeries(
        @Args('seriesId') seriesId: number
    ): Promise<Series | null> {
        return await this.seriesService.findByIdSeries(seriesId);
    }




}