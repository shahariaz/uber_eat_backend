import { Injectable } from '@nestjs/common';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish.dto';
import { User } from 'src/users/entites/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../entities/resturant.entity';
import { Repository } from 'typeorm';
import { Dish } from './entity/dish.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly resturant: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dish: Repository<Dish>,
  ) {}
  async createDish(
    createDishInput: CreateDishInput,
    authUser: User,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.resturant.findOne({
        where: { id: createDishInput.restaurantId },
      });
      if (!restaurant) {
        return { ok: false, error: 'Restaurant not found' };
      }
      if (authUser.id !== restaurant.ownerId) {
        return { ok: false, error: 'You are not allowed to do this' };
      }
      const dish = await this.dish.save(
        this.dish.create({ ...createDishInput, restaurant }),
      );
      console.log(dish);
      return Promise.resolve({ ok: true });
    } catch {
      return Promise.resolve({ ok: false, error: 'Could not create dish' });
    }
  }
}
