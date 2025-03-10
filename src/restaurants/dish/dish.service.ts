import { Injectable } from '@nestjs/common';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish.dto';
import { User } from 'src/users/entites/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../entities/resturant.entity';
import { Repository } from 'typeorm';
import { Dish } from './entity/dish.entity';
import { EditDishInput } from './dto/edit-dish.dto';
import { DeleteDishInput } from './dto/delete-dish.dto';

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
  async editDish(editDishInput: EditDishInput, owner: User) {
    try {
      const dish = await this.dish.findOne({
        where: { id: editDishInput.dishId },
        relations: ['restaurant'],
      });
      if (!dish) {
        return { ok: false, error: 'Dish not found' };
      }
      if (owner.id !== dish.restaurant.ownerId) {
        return { ok: false, error: 'You are not allowed to do this' };
      }
      await this.dish.save([
        {
          id: editDishInput.dishId,
          ...editDishInput,
        },
      ]);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not edit dish' };
    }
  }
  async deleteDish(deleteDishInput: DeleteDishInput, owner: User) {
    try {
      const Dish = await this.dish.findOne({
        where: { id: deleteDishInput.dishId },
        relations: ['restaurant'],
      });
      if (!Dish) {
        return { ok: false, error: 'Dish not found' };
      }
      if (owner.id !== Dish.restaurant.ownerId) {
        return { ok: false, error: 'You are not allowed to do this' };
      }
      await this.dish.delete(deleteDishInput.dishId);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not delete dish' };
    }
  }
}
