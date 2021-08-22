import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {CategoryService} from "./category.service";
import {CoreOutput} from "../common/dtos/core.dto";
import {CreateCategoryInput} from "./dtos/create-category.dto";
import {Roles} from "../auth/role.decorator";


@Resolver()
export class CategoryResolver {
    constructor(
        private readonly categoryService: CategoryService
    ) {
    }


    @Mutation(() => CoreOutput)
    async CreateCategory(
        @Args('input') input : CreateCategoryInput
    ) : Promise<CoreOutput> {
        return await this.categoryService.createCategory(input);
    }

}