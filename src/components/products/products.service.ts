import { Injectable } from '@nestjs/common';

import { CreateProductDto, Product, UpdateProductDto } from '..';
import { PaginationDto, ProductMock1, ResponsePopio } from './../../common';
import { MESSAGE } from './../../config';
import { ProductsRepositoryService } from './products.repository.service';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepositoryService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.repository.create(createProductDto);
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    return await this.repository.findAll(paginationDto);
  }

  async findOne(id: number): Promise<Product> {
    console.log(id);
    return ProductMock1;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return ProductMock1;
  }

  async remove(id: number): Promise<ResponsePopio> {
    return {
      message: MESSAGE.SE_ELIMINO_CORRECTAMENTE_ESTA_ENTIDAD,
      statusCode: 200,
      error: null,
    };
  }
}
