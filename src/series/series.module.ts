import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
    imports: [TypeOrmModule.forFeature([])],
    exports: [],
    providers: []
})
export class SeriesModule {
}
