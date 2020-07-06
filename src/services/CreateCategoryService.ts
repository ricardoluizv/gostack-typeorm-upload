import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);
    const exists = await categoryRepository.findOne({ title });

    if (!exists) {
      const category = categoryRepository.create({ title });
      await categoryRepository.save(category);

      return category;
    }
    return exists;
  }
}

export default CreateCategoryService;
