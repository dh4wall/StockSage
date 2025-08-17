<div align="center">
  
  <h1>
    StockSage 🌿
  </h1>
  <p>
    Harness the power of AI for smarter, simpler stock trading.
  </p>

  

  <div>
    <a href="https://github.com/your-username/stocksage/stargazers">
      <img src="https://img.shields.io/github/stars/your-username/stocksage?style=for-the-badge&logo=github&color=5865F2" alt="GitHub Stars" />
    </a>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript Badge" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS Badge" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Badge" />
    <img src="https://img.shields.io/badge/Gemini_API-8E44AD?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini API Badge" />
  </div>
</div>

<br>



> **StockSage** is a modern web application designed to demystify the stock market. It combines real-time market data with powerful AI-driven insights from Google's Gemini API, providing users with predictive analysis, stock comparisons, and a beautiful, intuitive interface to track their favorite companies.

---

## ✨ Features

* 📈 **Dynamic Stock Charts**: View interactive historical data graphs for 30+ days, powered by Recharts.
* 🧠 **AI-Powered Predictions**: Leverage Google's Gemini to receive AI-generated stock price forecasts and investment advice.
* ⚖️ **AI Stock Comparison**: Get a comprehensive, side-by-side analysis of any two stocks, complete with an AI-generated recommendation.
* 📊 **Real-Time Market Data**: Access up-to-the-minute stock information pulled from the Yahoo Finance API.
* ⭐ **Personalized Watchlist**: Keep track of your favorite stocks with an easy-to-use favoriting system.
* 📱 **Fully Responsive UI**: A sleek and modern interface built with Tailwind CSS that works beautifully on any device.

---

## 💻 Tech Stack

| Frontend                                                                                                                              | Backend                                                                                                                                | Database                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **React.js**: For building a fast, component-based UI.                                                                                | **Node.js / Express**: For a robust and scalable server.                                                                               | **PostgreSQL**: For reliable and structured data storage.                                                                                    |
| **Tailwind CSS**: For modern, utility-first styling.                                                                                    | **Gemini API**: For all AI-powered features like prediction and comparison.                                                            |                                                                                                                                              |
| **Recharts**: For creating beautiful and interactive charts.                                                                            | **Yahoo Finance API**: As the primary source for stock market data.                                                                      |                                                                                                                                              |
| **Axios**: For making promises-based HTTP requests to the backend.                                                                        | **CORS / Dotenv**: For server configuration and security.                                                                                |                                                                                                                                              |

---

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
    <img src="/assets/landing.png" alt="StockSage Dashboard" />
    </tr>
    <tr>
      <td width="50%" align="center">
        <strong>Dashboard View</strong>
        <br><br>
        <img src="/assets/chart.png" alt="StockSage Dashboard" />
      </td>
      <td width="50%" align="center">
        <strong>AI Forecast</strong>
        <br><br>
        <img src="/assets/ai-insight.png" alt="StockSage AI Forecast" />
      </td>
    </tr>
    <tr>
      <td width="50%" align="center">
        <strong>Stock Comparison</strong>
        <br><br>
        <img src="/assets/difference.png" alt="StockSage Stock Comparison" />
      </td>
      <td width="50%" align="center">
        <strong>details</strong>
        <br><br>
        <img src="/assets/stock.png" alt="StockSage Mobile View" />
      </td>
    </tr>
  </table>
</div>


---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have `npm` (or `yarn`) and Node.js installed on your machine.

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your-username/stocksage.git](https://github.com/your-username/stocksage.git)
    cd stocksage
    ```

2.  **Setup Backend**
    ```sh
    # Navigate to the backend folder
    cd backend

    # Install NPM packages
    npm install

    # Create a .env file and add your variables
    touch .env
    ```
    Your `backend/.env` file should look like this:
    ```env
    PORT=5001
    DATABASE_URL="your_postgresql_connection_string"
    GEMINI_API_KEY="your_gemini_api_key"
    ```
    Then, run the development server:
    ```sh
    npm run dev
    ```

3.  **Setup Frontend**
    ```sh
    # Navigate to the frontend folder from the root
    cd frontend

    # Install NPM packages
    npm install

    # Create a .env file and add your backend URL
    touch .env
    ```
    Your `frontend/.env` file should contain the URL of your local backend server:
    ```env
    VITE_API_BASE_URL=http://localhost:5001
    ```
    Then, run the development server:
    ```sh
    npm run dev
    ```
The frontend will now be running on `http://localhost:5173` (or another available port).

---

## 🌐 Deployment

This project is deployed using a monorepo pipeline on two separate services:

* **Frontend**: Deployed on **Vercel**, configured to use the `frontend` directory.
* **Backend**: Deployed on **Render**, configured to use the `backend` directory.

### Keeping the Backend Alive
Render's free web services spin down after 15 minutes of inactivity, which can cause a delay on the first request. To prevent this, this project uses a free cron job from **[UptimeRobot](https://uptimerobot.com/)** to send a request to the backend's health check route (`/`) every 10 minutes. This keeps the service active and ensures instant response times.

<div align="center">
  <a href="https://your-vercel-link.vercel.app/">
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Deploy" />
  </a>
  <a href="https://your-render-link.onrender.com/api/companies">
    <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render Deploy" />
  </a>
</div>

---

## 🙏 Show Your Support

If you found this project useful or learned something from it, please consider giving it a ⭐!
