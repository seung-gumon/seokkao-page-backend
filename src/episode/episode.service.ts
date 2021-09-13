import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Episode} from "./entities/episode.entity";
import {Repository} from "typeorm";
import {PurChaseHistory} from "./entities/purchaseHistory.entity";
import {PurChaseHistoryInput, PurchaseHistoryOutput} from "./dtos/purchase-history.dto";
import * as moment from 'moment';
import {User} from "../user/entities/user.entity";
import {Series} from "../series/entities/series.entity";

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
                    episode: episodeId,
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
                relations: ['episode', 'category'],
            })

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
                series,
            }
        } catch (e) {
            console.log(e);
            return null
        }
    }


}