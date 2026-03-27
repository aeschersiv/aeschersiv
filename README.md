# FutureWealth

AI-powered financial life planning that goes beyond the numbers. FutureWealth measures your human capital, your happiness, your relationships — and writes a financial future built around the life you actually want.

## Features

### Interactive Financial Life Assessment
A guided conversational chatbot that covers 14 categories across 40+ questions:
- **Demographics** — age, filing status, state, retirement age
- **Happiness Profile** — 8-dimension happiness scoring with values alignment
- **Income** — salary, side income, passive income, growth trajectory
- **Spending** — detailed monthly expense breakdown
- **Savings** — emergency fund, retirement accounts, brokerage
- **Debt** — mortgage, student loans, auto loans, credit cards
- **Insurance** — life, disability, health coverage analysis
- **Investments** — risk tolerance, style, allocation preferences
- **Human Capital** — education, career trajectory, skills, displacement risk
- **Goals** — prioritized goals with happiness impact scoring

### Living Balance Sheet
Inspired by the Living Balance Sheet concept, expanded with three layers of wealth:
- **Traditional Assets** — savings, investments, retirement accounts
- **Human Capital** — present value of future earnings (often the largest asset for those under 50)
- **Social & Relationship Capital** — network, community, purpose, relationships

### Financial Projections
- 40-year timeline with income, spending, and net worth projections
- Multi-scenario analysis (Best Case, Conservative, Disruption)
- Happiness trajectory modeling
- Milestone identification and tracking
- Intertemporal tradeoff visualization

### Integrations

#### Backn9ne Insurance
- Insurance gap analysis (life, disability, health)
- Instant quote generation with multiple carriers
- Coverage recommendations based on human capital value
- Application tracking (API-ready)

#### Altruist
- Model portfolio recommendations based on risk tolerance
- Asset allocation visualization
- Portfolio performance tracking
- Tax-loss harvesting analysis (API-ready)
- Automated rebalancing (API-ready)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page with narrative scroll
│   ├── assess/page.tsx       # Interactive chatbot assessment
│   ├── dashboard/page.tsx    # Living Balance Sheet + analytics
│   ├── future/page.tsx       # Future timeline narrative
│   └── api/
│       ├── assess/route.ts   # Assessment calculation API
│       ├── backn9ne/route.ts # Backn9ne Insurance proxy API
│       └── altruist/route.ts # Altruist portfolio proxy API
├── components/
│   ├── Navigation.tsx        # Global navigation
│   ├── ChatInterface.tsx     # Conversational assessment engine
│   ├── BalanceSheetCard.tsx   # Living Balance Sheet sections
│   ├── HappinessRadar.tsx    # 7-dimension happiness visualization
│   ├── WealthChart.tsx       # Multi-view financial trajectory
│   ├── SpendingBreakdown.tsx # Expense analysis & pie chart
│   ├── InsurancePanel.tsx    # Backn9ne integration panel
│   ├── InvestmentPanel.tsx   # Altruist portfolio panel
│   └── MetricCard.tsx        # KPI metric cards
├── lib/
│   ├── decision-tree.ts      # Assessment conversation flow
│   ├── calculations.ts       # Financial calculation engine
│   └── api-integrations.ts   # Backn9ne + Altruist API clients
└── types/
    └── index.ts              # TypeScript type definitions
```

## API Integration

### Backn9ne Insurance API
Set `BACKN9NE_API_KEY`, `BACKN9NE_API_URL`, and `BACKN9NE_AGENT_ID` in `.env`. The app falls back to mock data when keys aren't configured.

### Altruist API
Set `ALTRUIST_API_KEY`, `ALTRUIST_API_URL`, and `ALTRUIST_ADVISOR_ID` in `.env`. The app falls back to mock data when keys aren't configured.

## License

Private — All rights reserved.
