import {Field, InputType, Int, PickType} from "@nestjs/graphql";
import {BuyEpisodeInput} from "./buyEpisodeInput.dto";


@InputType()
export class prevOrNextEpisodeInput extends PickType(BuyEpisodeInput, ['seriesId']) {
    @Field(() => Int)
    episode: number
}