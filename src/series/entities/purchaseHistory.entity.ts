import {Field, InputType, Int, ObjectType} from "@nestjs/graphql";
import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Series} from "./series.entity";
import {Episode} from "./episode.entity";
import {User} from "../../user/entities/user.entity";


@InputType('PurchaseHistoryInput', {isAbstract: true})
@ObjectType()
@Entity('PurchaseHistory')
export class PurChaseHistory extends CoreEntity {

    @ManyToOne(() => Series, Series => Series.id)
    @Field(() => Int)
    Series: number;

    @Field(() => [Episode])
    @ManyToOne(() => Episode, Episode => Episode.id)
    episode: Episode[];


    @Field(() => User)
    @ManyToOne(() => User, {onDelete: "CASCADE"})
    writer: User

}