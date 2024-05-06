import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

//Propio
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { FindOneDto } from './../../common/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userDocument: Model<UserDocument>,
  ) {}
  private readonly logger = new Logger('UsersService');

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    try {
      const newLotery = new this.userDocument(createUserDto);
      return await newLotery.save();
    } catch (error) {
      this.logger.error(`Error creando Usuario ${error}`);
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userDocument.find().exec();
    } catch (e) {
      this.logger.error(`Error findAll Usuario ${e}`);
      return [];
    }
  }

  async findOne(findOneDto: FindOneDto): Promise<User | null> {
    try {
      const { id } = findOneDto;
      const user = await this.userDocument.findById(id);
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      this.logger.error(`Error findOne Usuario ${e}`);
      return null;
    }
  }

  async findOneByIdTelegram(id_telegram: number): Promise<User | null> {
    try {
      const user = await this.userDocument.findOne({ id_telegram });
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      this.logger.error(`Error findOneByIdTelegram Usuario ${e}`);
      return null;
    }
  }

  async findOneByIdTelefono(telefono: string): Promise<User | null> {
    try {
      const user = await this.userDocument.findOne({ telefono });
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      this.logger.error(`Error findOneByIdTelefono Usuario ${e}`);
      return null;
    }
  }

  async update(
    id_telegram: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    try {
      return await this.userDocument
        .findOneAndUpdate(
          { id_telegram: id_telegram },
          { $set: updateUserDto },
          { new: true },
        )
        .exec();
    } catch (e) {
      this.logger.error(`Error findOneByIdTelefono Usuario ${e}`);
      return null;
    }
  }

  async remove(id_telegram: number) {
    await this.userDocument.deleteOne({ id_telegram: id_telegram });
  }
}
