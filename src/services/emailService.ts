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
      result += `${cost.quantity} ${cost.name} - ${cost.price}<br>`;
    });
    return result;
  }
  const { category, customer, guests, budgetCosts, sellPrice } =
    budgetService.formatCurrency(budget);

  const title = `<h2><strong>New ${category} budget request for ${guests} guests</strong></h2>`;
  const customerInfos = `
  <p>
    Name: ${customer.name}<br>
    Email: ${customer.email}<br>
    Phone: ${customer.phone}<br>
</p>`;
  const { costs, cocktails, disposables } = budgetCosts;
  const costsText = `
  <div style="margin:16px;">
    Costs:<br>
      ${buildCostList(costs.list)}
      total: ${costs.total};<br>
    <br>Cocktails:<br>
      ${buildCostList(cocktails.list)}
      total: ${cocktails.total};<br>
    <br>Disposables:<br>
      ${buildCostList(disposables.list)}
      total: ${disposables.total};<br>
    </div>
      `;
  const suggestedPrice = `<h4><strong>Total suggested price: ${sellPrice}</strong></h4>`;

  return `${title}<hr><h4>Customer infos:</h4>${customerInfos}<hr>${suggestedPrice}<hr>${costsText}`;
}

export async function send({ email, msg, subject }: Mail) {
  const structure = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    html: msg,
  };
  await sgMail.send(structure);
}

export async function sendBudget(budget: RawBudget) {
  const msg = buildBudgetMsg(budget);
  const { email } = budget.customer;
  const subject = 'New budget request';
  await send({ email, msg, subject });
}
