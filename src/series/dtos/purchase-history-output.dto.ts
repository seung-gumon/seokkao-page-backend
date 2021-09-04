import {Field, Int, ObjectType} from "@nestjs/graphql";



@ObjectType()
export class PurchaseHistoryOutput {
    @Field(() => [String])
    date: string[]

    @Field(() => Int)
    purChaseHistoryLength: number[]
}