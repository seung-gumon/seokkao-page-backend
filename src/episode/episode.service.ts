import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Episode} from "./entities/episode.entity";
import {Repository} from "typeorm";
import {PurChaseHistory} from "./entities/purchaseHistory.entity";
import {PurChaseHistoryInput, PurchaseHistoryOutput} from "./dtos/purchase-history.dto";
import * as moment from 'moment';
import {User} from "../user/entities/user.entity";
import {Series} from "../series/entities/series.entity";
import {CreateEpisodeInput, EpisodeInput} from "./dtos/episodeInput.dto";
import {CoreOutput} from "../common/dtos/core.dto";
import {BuyEpisodeInput} from "./dtos/buyEpisodeInput.dto";

@Injectable()
export class EpisodeService {
    constructor(
        @InjectRepository(Series)
        private readonly series : Repository<Series>,
        @InjectRepository(Episode)
        private readonly episode : Repository<Episode>,
        @InjectRepository(PurChaseHistory)
        private readonly purchaseHistory : Repository<PurChaseHistory>
    ) {
    }


    async adminFindByIdEpisode(seriesId, episodeId, authUser): Promise<Episode | null> {
        try {
            const episode = await this.episode.findOne({
                where: {
                    series: seriesId,
                    id: episodeId,
                },
                relations: ['series']
            });

            if (!episode || episode.series.writerId !== authUser.id) {
                return null
            }
            return episode
        } catch {
            return null
        }
    }


    async seriesDashBoardData(purChaseHistoryInput: PurChaseHistoryInput, authUser: User): Promise<PurchaseHistoryOutput> {
        try {

            const series = await this.series.findOne({
                where: {
                    id: purChaseHistoryInput.seriesId
                },
                relations: ['category'],
            });


            const episodes = await this.episode.find({
                where : {
                    series
                },
                order : {episode : "DESC"}
            });


            const unionSeriesEpisodes = {
                ...series ,
                episode : [...episodes]
            }


            if (series.writerId !== authUser.id) {
                return null
            }

            const purchaseHistory = await this.purchaseHistory
                .createQueryBuilder('purchaseHistory')
                .where(`purchaseHistory.seriesId = :seriesId`, {seriesId: purChaseHistoryInput.seriesId})
                .andWhere(`purchaseHistory.createDate >= :startDate`, {startDate: purChaseHistoryInput.startDate})
                .andWhere(`purchaseHistory.createDate <= :endDate`, {endDate: purChaseHistoryInput.endDate})
                .select(`purchaseHistory.createDate`)
                .addSelect('COUNT(*) AS count')
                .groupBy('purchaseHistory.createDate')
                .orderBy('purchaseHistory.createDate', 'ASC')
                .getRawMany();



            const date = [];
            const count = [];

            purchaseHistory.forEach((item) => {
                date.push(item.purchaseHistory_createDate);
                count.push(+item.count)
            });


            return {
                date,
                count,
                series : unionSeriesEpisodes,
            }
        } catch (e) {
            return null
        }
    }


    async updateEpisode(episodeInput : EpisodeInput , authUser : User) : Promise<CoreOutput> {
        try{

            const episodeWriterUserId = await this.episode
                .createQueryBuilder('episode')
                .leftJoinAndSelect('episode.series' , 'series')
                .where(`episode.id = :id` , {id : episodeInput.id})
                .select(['series.writerId'])
                .getRawOne()

            if (episodeWriterUserId.writerId !== authUser.id) {
                return {
                    ok : false,
                    error : "권한이 없습니다."
                }
            }

            await this.episode.update({id : episodeInput.id} , {
                contents : episodeInput.contents
            })

            return {
                ok : true
            }
        }catch (e) {
            return {
                ok : false
            }
        }
    }


    async createEpisode(createEpisodeInput: CreateEpisodeInput, authUser: User): Promise<CoreOutput> {
        try {
            const findSeries = await this.series.findOne({
                id: createEpisodeInput.seriesId,
            })

            if (!findSeries && findSeries.writerId !== authUser.id) {
                return {
                    ok: false,
                    error: "권한이 없습니다."
                }
            }

            await this.episode.save(await this.episode.create({
                ...createEpisodeInput,
                series : findSeries
            }));

            return {
                ok: true
            }
        } catch(e) {
            console.log(e);
            return {
                ok: false,
                error: "글을 생성 할 수 없습니다."
            }
        }
    }


    async buyEpisode(authUser: User, buyEpisodeInput: BuyEpisodeInput) {
        try {
            if (!authUser) {
                return {
                    ok : false,
                    error : "로그인을 해주세요!"
                }
            }



        } catch (e) {
            return {
                ok: false,
                error: "구매 할 수 없습니다"
            }
        }
    }


}