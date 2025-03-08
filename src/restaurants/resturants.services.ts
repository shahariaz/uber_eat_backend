import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/resturant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { User } from 'src/users/entites/user.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly resturants: Repository<Restaurant>,
    @InjectRepository(Category) private readonly category: Repository<Category>,
  ) {}

  async createResturant(
    owner: User,
    CreateRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.resturants.create(CreateRestaurantInput);
      newRestaurant.owner = owner;
      const categoryName = CreateRestaurantInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      const category = await this.category.findOne({
        where: { slug: categorySlug },
      });
      if (category) {
        newRestaurant.category = category;
      } else {
        newRestaurant.category = await this.category.save(
          this.category.create({ slug: categorySlug, name: categoryName }),
        );
      }

      await this.resturants.save(newRestaurant);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not create restaurant' };
    }
  }
}
