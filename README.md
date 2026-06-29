# IPO Pulse AI

IPO Pulse is a side project I built to track Indian IPOs (Mainboard & SME) and figure out what the market is actually thinking. 

Most IPO aggregator sites are either cluttered with ads or don't give you enough real analysis. I wanted a clean dashboard that tracks Grey Market Premium (GMP), live subscriptions, and financials, but also uses AI to actually make sense of the data. 

## What it does

- **Tracks Live GMP:** Shows real-time Grey Market Premiums and calculates estimated listing prices.
- **Monitors Subscriptions:** Tracks how many times an IPO is oversubscribed across QIB, NII, and Retail categories.
- **Analyzes Financials:** Displays year-over-year revenue, profit, EPS, and ROE for upcoming IPOs.
- **AI Investment Scoring:** Passes IPO data into Google Gemini to automatically generate a SWOT analysis, assign a risk score, and provide a final "Subscribe or Avoid" recommendation.
- **Live Market News:** Fetches the latest stock market news via Yahoo Finance and uses AI to determine if the overall market sentiment is Bullish or Bearish.

## Screenshots

*(Screenshots will be added here)*

## How it works under the hood

The stack is **Next.js 15 (App Router)** with **Prisma** and **PostgreSQL**. 

Since I didn't want to pay for expensive financial data APIs, I had to get creative with how data flows into the app:

### 1. The Data Pipeline
There's a custom scraper (`src/lib/scraper.ts`) that runs in the background. It uses Cheerio to pull live GMP and price bands directly from `ipowatch.in`. Since scraping is brittle and they sometimes block bots, I built a fallback mechanism. If the scraper fails, it switches to a local curated feed so the UI doesn't break in production.

When you run the sync command from the admin panel, it grabs the latest data, upserts the `Company` and `IPO` records via Prisma, and logs a new entry in the `GMPHistory` table so we can chart it over time.

### 2. Live Market Quotes & News
For general market trends (Nifty 50, Sensex) and live news, I hooked up `yahoo-finance2`. It runs server-side to fetch real-time pricing and news articles without dealing with CORS issues or exposing API keys on the client.

### 3. The AI Integration (Gemini)
This is the fun part. Instead of just showing numbers, the app passes the scraped data to Google's Gemini API. 
- **IPO Details:** The app sends the issue size, sector, price band, and GMP to the `/api/insight` route. Gemini returns a structured JSON response containing a SWOT analysis, risk score, and a final recommendation (e.g., SUBSCRIBE or AVOID). 
- **Market Sentiment:** It also passes the latest Yahoo Finance news headlines to `/api/market-analysis`. Gemini reads the news and returns a live market sentiment score (Bullish/Bearish) along with key takeaways.

## Running it locally

If you want to spin this up yourself:

1. **Clone & install:**
   ```bash
   git clone https://github.com/yourusername/ipo-pulse-ai.git
   cd ipo-pulse-ai
   npm install
   ```

2. **Set up env vars & Bring Your Own API Key:**
   Create a `.env` file in the root directory. To run this project, you will need a PostgreSQL database (I use Supabase/Neon) and **you must generate your own free Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey) to make the AI features work.
   ```
   DATABASE_URL="postgresql://user:password@host:port/database"
   
   # Add YOUR own Google Gemini API Key here
   GEMINI_API_KEY="your_key_here"
   ```

3. **Push the schema:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Run it:**
   ```bash
   npm run dev
   ```

*Note: If you don't add the Gemini API key, the app won't crash—the AI widgets will just show a configuration warning.*

## License
MIT. Feel free to fork it, break it, or use it for your own trading dashboard.
