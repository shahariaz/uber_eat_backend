import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly category: CategoryRepository) {}
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
}
