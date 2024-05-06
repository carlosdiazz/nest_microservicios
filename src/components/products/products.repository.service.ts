import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../database';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsRepositoryService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    const { limit, page } = paginationDto;
    const totalPages = await this.prisma.product.count();
    const lastPage = Math.ceil(totalPages / limit);
    return await this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
