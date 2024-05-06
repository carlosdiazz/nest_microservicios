import { Injectable } from '@nestjs/common';

import { CreateProductDto, Product, UpdateProductDto } from '..';
import { ProductMock1 } from './../../common';

@Injectable()
export class ProductsService {
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return ProductMock1;
  }

  async findAll(): Promise<Product[]> {
    return [];
  }

  async findOne(id: number): Promise<Product> {
    return ProductMock1;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return ProductMock1;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
