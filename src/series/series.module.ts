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


@Module({
    imports: [TypeOrmModule.forFeature([Series , Part , Category , User , Episode , PurChaseHistory])],
    exports: [],
    providers: [SeriesService,SeriesResolver]
})
export class SeriesModule {
}
