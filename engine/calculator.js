'use strict'

const validator = require('./validator');
const options = require('../options.json');

const calcResponse = (success, msg) => {
  return { success, msg }
};

const applyTransportationCharges = (clientCountry, sourceCountry, passportCountry, quantity) => {
  let transportCharge = 0;
  if (clientCountry !== sourceCountry) {
    const totalBatches = Math.round(quantity / 10);
    transportCharge = options.transportCost * totalBatches;
    if (passportCountry && sourceCountry === passportCountry) {
      transportCharge -= (transportCharge * options.discount / 100);
    }
  }
  return transportCharge;
};

const purchaseQuantity = (stock, price, sale) => {
  const saleQuantity = stock > sale ? sale : stock;
  return { cost: (price * saleQuantity), sale: saleQuantity };
}

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

module.exports = (enquiry) => {

  let inputs = [];
  let quantities = [];
  let defaultQuantities = [];
  let totalPurchasePrice = 0;
  const masterInventory = require('../inventory.json');
  let requestedQuantity, passportCountry, clientCountry;

  // split the string into input elements
  enquiry.split(':').forEach(param => inputs.push(param.toLowerCase()));

  // check for valid country
  clientCountry = validator.findValidCountry(inputs);
  if (!clientCountry) {
    return calcResponse(false, `Invalid Country, [${options.countries.toString()}] are the countries available`);
  }

  // Check for valid passport
  passportCountry = validator.findValidPassportCountry(inputs);

  // Check for required items in the input using options.products
  if (!validator.isValidProducts(inputs)) {
    return calcResponse(false, `Invalid Product. Products ${options.products.toString()} inventory available. 
    Set 0 units for no order of respective item.`);
  }

  // Validate and capture numeric units for requested products
  requestedQuantity = validator.findValidProductUnits(inputs);
  if (typeof requestedQuantity !== 'object') {
    return calcResponse(false, `Invalid units ${requestedQuantity}, please enter numeric value for units/quantity`);
  }

  for (const product of requestedQuantity) {

    masterInventory.sort((curr, next) => (curr[product.name].price > next[product.name].price) ? 1 : ((next[product.name].price > curr[product.name].price) ? -1 : 0));

    for (const [index, currentInventory] of masterInventory.entries()) {

      const iProductItem = currentInventory[product.name];
      const overHead = product.quantity > 10 && masterInventory[index + 1] ? product.quantity % 10 : 0;

      defaultQuantities.insert(iProductItem.index, iProductItem.inventory);
      if (typeof totalPurchasePrice == 'string' ||
        (totalPurchasePrice > 0 && product.quantity == 0) ||
        (!overHead && currentInventory.country !== clientCountry && clientCountry == passportCountry && masterInventory[index + 1] && masterInventory[index + 1][product.name].inventory >= product.quantity)) {
        quantities.insert(iProductItem.index, iProductItem.inventory);
      } else {
        const purchasedItem = purchaseQuantity(iProductItem.inventory, iProductItem.price, product.quantity - overHead);
        totalPurchasePrice += purchasedItem.cost;
        totalPurchasePrice += applyTransportationCharges(clientCountry, currentInventory.country, passportCountry, purchasedItem.sale);
        const extraQuantity = product.quantity - purchasedItem.sale;
        product.quantity = extraQuantity > 0 ? extraQuantity : 0;
        quantities.insert(iProductItem.index, iProductItem.inventory - purchasedItem.sale);
        if (product.quantity > 0 && !masterInventory[index + 1]) {
          totalPurchasePrice = 'OUT_OF_STOCK';
        }
      }
    }
  }

  if (typeof totalPurchasePrice == 'string') {
    quantities = defaultQuantities;
  }

  const result = [totalPurchasePrice, ...quantities];

  return calcResponse(true, result.join(':'));
};
