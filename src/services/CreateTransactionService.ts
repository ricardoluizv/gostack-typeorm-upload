import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category_title: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_title,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const { total } = await transactionRepository.getBalance();
      if (total - value < 0) {
        throw new AppError(
          `The value is biggest than income, try a value less or equal at ${total}`,
        );
      }
    }

    const categoryService = new CreateCategoryService();
    const category = await categoryService.execute({ title: category_title });

    const transaction = transactionRepository.create({
      title,
      type: type === 'income' ? 'income' : 'outcome',
      value,
      category_id: category.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
