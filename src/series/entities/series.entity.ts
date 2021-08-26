import {Field, InputType, Int, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Category} from "../../category/entities/category.entity";
import {User} from "../../user/entities/user.entity";

@InputType("SeriesInput",  {isAbstract: true})
@ObjectType()
@Entity('Series')
export class Series extends CoreEntity {


    @Field(() => String)
    @Column()
    thumbnail: string

    @Field(() => String)
    @Column()
    name: string

    @Field(() => String)
    @Column()
    description: string


    @Field(() => String, {
        description: "언제 연재하는지"
    })
    @Column()
    serialization: string


    @Field(() => Int)
    @Column({default : 0})
    like: number

    @Field(() => Int)
    @Column({default : 0})
    view: number


    @Field(() => User)
    @ManyToOne(() => User, {onDelete: "CASCADE"})
    writer: User


    @Field(() => Category)
    @ManyToOne(() => Category)
    category: Category


}
