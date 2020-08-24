# Commandline based Multinational Inventory Management System
Contains engine to find minimum price for order items across countries inventory using sorting by price against each product item.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

```
npm - https://www.npmjs.com/get-npm
```

### Installing

A step by step guide that tell you how to get a development env running


Clone the repo locally, then using terminal navigate into the cloned repo and run the below command to install node packages:

```
npm i
```

Once the packages are installed, use terminal window to start local instance

```
node index.js
```
OR

```
node .
```
The application runs in an infinite loop which is controlled using an input value to re-run the app cycle or exit it.
The application accepts two values,
- input request, which is the inventory item request of the format: 
```
<purchase_country>:<optional_passport_number>:<item_type>:<number_of_units_to_be_ordered>:<item_type>:<number_of_units_to_be_ordered> (with no space between separators)
```
- re-run request, which can be replied with `yes` or `y` to re-run or any other key to exit.

The output of the input request is in the below format, based on the requested input structure:
```
<total_sale_price>:<Mask_UK_inventory>:<Mask_Germany_inventory> :<Gloves_UK_inventory>:<Gloves_Germany_inventory>
```

- The `inventory.json` file contains local no-sql based static inventory data object.
- The `options.json` file contains configuration options for countries, products, passport validation regex rules, discount, etc.

The core source code is in the `engine` folder where `calculator.js` handles inventory requests and `validator.js` contains validation utils.

## Authors

* **Abhay Verma** - *Initial work* - [AbhayVerma](https://github.com/abhayverma)
