import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "./entities/category.entity";
import {Repository} from "typeorm";
import {CoreOutput} from "../common/dtos/core.dto";
import {CreateCategoryInput} from "./dtos/create-category.dto";


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly category : Repository<Category>
    ) {
    }



    async createCategory(input : CreateCategoryInput) : Promise<CoreOutput> {
        try{
            await this.category.save(await this.category.create(input));
            return {
                ok :true
            }
        }catch{
            return {
                ok :false
            }
        }

    }


}