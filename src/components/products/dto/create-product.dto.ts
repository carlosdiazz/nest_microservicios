import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  public name: string;

  @IsNumber()
  @Min(0)
  public price: number;
}
