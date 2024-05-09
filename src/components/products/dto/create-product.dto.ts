import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  public name: string;

  @IsNumber()
  @Min(0)
  public price: number;
}

export class ValidateProductsIdDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  public ids: number[];
}
