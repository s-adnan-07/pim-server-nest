import mongoose, { Schema, Document, Types, Model } from 'mongoose'

const docEnum = ['DATASHEETS', 'USERMANUALS', 'CERTIFICATES']

export type DocType =
  | 'Datasheet'
  | 'User Manual'
  | 'Arabic User Manual'
  | 'Certificate'
  | 'Others'

export interface keySpec {
  attribute: string
  value: string
}

export interface spec extends keySpec {
  filter?: boolean
}

export interface Category {
  category: Types.ObjectId
  name: string
  breadCrumbs: string
}

export interface Dimension {
  length?: number
  width?: number
  height?: number
  weight?: number
  dimension_unit?: string
  weight_unit?: string
}

export interface variantAttributes {
  arg1?: string
  arg2?: string
  arg3?: string
}

export interface Image {
  is_main?: boolean
  url: string
}

export interface Datasheet {
  name?: 'DATASHEETS' | 'USERMANUALS' | 'CERTIFICATES'
  url?: string
}

export interface URL {
  maintive?: string
}

export interface Promotion {
  startDate?: Date
  endDate?: Date
  salePrice?: number
}

export class S3Image {
  sno: number
  url: string
  source?: string

  constructor(sno: number, url: string) {
    this.sno = sno
    this.url = url
  }
}

export class S3Document {
  url: string
  fileType: DocType

  constructor(url: string, type: DocType = 'Datasheet') {
    this.url = url
    this.fileType = type
  }
}

export interface Product {
  // Index signature is used to define how props of IProduct Object can be accesses
  // The below index signature enables us to use dynamic string index
  // eg.
  //      prod: IProduct = {...}
  //      let key = 'model'
  //      prod['model']       => WILL WORK
  //      prod[key]           => Will throw error if below line isn't included

  [index: string]: any

  // #################### Basic details ####################

  brand?: string
  model: string
  searchTitle?: string
  itemId: number
  slug?: string
  aabSlug?: string
  url?: URL

  // #################### Codes####################

  itemCode: string
  erpItemCode?: string
  WMSCode?: number

  // Obsolete?
  erpItemId?: number

  // #################### Pricing & Stock ####################

  price?: {
    EndUser?: number
    ToolSelect?: number
    Maintive?: number
    Amazon?: number
    Noon?: number
    OnlineReseller?: number
  }

  stock?: number

  // To be obsolete
  toolSelect_price?: number
  marketplace_price?: number

  // #################### Active flags ####################

  active?: boolean
  marketplace_active?: boolean
  toolSelect_active?: boolean

  // #################### Platform specific strap ids ####################

  maintiveId?: number
  strapi_id?: number
  test_id?: number

  // #################### Categories ####################

  category?: Array<Category>
  gazelleCategory?: Array<Category>

  // To be obsolete
  ecategory?: string
  esubcategory?: string
  eproduct_type?: string
  eproducttype?: mongoose.Schema.Types.ObjectId

  // Obsolete
  subcategory?: string
  product_type?: mongoose.Schema.Types.ObjectId
  producttype?: mongoose.Schema.Types.ObjectId

  // #################### Further Details ####################

  warranty?: string
  description?: string
  features?: Array<string>
  specification?: Array<spec>
  keySpecs?: Array<keySpec>
  whats_included?: Array<string>
  shortDescription?: string

  // #################### Media ####################

  images?: Array<Image>

  documents?: Array<Datasheet>

  // Obsolete
  datasheet_url?: string

  // #################### Dimensions & Shipping ####################

  product_dimension?: Dimension
  package_dimension?: Dimension
  barcode?: string
  CountryCode?: string
  HSCode?: string
  deliveryLatency?: number
  returnsPolicy?: string
  clickAndCollectAvailable?: boolean

  // #################### Sale & Promotion ####################

  onSale?: boolean
  maintivePromotion?: Promotion

  // #################### Alternates & Variants ####################

  isVariantParent?: boolean
  isVariantChild?: boolean
  variantParent?: number
  variant?: { model?: string; maintiveId?: number }[]
  variantAttributes?: variantAttributes

  alternate?: { model: string; itemCode: string }[]
  tags?: Array<string>
  searchTerms?: Array<string>

  // #################### Calibration ####################

  isCal?: boolean
  calibration_price?: number
  calibrationItemCode?: string

  // #################### Google Merchant Center ####################

  googleAds?: {
    title?: string
    category?: string
  }

  // #################### Dates ####################

  created_at?: Date
  updated_at?: Date

  // #################### Added by Sabir ####################

  // reservedStock   ?: number,
  // warehouse       ?: {
  //     id      : number,
  //     name    : string,
  //     stock   : number
  // }[]

  // #################### Misc ####################

  maintiveSku?: string
  imageUpdate?: boolean
  ASIN?: string
  untilStocksLast?: boolean
  catalog_no?: string
  changed?: boolean // This is custom flag by me to upload to strapi without query
  rankingWeightage?: number
  scUpdate?: boolean

  // Obsolete ?
  supported?: boolean

