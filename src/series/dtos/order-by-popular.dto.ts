import {Field, ObjectType} from "@nestjs/graphql";
import {Series} from "../entities/series.entity";






@ObjectType()
export class OrderByPopularOutput {

    @Field(() => [Series])
    cartoon: Series[]

    @Field(() => [Series])
    novel: Series[]
}