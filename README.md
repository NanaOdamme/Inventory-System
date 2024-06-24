Here is a `README.md` file for your backend project:

```markdown
#  Farm Mangement Backend

This is the backend server for Ebenezer Farm, a poultry farm located in Assin Fosu in the Central Region of Ghana. The backend handles user authentication, product management, inventory management, and profit calculation.

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v12.x or later)
- npm (v6.x or later)
- MySQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ebenezer-farm-backend.git
   cd ebenezer-farm-backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up the `.env` file:
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file to include your MySQL credentials and JWT secret.

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=poultry_inventory
   JWT_SECRET=yourjwtsecret
   ```

4. Set up the MySQL database:

   - Create a database named `poultry_inventory`.
   - Import the database schema from `schema.sql`.

5. Start the server:
   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000`.

## API Endpoints

### Authentication

- `POST /register`: Register a new user (Admin only).
- `POST /login`: Login a user.

### Users

- `GET /user`: Get the logged-in user's details.
- `GET /users`: Get all users.
- `POST /users`: Create a new user.
- `PUT /users/:id`: Update a user.
- `DELETE /users/:id`: Delete a user.

### Products

- `GET /products`: Get all products.
- `GET /products/:id`: Get a product by ID.
- `POST /products`: Create a new product.
- `PUT /products/:id`: Update a product.
- `DELETE /products/:id`: Delete a product.

### Inventory

- `GET /inventory`: Get all available stocks.
- `POST /inventory`: Add new stock.
- `PUT /inventory/:id`: Update stock.
- `DELETE /inventory/:id`: Delete stock.
- `POST /inventory/not-in-stock`: Move stock to not in stock.
- `GET /not-in-stock`: Get all not in stock items.
- `POST /inventory/sold`: Move stock to sold.

### Profits

- `GET /profits/weekly`: Get weekly profit.
- `GET /profits/monthly`: Get monthly profit.
- `GET /profits/monthly-all`: Get monthly profit for all months.
- `GET /profits/yearly-all`: Get yearly profit for all years.

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web framework
- [MySQL](https://www.mysql.com/) - Database
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication

## Authors

- **Nana Akosua Odame**

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspiration from farm management systems
- Thanks to the open-source community for their invaluable resources

