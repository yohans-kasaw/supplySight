# SupplySight - Smart Warehouse Management
## 📸 Screenshots

Here are some of the key features of the application.

### 1. Main Dashboard (7-Day Trend)
![Screenshot of the main dashboard showing a 7-day trend graph](./screenshots/main_dashboard.png)

### 2. Dashboard (30-Day Trend)
![Screenshot of the dashboard showing a 30-day trend graph](./screenshots/30days.png)

### 3. Product Inventory List
![Screenshot of the product inventory list page](./screenshots/list.png)

### 4. Update Demand Level
![Screenshot of the modal used to update a product's demand level](./screenshots/update-demand.png)

### 5. Transfer Stock Between Warehouses
![Screenshot of the stock transfer interface](./screenshots/transfer.png)

### 5. Error 
![Screenshot of error](./screenshots/error.png)

## 💻 Tech Stack

-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Frontend Framework:** [React](https://reactjs.org/)
-   **Styling:**[Tailwind CSS](https://tailwindcss.com/) _(or specify your choice)_
-   **Build Tool:** [Vite](https://vitejs.dev/)

## 🚀 Getting Started
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  **Clone the repository**
2.  **Navigate to the project directory**
    ```sh
    cd supplysight
    ```
2.  **run the server**
    ```sh
    cd backend
    npm install
    npm src/index.ts
    ```
3.  **run the frontend**
    ```sh
    cd frontend 
    npm install
    npm run dev 
    ```
    The application should now be running on `http://localhost:5173` (or your configured port).

## 📧 Contact
Your Name - [yohanshailukasaw@gmail.com](mailto:yohanshailukasaw@gmail.com)


## Nots.md
## 1. Design & UX Decisions
*   **Decision: Card-based Layout for Product List.**
    * Instead of a traditional, dense data table, I opted for a spacious card-based list. 
    * This improves scannability, as each product is a distinct visual block. 
    * It also provides a better foundation for a responsive mobile layout. 

*   **Decision: Expanded Status Vocabulary.**
    * While the spec defined `Healthy`, `Low`, and `Critical`, the UI introduces more descriptive statuses like `Surplus`, `Shortage`, and `Balanced`. 
    * This provides more nuance. `Surplus` (Stock > Demand) and `Shortage` (Stock < Demand) are more direct calls-to-action than `Healthy` and `Critical`. `Balanced` is a clearer state than `Low`.

*   **Decision: Visual Fill-Rate/Stock Level Indicators.**
    * Simple progress bars were added below the Stock and Demand figures on each product card and in the detail view. This provides an immediate, at-a-glance understanding of how close a product is to meeting its demand without requiring the user to do mental math.

## 2. Technical Trade-offs

*   ** Client-Side Calculation of KPIs and Status.**
    * Key metrics like `Total Stock`, `Total Demand`, and `Fill Rate`, as well as the per-product `Status`, are calculated on the frontend after fetching the raw product data. This simplified the backend API, which only needs to return a list of products.

    * For very large datasets (this could introduce a small amount of lag 

*   **No Real-Time Data Synchronization.**
    * The application follows a standard request-response model. Data is fetched when the component mounts or when a user action (like changing a filter) triggers a refetch. There are no WebSockets or server-sent events. This is significantly simpler and cheaper to implement and host.

    * The data on the dashboard can become stale.

*   ** Basic Form Validation.**
    *   The "Update Demand" and "Transfer Stock" forms have minimal client-side validation (e.g., ensuring a number is entered). There is no complex logic like checking if the `Quantity to Transfer` exceeds the `Available Stock` on the client side before sending the mutation.

    *   The application relies on the backend API to reject invalid operations. 

## 3. Future Improvements 

Given more time,

*   **Bulk Actions:**
    * checkboxes to the product list to allow users to select multiple items and perform bulk actions. 

*   **Enhanced Analytics & Reporting:**
    * A dedicated "Reports" section where users can generate and export PDF/CSV reports

*   **Real-Time Updates & Notifications:**
    *  Integration of WebSockets to push live updates to all connected clients. 

*   **User Roles & Permissions:**
    * An authentication system with distinct user roles e.g., `Admin`, `Warehouse Manager` 

*   **Stock Movement History:**
    * In the product detail drawer, I would add "History" tab. 
