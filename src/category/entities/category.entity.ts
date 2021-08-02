import {Field, InputType, Int, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Column, Entity, OneToMany} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";


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




}
