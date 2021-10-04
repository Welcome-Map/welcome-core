import { Test, TestingModule } from '@nestjs/testing';
import { internet } from 'faker';
import { PrismaService } from '../prisma.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;

  const userMock: User = {
    email: internet.email(),
    username: internet.userName(),
    passwordHash: internet.password(),
    admin: false,
    verified: true,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    jest
      .spyOn(usersRepository, 'create')
      .mockImplementation(() => Promise.resolve(userMock));
    const user = await service.create({
      email: internet.email(),
      username: internet.userName(),
      passwordHash: internet.password(),
    });
    expect(user.email).toEqual(userMock.email);
  });

  it('should find all users', async () => {
    jest
      .spyOn(usersRepository, 'findAll')
      .mockImplementation(() => Promise.resolve([userMock, userMock]));
    const user = await service.findAll();
    expect(user.length).toEqual(2);
  });

  it('should find one users', async () => {
    jest
      .spyOn(usersRepository, 'findOne')
      .mockImplementation(() => Promise.resolve(userMock));
    const user = await service.findOne({ email: userMock.email });
    expect(user.email).toEqual(userMock.email);
  });

  it('should find by username', async () => {
    jest
      .spyOn(usersRepository, 'findByUsername')
      .mockImplementation(() => Promise.resolve(userMock));
    const user = await service.findByUsername(userMock.username);
    expect(user.email).toEqual(userMock.email);
  });
  it('should find by email', async () => {
    jest
      .spyOn(usersRepository, 'findByEmail')
      .mockImplementation(() => Promise.resolve(userMock));
    const user = await service.findByEmail(userMock.email);
    expect(user.username).toEqual(userMock.username);
  });

  it('should update', async () => {
    jest
      .spyOn(usersRepository, 'findByEmail')
      .mockImplementation(() => Promise.resolve(userMock));
    const user = await service.findByEmail(userMock.email);
    expect(user.username).toEqual(userMock.username);
  });

  it('should delete', async () => {
    jest
      .spyOn(usersRepository, 'delete')
      .mockImplementation(() => Promise.resolve(userMock));
    const user = await service.delete({ email: userMock.email });
    expect(user.username).toEqual(userMock.username);
  });
});
