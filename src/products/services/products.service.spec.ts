import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'

import { ProductsService } from './products.service'
import { ItemStock } from '../schemas/item-stocks.schema'

describe('ProductsService', () => {
  let service: ProductsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getModelToken('Product', 'pim-prod'), useValue: Model },
        { provide: getModelToken(ItemStock.name, 'oms'), useValue: Model },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
