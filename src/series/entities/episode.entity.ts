import {Field, InputType, Int, ObjectType} from "@nestjs/graphql";
import {Column, Entity, ManyToOne,} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Series} from "./series.entity";

@InputType("EpisodeInput", {isAbstract: true})
@ObjectType()
@Entity('Episode')
export class Episode extends CoreEntity {
    @ManyToOne(() => Series, Series => Series.id)
    @Field(() => Int)
    Series: number;

    @Column()
    @Field(() => Int)
    episode: number;


    @Column("text", {array: true})
    @Field(() => [String])
    contents: string[]
}





