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
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly resturants: Repository<Restaurant>,
    @InjectRepository(Category) private readonly category: Repository<Category>,
    @InjectRepository(CategoryRepository)
    private readonly categoryRepo: CategoryRepository,
  ) {}
  async getOrCreateCategory(name: string) {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/ /g, '-');
    let category = await this.category.findOne({
      where: { slug: categorySlug },
    });
    if (!category) {
      category = await this.category.save(
        this.category.create({ slug: categorySlug, name: categoryName }),
      );
    }
    return category;
  }
  async createResturant(
    owner: User,
    CreateRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.resturants.create(CreateRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.getOrCreateCategory(
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
        const category = await this.getOrCreateCategory(
          editResturantInput.categoryName,
        );
        isRestaurantExist.category = category;
      }
      await this.resturants.save([
        {
          id: editResturantInput.restaurantId,
          ...editResturantInput,
        },
      ]);

      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not edit restaurant' };
    }
  }
}
