import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { GetProductByModelDto } from '../dtos/get-product-by-model.dto'
import { ProductsService } from '../services/products.service'
import { Request } from 'express'
import * as util from 'util'

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  private logger = new Logger(ProductsController.name, { timestamp: true })

  @Post('base')
  @HttpCode(HttpStatus.OK)
  getBaseProductByModel(
    @Body() getProductByModel: GetProductByModelDto,
    @Req() { user }: Request,
  ) {
    this.logger.log(
      `'${user}': POST /products/base ${util.inspect(getProductByModel)}`,
    )
    return this.productsService.findBaseProductByModel(getProductByModel)
  }

  @Get('by-id/:itemId')
  getProductById(@Param('itemId') itemId: number, @Req() { user }: Request) {
    this.logger.log(`'${user}': GET /products/by-id/${itemId}`)
    return this.productsService.findProductById(itemId)
  }
}
