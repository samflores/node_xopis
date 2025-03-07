# Node Xopis

## Dependencies

Before setting up the project, ensure you have the following installed:

- Node.js (v22.13.x+ recommended)
- npm (v10.9.x+ recommended)
- SQLite3 (for database management)

## Getting Started

1. **Fork the repository**

2. **Clone the repository**:
   ```sh
   git clone https://github.com/<yous_username>/node_xopis.git
   cd node_xopis
   ```

3. **Install dependencies**:
   ```sh
   npm install
   ```

4. **Run the project in development mode**:
   ```sh
   npm run dev
   ```

5. **Run the test suite**:
   ```sh
   npm test
   ```

## Tasks

### Task 1: Order Creation Endpoint

Create an endpoint to handle order creation using Objection.js and Knex.js. You can ignore shipment cost and taxes,
 setting them to zero. No need to worry about payment processing or order status. Simply set it to `payment_pending`.

- **Endpoint**: `POST /orders`
- **Payload**:
  ```json
  {
    "customer_id": 1,
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "discount": 3.98
      },
      {
        "product_id": 2,
        "quantity": 1,
        "discount": 0.99
      }
    ]
  }
  ```
- **Payload Parameters**:
  - `customer_id` (required)
  - `product_id` (required)
  - `quantity` (required)
  - `discount` (optional, defaults to 0) the total discount for the quantity provided, i.e, if the user is buying
  2 copies of the item and getting $1 discount on each, this field will be $2. No need to multiply discount by quantity.
- **Response**:
  ```json
  {
    "id": 101, // order id
    "customer_id": 1,
    "total_paid": 45.03,
    "total_discount": 4.97,
    "status": "payment_pending",
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "discount": 3.98
      },
      {
        "product_id": 2,
        "quantity": 1,
        "discount": 0.99
      }
    ]
  }
  ```

### Task 2: Reporting Endpoints

Create two endpoints to generate reports, focusing on queries with joins and avoiding N+1 problems.

#### Endpoint 1: Total Sold by Date and Product

- **Endpoint**: `GET /reports/sales`
- **Query Parameters**:
  - `start_date` (required)
  - `end_date` (required)
  - `product_id` (optional)
- **Response**:
  ```json
  [
    {
      "date": "2025-02-01",
      "product_id": 1,
      "total_sold": 100.00
    },
    {
      "date": "2025-02-01",
      "product_id": 2,
      "total_sold": 50.00
    }
  ]
  ```

#### Endpoint 2: Most Sold Product by Number of Purchases

- **Endpoint**: `GET /reports/top-products`
- **Query Parameters**:
  - `start_date` (required)
  - `end_date` (required)
  - `breakdown` (optional, defaults to `false`) if set to `true` must breakdown the requested period by day
- **Response when breakdown is false**:
  ```json
  [
    {
      "product_id": 1,
      "total_purchases": 20
    },
    {
      "product_id": 2,
      "total_purchases": 15
    }
  ]
  ```
- **Response when breakdown is true**:
  ```json
  [
    {
      "product_id": 1,
      "date": "2025-02-01",
      "total_purchases": 15
    },
    {
      "product_id": 1,
      "date": "2025-02-02",
      "total_purchases": 5
    },
    {
      "product_id": 2,
      "date": "2025-02-01",
      "total_purchases": 4
    },
    {
      "product_id": 2,
      "date": "2025-02-02",
      "total_purchases": 11
    }
  ]
  ```
