import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/resturant.entity';
import { RestaurantService } from './resturants.services';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './category/category.service';
import { CategoryResolver } from './category/category.resolver';
import { Dish } from './dish/entity/dish.entity';
import { DishResolver } from './dish/dish.resolver';
import { DishService } from './dish/dish.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, Category, CategoryRepository, Dish]),
  ],
  providers: [
    RestaurantResolver,
    RestaurantService,
    CategoryRepository,
    CategoryService,
    CategoryResolver,
    DishResolver,
    DishService,
  ],
})
export class RestaurantsModule {}
