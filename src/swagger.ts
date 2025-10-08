import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Insta E-Commerce API Documentation",
      version: "1.0.0",
      description:
        "Comprehensive API documentation for the Insta E-Commerce backend",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3030/api-docs",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email",
            },
            role: {
              type: "string",
              enum: ["ADMIN", "USER"],
              description: "User role",
            },
            defaultShippingAddressId: {
              type: "integer",
              nullable: true,
              description: "Default shipping address ID",
            },
            defaultBillingAddressId: {
              type: "integer",
              nullable: true,
              description: "Default billing address ID",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              description: "User name",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "User password (minimum 6 characters)",
              example: "password123",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              description: "User password",
              example: "password123",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            user: {
              $ref: "#/components/schemas/User",
            },
            token: {
              type: "string",
              description: "JWT authentication token",
            },
          },
        },
        Address: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Address ID",
            },
            lineOne: {
              type: "string",
              description: "Address line 1",
            },
            lineTwo: {
              type: "string",
              nullable: true,
              description: "Address line 2",
            },
            city: {
              type: "string",
              description: "City",
            },
            country: {
              type: "string",
              description: "Country",
            },
            pincode: {
              type: "string",
              description: "Postal code (6 digits)",
            },
            userId: {
              type: "integer",
              description: "User ID",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        AddressRequest: {
          type: "object",
          required: ["lineOne", "pincode", "country", "city"],
          properties: {
            lineOne: {
              type: "string",
              description: "Address line 1",
              example: "123 Main Street",
            },
            lineTwo: {
              type: "string",
              nullable: true,
              description: "Address line 2",
              example: "Apt 4B",
            },
            city: {
              type: "string",
              description: "City",
              example: "New York",
            },
            country: {
              type: "string",
              description: "Country",
              example: "USA",
            },
            pincode: {
              type: "string",
              description: "Postal code (exactly 6 digits)",
              example: "100001",
            },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "User name",
              example: "John Doe",
            },
            defaultShippingAddressId: {
              type: "integer",
              description: "Default shipping address ID",
              example: 1,
            },
            defaultBillingAddressId: {
              type: "integer",
              description: "Default billing address ID",
              example: 1,
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Product ID",
            },
            name: {
              type: "string",
              description: "Product name",
            },
            description: {
              type: "string",
              description: "Product description",
            },
            price: {
              type: "number",
              format: "decimal",
              description: "Product price",
            },
            tags: {
              type: "string",
              description: "Comma-separated tags",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        CreateProductRequest: {
          type: "object",
          required: ["name", "description", "price", "tags"],
          properties: {
            name: {
              type: "string",
              description: "Product name",
              example: "Premium Tea",
            },
            description: {
              type: "string",
              description: "Product description",
              example: "High-quality organic tea from India",
            },
            price: {
              type: "number",
              format: "decimal",
              description: "Product price",
              example: 29.99,
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Product tags",
              example: ["tea", "organic", "india"],
            },
          },
        },
        ProductListResponse: {
          type: "object",
          properties: {
            count: {
              type: "integer",
              description: "Total number of products",
            },
            data: {
              type: "object",
              properties: {
                products: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Cart item ID",
            },
            quantity: {
              type: "integer",
              description: "Quantity",
            },
            userId: {
              type: "integer",
              description: "User ID",
            },
            productId: {
              type: "integer",
              description: "Product ID",
            },
            product: {
              $ref: "#/components/schemas/Product",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        AddToCartRequest: {
          type: "object",
          required: ["productId", "quantity"],
          properties: {
            productId: {
              type: "integer",
              description: "Product ID",
              example: 1,
            },
            quantity: {
              type: "integer",
              description: "Quantity",
              example: 2,
            },
          },
        },
        ChangeQuantityRequest: {
          type: "object",
          required: ["quantity"],
          properties: {
            quantity: {
              type: "integer",
              description: "New quantity",
              example: 3,
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Order ID",
            },
            netAmount: {
              type: "number",
              format: "decimal",
              description: "Total order amount",
            },
            address: {
              type: "string",
              description: "Formatted delivery address",
            },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "ACCEPTED",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
              ],
              description: "Order status",
            },
            userId: {
              type: "integer",
              description: "User ID",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        OrderWithDetails: {
          allOf: [
            {
              $ref: "#/components/schemas/Order",
            },
            {
              type: "object",
              properties: {
                products: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/OrderProduct",
                  },
                },
                events: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/OrderEvent",
                  },
                },
              },
            },
          ],
        },
        OrderProduct: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Order product ID",
            },
            quantity: {
              type: "integer",
              description: "Quantity",
            },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "ACCEPTED",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
              ],
              description: "Order product status",
            },
            orderId: {
              type: "integer",
              description: "Order ID",
            },
            productId: {
              type: "integer",
              description: "Product ID",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        OrderEvent: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Event ID",
            },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "ACCEPTED",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
              ],
              description: "Event status",
            },
            orderId: {
              type: "integer",
              description: "Order ID",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        ChangeStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: [
                "PENDING",
                "ACCEPTED",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
              ],
              description: "New order status",
              example: "ACCEPTED",
            },
          },
        },
        ChangeRoleRequest: {
          type: "object",
          required: ["role"],
          properties: {
            role: {
              type: "string",
              enum: ["ADMIN", "USER"],
              description: "New user role",
              example: "ADMIN",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            errorCode: {
              type: "integer",
              description: "Error code",
            },
            errors: {
              type: "object",
              nullable: true,
              description: "Additional error details",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Authentication token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Unauthorized",
                errorCode: 1001,
                errors: null,
              },
            },
          },
        },
        ForbiddenError: {
          description: "User does not have permission to access this resource",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Forbidden - Admin access required",
                errorCode: 1003,
                errors: null,
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Resource not found",
                errorCode: 2001,
                errors: null,
              },
            },
          },
        },
        ValidationError: {
          description: "Request validation failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Validation error",
                errorCode: 3001,
                errors: {
                  field: "Invalid value",
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Products",
        description: "Product management endpoints (Admin only)",
      },
      {
        name: "Cart",
        description: "Shopping cart endpoints",
      },
      {
        name: "Orders",
        description: "Order management endpoints",
      },
    ],
    paths: {
      "/auth/signup": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          description: "Create a new user account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SignupRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "User successfully created",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            "400": {
              description: "User already exists or validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          description: "Authenticate user and receive JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/LoginResponse",
                  },
                },
              },
            },
            "400": {
              description: "Incorrect password",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            "404": {
              description: "User not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current user",
          description: "Get the currently authenticated user details",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            "200": {
              description: "Current user details",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
          },
        },
      },
      "/users": {
        get: {
          tags: ["Users"],
          summary: "List all users (Admin only)",
          description: "Get a paginated list of all users",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "query",
              name: "skip",
              schema: {
                type: "integer",
                default: 0,
              },
              description: "Number of records to skip for pagination",
            },
          ],
          responses: {
            "200": {
              description: "List of users",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/User",
                    },
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "403": {
              $ref: "#/components/responses/ForbiddenError",
            },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update current user",
          description: "Update the authenticated user profile",
          security: [
            {
              BearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateUserRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "User updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "404": {
              description: "Address not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user by ID (Admin only)",
          description: "Get detailed user information including addresses",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "User ID",
            },
          ],
          responses: {
            "200": {
              description: "User details",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/User",
                      },
                      {
                        type: "object",
                        properties: {
                          addresses: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/Address",
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "403": {
              $ref: "#/components/responses/ForbiddenError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
      },
      "/users/{id}/role": {
        put: {
          tags: ["Users"],
          summary: "Change user role (Admin only)",
          description: "Update user role (ADMIN or USER)",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "User ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ChangeRoleRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Role updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "string",
                    enum: ["ADMIN", "USER"],
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "403": {
              $ref: "#/components/responses/ForbiddenError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
      },
      "/users/address": {
        post: {
          tags: ["Users"],
          summary: "Add new address",
          description: "Add a new address for the authenticated user",
          security: [
            {
              BearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AddressRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Address added successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Address",
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
          },
        },
        get: {
          tags: ["Users"],
          summary: "List user addresses",
          description: "Get all addresses for the authenticated user",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            "200": {
              description: "List of addresses",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Address",
                    },
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
          },
        },
      },
      "/users/address/{id}": {
        delete: {
          tags: ["Users"],
          summary: "Delete address",
          description: "Delete a specific address",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Address ID",
            },
          ],
          responses: {
            "200": {
              description: "Address deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Address",
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
      },
      "/products": {
        post: {
          tags: ["Products"],
          summary: "Create product (Admin only)",
          description: "Create a new product",
          security: [
            {
              BearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateProductRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Product created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "403": {
              $ref: "#/components/responses/ForbiddenError",
            },
          },
        },
        get: {
          tags: ["Products"],
          summary: "List products (Admin only)",
          description: "Get a paginated list of all products",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "query",
              name: "skip",
              schema: {
                type: "integer",
                default: 0,
              },
              description: "Number of records to skip for pagination",
            },
          ],
          responses: {
            "200": {
              description: "List of products with count",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProductListResponse",
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "403": {
              $ref: "#/components/responses/ForbiddenError",
            },
          },
        },
      },
      "/products/{id}": {
        get: {
          tags: ["Products"],
          summary: "Get product by ID (Admin only)",
          description: "Get detailed product information",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Product ID",
            },
          ],
          responses: {
            "200": {
              description: "Product details",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "403": {
              $ref: "#/components/responses/ForbiddenError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
        put: {
          tags: ["Products"],
          summary: "Update product (Admin only)",
          description: "Update an existing product",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Product ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateProductRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Product updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "403": {
              $ref: "#/components/responses/ForbiddenError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
        delete: {
          tags: ["Products"],
          summary: "Delete product (Admin only)",
          description: "Delete a product",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Product ID",
            },
          ],
          responses: {
            "200": {
              description: "Product deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "403": {
              $ref: "#/components/responses/ForbiddenError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
      },
      "/cart": {
        post: {
          tags: ["Cart"],
          summary: "Add item to cart",
          description:
            "Add a product to the shopping cart or update quantity if already exists",
          security: [
            {
              BearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AddToCartRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Cart item updated",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CartItem",
                  },
                },
              },
            },
            "201": {
              description: "Cart item added",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CartItem",
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
          },
        },
        get: {
          tags: ["Cart"],
          summary: "Get cart",
          description:
            "Get all items in the shopping cart with product details",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            "200": {
              description: "Cart items",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/CartItem",
                    },
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
          },
        },
      },
      "/cart/{id}": {
        delete: {
          tags: ["Cart"],
          summary: "Remove item from cart",
          description: "Remove a specific item from the shopping cart",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Cart item ID",
            },
          ],
          responses: {
            "200": {
              description: "Cart item removed",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CartItem",
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "404": {
              description: "Cart item not found or unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ["Cart"],
          summary: "Change item quantity",
          description: "Update the quantity of a cart item",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Cart item ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ChangeQuantityRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Quantity updated",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CartItem",
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "404": {
              description: "Cart item not found or unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },
      "/orders": {
        post: {
          tags: ["Orders"],
          summary: "Create order",
          description: "Create a new order from cart items",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            "200": {
              description: "Order created successfully (or cart is empty)",
              content: {
                "application/json": {
                  schema: {
                    oneOf: [
                      {
                        $ref: "#/components/schemas/OrderWithDetails",
                      },
                      {
                        type: "object",
                        properties: {
                          message: {
                            type: "string",
                            example: "cart is empty",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
          },
        },
        get: {
          tags: ["Orders"],
          summary: "List user orders",
          description: "Get all orders for the authenticated user",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            "200": {
              description: "List of orders",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
          },
        },
      },
      "/orders/{id}": {
        get: {
          tags: ["Orders"],
          summary: "Get order by ID",
          description:
            "Get detailed order information including products and events",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Order ID",
            },
          ],
          responses: {
            "200": {
              description: "Order details",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/OrderWithDetails",
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
        put: {
          tags: ["Orders"],
          summary: "Cancel order",
          description: "Cancel an existing order",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Order ID",
            },
          ],
          responses: {
            "200": {
              description: "Order cancelled successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Order",
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
      },
      "/orders/index": {
        get: {
          tags: ["Orders"],
          summary: "List all orders (Admin only)",
          description:
            "Get a paginated list of all orders, optionally filtered by status",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "query",
              name: "status",
              schema: {
                type: "string",
                enum: [
                  "PENDING",
                  "ACCEPTED",
                  "OUT_FOR_DELIVERY",
                  "DELIVERED",
                  "CANCELLED",
                ],
              },
              description: "Filter by order status",
            },
            {
              in: "query",
              name: "skip",
              schema: {
                type: "integer",
                default: 0,
              },
              description: "Number of records to skip for pagination",
            },
          ],
          responses: {
            "200": {
              description: "List of orders",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "403": {
              $ref: "#/components/responses/ForbiddenError",
            },
          },
        },
      },
      "/orders/{id}/status": {
        put: {
          tags: ["Orders"],
          summary: "Change order status (Admin only)",
          description: "Update the status of an order",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Order ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ChangeStatusRequest",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Status updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Order",
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "403": {
              $ref: "#/components/responses/ForbiddenError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
      },
      "/orders/{id}/users": {
        get: {
          tags: ["Orders"],
          summary: "List orders for specific user (Admin only)",
          description:
            "Get all orders for a specific user, optionally filtered by status",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer",
              },
              description: "User ID",
            },
            {
              in: "query",
              name: "status",
              schema: {
                type: "string",
                enum: [
                  "PENDING",
                  "ACCEPTED",
                  "OUT_FOR_DELIVERY",
                  "DELIVERED",
                  "CANCELLED",
                ],
              },
              description: "Filter by order status",
            },
            {
              in: "query",
              name: "skip",
              schema: {
                type: "integer",
                default: 0,
              },
              description: "Number of records to skip for pagination",
            },
          ],
          responses: {
            "200": {
              description: "List of user orders",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "403": {
              $ref: "#/components/responses/ForbiddenError",
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Insta E-Commerce API Docs",
    })
  );

  // Swagger JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("📚 Swagger documentation available at /api-docs");
};
