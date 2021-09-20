import {Field, InputType, Int, OmitType, PickType} from "@nestjs/graphql";
import {Episode} from "../entities/episode.entity";


@InputType("episodeUpdateInput")
export class EpisodeInput extends PickType(Episode, ['id', 'contents']) {
}


@InputType('episodeCreateInput')
export class CreateEpisodeInput extends OmitType(Episode, ['series','id','createdAt','updatedAt']) {
    @Field(() => Int)
    seriesId: number
}