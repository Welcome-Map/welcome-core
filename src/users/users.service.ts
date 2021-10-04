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
    const users = await this.usersRepository.findAll({ skip, take });
    return users.map((user) => new User(user));
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const user = await this.usersRepository.findOne(userWhereUniqueInput);
    return new User(user);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findByUsername(username);
    return new User(user);
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);
    return new User(user);
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const user = await this.usersRepository.update(params);
    return new User(user);
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.usersRepository.delete(where);
    return new User(user);
  }
}
