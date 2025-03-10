import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../entities/resturant.entity';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryInput } from './dtos/category.dto';

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
  async findCategoryBySlug(slug: CategoryInput) {
    try {
      const category = await this.category.findOne({
        where: { slug: slug.slug },
        relations: ['restaurants'],
      });
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }
      return {
        ok: true,
        category,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }
}
