import { Args, Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Category } from '../entities/category.entity';
import { Query as GqlQuery } from '@nestjs/graphql';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryService } from './category.service';
import { Role } from 'src/auth/role.decorator';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoriesService: CategoryService) {}
  @ResolveField(() => Int)
  async restaurantCount(@Parent() category: Category): Promise<number> {
    return await this.categoriesService.countRestaurants(category);
  }
  @GqlQuery(() => AllCategoriesOutput)
  @Role(['Any'])
  async allCategories(): Promise<AllCategoriesOutput> {
    return await this.categoriesService.allCategories();
  }
  @GqlQuery(() => CategoryOutput)
  @Role(['Any'])
  async category(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return await this.categoriesService.findCategoryBySlug(
      categoryInput.slug,
      categoryInput.page,
    );
  }
}
