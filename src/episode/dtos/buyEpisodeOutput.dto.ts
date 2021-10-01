import {Field, Int, ObjectType} from "@nestjs/graphql";
import {CoreOutput} from "../../common/dtos/core.dto";


@ObjectType()
export class BuyEpisodeOutput extends CoreOutput {
    @Field(() => Int , {nullable : true})
    buyEpisodeId ?: number
}