import {InputType, OmitType, PickType} from "@nestjs/graphql";
import {Category} from "../entities/category.entity";


@InputType()
export class CreateCategoryInput extends Category {}