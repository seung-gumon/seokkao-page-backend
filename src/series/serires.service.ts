import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Series} from "./entities/series.entity";
import {Repository} from "typeorm";
import {CreateSeriesInput} from "./dtos/create-series.dto";
import {CoreOutput} from "../common/dtos/core.dto";
import {User} from "../user/entities/user.entity";
import {Category} from "../category/entities/category.entity";


@Injectable()
export class SeriresService {
    constructor(
        @InjectRepository(Series)
        private readonly series: Repository<Series>,
        @InjectRepository(Category)
        private readonly category: Repository<Category>
    ) {
    }


    async createSeries(input: CreateSeriesInput, user: User): Promise<CoreOutput> {
        try {
            const category = await this.category.findOne(input.category);
            await this.series.save(await this.series.create({...input, writer: user, category}));

            return {
                ok: true
            }
        } catch {
            return {
                ok: false
            }
        }
    }


    async getMainPage(): Promise<Series[]> {
        try {
            const series = await this.series.find({
                take: 10
            });

            return series;
        } catch {

        }
    }


}