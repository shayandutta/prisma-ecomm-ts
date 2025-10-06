import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { ErrorCodes } from "../exceptions/root";
import { User } from "@prisma/client";
import { prismaClient } from "..";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const addItemsToCart = async (
  req: Request & { user: User },
  res: Response
) => {
  //check for the existance of the same product in the users cart and alter the quantity
  const validatedData = CreateCartSchema.parse(req.body);

  const productExists = await prismaClient.cartItems.findFirst({
    where: {
      userId: req.user.id,
      productId: validatedData.productId,
    },
  });
  if (productExists) {
    const updatedCart = await prismaClient.cartItems.update({
      where: { id: productExists.id }, //productExists.id -> cartItems primary id key
      data: {
        quantity: { increment: validatedData.quantity }, //atomic increment is required
      },
    });
    return res.status(200).json(updatedCart);
  }

  const cart = await prismaClient.cartItems.create({
    data: {
      userId: req.user.id,
      productId: validatedData.productId,
      quantity: validatedData.quantity,
    },
  });
  res.status(201).json(cart);
};

export const deleteItemFromCart = async (
  req: Request & { user: User },
  res: Response
) => {
  const cartItemId = Number(req.params.id);

  // verify ownership first, then delete a single record by unique id
  const existing = await prismaClient.cartItems.findFirst({
    where: { id: cartItemId, userId: req.user.id },
  });

  if (!existing) {
    throw new UnauthorizedException("Unauthorised", ErrorCodes.UNAUTHORIZED);
  }
  await prismaClient.cartItems.delete({ where: { id: cartItemId } });

  res.json(existing);
};

export const changeQuantity = async (
  req: Request & { user: User },
  res: Response
) => {
  const cartItemId = Number(req.params.id);
  const existing = await prismaClient.cartItems.findFirst({
    where: {
      id: cartItemId,
      userId: req.user.id,
    },
  });
  if (!existing) {
    throw new UnauthorizedException("Unauthorised", ErrorCodes.UNAUTHORIZED);
  }
  const validatedData = ChangeQuantitySchema.parse(req.body);
  const updatedCart = await prismaClient.cartItems.update({
    where: {
      id: +(req.params.id || 0),
    },
    data: {
      quantity: validatedData.quantity,
    },
  });
  res.json(updatedCart);
};

export const getCart = async (req: Request & {user:User}, res: Response) => {
    const cart = await prismaClient.cartItems.findMany({
        where:{
            userId: req.user.id
        },
        include:{
            product:true
        }
    })
    res.json(cart)
};
