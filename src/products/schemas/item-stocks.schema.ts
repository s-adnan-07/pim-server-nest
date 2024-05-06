import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ItemStockDocument = HydratedDocument<ItemStock>
export type WarehouseDocument = HydratedDocument<Warehouse>

@Schema()
export class Warehouse {
  @Prop({ required: true })
  warehouseID: number

  @Prop({ required: true })
  warehouseName: string

  @Prop({ required: true })
  stock: number
}

@Schema({ timestamps: true, collection: 'item_stocks' })
export class ItemStock {
  @Prop({ required: true })
  itemID: number

  @Prop({ required: true })
  itemCode: string

  @Prop()
  itemDescription: string

  @Prop()
  identifier: string

  @Prop([Warehouse])
  warehouse: Warehouse[]

  @Prop()
  itemGazelleID: number

  @Prop()
  itemMaintiveID: number

  @Prop()
  itemToolSelectID: string
}

export const ItemStockSchema = SchemaFactory.createForClass(ItemStock)
