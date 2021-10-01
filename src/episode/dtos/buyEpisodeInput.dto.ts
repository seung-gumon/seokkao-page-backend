import {Field, InputType, Int} from "@nestjs/graphql";


@InputType()
export class BuyEpisodeInput {

    @Field(() => Int)
    seriesId : number

    @Field(() => Int)
    episodeId : number

}