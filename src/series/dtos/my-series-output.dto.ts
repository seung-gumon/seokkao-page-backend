import {Field, ObjectType} from "@nestjs/graphql";
import {User} from "../../user/entities/user.entity";
import {Series} from "../entities/series.entity";


@ObjectType()
export class MySeriesOutputDto extends User {

    @Field(() => [Series])
    series : Series[]
}