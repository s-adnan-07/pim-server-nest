import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'

import { ProductsController } from './products.controller'
import { ProductsService } from '../services/products.service'
import { ItemStock } from '../schemas/item-stocks.schema'
import { GetProductByModelDto } from '../dtos/get-product-by-model.dto'

describe('ProductsController', () => {
  let controller: ProductsController
  let service: ProductsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        { provide: getModelToken('Product', 'pim-prod'), useValue: Model },
        { provide: getModelToken(ItemStock.name, 'oms'), useValue: Model },
      ],
    }).compile()

    controller = module.get<ProductsController>(ProductsController)
    service = module.get<ProductsService>(ProductsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('base', () => {
    it('should call getBaseProductByModel', async () => {
      const getProductByModel: GetProductByModelDto = {
        model: 'G9701',
      }

      jest.spyOn(service, 'findBaseProductByModel').mockImplementation()

      await controller.getBaseProductByModel(getProductByModel)
      expect(service.findBaseProductByModel).toHaveBeenCalledWith(
        getProductByModel,
      )
    })
  })

  describe('by-id/:itemId', () => {
    it('should call findProductById', async () => {
      const itemId = 24390

      jest.spyOn(service, 'findProductById').mockImplementation()

      await controller.getProductById(itemId)
      expect(service.findProductById).toHaveBeenCalledWith(itemId)
    })
  })
})
