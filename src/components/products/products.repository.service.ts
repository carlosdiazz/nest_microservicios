import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../database';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from './../../common';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsRepositoryService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    const { limit, page } = paginationDto;
    const totalPages = await this.prisma.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalPages / limit);
    return await this.prisma.product.findMany({
      where: { available: true },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Product | null> {
    return await this.prisma.product.findFirst({
      where: { id, available: true },
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
    //try {
    //  await this.prisma.product.delete({ where: { id } });
    //  return true;
    //} catch (e) {
    //  console.log(e);
    //  return false;
    //}
  }
}
