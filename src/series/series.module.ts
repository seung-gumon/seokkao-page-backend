import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Series} from "./entities/series.entity";
import {Part} from "./entities/part.entity";
import {Category} from "../category/entities/category.entity";
import {SeriresService} from "./serires.service";
import {SeriesResolver} from "./series.resolver";


@Module({
    imports: [TypeOrmModule.forFeature([Series , Part , Category])],
    exports: [],
    providers: [SeriresService,SeriesResolver]
})
export class SeriesModule {
}
