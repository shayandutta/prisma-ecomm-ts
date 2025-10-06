import { Request, Response } from "express";
import { prismaClient } from "..";
import { User } from "@prisma/client";

export const createOrder = async (
  req: Request & { user: User },
  res: Response
) => {
  //1. to create a transaction
  return await prismaClient.$transaction(async (tx) => {
    //2. to list all the cart items and proceed if cart is not empty
    const cartItems = await tx.cartItems.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length === 0) {
      return res.json({ message: "cart is empty" });
    }
    //3. calculate the total amount
    //what the reduce method does is starts with 0(first prev price), then the second parameter is the current item in the array and then the function is applied to the previous and current item
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * current.product.price.toNumber(); //toNumber() is used to convert the price to a number
    }, 0);
    //4. fetch address of user
    const address = await tx.address.findFirst({
      where: {
        id: +(req.user.defaultShippingAddressId || 0),
      },
    });
    //5. to define computed field for formatted address on address model(done in index.ts)
    //6. to create an order and order products
    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address?.formattedAddress || "",
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
      include: {
        products: true,
      },
    });
    //7. to create an order event
    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });
    //8. to empty the cart
    await tx.cartItems.deleteMany({
      where: {
        userId: req.user.id,
      },
    });
    res.json(order);
  });
};

export const listOrders = async (req: Request, res: Response) => {};

export const cancelOrder = async (req: Request, res: Response) => {};

export const getOrderById = async (req: Request, res: Response) => {};
