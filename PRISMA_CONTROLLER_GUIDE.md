# Prisma Controller Building Guide

A comprehensive guide to building controllers with Prisma ORM - understanding when to use `where`, `data`, `include`, and other query options.

---

## Table of Contents

1. [Prisma Operations Overview](#prisma-operations-overview)
2. [Common Query Options](#common-query-options)
3. [Read Operations (Querying)](#read-operations-querying)
4. [Write Operations (Creating/Updating)](#write-operations-creatingupdating)
5. [Delete Operations](#delete-operations)
6. [Real-World Examples](#real-world-examples)
7. [Quick Reference Table](#quick-reference-table)

---

## Prisma Operations Overview

Prisma has different methods for different database operations:

```typescript
// READ operations (Query data)
prismaClient.model.findMany(); // Get multiple records
prismaClient.model.findFirst(); // Get first matching record
prismaClient.model.findUnique(); // Get one record by unique field
prismaClient.model.findFirstOrThrow(); // Get first or throw error

// WRITE operations (Create/Update data)
prismaClient.model.create(); // Create new record
prismaClient.model.update(); // Update existing record
prismaClient.model.upsert(); // Update or create if doesn't exist
prismaClient.model.createMany(); // Create multiple records
prismaClient.model.updateMany(); // Update multiple records

// DELETE operations
prismaClient.model.delete(); // Delete one record
prismaClient.model.deleteMany(); // Delete multiple records

// COUNT operations
prismaClient.model.count(); // Count records
```

---

## Common Query Options

Here are the main options you'll use with Prisma operations:

| Option    | Used With            | Purpose                            | Example                            |
| --------- | -------------------- | ---------------------------------- | ---------------------------------- |
| `where`   | Read, Update, Delete | **Filter** which records to affect | `where: { id: 1 }`                 |
| `data`    | Create, Update       | **Specify** what data to write     | `data: { name: "John" }`           |
| `include` | Read, Create, Update | **Include** related models         | `include: { posts: true }`         |
| `select`  | Read, Create, Update | **Choose** specific fields         | `select: { id: true, name: true }` |
| `orderBy` | Read                 | **Sort** results                   | `orderBy: { createdAt: 'desc' }`   |
| `skip`    | Read                 | **Skip** N records (pagination)    | `skip: 10`                         |
| `take`    | Read                 | **Limit** results (pagination)     | `take: 20`                         |

---

## Read Operations (Querying)

### When to use: `findMany`, `findFirst`, `findUnique`, `findFirstOrThrow`

Read operations fetch data from the database. They **NEVER** use `data`.

### Options for Read Operations:

#### 1. `where` - Filter records

**Purpose**: Specify which records you want to find

```typescript
// Find all orders for a specific user
const orders = await prismaClient.order.findMany({
  where: {
    userId: 123,
  },
});

// Find orders with multiple conditions
const pendingOrders = await prismaClient.order.findMany({
  where: {
    userId: 123,
    status: "PENDING",
  },
});

// Find orders with OR conditions
const orders = await prismaClient.order.findMany({
  where: {
    OR: [{ status: "PENDING" }, { status: "PROCESSING" }],
  },
});
```

#### 2. `include` - Get related data

**Purpose**: Include data from related models (JOIN in SQL)

```typescript
// Get order WITH its products
const order = await prismaClient.order.findFirst({
  where: {
    id: 1,
  },
  include: {
    products: true, // Include all products
    events: true, // Include all events
  },
});

// Result looks like:
// {
//   id: 1,
//   userId: 123,
//   status: "PENDING",
//   products: [...],    // Array of product objects
//   events: [...]       // Array of event objects
// }
```

#### 3. `select` - Choose specific fields

**Purpose**: Only get specific fields (instead of all fields)

```typescript
// Only get id and status (not all fields)
const orders = await prismaClient.order.findMany({
  where: {
    userId: 123,
  },
  select: {
    id: true,
    status: true,
    // Won't include: createdAt, updatedAt, netAmount, etc.
  },
});
```

⚠️ **Note**: You **cannot** use `include` and `select` together. Choose one.

#### 4. `orderBy` - Sort results

**Purpose**: Sort results by a field

```typescript
// Get latest orders first
const orders = await prismaClient.order.findMany({
  where: {
    userId: 123,
  },
  orderBy: {
    createdAt: "desc", // 'asc' for ascending, 'desc' for descending
  },
});

// Sort by multiple fields
const orders = await prismaClient.order.findMany({
  orderBy: [{ status: "asc" }, { createdAt: "desc" }],
});
```

#### 5. `skip` and `take` - Pagination

**Purpose**: Implement pagination (limit and offset)

```typescript
// Get 10 orders, skip first 20 (page 3, 10 per page)
const orders = await prismaClient.order.findMany({
  where: {
    userId: 123,
  },
  skip: 20, // Skip first 20 records (offset)
  take: 10, // Get 10 records (limit)
  orderBy: {
    createdAt: "desc",
  },
});
```

### Complete Read Example

```typescript
export const listOrders = async (
  req: Request & { user: User },
  res: Response
) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id, // Filter by user
      status: req.query.status || undefined, // Optional status filter
    },
    include: {
      products: true, // Include related products
      events: true, // Include related events
    },
    orderBy: {
      createdAt: "desc", // Newest first
    },
    skip: +(req.query.skip || 0), // Pagination offset
    take: +(req.query.limit || 10), // Pagination limit
  });

  res.json(orders);
};
```

---

## Write Operations (Creating/Updating)

### When to use: `create`, `update`, `upsert`

Write operations create or modify data. They **ALWAYS** use `data`.

### Options for Write Operations:

#### 1. `data` - What to create/update

**Purpose**: Specify the data you want to write to the database

```typescript
// CREATE - uses 'data'
const newOrder = await prismaClient.order.create({
  data: {
    userId: 123,
    netAmount: 99.99,
    address: "123 Main St",
    status: "PENDING",
  },
});

// UPDATE - uses 'where' + 'data'
const updatedOrder = await prismaClient.order.update({
  where: {
    id: 1, // Which record to update
  },
  data: {
    status: "CANCELLED", // What to update
  },
});
```

#### 2. `where` (for updates only)

**Purpose**: Specify which record to update

```typescript
// Update a specific order
const order = await prismaClient.order.update({
  where: {
    id: 1, // Find the order with id 1
  },
  data: {
    status: "SHIPPED", // Update its status
  },
});
```

#### 3. `include` (optional after create/update)

**Purpose**: Return the created/updated record with its relations

```typescript
// Create order and return it WITH products
const order = await prismaClient.order.create({
  data: {
    userId: 123,
    netAmount: 99.99,
    address: "123 Main St",
  },
  include: {
    products: true, // Include products in the returned object
  },
});
```

### Creating with Relations

You can create related records in the same operation:

```typescript
// Create order AND its products at once
const order = await prismaClient.order.create({
  data: {
    userId: 123,
    netAmount: 199.99,
    address: "123 Main St",
    products: {
      create: [
        // Create multiple products
        {
          productId: 1,
          quantity: 2,
        },
        {
          productId: 3,
          quantity: 1,
        },
      ],
    },
  },
  include: {
    products: true, // Return order with products
  },
});
```

### Complete Write Example

```typescript
export const createOrder = async (
  req: Request & { user: User },
  res: Response
) => {
  // Get cart items
  const cartItems = await prismaClient.cartItems.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      product: true,
    },
  });

  // Calculate total
  const price = cartItems.reduce((prev, current) => {
    return prev + current.quantity * current.product.price.toNumber();
  }, 0);

  // Create order with products
  const order = await prismaClient.order.create({
    data: {
      // What to create
      userId: req.user.id,
      netAmount: price,
      address: "123 Main St",
      products: {
        create: cartItems.map((cart) => ({
          productId: cart.productId,
          quantity: cart.quantity,
        })),
      },
    },
    include: {
      // Include relations in response
      products: true,
    },
  });

  res.json(order);
};
```

---

## Delete Operations

### When to use: `delete`, `deleteMany`

Delete operations remove data. They use `where` to specify what to delete.

```typescript
// Delete one record
const deletedOrder = await prismaClient.order.delete({
  where: {
    id: 1,
  },
});

// Delete many records
const deletedOrders = await prismaClient.order.deleteMany({
  where: {
    userId: 123,
    status: "CANCELLED",
  },
});

// Delete all records (be careful!)
const deletedAll = await prismaClient.cartItems.deleteMany({
  where: {
    userId: 123,
  },
});
```

---

## Real-World Examples

### Example 1: List User's Orders (Read)

```typescript
export const listOrders = async (
  req: Request & { user: User },
  res: Response
) => {
  const orders = await prismaClient.order.findMany({
    where: {
      // FILTER: only this user's orders
      userId: req.user.id,
    },
  });

  res.json(orders);
};
```

**Breakdown:**

- ✅ Uses `findMany` (read operation)
- ✅ Uses `where` to filter
- ❌ NO `data` (not creating/updating)

---

### Example 2: Get Order with Details (Read + Include)

```typescript
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        // FILTER: find order by id
        id: +(req.params.id || 0),
      },
      include: {
        // INCLUDE: get related data
        products: true,
        events: true,
      },
    });

    res.json(order);
  } catch (err) {
    throw new NotFoundException("Order not found", ErrorCodes.ORDER_NOT_FOUND);
  }
};
```

**Breakdown:**

- ✅ Uses `findFirstOrThrow` (read operation)
- ✅ Uses `where` to find specific order
- ✅ Uses `include` to get products and events
- ❌ NO `data` (not creating/updating)

---

### Example 3: Cancel Order (Update)

```typescript
export const cancelOrder = async (
  req: Request & { user: User },
  res: Response
) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        // WHICH: which order to update
        id: +(req.params.id || 0),
      },
      data: {
        // WHAT: what to update
        status: "CANCELLED",
      },
    });

    // Create event
    await prismaClient.orderEvent.create({
      data: {
        // WHAT: what to create
        orderId: order.id,
        status: "CANCELLED",
      },
    });

    res.json(order);
  } catch (err) {
    throw new NotFoundException("Order not found", ErrorCodes.ORDER_NOT_FOUND);
  }
};
```

**Breakdown:**

- ✅ Uses `update` (write operation)
- ✅ Uses `where` to find which order
- ✅ Uses `data` to specify new values
- ✅ Uses `create` to add event
- ✅ Uses `data` for create operation

---

### Example 4: List Orders with Filters (Read + Dynamic Where)

```typescript
export const listAllOrders = async (
  req: Request & { user: User },
  res: Response
) => {
  let whereClause = {};
  const status = req.query.status;

  if (status) {
    whereClause = {
      // CONDITIONAL FILTER
      status,
    };
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause, // FILTER: apply dynamic filter
    skip: +(req.query.skip || 0), // PAGINATION: offset
    take: 5, // PAGINATION: limit
  });

  res.json(orders);
};
```

**Breakdown:**

- ✅ Uses `findMany` (read operation)
- ✅ Builds `where` dynamically based on query params
- ✅ Uses `skip` and `take` for pagination
- ❌ NO `data` (not creating/updating)

---

### Example 5: Create Order with Transaction (Complex Write)

```typescript
export const createOrder = async (
  req: Request & { user: User },
  res: Response
) => {
  return await prismaClient.$transaction(async (tx) => {
    // 1. READ cart items
    const cartItems = await tx.cartItems.findMany({
      where: {
        // FILTER
        userId: req.user.id,
      },
      include: {
        // INCLUDE: get product details
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return res.json({ message: "cart is empty" });
    }

    // 2. Calculate price
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * current.product.price.toNumber();
    }, 0);

    // 3. READ address
    const address = await tx.address.findFirst({
      where: {
        // FILTER
        id: +(req.user.defaultShippingAddressId || 0),
      },
    });

    // 4. CREATE order with products
    const order = await tx.order.create({
      data: {
        // WHAT TO CREATE
        userId: req.user.id,
        netAmount: price,
        address: address?.formattedAddress || "",
        products: {
          create: cartItems.map((cart) => ({
            productId: cart.productId,
            quantity: cart.quantity,
          })),
        },
      },
      include: {
        // INCLUDE: return with products
        products: true,
      },
    });

    // 5. CREATE order event
    await tx.orderEvent.create({
      data: {
        // WHAT TO CREATE
        orderId: order.id,
      },
    });

    // 6. DELETE cart items
    await tx.cartItems.deleteMany({
      where: {
        // WHICH: user's cart items
        userId: req.user.id,
      },
    });

    res.json(order);
  });
};
```

**Breakdown:**

- ✅ Uses transaction for atomicity
- ✅ Mixes read (`findMany`, `findFirst`) and write (`create`, `deleteMany`)
- ✅ Uses `where` for filtering
- ✅ Uses `data` for creating
- ✅ Uses `include` to get relations
- ✅ Complex nested create (order + products)

---

## Quick Reference Table

### By Operation Type

| Operation    | Uses `where` | Uses `data` | Uses `include` | Uses `select` |
| ------------ | ------------ | ----------- | -------------- | ------------- |
| `findMany`   | ✅ Filter    | ❌ No       | ✅ Relations   | ✅ Fields     |
| `findFirst`  | ✅ Filter    | ❌ No       | ✅ Relations   | ✅ Fields     |
| `findUnique` | ✅ Filter    | ❌ No       | ✅ Relations   | ✅ Fields     |
| `create`     | ❌ No        | ✅ Required | ✅ Optional    | ✅ Optional   |
| `update`     | ✅ Required  | ✅ Required | ✅ Optional    | ✅ Optional   |
| `delete`     | ✅ Required  | ❌ No       | ❌ No          | ❌ No         |
| `deleteMany` | ✅ Filter    | ❌ No       | ❌ No          | ❌ No         |

### By Option

| Option    | Purpose              | Used With            | Example                          |
| --------- | -------------------- | -------------------- | -------------------------------- |
| `where`   | Filter which records | Read, Update, Delete | `where: { id: 1 }`               |
| `data`    | Specify what data    | Create, Update       | `data: { status: "ACTIVE" }`     |
| `include` | Get related models   | Read, Create, Update | `include: { posts: true }`       |
| `select`  | Choose fields        | Read, Create, Update | `select: { id: true }`           |
| `orderBy` | Sort results         | Read                 | `orderBy: { createdAt: 'desc' }` |
| `skip`    | Skip N records       | Read                 | `skip: 10`                       |
| `take`    | Limit results        | Read                 | `take: 20`                       |

---

## Common Patterns

### Pattern 1: Simple List

```typescript
// Get all records
const items = await prismaClient.item.findMany();
```

### Pattern 2: Filtered List

```typescript
// Get filtered records
const items = await prismaClient.item.findMany({
  where: { status: "ACTIVE" },
});
```

### Pattern 3: List with Relations

```typescript
// Get records with related data
const items = await prismaClient.item.findMany({
  where: { status: "ACTIVE" },
  include: { category: true },
});
```

### Pattern 4: Paginated List

```typescript
// Get paginated records
const items = await prismaClient.item.findMany({
  where: { status: "ACTIVE" },
  orderBy: { createdAt: "desc" },
  skip: 0,
  take: 10,
});
```

### Pattern 5: Get One

```typescript
// Get single record
const item = await prismaClient.item.findUnique({
  where: { id: 1 },
  include: { category: true },
});
```

### Pattern 6: Create

```typescript
// Create new record
const item = await prismaClient.item.create({
  data: {
    name: "New Item",
    price: 29.99,
    status: "ACTIVE",
  },
});
```

### Pattern 7: Update

```typescript
// Update existing record
const item = await prismaClient.item.update({
  where: { id: 1 },
  data: { price: 39.99 },
});
```

### Pattern 8: Delete

```typescript
// Delete record
const item = await prismaClient.item.delete({
  where: { id: 1 },
});
```

---

## Key Takeaways

1. **Read operations** (`find*`):

   - ✅ Use `where` to filter
   - ✅ Use `include` to get relations
   - ✅ Use `select` to choose fields
   - ✅ Use `orderBy`, `skip`, `take` for sorting/pagination
   - ❌ NEVER use `data`

2. **Write operations** (`create`, `update`):

   - ✅ ALWAYS use `data` to specify what to write
   - ✅ Use `where` for updates (which record to update)
   - ✅ Can use `include` to return with relations
   - ❌ `create` doesn't need `where`

3. **Delete operations** (`delete`, `deleteMany`):

   - ✅ Use `where` to specify what to delete
   - ❌ NO `data` (you're deleting, not writing)
   - ❌ NO `include` (nothing to return)

4. **Remember:**
   - `where` = **WHICH** records (filtering)
   - `data` = **WHAT** to write (creating/updating)
   - `include` = **GET** related data (joins)
   - `select` = **CHOOSE** specific fields
   - `orderBy` = **SORT** results
   - `skip`/`take` = **PAGINATE** results

---

_This guide is specific to Prisma ORM with Express.js/TypeScript._
