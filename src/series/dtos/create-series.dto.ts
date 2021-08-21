import {Field, InputType, Int, ObjectType, OmitType, PickType} from "@nestjs/graphql";
import {Series} from "../entities/series.entity";


@InputType()
export class CreateSeriesInput extends PickType(Series , ['thumbnail','name','serialization','like','view']) {
    @Field(() => Int)
    writer : number
}