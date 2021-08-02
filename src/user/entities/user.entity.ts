import {
    Field,
    InputType,
    Int,
    ObjectType,
    registerEnumType,
} from '@nestjs/graphql';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {IsEmail, IsPhoneNumber} from 'class-validator';
import {CoreEntity} from 'src/common/entities/core.entity';
import * as bcrypt from 'bcrypt';
import {InternalServerError} from 'http-errors';

export enum UserRole {
    User = "User",
    Novelist = "Novelist",
    Cartoonist = "Cartoonist",
}

registerEnumType(UserRole, {name: 'UserRole'});

@InputType('UserInput', {isAbstract: true})
@ObjectType()
@Entity('User')
export class User extends CoreEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @IsEmail()
    @Field(() => String)
    @Column()
    email: string;

    @Field(() => String)
    @Column()
    password: string;

    @Field(() => UserRole)
    @Column({type: 'enum', enum: UserRole})
    role: UserRole;

    @Field(() => String)
    @Column()
    name: string;

    @IsPhoneNumber()
    @Field(() => String)
    @Column()
    phoneNumber: string;


    @Field(() => Int)
    @Column()
    coin: number;


    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch {
            throw new InternalServerError();
        }
    }

    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            const ok = await bcrypt.compare(aPassword, this.password);
            return ok;
        } catch (e) {
            throw new InternalServerError();
        }
    }
}
