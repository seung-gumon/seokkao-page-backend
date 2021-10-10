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
import {MySeriesOutputDto} from "./dtos/my-series-output.dto";
import {Episode} from "../episode/entities/episode.entity";
import {PurChaseHistory} from "../episode/entities/purchaseHistory.entity";
import {SeriesRepository} from "./repository/series.repository";


@Injectable()
export class SeriesService {
    constructor(
        @InjectRepository(Series)
        private readonly series: Repository<Series>,
        private readonly customSeriesRepository : SeriesRepository,
        @InjectRepository(Category)
        private readonly category: Repository<Category>,
        @InjectRepository(User)
        private readonly user: Repository<User>,
        @InjectRepository(Episode)
        private readonly episode: Repository<Episode>,
        @InjectRepository(PurChaseHistory)
        private readonly purChaseHistory: Repository<PurChaseHistory>
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


    async mySeries(writer: User): Promise<MySeriesOutputDto> {
        try {
            const writerUser = await this.user.findOne({
                where: {
                    id: writer.id
                },
                relations: ['series', 'series.category']
            });

            return writerUser
        } catch (e) {
            console.log(e, "error")
        }
    }


    async findByIdSeries(seriesId: number): Promise<Series | null> {
        try {
            return await this.series
                .createQueryBuilder('series')
                .leftJoinAndSelect('series.episode', 'episode')
                .leftJoinAndSelect('series.writer', 'writer')
                .leftJoinAndSelect('series.category', 'category')
                .where(`series.id = :seriesId`, {seriesId})
                .orderBy('episode.id', "DESC")
                .getOne();
        } catch (e) {
            return null
        }
    }


    async updateNovelProfileImage(seriesId, profileImage: string, authUser: User): Promise<CoreOutput> {
        try {
            const validationCheck = await this.customSeriesRepository.adminValidationCheck(seriesId, authUser);
            if (!validationCheck.ok) {
                return validationCheck
            }

            await this.series.update({id: seriesId}, {
                thumbnail: profileImage
            })

            return {
                ok: true
            }
        } catch (e) {
            return {
                ok: false,
                error: "업데이트후 수정해주세요"
            }
        }
    }


    async updateSerialization(seriesId: number, day: string, authUser: User): Promise<CoreOutput> {
        try {
            const validationCheck = await this.customSeriesRepository.adminValidationCheck(seriesId, authUser);
            if (!validationCheck.ok) {
                return validationCheck
            }

            await this.series.update({id: seriesId}, {
                serialization: day
            })

            return {
                ok: true
            }
        } catch (e) {
            return {
                ok: false,
                error: "요일 업데이트 하지 못하였습니다."
            }
        }
    }






}