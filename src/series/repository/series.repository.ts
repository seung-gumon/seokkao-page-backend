import {EntityRepository, Repository} from "typeorm";
import {Series} from "../entities/series.entity";
import {User} from "../../user/entities/user.entity";
import {CoreOutput} from "../../common/dtos/core.dto";


@EntityRepository(Series)
export class SeriesRepository extends Repository<Series> {

    async adminValidationCheck(seriesId: number, authUser: User): Promise<CoreOutput> {
        try {
            const series = await this.findOne({
                where: {
                    id: seriesId
                },
            });

            if (!series || series.writerId !== authUser.id) {
                return {
                    ok: false,
                    error: "시리즈를 찾을 수 없거나 권한이 없는 계정입니다."
                }
            }

            return {
                ok: true
            }
        } catch (e) {
            return {
                ok: false,
                error: "업데이트에 실패하였습니다."
            }
        }
    }
}