import {Field, InputType, Int, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, RelationId} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Category} from "../../category/entities/category.entity";
import {User} from "../../user/entities/user.entity";
import {Episode} from "../../episode/entities/episode.entity";
import {PurChaseHistory} from "../../episode/entities/purchaseHistory.entity";

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


    @Field(() => User)
    @ManyToOne(() => User, {onDelete: "CASCADE"})
    writer: User


    @RelationId((series : Series) => series.writer)
    @Field(() => Int)
    writerId: number;


    @Field(() => PurChaseHistory , {nullable : true})
    @OneToMany(() => PurChaseHistory , purchaseHistory => purchaseHistory.Series)
    view : PurChaseHistory[]


    @Field(() => Category)
    @ManyToOne(() => Category)
    category: Category


    @Field(() => [Episode])
    @OneToMany(() => Episode , Episode => Episode.series)
    episode : Episode[]


}
