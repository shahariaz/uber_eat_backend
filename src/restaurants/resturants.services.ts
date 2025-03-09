import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/resturant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { User } from 'src/users/entites/user.entity';

import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { CategoryRepository } from './repositories/category.repository';
import { Category } from './entities/category.entity';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly resturants: Repository<Restaurant>,
    @InjectRepository(CategoryRepository)
    private readonly category: CategoryRepository,
  ) {}

  async createResturant(
    owner: User,
    CreateRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.resturants.create(CreateRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.category.getOrCreateCategory(
        CreateRestaurantInput.categoryName,
      );
      newRestaurant.category = category;
      await this.resturants.save(newRestaurant);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not create restaurant' };
    }
  }
  async editRestaurant(
    owner: User,
    editResturantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      let category: Category | null = null;
      const isRestaurantExist = await this.resturants.findOne({
        where: { id: editResturantInput.restaurantId },
      });
      if (!isRestaurantExist) {
        return { ok: false, error: 'Restaurant not found' };
      }
      console.log(isRestaurantExist);
      if (owner.id !== isRestaurantExist.ownerId) {
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own",
        };
      }
      if (editResturantInput.categoryName) {
        category = await this.category.getOrCreateCategory(
          editResturantInput.categoryName,
        );
      }
      await this.resturants.save([
        {
          id: editResturantInput.restaurantId,
          ...editResturantInput,
          ...(category && { category }),
        },
      ]);

      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, error: 'Could not edit restaurant' };
    }
  }
  async deleteRestaurant(
    owner: User,
    restaurantId: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.resturants.findOne({
        where: { id: restaurantId.id },
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't delete a restaurant that you don't own",
        };
      }
      await this.resturants.delete(restaurantId);
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: 'Could not delete restaurant',
      };
    }
  }
}
