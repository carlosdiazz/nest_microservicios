import {
  Controller,
  //Get,
  //Post,
  //Body,
  //Patch,
  //Param,
  //Delete,
  //Query,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

//?Propio
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto, ResponsePopio } from './../../common';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'create_product' })
  //@Post()
  async create(
    @Payload() createProductDto: CreateProductDto,
  ): Promise<Product> {
    //async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'find_all_product' })
  //@Get()
  async findAll(@Payload() paginationDto: PaginationDto): Promise<Product[]> {
    return await this.productsService.findAll(paginationDto);
  }

  //@Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  async findOne(@Payload('id', ParseIntPipe) id: number): Promise<Product> {
    return await this.productsService.findOne(id);
  }

  //@Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  async update(
    //@Payload('id', ParseIntPipe) id: number,
    //@Body() updateProductDto: UpdateProductDto,
    @Payload() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    console.log(updateProductDto);
    return await this.productsService.update(
      updateProductDto.id,
      updateProductDto,
    );
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  async remove(
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<ResponsePopio> {
    return await this.productsService.remove(id);
  }
}
