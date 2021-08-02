import {Field, InputType, Int, ObjectType} from "@nestjs/graphql";
import {CoreEntity} from "../../common/entities/core.entity";
import {Column, Entity} from "typeorm";


@InputType('pageViewInput', {isAbstract: true})
@ObjectType()
export class PageView {
    @Field(() => Int)
    page: number

    @Field(() => String)
    image: string
}


@ObjectType()
@InputType({isAbstract: true})
@Entity('part')
export class Part extends CoreEntity {

    @Field(() => String)
    @Column()
    title: string

    @Field(() => String)
    @Column()
    thumbnail: string

    @Field(() => [PageView])
    @Column({type: 'json'})
    pageView: PageView[]
}