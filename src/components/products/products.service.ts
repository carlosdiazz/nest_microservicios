import { Injectable, NotFoundException } from '@nestjs/common';

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
    const product = await this.repository.findOne(id);
    if (!product) {
      console.log(product);
      throw new NotFoundException(MESSAGE.ESTA_ENTIDAD_NO_EXISTE);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findOne(id);
    return await this.repository.update(id, updateProductDto);
  }

  async remove(id: number): Promise<ResponsePopio> {
    await this.findOne(id);
    await this.repository.remove(id);
    return {
      message: MESSAGE.SE_ELIMINO_CORRECTAMENTE_ESTA_ENTIDAD,
      statusCode: 200,
      error: null,
    };
  }
}
