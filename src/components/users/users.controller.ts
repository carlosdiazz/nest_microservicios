import { Controller, Get, Param } from '@nestjs/common';

//Propio
import { UsersService } from './users.service';
import { FindOneDto } from './../../common/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') findOneDto: FindOneDto) {
    return this.usersService.findOne(findOneDto);
  }
}
