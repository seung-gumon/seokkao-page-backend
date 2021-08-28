import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Series} from "./entities/series.entity";
import {Raw, Repository} from "typeorm";
import {CreateSeriesInput} from "./dtos/create-series.dto";
import {CoreOutput} from "../common/dtos/core.dto";
import {User} from "../user/entities/user.entity";
import {Category} from "../category/entities/category.entity";
import * as moment from 'moment';
import {OrderByPopularOutput} from "./dtos/order-by-popular.dto";


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
        } catch (e) {
            console.log(e)
        }
    }


    async getSerializationToday(today: string, mainCategory: "Cartoon" | "Novel"): Promise<Series[]> {
        try {
            const replaceDay = today.replace("요일", "");

            const series = await this.series
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .where('series.serialization ILIKE :today', {today: `%${replaceDay}%`})
                .andWhere(`category.mainCategory =:mainCategory `, {mainCategory})
                .getMany();

            return series;
        } catch (e) {
            console.log(e);
        }
    }


    async orderByPopular(today: string): Promise<OrderByPopularOutput> {
        try {

            const replaceDay = today.replace("요일", "");

            const cartoons = await this.series
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.writer', 'writer')
                .where('series.serialization ILIKE :today', {today: `%${replaceDay}%`})
                .andWhere(`category.mainCategory =:mainCategory `, {mainCategory: "Cartoon"})
                .take(4)
                .orderBy('series.like', "DESC")
                .getMany();


            const novels = await this.series
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.category', 'category')
                .leftJoinAndSelect('series.writer', 'writer')
                .where('series.serialization ILIKE :today', {today: `%${replaceDay}%`})
                .andWhere(`category.mainCategory =:mainCategory `, {mainCategory: "Novel"})
                .take(4)
                .orderBy('series.like', "DESC")
                .getMany();

            return {
                cartoon: cartoons,
                novel: novels
            }

        } catch (e) {
            console.log(e)
        }
    }


    async mySeries(writer: User): Promise<Series[]> {
        try {
            const series = await this.series.find({
                where: {
                    writer
                },
                relations: ['writer', 'category']
            });

            return series
        } catch (e) {
            console.log(e, "error")
        }

    }


}