import sgMail from '@sendgrid/mail';
import { RawBudget } from '../interface/budgetInterfaces.js';
import { FormatedCocktailPrice } from '../interface/cocktailInterfaces.js';
import { FormatedCost } from '../interface/costInterfaces.js';
import { FormatedDisposable } from '../interface/disposableInterfaces.js';
import * as budgetService from './budgetService.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
interface Mail {
  email: string;
  msg: string;
  subject: string;
}

function buildBudgetMsg(budget: RawBudget) {
  function buildCostList(
    costs: FormatedCost[] | FormatedCocktailPrice[] | FormatedDisposable[]
  ) {
    let result = '';
    costs.forEach((cost) => {
      result += `${cost.quantity} ${cost.name} - $${cost.price}\n`;
    });
    return result;
  }
  const { category, customer, guests, budgetCosts, sellPrice } =
    budgetService.formatCurrency(budget);

  const title = `New ${category} budget request for ${guests} guests`;
  const customerInfos = `
    Name: ${customer.name}
    Email: ${customer.email}
    Phone: ${customer.phone}`;
  const { costs, cocktails, disposables } = budgetCosts;
  const costsText = `
    Costs: 
      ${buildCostList(costs.list)}
      total: ${costs.total};
    Cocktails:
      ${buildCostList(cocktails.list)}
      total: ${cocktails.total};
    Disposables:
      ${buildCostList(disposables.list)}
      total: ${disposables.total};
      `;
  const suggestedPrice = `Total suggested price: ${sellPrice}`;

  return `${title}\nCustomer infos:${customerInfos}\n${costsText}\n${suggestedPrice}`;
}

export async function send({ email, msg, subject }: Mail) {
  const structure = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    text: msg,
  };
  await sgMail.send(structure);
}

export async function sendBudget(budget: RawBudget) {
  const msg = buildBudgetMsg(budget);
  const { email } = budget.customer;
  const subject = 'New budget request';
  await send({ email, msg, subject });
}
