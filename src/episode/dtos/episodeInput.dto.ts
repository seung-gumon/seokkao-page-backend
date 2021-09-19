import {InputType, PickType} from "@nestjs/graphql";
import {Episode} from "../entities/episode.entity";


@InputType("episodeUpdateInput")
export class EpisodeInput extends PickType(Episode, ['id', 'contents']) {
}