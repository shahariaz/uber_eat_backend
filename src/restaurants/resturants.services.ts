import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/resturant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-resturant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly resturants: Repository<Restaurant>,
  ) {}
  async getAll(): Promise<Restaurant[]> {
    return await this.resturants.find();
  }
  async createResturant(createRestaurantDto: CreateRestaurantDto) {
    const newRestaurant = this.resturants.create(createRestaurantDto);

    return await this.resturants.save(newRestaurant);
  }
  async updaateResturant(updateRestaurantDto: UpdateRestaurantDto) {
    const { id, data } = updateRestaurantDto;
    await this.resturants.update(id, { ...data });
  }
}
