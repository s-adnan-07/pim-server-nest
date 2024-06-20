import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import {
  Image,
  Product,
  ProductReturnType,
  S3Image,
} from '../schemas/product.schema'

import { GetProductByModelDto } from '../dtos/get-product-by-model.dto'
import { ItemStock } from '../schemas/item-stocks.schema'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product', 'pim-prod') private productModel: Model<Product>,
    @InjectModel(ItemStock.name, 'oms')
    private itemStockModel: Model<ItemStock>,
  ) {}

  async getStockDetails(erpItemCode?: string) {
    const itemStock = await this.itemStockModel
      .findOne({
        itemCode: erpItemCode,
      })
      .select({ 'warehouse._id': false })

    if (!itemStock) return []

    return itemStock.warehouse
  }

  getBaseProductDetails(product: ProductReturnType) {
    const NA = 'N/A'

    const { itemId, searchTitle, brand, model } = product

    const baseProduct = {
      itemId,
      model,
      brand: brand ?? NA,
      searchTitle: searchTitle ?? NA,
    }

    // return { statusCode: HttpStatus.OK, product: baseProduct }
    return { ...baseProduct }
  }

  async getProductDetails(product: ProductReturnType) {
    if (!product) return { product }

    const NA = 'N/A'
    const cm = 'cm'
    const grams = 'g'

    let {
      model,
      brand,
      searchTitle,
      images,
      s3Images,
      features,
      specification,
      price,
      whats_included,
      package_dimension,
      category,
      erpItemCode,
      warranty,
    } = product

    brand = brand ?? NA
    searchTitle = searchTitle ?? NA
    features = features.length == 0 ? null : features
    specification = specification?.length == 0 ? null : specification
    whats_included = whats_included?.length == 0 ? null : whats_included

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

    // We are taking images from from the 'images' field if s3 images is empty or doesn't exist
    let imageList: Array<S3Image | Image> = s3Images ?? []

    if (imageList.length == 0) {
      imageList = images ?? []
    }

    const stocks = await this.getStockDetails(erpItemCode)

    // TODO: Return ['N/A'] for empty arrays too, currently undefined values are only handled
    const filteredProduct = {
      model,
      brand,
      searchTitle,
      features,
      specification,
      whats_included,
      stocks,
      s3Images: imageList,
      price: new_price,
      package_dimension: new_dimension,
      soloCategory: new_category,
      warranty,
    }

    return { product: filteredProduct }
  }

  async findBaseProductByModel({ model }: GetProductByModelDto) {
    const cleaned = model.replace(/\W/gi, '.')
    const pattern = new RegExp(cleaned, 'i')
    const products = await this.productModel.find({ model: pattern }).limit(20)

    if (!products || products.length === 0) {
      throw new HttpException(`${model} doesn't exist`, HttpStatus.NOT_FOUND)
    }

    return products.map(product => this.getBaseProductDetails(product))
  }

  async findProductById(itemId: number) {
    const product = await this.productModel.findOne({ itemId })

    return this.getProductDetails(product)
  }
}
