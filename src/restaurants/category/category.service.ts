import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../entities/resturant.entity';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryOutput } from './dtos/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly category: CategoryRepository,
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
  ) {}
  async allCategories() {
    try {
      const categories = await this.category.find();
      const length = categories.length;
      return {
        ok: true,
        categories,
        totalResults: length,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load categories',
      };
    }
  }
  async countRestaurants(category: Category) {
    return this.restaurant.count({ where: { category: { id: category.id } } });
  }
  async findCategoryBySlug(
    slug: string,
    page: number,
  ): Promise<CategoryOutput> {
    try {
      const category = await this.category.findOne({
        where: { slug },
      });

      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }

      const totalRestaurants = await this.countRestaurants(category);

      // Only fetch restaurants if category exists
      const restaurants = await this.restaurant.find({
        where: { category: { id: category.id } },
        take: 10,
        skip: (page - 1) * 10,
        // Add caching if these rarely change
        // cache: true,
      });

      category.restaurants = restaurants;

      return {
        ok: true,
        category,
        totalPages: Math.ceil(totalRestaurants / 10),
      };
    } catch (error) {
      console.error('Error in findCategoryBySlug:', error);
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }
}
