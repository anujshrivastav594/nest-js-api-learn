import { ForbiddenException, Injectable } from "@nestjs/common";

import {User, Bookmark} from "@prisma/client"
import { AuthDto } from "src/dto";
import { PrismaService } from "src/prisma/prisma.service";//able to import as it is globally exported .
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService) {}
    async signup(dto: AuthDto) {
        //generate the hash password
        const hash = await argon.hash(dto.password);
        // console.log(hash);
        //save the new user in the db
        try {
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
            },
            // select: {
            //     id: true,
            //     email: true,
            //     createdAt: true,
            // },
            
        })
        //return the saved user
        delete user.hash; // should not do, but here as a demo for learning purpose.
        return user;
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if(error.code === "P2002") {
                throw new ForbiddenException("Credentials Taken");
            }
        }
        throw error;
    }
    }

    async signin(dto: AuthDto) {
        // find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        //if user does not exist, throw exception
        if(!user)
            throw new ForbiddenException(
            "credentials incorrect",
    );
        //compare password
        const pwMatches = await argon.verify(user.hash, dto.password);
        //if password incorrect throw exception.
        if(!pwMatches) {
            throw new ForbiddenException(
                "credentials incorrect",
        );
        }
        //if everything okk, then send back the user.
        
        delete user.hash;
        return user;
    }
}