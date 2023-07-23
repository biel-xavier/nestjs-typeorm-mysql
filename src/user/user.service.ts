import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/Prisma/prisma.service";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {  

    constructor(private readonly prisma: PrismaService) {}

    async create({email, name, password, role}: CreateUserDTO) {
        

        password = await bcrypt.hash(password, await bcrypt.genSalt());

        return  this.prisma.users.create({
            data: {
                email, 
                name,
                password,
                role
            },
        });
    }

    async read() {
        return this.prisma.users.findMany();
    }
    
    async readOne(id: number) {
        await this.exists(id);

        return this.prisma.users.findUnique({
            where: {
                id
            }
        });
    }
    
    async update(id: number, data: UpdatePutUserDTO) {
        await this.exists(id);
        
        return this.prisma.users.update({
            data,
            where: {
                id
            }
        });
    }

    async updatePartial(id: number, data: UpdatePatchUserDTO) {
        await this.exists(id);
        
        return this.prisma.users.update({
            data,
            where: {
                id
            }
        });
    }

    async delete(id: number) {

        this.exists(id);

        return this.prisma.users.delete({
            where: {
                id
            }
        })
    }

    async exists(id: number) {
        if(!(await this.prisma.users.count({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`O usuário ${id} não existe.`);
        }
        
    }
}