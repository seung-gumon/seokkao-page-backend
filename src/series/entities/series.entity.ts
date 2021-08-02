import {Field, InputType, Int, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Column, Entity, OneToMany} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";


@ObjectType()
@InputType({isAbstract: true})
@Entity('series')
export class Series extends CoreEntity {

    @Field(() => String)
    @Column()
    thumbnail: string

    @Field(() => String)
    @Column()
    name: string


    @Field(() => String, {
        description: "언제 연재하는지"
    })
    @Column()
    serialization: string


    @Field(() => Int)
    @Column()
    like: number

    @Field(() => Int)
    @Column()
    view: number


    @Field(() => Int)
    @Column()
    comments: number
}
