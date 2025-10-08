import { Request, Response } from "express";
import { prismaClient } from "..";
import { CreateProductSchema } from "../schema/products";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

export const createProduct = async (req: Request, res: Response) => {
  //tags-> ["tea", "india"] <- this is how we will be getting the tags as input => "tea, india" <- this is how we want to show it
  CreateProductSchema.parse(req.body);

  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  //we will use try catch here because we need to explicitely catch the error if product doesn't exists
  try {
    const product = req.body;
    //if tags need to be updated then first join the elements in array like we did while creating product
    if (product.tags) {
      product.tags = product.tag.join(",");
    }

    const updatedProduct = await prismaClient.product.update({
      where: {
        id: +(req.params.id || 0),
      },
      data: product,
    });
    res.json(updatedProduct);
  } catch (err) {
    throw new NotFoundException(
      "Product not found",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => {

    try{
        const deletedProduct = await prismaClient.product.delete({
            where:{
                id: +(req.params.id || 0)
            }
        })
        res.json(deletedProduct);
    }catch(err){
        throw new NotFoundException("Product not found", ErrorCodes.PRODUCT_NOT_FOUND)
    }
};

export const ListProducts = async (req: Request, res: Response) => {
    //we need paginated response
    //the response format is like this ->

    // {
    //     count:100,
    //     data: []
    // }

    const count = await prismaClient.product.count(); //count is necessary to provide some data to the frontend team so that they can write the pagination logic on the frontend
    const products = await prismaClient.product.findMany({
      skip: +(req.query.skip || 0),
      take: 5
    })
    res.json({
      count,
      data:{
        products
      }
    })
};

export const getProductbyId = async (req: Request, res: Response) => {
  //we need to add try or catch here because product may not exist
  try{
    const product = await prismaClient.product.findFirstOrThrow({
      where:{
        id: +(req.params.id || 0)
      }
    })
    res.json(product);
  }
  catch(err){
    throw new NotFoundException("Product not found", ErrorCodes.PRODUCT_NOT_FOUND);
  }

};


export const searchProducts = async (req: Request, res: Response) => {
  const product = await prismaClient.product.findMany({
    where:{
      name:{
        search: req.query.q as string,
      },
      description:{
        search: req.query.q as string
      },
      tags:{
        search: req.query.q as string
      }
    },
    skip: +(req.query.skip || 0),
    take: 5
  })
  res.json(product)
};