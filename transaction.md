# Database Transactions Explained

## What is a Database Transaction?

A **transaction** is a sequence of database operations that are executed as a single unit of work. It ensures that either **all operations succeed together** or **all operations fail together** - there's no in-between state.

### Real-World Analogy

Think of a bank transfer:

1. Deduct $100 from Account A
2. Add $100 to Account B

If step 1 succeeds but step 2 fails, Account A loses $100 but Account B never receives it - money disappears! A transaction prevents this by ensuring both steps happen together or neither happens at all.

## ACID Properties

Transactions follow four key principles (ACID):

1. **Atomicity**: All operations succeed or all fail (no partial completion)
2. **Consistency**: Database moves from one valid state to another
3. **Isolation**: Concurrent transactions don't interfere with each other
4. **Durability**: Once committed, changes are permanent

## Transaction in Our Order Creation

### The Code Structure

```typescript
export const createOrder = async (
  req: Request & { user: User },
  res: Response
) => {
  return await prismaClient.$transaction(async (tx) => {
    // All database operations happen here using 'tx' instead of 'prismaClient'
  });
};
```

### What is `tx`?

`tx` is **not** a transaction ID. It's the **transaction client** - a special version of Prisma Client that operates within the transaction boundary.

- Use `tx.model.operation()` inside transactions
- Use `prismaClient.model.operation()` outside transactions
- All operations with `tx` are part of the same atomic unit

### Step-by-Step Flow

#### **Step 1: Fetch Cart Items**

```typescript
const cartItems = await tx.cartItems.findMany({
  where: { userId: req.user.id },
  include: { product: true },
});
```

- Retrieves all items in the user's shopping cart
- Includes product details (price, name, etc.) needed for order creation

#### **Step 2: Validate Cart is Not Empty**

```typescript
if (cartItems.length === 0) {
  return res.json({ message: "cart is empty" });
}
```

- If no items in cart, return early without creating an order
- This exits the transaction without making any changes

#### **Step 3: Calculate Total Price**

```typescript
const price = cartItems.reduce((prev, current) => {
  return prev + current.quantity * current.product.price.toNumber();
}, 0);
```

- Uses `reduce()` to sum up the cost of all items
- Formula: `quantity × price` for each item
- Example:
  - 2 shirts @ $20 each = $40
  - 1 hat @ $15 = $15
  - **Total = $55**

#### **Step 4: Fetch User's Shipping Address**

```typescript
const address = await tx.address.findFirst({
  where: { id: +(req.user.defaultShippingAddressId || 0) },
});
```

- Retrieves the user's default shipping address
- The `+` operator converts the ID to a number
- Uses `|| 0` as a fallback if no default address is set

#### **Step 5: Create the Order**

```typescript
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
```

- Creates the main order record with total amount and shipping address
- **Nested create**: Simultaneously creates multiple `OrderProduct` records
- Each cart item becomes an order product with its productId and quantity
- Returns the order with all its products included

#### **Step 6: Create Order Event**

```typescript
const orderEvent = await tx.orderEvent.create({
  data: { orderId: order.id },
});
```

- Creates an event record for order tracking
- Typically initializes with status like "PENDING"
- Used for order history and status changes

#### **Step 7: Empty the Cart**

```typescript
await tx.cartItems.deleteMany({
  where: { userId: req.user.id },
});
```

- Deletes all items from the user's cart
- **Critical**: Must use `await` to ensure completion before transaction commits
- Without `await`, deletion might not complete, leaving items in cart

#### **Step 8: Return the Order**

```typescript
res.json(order);
```

- Sends the created order back to the client
- Transaction automatically commits when function completes successfully

## Why Use a Transaction Here?

### Without Transaction (Dangerous!)

Imagine this sequence:

1. ✅ Order created (ID: 123)
2. ✅ Order products created (3 items)
3. ✅ Order event created
4. ❌ **Database connection drops before cart deletion**

**Result**:

- Order exists in database
- User's cart still has items
- User refreshes page and creates duplicate order!
- Inventory is double-deducted

### With Transaction (Safe!)

Same scenario with transaction:

1. Order creation prepared
2. Order products creation prepared
3. Order event creation prepared
4. ❌ **Database connection drops**

**Result**:

- Transaction automatically **rolls back**
- **All changes are undone**
- Database returns to state before transaction started
- User can retry without duplicates

## Transaction Failure Scenarios

### Scenario 1: Insufficient Product Stock

```typescript
// Imagine we add stock checking
const product = await tx.product.findUnique({ where: { id: productId } });
if (product.stock < quantity) {
  throw new Error("Insufficient stock");
}
```

**Result**:

- Error thrown inside transaction
- Entire transaction rolls back
- Order not created, cart not emptied
- User can modify cart and retry

### Scenario 2: Network Failure

If network fails during any operation:

- Transaction automatically rolls back
- No partial data saved
- Database remains consistent

### Scenario 3: Missing Address

```typescript
const address = await tx.address.findFirst({ ... });
if (!address) {
  throw new Error("No shipping address found");
}
```

**Result**:

- Transaction rolls back
- User prompted to add shipping address
- Cart remains intact for retry

## Key Takeaways

1. **Transactions ensure atomicity**: All database operations succeed together or fail together
2. **Use `tx` client inside transactions**: All operations must use the transaction client
3. **Always `await` operations**: Especially important for delete/update operations
4. **Automatic rollback on errors**: If anything fails, all changes are undone
5. **Commit happens automatically**: When the transaction function completes successfully

## Best Practices

1. ✅ Keep transactions as short as possible (minimize operations)
2. ✅ Always await all database operations inside transactions
3. ✅ Handle errors gracefully and let transaction roll back
4. ✅ Use transactions when multiple related operations must succeed together
5. ❌ Don't make external API calls inside transactions (they can't be rolled back)
6. ❌ Don't perform long-running operations in transactions (blocks database)

## When to Use Transactions

Use transactions when:

- Multiple database operations depend on each other
- You need all-or-nothing guarantee
- Data consistency across tables is critical
- Examples: transfers, orders, user registration with profile

Don't use transactions for:

- Single database operations (they're already atomic)
- Read-only operations
- Operations that don't depend on each other
