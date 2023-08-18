import { Body, Controller, Post, Get, Param, Put, Patch, Delete, ParseIntPipe, UseInterceptors, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { AuthGuard } from "../Guards/auth.guard";
import { LogInterceptor } from "../Interceptors/log.interceptor";
import { Role } from "../Enums/role.enum";
import { Roles } from "../Decorators/role.decorator";
import { ParamId } from "../Decorators/param-id.decorator";
import { RoleGuard } from "../Guards/role.guard";


@UseGuards(RoleGuard, AuthGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {

    constructor( private readonly userService: UserService){}

    @Roles(Role.Admin, Role.User)
    @Post()
    async create(@Body() {email, name, password, role}: CreateUserDTO) {
        return this.userService.create({email, name, password, role })
    }

    @Get()
    async read() {
        return this.userService.read();

    }

    @Get(':id')
    async readOne(@ParamId() id: number) {
        return this.userService.readOne(id)     
    }
    
    @Roles(Role.Admin)
    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) {
        return this.userService.update(id, data);
    }

    @Roles(Role.Admin)
    @Patch(':id')
    async updatePartial(@Body() data : UpdatePatchUserDTO, @ParamId() id: number) {
        return this.userService.updatePartial(id, data)
    }

    @Roles(Role.Admin)
    @Delete(':id')
    async delete(@ParamId() id: number) {
        return this.userService.delete(id); 

    }
}