import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class MaintiveService {
  constructor(private configService: ConfigService) {}

  async updateBasePrice(basePrice: number) {
    const MAINTIVE_STRAPI = this.configService.get<string>('MAINTIVE_STRAPI')
    const result = await axios.post(`${MAINTIVE_STRAPI}/products`)
  }
}
