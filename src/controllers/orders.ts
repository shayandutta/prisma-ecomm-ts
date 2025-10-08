import { Request, Response } from "express";
import { prismaClient } from "..";
import { User } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

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

export const listOrders = async (
  req: Request & { user: User },
  res: Response
) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user?.id,
    },
  });
  res.json(orders);
};

export const cancelOrder = async (
  req: Request & { user: User },
  res: Response
) => {
  //wrap it inside transaction
  //check if the user is cancelling its own order
  try {
    const order = await prismaClient.order.update({
      where: {
        id: +(req.params.id || 0),
      },
      data: {
        status: "CANCELLED",
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: "CANCELLED",
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException("Order not found", ErrorCodes.ORDER_NOT_FOUND);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +(req.params.id || 0),
      },
      include: {
        products: true,
        events: true,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException("Order not found", ErrorCodes.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (
  req: Request & { user: User },
  res: Response
) => {
   let whereClause = {};//whereClause is a dynamic filter object that determines which orders will be retrieved from the database. It's built conditionally based on whether a status parameter is provided.
   //Starts with an empty object (no filters = return all orders)
   const status = req.query.status
   //If a status is provided in the URL (e.g., /orders/PENDING), it updates whereClause to filter by that status
   if(status) {
    whereClause = {
      status
    }
   }
   //If no status is provided, whereClause remains empty

   const orders = await prismaClient.order.findMany({
    //where: whereClause - applies the filter (either empty or with status)
    // skip - implements pagination offset (from query string, defaults to 0)
    // take:5 - limits results to 5 orders per page
    where: whereClause,
    skip:+(req.query.skip || 0),
    take:5
   })
   res.json(orders)
};

export const changeStatus = async (req: Request, res: Response) => {
  try{
    const order = await prismaClient.order.update({
      where:{
        id:+(req.params.id || 0)
      }, data:{
        status: req.body.status
      }
    })
  await prismaClient.orderEvent.create({
    data:{
      orderId: order.id,
      status: req.body.status
    }
  })
  res.json(order)
  }catch(err){
    throw new NotFoundException("Order not found", ErrorCodes.ORDER_NOT_FOUND)
  }
  
};
export const listUserOrders = async (req: Request, res: Response) => {
  let whereClause:any = {
    userId:+(req.params.id || 0)
  };
  const status = req.query.status
  if(status){
    whereClause={
      ...whereClause,
      status
    }
  }
  const orders = await prismaClient.order.findMany({
    where:whereClause,
    skip:+(req.query.skip || 0),
    take:5
  })
  res.json(orders)
};



// What is whereClause?
// whereClause is a dynamic filter object that gets passed to Prisma's findMany() method to determine which orders to retrieve from the database.
// How it works:
// Step 1: Start with a base filter that always includes the userId (so you only get orders for that specific user)
// Step 2: If a status is provided in the query string, replace the entire whereClause object with a new one that includes both filters.