import {Field, InputType, Int, ObjectType, OmitType, PickType} from "@nestjs/graphql";
import {Series} from "../entities/series.entity";


@InputType()
export class CreateSeriesInput extends OmitType(Series,["category",'writer']){
    @Field(() => Int)
    category : number
}