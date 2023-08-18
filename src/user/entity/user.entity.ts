import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Role } from '../../Enums/role.enum';

@Entity({
    name: 'users'
})
export class UserEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id?: number;

    @Column({
        length: 67
    })
    name: string;

    @Column({
        length: 128,
        unique: true
    })
    email: string;
    
    @Column()
    password: string;
   
    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @Column({
        enum: [1, 2],
        default: 1
    })
    role: number;
}