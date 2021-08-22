import {Field, InputType, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Series} from "../../series/entities/series.entity";


export enum MainCategoryRole {
    Cartoon = 'Cartoon',
    Novel = 'Novel'
}

registerEnumType(MainCategoryRole, {name: 'MainCategoryRole'})

@InputType("CategoryInput" , {isAbstract: true})
@ObjectType()
@Entity('category')
export class Category extends CoreEntity {


    @Field(() => MainCategoryRole)
    @Column({type: 'enum', enum: MainCategoryRole})
    mainCategory : MainCategoryRole;


    @Field(() => String)
    @Column()
    categoryName : string


}
