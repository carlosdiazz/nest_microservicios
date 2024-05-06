import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

//Propios
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindOneDto } from 'src/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], {
    name: 'allUser',
    description: 'Devolver todos los usuarios',
  })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Query(() => User, {
    name: 'findUser',
    description: 'Devolver todos los usuarios',
  })
  async findOne(@Args('id') findOneDto: FindOneDto): Promise<User> {
    return this.usersService.findOne(findOneDto);
  }

  @Mutation(() => User, {
    name: 'createUser',
    description: 'Para crear un Usuario',
  })
  async createResultado(
    @Args('createUserInput') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
