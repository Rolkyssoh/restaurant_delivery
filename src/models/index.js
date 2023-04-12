// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const TransportationModes = {
  "DRIVING": "DRIVING",
  "BICYCLING": "BICYCLING"
};

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "PICKED_UP": "PICKED_UP",
  "COMPLETED": "COMPLETED",
  "ACCEPTED": "ACCEPTED",
  "DECLINED_BY_STRUCTURE": "DECLINED_BY_STRUCTURE"
};

const StructureType = {
  "RESTAURANT": "RESTAURANT",
  "SHOP": "SHOP"
};

const UserType = {
  "CUSTOMER": "CUSTOMER",
  "DRIVER": "DRIVER",
  "ADMIN": "ADMIN",
  "RESTORER": "RESTORER"
};

const { Courier, OrderDish, Dish, Ingredient, Order, Structure, Basket, BasketDish, User } = initSchema(schema);

export {
  Courier,
  OrderDish,
  Dish,
  Ingredient,
  Order,
  Structure,
  Basket,
  BasketDish,
  User,
  TransportationModes,
  OrderStatus,
  StructureType,
  UserType
};