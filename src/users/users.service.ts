import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(data);
    return new User(user);
  }

  async findAll(params?: { skip?: number; take?: number }): Promise<User[]> {
    const { skip, take } = params;
    return this.usersRepository.findAll({ skip, take });
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    return await this.usersRepository.findOne(userWhereUniqueInput);
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findByUsername(username);
  }
  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findByEmail(email);
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return await this.usersRepository.update(params);
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.usersRepository.delete(where);
  }
}
