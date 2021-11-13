import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {CategoryService} from "./category.service";
import {CoreOutput} from "../common/dtos/core.dto";
import {CreateCategoryInput} from "./dtos/create-category.dto";
import {Roles} from "../auth/role.decorator";
import {Category} from "./entities/category.entity";


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

    @Roles(['Novelist', 'Cartoonist'])
    @Query(() => [Category])
    async getCategoryByAdminRole(
        @Args('mainCategory') mainCategory : string
    ) : Promise<Category[]> {
        return await this.categoryService.getCategoryByAdminRole(mainCategory)
    }

}