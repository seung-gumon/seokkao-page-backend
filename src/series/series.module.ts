import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Series} from "./entities/series.entity";
import {Part} from "./entities/part.entity";
import {Category} from "../category/entities/category.entity";
import {SeriresService} from "./serires.service";
import {SeriesResolver} from "./series.resolver";
import {User} from "../user/entities/user.entity";
import {Episode} from "./entities/episode.entity";
import {PurChaseHistory} from "./entities/purchaseHistory.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Series , Part , Category , User , Episode , PurChaseHistory])],
    exports: [],
    providers: [SeriresService,SeriesResolver]
})
export class SeriesModule {
}
