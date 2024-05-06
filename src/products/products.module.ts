import { Module } from '@nestjs/common'
import { ProductsController } from './controllers/products.controller'
import { ProductsService } from './services/products.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductSchema } from './schemas/product.schema'
import { ItemStock, ItemStockSchema } from './schemas/item-stocks.schema'

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Product', schema: ProductSchema }],
      'pim-prod',
    ),
    MongooseModule.forFeature(
      [{ name: ItemStock.name, schema: ItemStockSchema }],
      'oms',
    ),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
