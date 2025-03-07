import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/resturant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly resturants: Repository<Restaurant>,
  ) {}

  async createResturant(createRestaurantDto: CreateRestaurantDto) {
    const newRestaurant = this.resturants.create(createRestaurantDto);

    return await this.resturants.save(newRestaurant);
  }
}
