import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Product, ProductReturnType } from '../schemas/product.schema'
import { GetProductByModelDto } from '../dtos/get-product-by-model.dto'

@Injectable()
export class ProductsService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {}

  getBaseProductDetails(product: ProductReturnType) {
    const NA: 'N/A' = 'N/A'

    const { itemId, searchTitle, brand, model } = product

    const baseProduct = {
      itemId,
      model,
      brand: brand ?? NA,
      searchTitle: searchTitle ?? NA,
    }

    return { statusCode: HttpStatus.OK, product: baseProduct }
  }

  getProductDetails(product: ProductReturnType) {
    const NA: 'N/A' = 'N/A'
    const cm: 'cm' = 'cm'
    const grams: 'g' = 'g'

    const {
      model,
      brand,
      searchTitle,
      s3Images,
      features,
      specification,
      price,
      whats_included,
      package_dimension,
      category,
    } = product

    const new_price = {
      Maintive: price?.Maintive ?? NA,
      ToolSelect: price?.ToolSelect ?? NA,
      EndUser: price?.EndUser ?? NA,
      Amazon: price?.Amazon ?? NA,
      Noon: price?.Noon ?? NA,
      OnlineReseller: price?.OnlineReseller ?? NA,
    }

    const new_dimension = {
      length: package_dimension?.length ?? NA,
      width: package_dimension?.width ?? NA,
      height: package_dimension?.height ?? NA,
      weight: package_dimension?.weight ?? NA,
      dimension_unit: cm,
      weight_unit: grams,
    }

    const new_category = {
      name: category?.[0]?.name ?? NA,
      breadCrumbs: category?.[0]?.breadCrumbs ?? NA,
    }

    const filteredProduct = {
      model,
      brand: brand ?? NA,
      searchTitle: searchTitle ?? NA,
      s3Images: s3Images ?? [],
      features: features ?? [NA],
      specification: specification ?? [],
      price: new_price,
      whats_included: whats_included ?? [NA],
      package_dimension: new_dimension,
      category: [new_category],
      soloCategory: new_category,
    }

    return { statusCode: HttpStatus.OK, product: filteredProduct }
  }

  async findBaseProductByModel({ model }: GetProductByModelDto) {
    const product = await this.productModel.findOne({ model })

    if (!product) {
      throw new HttpException(`${model} doesn't exist`, HttpStatus.NOT_FOUND)
    }

    return this.getBaseProductDetails(product)
  }

  async findProductById(itemId: number) {
    const product = await this.productModel.findOne({ itemId })

    if (!product) {
      throw new HttpException(
        `Product with itemId ${itemId} doesn't exist`,
        HttpStatus.NOT_FOUND,
      )
    }

    return this.getProductDetails(product)
  }
}
