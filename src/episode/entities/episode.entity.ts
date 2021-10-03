import {Field, InputType, Int, ObjectType} from "@nestjs/graphql";
import {BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, RelationId,} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Series} from "../../series/entities/series.entity";
import {InternalServerError} from "http-errors";

@InputType("EpisodeInput", {isAbstract: true})
@ObjectType()
@Entity('Episode')
export class Episode extends CoreEntity {

    @Field(() => Series)
    @ManyToOne(() => Series, Series => Series.id)
    series: Series;

    @Column()
    @Field(() => Int)
    episode: number;


    @Column("text", {array: true})
    @Field(() => [String])
    contents: string[]


    @Column()
    @Field(() => Int)
    howMuchCoin : number

}








