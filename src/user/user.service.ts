import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class UserService {  

    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) 
    {}

    async create({email, name, password, role}: CreateUserDTO) {
        
        if( await this.usersRepository.exist({
            where: {
                email
            }
        })) {
            throw new BadRequestException("Este e-mail já está sendo usado")
        }

        password = await bcrypt.hash(password, await bcrypt.genSalt());

        const user = this.usersRepository.create({
            email, 
            name,
            password,
            role
        });

        return this.usersRepository.save(user)
    }

    async read() {
        return this.usersRepository.find();
    }
    
    async readOne(id: number) {
        await this.exists(id);

        return this.usersRepository.findOneBy({
            id
        });
    }
    
    async update(id: number, data: UpdatePutUserDTO) {
        await this.exists(id);
        
        await this.usersRepository.update(id, {
            ...data
        });

        return this.readOne(id);
    }

    async updatePartial(id: number, data: UpdatePatchUserDTO) {
        await this.exists(id);
        
        await this.usersRepository.update(id, {
            ...data
        });

        return this.readOne(id);
    }

    async delete(id: number) {

        this.exists(id);

        await this.usersRepository.delete(id);

        return true;
    }

    async exists(id: number) {
        if(!(await this.usersRepository.exist({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`O usuário ${id} não existe.`);
        }
        
    }
}