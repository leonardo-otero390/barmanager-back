import { CocktailPrice, FormatedCocktailPrice } from './cocktailInterfaces';
import { FormatedCost, NeededCost } from './costInterfaces';
import { PublicCustomer } from './customerInterfaces';
import { FormatedDisposable, NeededDisposable } from './disposableInterfaces';

export interface ListCost {
  list: NeededCost[];
  total: number;
}

export interface ListCocktail {
  list: CocktailPrice[];
  total: number;
}

export interface ListDisposable {
  list: Omit<NeededDisposable, 'id' | 'measurementId'>[];
  total: number;
}

export interface BudgetCosts {
  costs: ListCost;
  cocktails: ListCocktail;
  disposables: ListDisposable;
  total: number;
}

export interface RawBudget {
  customer: PublicCustomer;
  category: string;
  guests: number;
  budgetCosts: BudgetCosts;
  sellPrice: number;
}

export interface FormatedListCost {
  list: FormatedCost[];
  total: string;
}

export interface FormatedListCocktail {
  list: FormatedCocktailPrice[];
  total: string;
}

export interface FormatedListDisposable {
  list: FormatedDisposable[];
  total: string;
}

interface FormatedBudgetCosts {
  costs: FormatedListCost;
  cocktails: FormatedListCocktail;
  disposables: FormatedListDisposable;
  total: string;
}

export interface FormatedBudget
  extends Omit<RawBudget, 'budgetCosts' | 'sellPrice'> {
  budgetCosts: FormatedBudgetCosts;
  sellPrice: string;
}
