import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Series} from "./entities/series.entity";
import {Raw, Repository} from "typeorm";
import {CreateSeriesInput} from "./dtos/create-series.dto";
import {CoreOutput} from "../common/dtos/core.dto";
import {User} from "../user/entities/user.entity";
import {Category, MainCategoryRole} from "../category/entities/category.entity";
import * as moment from 'moment';


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
            const minusSevenDaysFromToday = moment().add(-7, 'days').format('YYYY-MM-DD');

            const series = await this.series
                .createQueryBuilder('series')
                .andWhere(`series.createdAt >= :minusSevenDaysFromToday`, {minusSevenDaysFromToday})
                .take(10)
                .getMany();

            return series;
        } catch(e){
            console.log(e)
        }
    }


    async getSerializationToday(today: string, mainCategory: MainCategoryRole): Promise<Series[]> {
        try {
            const replaceDay = today.replace("요일", "");


            const series = await this.series
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.category','category')
                .where('series.serialization ILIKE :today', {today: `%${replaceDay}%`})
                .andWhere(`category.mainCategory =:mainCategory `, {mainCategory})
                .getMany()


            return series;
        } catch (e) {
            console.log(e);
        }
    }


}