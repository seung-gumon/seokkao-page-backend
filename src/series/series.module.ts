import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Series} from "./entities/series.entity";
import {Part} from "../episode/entities/part.entity";
import {Category} from "../category/entities/category.entity";
import {SeriesService} from "./series.service";
import {SeriesResolver} from "./series.resolver";
import {User} from "../user/entities/user.entity";
import {Episode} from "../episode/entities/episode.entity";
import {PurChaseHistory} from "../episode/entities/purchaseHistory.entity";
import {SeriesRepository} from "./repository/series.repository";


@Module({
    imports: [TypeOrmModule.forFeature([Series , Part , Category , User , Episode , PurChaseHistory, SeriesRepository])],
    exports: [],
    providers: [SeriesService,SeriesResolver]
})
export class SeriesModule {
}
