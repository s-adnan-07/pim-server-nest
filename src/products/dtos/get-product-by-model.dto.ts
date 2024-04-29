import { IsNotEmpty, IsString } from 'class-validator'

export class GetProductByModelDto {
  @IsNotEmpty()
  @IsString()
  model: string
}
