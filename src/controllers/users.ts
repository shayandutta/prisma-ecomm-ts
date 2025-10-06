import { Request, Response } from "express";
import { AddressSchema } from "../schema/users";
import { prismaClient } from "..";
import { User } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

export const addAddress = async (
  req: Request & { user: User },
  res: Response
) => {
  AddressSchema.parse(req.body); //zod validation

  //first fetch the user in try catch because the user may or may not exist
  //authMiddleware will extract the token and give userId from the payload (req.body.user.id)
  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.json(address);
};

export const deleteAddress = async (
  req: Request & { user: User },
  res: Response
) => {
  try {
    const address = await prismaClient.address.findFirst({
      where: {
        id: +(req.params.id || 0), //fetching the particular address that needs to get deleted
        userId: req.user.id, //fetching the user whose id needs to get deleted
      },
    });

    if (!address) {
      throw new NotFoundException(
        "Address not found",
        ErrorCodes.ADDRESS_NOT_FOUND
      );
    }

    const deletedAddress = await prismaClient.address.delete({
      where: { id: address.id },
    });

    res.json(deletedAddress);
  } catch (err) {
    if (err instanceof NotFoundException) throw err;
    throw new NotFoundException(
      "Address not found",
      ErrorCodes.ADDRESS_NOT_FOUND
    );
  }
};

export const listAddress = async (
  req: Request & { user: User },
  res: Response
) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: req.user.id, //this is the primary key of the user inside foreign key(userId) of the address
    },
  });
  res.json(addresses);
};
