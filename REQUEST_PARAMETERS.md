# Request Parameters Guide: `req.params` vs `req.query`

Understanding the difference between route parameters (`req.params`) and query string parameters (`req.query`) in Express.js.

---

## Overview

When building REST APIs, you need to accept data from clients. Two common ways to pass data in URLs are:

1. **Route Parameters** (`req.params`) - Part of the URL path
2. **Query Parameters** (`req.query`) - Key-value pairs after `?`

---

## Route Parameters (`req.params`)

### What are they?

Route parameters are **variable segments** in the URL path, defined in your route pattern using a colon (`:`) prefix.

### Syntax

```typescript
// Route definition
app.get("/orders/:id", handler);
app.get("/users/:userId/posts/:postId", handler);
```

### How to access

```typescript
// URL: GET /orders/42
req.params.id; // "42"

// URL: GET /users/123/posts/456
req.params.userId; // "123"
req.params.postId; // "456"
```

### Example from this project

```typescript
export const getOrderById = async (req: Request, res: Response) => {
  // Route: /orders/:id
  // URL: GET /orders/42

  const order = await prismaClient.order.findFirstOrThrow({
    where: {
      id: +(req.params.id || 0), // Accesses "42" from URL path
    },
  });
  res.json(order);
};
```

### When to use

- ✅ Identifying a **specific resource** (user ID, order ID, product ID)
- ✅ Required values that define the endpoint
- ✅ RESTful resource paths
- ✅ Values that are part of the resource hierarchy

### Characteristics

| Property          | Value                             |
| ----------------- | --------------------------------- |
| Required in route | ✅ Yes (must be defined with `:`) |
| Position in URL   | Path segment                      |
| Typical use       | Resource identifiers              |
| Multiple values   | Multiple params possible          |
| Example           | `/users/123/orders/456`           |

---

## Query Parameters (`req.query`)

### What are they?

Query parameters are **optional key-value pairs** appended to the URL after a `?` symbol, separated by `&`.

### Syntax

```
/endpoint?key1=value1&key2=value2&key3=value3
```

### How to access

```typescript
// URL: GET /orders?status=PENDING&skip=10&limit=5
req.query.status; // "PENDING"
req.query.skip; // "10"
req.query.limit; // "5"
```

### Example from this project

```typescript
export const listAllOrders = async (
  req: Request & { user: User },
  res: Response
) => {
  // URL: GET /orders?skip=10
  // URL: GET /orders?status=PENDING&skip=20

  let whereClause = {};
  const status = req.query.status; // Optional filter

  if (status) {
    whereClause = { status };
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: +(req.query.skip || 0), // Pagination offset
    take: 5,
  });

  res.json(orders);
};
```

### When to use

- ✅ **Filtering** results (`?status=active`)
- ✅ **Pagination** (`?page=2&limit=10`)
- ✅ **Sorting** (`?sort=date&order=desc`)
- ✅ **Search** (`?search=laptop`)
- ✅ **Optional parameters** that modify the response
- ✅ Multiple optional criteria

### Characteristics

| Property          | Value                            |
| ----------------- | -------------------------------- |
| Required in route | ❌ No (automatically available)  |
| Position in URL   | After `?`                        |
| Typical use       | Filters, options, pagination     |
| Multiple values   | Many: `?a=1&b=2&c=3`             |
| Example           | `/orders?status=PENDING&skip=10` |

---

## Side-by-Side Comparison

```typescript
// ====== Route Parameters ======
// Route: /orders/:id
// URL: GET /orders/42

req.params.id; // "42"

// ====== Query Parameters ======
// Route: /orders
// URL: GET /orders?id=42&status=PENDING

req.query.id; // "42"
req.query.status; // "PENDING"
```

## Combined Example

You can use **both** in the same request:

```typescript
// Route definition
app.get('/users/:userId/orders', handler)

// URL
GET /users/123/orders?status=PENDING&skip=10&limit=5

// Access in handler
req.params.userId    // "123" (which user)
req.query.status     // "PENDING" (filter orders)
req.query.skip       // "10" (pagination)
req.query.limit      // "5" (page size)
```

### Real-world example

```typescript
export const getUserOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: +(req.params.userId || 0), // From path
      status: req.query.status || undefined, // From query string
    },
    skip: +(req.query.skip || 0), // From query string
    take: +(req.query.limit || 10), // From query string
  });

  res.json(orders);
};
```

---

## Quick Decision Guide

**Use `req.params` when:**

- 🎯 You need to identify a **specific resource**
- 🎯 The value is **required** for the endpoint to work
- 🎯 It's part of the **resource hierarchy** (`/users/:id/posts/:postId`)

**Use `req.query` when:**

- 🔍 You want to **filter**, **sort**, or **search** results
- 📄 You need **pagination** (`skip`, `limit`, `page`)
- ⚙️ The parameter is **optional**
- 🔀 You have **multiple optional parameters**

---

## Common Patterns

### Pattern 1: Resource Retrieval

```typescript
// Get a specific order
GET /orders/:id
req.params.id  // Required identifier
```

### Pattern 2: Filtered List

```typescript
// Get all orders with filters
GET /orders?status=PENDING&limit=20
req.query.status  // Optional filter
req.query.limit   // Optional limit
```

### Pattern 3: Nested Resources with Filters

```typescript
// Get user's orders with filters
GET /users/:userId/orders?status=PENDING&skip=10
req.params.userId  // Which user (required)
req.query.status   // Filter by status (optional)
req.query.skip     // Pagination (optional)
```

---

## Type Conversion

⚠️ **Important**: Both `req.params` and `req.query` return **strings**. You need to convert them to numbers when needed:

```typescript
// Convert to number
const orderId = +(req.params.id || 0);
const skip = +(req.query.skip || 0);

// Or use parseInt/parseFloat
const limit = parseInt(req.query.limit || "10");
```

---

## Summary Table

| Feature              | `req.params`         | `req.query`                  |
| -------------------- | -------------------- | ---------------------------- |
| **Part of URL**      | Path segment         | After `?`                    |
| **Example**          | `/orders/123`        | `/orders?id=123`             |
| **Route definition** | Must define with `:` | No definition needed         |
| **Typical use**      | Resource identifiers | Filters, options, pagination |
| **Required**         | Usually yes          | Usually optional             |
| **RESTful**          | ✅ Core part         | ⚙️ Modifiers                 |
| **Multiple values**  | Multiple params      | Unlimited `&` pairs          |
| **Type**             | String               | String (or array)            |

---

## Best Practices

1. **Use params for identity**: `/users/:id`, `/orders/:orderId`
2. **Use query for options**: `/users?role=admin&active=true`
3. **Combine both**: `/users/:id/orders?status=PENDING`
4. **Always provide defaults** for query params: `req.query.limit || 10`
5. **Validate and convert types**: `+(req.params.id || 0)`
6. **Keep URLs readable**: prefer `/users/123` over `/users?id=123`

---

_This guide is specific to Express.js in Node.js/TypeScript applications._
