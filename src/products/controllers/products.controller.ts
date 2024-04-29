import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common'
import { GetProductByModelDto } from '../dtos/get-product-by-model.dto'
import { ProductsService } from '../services/products.service'

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post('base')
  @HttpCode(HttpStatus.OK)
  getBaseProductByModel(@Body() getProductByModel: GetProductByModelDto) {
    return this.productsService.findBaseProductByModel(getProductByModel)
  }

  @Get('by-id/:itemId')
  getProductById(@Param('itemId') itemId: number) {
    return this.productsService.findProductById(itemId)
  }
}