  filterAttributes?: {
    attributeSet?: mongoose.Schema.Types.ObjectId
    attribute?: string
    value?: string
  }

  s3Images?: S3Image[]
  s3Documents?: S3Document[]
}

export type ProductReturnType = Document<unknown, {}, Product> &
  Product & { _id: Types.ObjectId }

export type ProductModelType = Model<
  Product,
  {},
  {},
  {},
  ProductReturnType,
  any
>

// #################### Schema Definition from here ####################

export const ProductSchema = new Schema<Product>({
  // #################### Basic details ####################

  brand: String,
  model: { type: String, required: true, unique: true },
  searchTitle: String,
  itemId: { type: Number, required: true, unique: true },
  slug: String,
  aabSlug: String,
  url: { maintive: String },

  // #################### Codes####################

  itemCode: String,
  erpItemCode: String,
  WMSCode: Number,

  // Obsolete?
  erpItemId: Number,

  // #################### Pricing & Stock ####################

  price: {
    EndUser: Number,
    ToolSelect: Number,
    Maintive: Number,
    Amazon: Number,
    Noon: Number,
    OnlineReseller: Number,
  },

  stock: Number,

  // To be obsolete
  toolSelect_price: Number,
  marketplace_price: Number,

  // #################### Active flags ####################

  active: Boolean,
  marketplace_active: Boolean,
  toolSelect_active: Boolean,

  // #################### Platform specific strap ids ####################

  maintiveId: Number,
  strapi_id: Number,
  test_id: Number,

  // #################### Categories ####################

  category: [
    {
      category: Types.ObjectId,
      name: String,
      breadCrumbs: String,
    },
  ],

  gazelleCategory: [
    {
      category: Types.ObjectId,
      name: String,
      breadCrumbs: String,
    },
  ],

  // To be obsolete
  ecategory: String,
  esubcategory: String,
  eproduct_type: String,
  eproducttype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'eproducttype',
  },

  // Obsolete
  subcategory: String,
  product_type: String,
  producttype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'producttype',
  },

  // #################### Further Details ####################

  warranty: String,
  description: String,
  features: [String],

  specification: [
    {
      attribute: String,
      value: String,
      filter: Boolean,
    },
  ],

  keySpecs: [
    {
      attribute: String,
      value: String,
    },
  ],

  whats_included: [String],
  shortDescription: String,

  // #################### Media ####################

  images: [
    {
      is_main: Boolean,
      url: String,
    },
  ],

  documents: [
    {
      name: { type: String, enum: docEnum },
      url: String,
    },
  ],

  // Obsolete
  datasheet_url: String,

  // #################### Dimensions & Shipping ####################

  product_dimension: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    dimension_unit: String,
    weight_unit: String,
  },

  package_dimension: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    dimension_unit: String,
    weight_unit: String,
  },

  barcode: String,
  CountryCode: String,
  HSCode: String,
  deliveryLatency: Number,
  returnsPolicy: String,
  clickAndCollectAvailable: Boolean,

  // #################### Sale & Promotion ####################

  onSale: Boolean,
  maintivePromotion: {
    startDate: Date,
    endDate: Date,
    salePrice: Number,
  },

  // #################### Alternates & Variants ####################

  isVariantParent: Boolean,
  isVariantChild: Boolean,
  variantParent: Number,
  variant: [{ model: String, maintiveId: Number }],
  variantAttributes: {
    arg1: String,
    arg2: String,
    arg3: String,
  },

  alternate: [{ model: String, itemCode: String }],
  tags: [String],
  searchTerms: [String],

  // #################### Calibration ####################

  isCal: Boolean,
  calibration_price: Number,
  calibrationItemCode: String,

  // #################### Google Merchant Center ####################

  googleAds: {
    title: String,
    category: String,
  },

  // #################### Dates ####################

  created_at: Date,
  updated_at: Date,

  // #################### Added by Sabir ####################

  // reservedStock   : {type: Number, default: 0},
  // warehouse       : [{
  //     id      : Number,
  //     name    : String,
  //     stock   : Number
  // }]

  // #################### Misc ####################

  maintiveSku: String,
  imageUpdate: Boolean,
  ASIN: String,
  untilStocksLast: Boolean,
  catalog_no: String,
  changed: Boolean, // This is custom flag by me to upload to strapi without query
  rankingWeightage: Number,
  scUpdate: Boolean,

  // Obsolete ?
  supported: Boolean,

  filterAttributes: {
    attributeSet: mongoose.Schema.Types.ObjectId,
    attribute: String,
    value: String,
  },

  s3Images: [{ _id: false, sno: Number, url: String, source: String }],
  s3Documents: [{ _id: false, fileType: String, url: String }],
})

// Arrow functions don't work here apparently

ProductSchema.pre('save', function (next) {
  if (!this.created_at) this.created_at = new Date()
  this.updated_at = new Date()

  next()
})

// Pre hooks are called on schema ** BEFORE ** compiling model

// Default model
// const Product = model<IProduct>('Product', ProductSchema)

// export default Product
