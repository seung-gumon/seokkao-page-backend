import {Field, InputType, Int, OmitType} from "@nestjs/graphql";
import {Series} from "../entities/series.entity";


@InputType()
export class CreateSeriesInput extends OmitType(Series, ["category", 'writer', 'like', 'view', 'episode', 'id', 'createdAt', 'updatedAt']) {
    @Field(() => Int)
    category: number

    @Field(() => Int, {defaultValue: 0, nullable: true})
    like ?: number
}