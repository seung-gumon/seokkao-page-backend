import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Series} from "./entities/series.entity";
import {Repository} from "typeorm";
import {CreateSeriesInput} from "./dtos/create-series.dto";
import {CoreOutput} from "../common/dtos/core.dto";


@Injectable()
export class SeriresService {
    constructor(
        @InjectRepository(Series)
        private readonly series : Repository<Series>
    ) {
    }



    async createSeries(input : CreateSeriesInput) : Promise<CoreOutput> {
        console.log(input);
        return {
            ok : true
        }
    }


    async getMainPage() : Promise<Series[]> {
        const series = await this.series.find({
            take : 10
        });

        return series;
    }


}