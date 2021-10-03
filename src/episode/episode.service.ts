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
import {BuyEpisodeOutput} from "./dtos/buyEpisodeOutput.dto";
import {seriesEpisodeIdsInput} from "./dtos/seriesEpisodeIdsInput.dto";
import {prevOrNextEpisodeInput} from "./dtos/prevOrNextEpisode.dto";

@Injectable()
export class EpisodeService {
    constructor(
        @InjectRepository(Series)
        private readonly series: Repository<Series>,
        @InjectRepository(Episode)
        private readonly episode: Repository<Episode>,
        @InjectRepository(PurChaseHistory)
        private readonly purchaseHistory: Repository<PurChaseHistory>,
        @InjectRepository(User)
        private readonly user: Repository<User>
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
                where: {
                    series
                },
                order: {episode: "DESC"}
            });


            const unionSeriesEpisodes = {
                ...series,
                episode: [...episodes]
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
                series: unionSeriesEpisodes,
            }
        } catch (e) {
            return null
        }
    }


    async updateEpisode(episodeInput: EpisodeInput, authUser: User): Promise<CoreOutput> {
        try {

            const episodeWriterUserId = await this.episode
                .createQueryBuilder('episode')
                .leftJoinAndSelect('episode.series', 'series')
                .where(`episode.id = :id`, {id: episodeInput.id})
                .select(['series.writerId'])
                .getRawOne()

            if (episodeWriterUserId.writerId !== authUser.id) {
                return {
                    ok: false,
                    error: "권한이 없습니다."
                }
            }

            await this.episode.update({id: episodeInput.id}, {
                contents: episodeInput.contents
            })

            return {
                ok: true
            }
        } catch (e) {
            return {
                ok: false
            }
        }
    }


    async createEpisode(createEpisodeInput: CreateEpisodeInput, authUser: User): Promise<CoreOutput> {
        try {
            const findSeries = await this.series.findOne({
                where: {
                    id: createEpisodeInput.seriesId,
                },
                relations: ['category']
            })


            if (!findSeries && findSeries.writerId !== authUser.id) {
                return {
                    ok: false,
                    error: "권한이 없습니다."
                }
            }

            await this.episode.save(await this.episode.create({
                ...createEpisodeInput,
                howMuchCoin: findSeries.category.mainCategory === 'Novel' ? 2 : 3,
                series: findSeries
            }));

            return {
                ok: true
            }
        } catch (e) {
            console.log(e);
            return {
                ok: false,
                error: "글을 생성 할 수 없습니다."
            }
        }
    }


    async buyEpisode(authUser: User, buyEpisodeInput: BuyEpisodeInput): Promise<BuyEpisodeOutput> {
        try {

            if (!authUser) {
                return {
                    ok: false,
                    error: "로그인을 해주세요!"
                }
            }

            const purchaseHistory = await this.purchaseHistory.findOne({
                where: {
                    whoPurchase: authUser.id,
                    Series: buyEpisodeInput.seriesId,
                    episode: buyEpisodeInput.episodeId
                },
                select: ['id']
            });


            if (purchaseHistory) {
                return {
                    ok: true,
                    buyEpisodeId: buyEpisodeInput.episodeId
                }
            }


            const episode = await this.episode.findOne({
                where: {
                    id: buyEpisodeInput.episodeId,
                    series: buyEpisodeInput.seriesId
                },
            });

            if (episode.howMuchCoin > authUser.coin) {
                return {
                    ok: false,
                    error: "코인이 부족합니다."
                }
            }


            const series = await this.series.findOne({
                where: {
                    id: buyEpisodeInput.seriesId
                }
            })

            await this.user.update({id: authUser.id}, {
                ...authUser,
                coin: authUser.coin - episode.howMuchCoin
            });


            await this.purchaseHistory.save(await this.purchaseHistory.create({
                Series: series,
                episode: episode,
                whoPurchase: authUser,
                createDate: moment(new Date()).format('YYYY-MM-DD')
            }));


            return {
                ok: true,
                buyEpisodeId: episode.id
            }

        } catch (e) {
            console.log(e);
            return {
                ok: false,
                error: "구매 할 수 없습니다"
            }
        }
    }


    async getPurchaseHistory(authUser: User, seriesId: number): Promise<number[]> {
        try {
            if (!authUser) {
                return []
            }


            const history = await this.purchaseHistory.find({
                where: {
                    Series: seriesId,
                    whoPurchase: authUser
                },
                relations: ['episode'],
            });


            const onlyEpisodeId = await history.map((history) => history.episode.id);
            return onlyEpisodeId
        } catch (e) {
            console.log(e);
            return []
        }
    }


    async getEpisodeBySeriesIdAndEpisodeId(ids: seriesEpisodeIdsInput, authUser): Promise<Episode> {
        try {

            const purchaseHistory = await this.purchaseHistory.findOne({
                where: {
                    Series: ids.seriesId,
                    episode: ids.episodeId,
                    whoPurchase: authUser,
                },
                relations: ['episode']
            });


            if (purchaseHistory.episode.episode === 1) {
                return await this.episode.findOne({
                    where: {
                        series: ids.seriesId,
                        id: ids.episodeId,
                    },
                    relations: ['series']
                });
            } else if (!purchaseHistory) {
                return null
            }


            return await this.episode.findOne({
                where: {
                    series: ids.seriesId,
                    id: ids.episodeId,
                },
                relations: ['series']
            });

        } catch (e) {
            return null
        }
    }


    async prevOrNextEpisode(authUser: User, prevOrNextEpisode: prevOrNextEpisodeInput, prevOrNext : string): Promise<BuyEpisodeOutput> {
        try {
            const episode = await this.episode.findOne({
                where : {
                    series : prevOrNextEpisode.seriesId,
                    episode : prevOrNextEpisode.episode
                },
                relations : ['series']
            });

            if (prevOrNext === 'next' && !episode) {
                return {
                    ok: false,
                    error: "다음화가 없습니다."
                }
            } else if (prevOrNext === 'prev' && !episode) {
                return {
                    ok: false,
                    error: "이전화가 없습니다."
                }
            }

            const buyEpisodeInput = {
                seriesId : episode.series.id,
                episodeId : episode.id
            }

            const req = await this.buyEpisode(authUser , buyEpisodeInput);



            if (req.ok) {
                return {
                    ok: true,
                    error : episode.id + ""
                }
            } else {
                return req
            }

        } catch (e) {
            return {
                ok: false,
                error: "구매 할 수 없습니다."
            }
        }
    }

}