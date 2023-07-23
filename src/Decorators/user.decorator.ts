import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

export const User = createParamDecorator((_data: string, context: ExecutionContext)=>{
    const request = context.switchToHttp().getRequest();
    if(request) {
        return request.user;
    }else{
        throw new NotFoundException("Usuário não encontrado no Request");
    }
}) 