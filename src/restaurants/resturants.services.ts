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
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { SearchRestaurantInput } from './dtos/search-restaurant.dto';
import {
  SingleRestaurantInput,
  SingleRestaurantOutput,
} from './dtos/single-resturant.dto';

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
      CreateRestaurantInput.name = CreateRestaurantInput.name.toLowerCase();
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
  async allRestaurants(
    resturantInput: RestaurantInput,
  ): Promise<RestaurantOutput> {
    try {
      const [restaurants, totalResults] = await this.resturants.findAndCount({
        take: 10,
        skip: (resturantInput.page - 1) * 10,
      });
      return {
        ok: true,
        restaurants,
        totalPages: Math.ceil(totalResults / 10),
        totalResults,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load restaurants',
      };
    }
  }
  async findRestaurantById({
    resturantId,
  }: SingleRestaurantInput): Promise<SingleRestaurantOutput> {
    try {
      const restaurant = await this.resturants.findOne({
        where: { id: resturantId },
        relations: ['dishes'],
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load restaurant',
      };
    }
  }
  async searchRestaurantByName(searchRestaurantInput: SearchRestaurantInput) {
    try {
      const { query, page = 1 } = searchRestaurantInput;

      if (!query?.trim()) {
        return {
          ok: false,
          error: 'Search query cannot be empty',
        };
      }

      const cleanedQuery = query.trim();
      const take = 10;
      const skip = (page - 1) * take;

      // Create query builder for restaurant
      const queryBuilder = this.resturants.createQueryBuilder('restaurant');

      // Add the where condition for restaurant name
      queryBuilder.where('restaurant.name ILIKE :query', {
        query: `%${cleanedQuery}%`,
      });

      // Join with dishes and select them
      queryBuilder
        .leftJoinAndSelect('restaurant.dishes', 'dish')
        .leftJoinAndSelect('restaurant.category', 'category')
        .orderBy('restaurant.name', 'ASC');

      // Execute query with pagination
      const [restaurants, totalResults] = await queryBuilder
        .take(take)
        .skip(skip)
        .getManyAndCount();

      // Log the dishes for debugging
      restaurants.forEach((restaurant) => {
        console.log(
          `Restaurant ${restaurant.name} has ${restaurant.dishes?.length || 0} dishes`,
        );
      });

      return {
        ok: true,
        restaurants,
        totalResults,
        totalPages: Math.ceil(totalResults / take),
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        ok: false,
        error: 'Could not search for restaurants',
      };
    }
  }
}
