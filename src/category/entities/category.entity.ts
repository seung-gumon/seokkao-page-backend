import {Field, InputType, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Series} from "../../series/entities/series.entity";


export enum MainCategoryRole {
    Cartoon = 'Cartoon',
    Novel = 'Novel'
}

registerEnumType(MainCategoryRole, {name: 'MainCategoryRole'})

@ObjectType()
@InputType({isAbstract: true})
@Entity('category')
export class Category extends CoreEntity {


    @Field(() => MainCategoryRole)
    @Column({type: 'enum', enum: MainCategoryRole})
    mainCategory : MainCategoryRole;


    @Field(() => String)
    @Column()
    categoryName : string


    @Field(() => Series)
    @ManyToOne(() => Series)
    series: Series
}
