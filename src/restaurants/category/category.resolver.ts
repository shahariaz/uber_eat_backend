import { Resolver } from '@nestjs/graphql';
import { Category } from '../entities/category.entity';
import { Query as GqlQuery } from '@nestjs/graphql';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryService } from './category.service';
import { Role } from 'src/auth/role.decorator';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoriesService: CategoryService) {}

  @GqlQuery(() => AllCategoriesOutput)
  @Role(['Any'])
  async allCategories(): Promise<AllCategoriesOutput> {
    return await this.categoriesService.allCategories();
  }
}
