# EcomFlow AI - "Where's My Order?" Assistant

An AI-powered order tracking assistant that answers customer inquiries using grounded data from anonymized order records. Built with streaming AI responses and background job processing.

## 🎯 Overview

This application provides a simple interface for customers to ask questions about their orders using natural language. The AI assistant:
- Looks up orders from anonymized data based on email and/or order ID
- Provides grounded, factual responses citing specific order information
- Streams responses in real-time using Vercel AI SDK
- Processes data updates via Inngest background jobs

## 🛠 Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **AI**: Vercel AI SDK with OpenAI
- **Backend**: tRPC for type-safe APIs
- **Jobs**: Inngest for background processing
- **Validation**: Zod for input validation
- **Data**: CSV processing with optional SQLite/Postgres storage

## ✨ Key Features

- **Streaming AI Responses**: Real-time response streaming using Vercel AI SDK
- **Grounded AI**: Responses strictly based on provided order data, no hallucinations
- **Order Lookup**: Search by email, order ID, or customer name
- **Input Validation**: Robust validation using Zod schemas
- **Background Jobs**: Inngest-powered data processing and updates
- **Type Safety**: End-to-end TypeScript with tRPC
- **Result Pattern**: Functional error handling with Result<T, E> types

## ✅ Implementation Checklist

### Core Infrastructure
- [ ] Set up tRPC with TypeScript
- [ ] Configure Vercel AI SDK with OpenAI
- [ ] Set up Inngest for background jobs
- [ ] Add Zod for input validation
- [ ] Implement Result<T, E> pattern for error handling

### Data Layer
- [ ] Process and load `data_case_study_q325.csv`
- [ ] Create Order type definition
- [ ] Set up data storage (in-memory, SQLite, or Postgres with Drizzle)
- [ ] Implement order lookup service with these methods:
  - [ ] Query by `platformOrderId`
  - [ ] Query by `customerEmail`
  - [ ] Query by `customerName`
  - [ ] Handle multiple matches and ambiguous results

### API Implementation
- [ ] Create tRPC router with streaming endpoint
- [ ] Input validation: `{ email?: string; orderId?: string; question: string }`
- [ ] Implement order lookup "tool" for AI
- [ ] HTTP 400 error handling for invalid inputs
- [ ] Stream AI responses to client

### AI Integration
- [ ] Configure OpenAI API with streaming
- [ ] Create system prompt for grounded responses
- [ ] Implement order data injection into AI context
- [ ] Ensure AI cites order information (platformOrderId, status, tracking)
- [ ] Handle ambiguous matches and missing data scenarios
- [ ] Prevent hallucination of dates/events

### Frontend Components
- [ ] Create order inquiry form with:
  - [ ] Email input (optional)
  - [ ] Order ID input (optional)
  - [ ] Free-text question input
  - [ ] Submit button
- [ ] Implement streaming response display
- [ ] Add loading states and error handling
- [ ] Create "Try example" button with pre-filled demo data
- [ ] Display validation errors from Zod

### Background Jobs (Inngest)
- [ ] Set up Inngest dashboard integration
- [ ] Create background job that modifies data affecting answers
- [ ] Ensure job is visible and runnable in dashboard
- [ ] Test that job execution changes response behavior

### Error Handling & Validation
- [ ] Zod schemas for all external inputs
- [ ] Friendly validation error messages
- [ ] Handle no matches found
- [ ] Handle multiple ambiguous matches
- [ ] Proper error states in UI

### AI Prompt Engineering
- [ ] System prompt: "Answer only using provided orders/tracking data"
- [ ] Instruction to state ambiguity when unclear
- [ ] Requirement to cite platformOrderId
- [ ] Include latest status information
- [ ] Avoid definitive delivery date predictions
- [ ] Ensure human-quality responses

### Testing & Quality
- [ ] Test streaming functionality end-to-end
- [ ] Verify no hallucinated facts in responses
- [ ] Test input validation edge cases
- [ ] Confirm Inngest job affects answer behavior
- [ ] Test demo flow with example data

### Deployment & Documentation
- [ ] Deploy to Vercel or similar platform
- [ ] Environment variables setup (OPENAI_API_KEY)
- [ ] Create demo recording (Loom):
  - [ ] Live demo of ask → streamed answer flow
  - [ ] Show Inngest dashboard with visible/runnable function
  - [ ] Explain design decisions and trade-offs
  - [ ] Discuss what would be built next

### Code Quality Standards
- [ ] Use `type` instead of `interface`
- [ ] Zod for all external inputs
- [ ] Result<T, E> pattern for services
- [ ] Business logic server-side only
- [ ] Keep components "dumb" (presentational)
- [ ] Proper TypeScript throughout

## ⚙️ Prerequisites

Make sure you have the following installed on your development machine:

- Node.js (version 22 or above)
- pnpm (package manager)
- OpenAI API key (with $5 spend limit for this project)
- Inngest account for background job processing

## 🚀 Getting Started

Follow these steps to get started with EcomFlow AI:

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd ecomflow-ai
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

4. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   INNGEST_EVENT_KEY=your_inngest_event_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   ```

5. Add the order data file:
   
   Place `data_case_study_q325.csv` in the `data/` directory

6. Start the development server:

   ```bash
   pnpm dev
   ```

## 📜 Available Scripts

- pnpm dev - Starts the development server.
- pnpm build - Builds the production-ready code.
- pnpm lint - Runs ESLint to analyze and lint the code.
- pnpm preview - Starts the Vite development server in preview mode.

## 📂 Project Structure

```
ecomflow-ai/
  ├── data/                    # Order data files
  │   └── data_case_study_q325.csv
  ├── src/
  │   ├── components/          # React components
  │   │   ├── ui/             # shadcn/ui components
  │   │   ├── order-inquiry-form.tsx
  │   │   └── streaming-response.tsx
  │   ├── server/             # Server-side code
  │   │   ├── api/            # tRPC routers
  │   │   ├── services/       # Business logic
  │   │   │   └── order-lookup.ts
  │   │   └── inngest/        # Background jobs
  │   ├── lib/                # Utility functions
  │   │   ├── types.ts        # Type definitions
  │   │   ├── validation.ts   # Zod schemas
  │   │   └── utils.ts
  │   ├── styles/             # CSS stylesheets
  │   ├── App.tsx            # Application entry point
  │   └── main.tsx           # Main rendering file
  ├── .env.example           # Environment variables template
  ├── package.json
  └── vite.config.ts
```

## 🔌 API Documentation

### Core Types

```typescript
type Order = {
  platformOrderId: string;
  customerEmail: string;
  status: string;
  trackingNumber?: string;
  lastEvent?: string;
  lastEventAt?: string;
  itemsJson?: string;
}

type Result<T, E> = 
  | { success: true; data: T } 
  | { success: false; error: E }

type QueryInput = {
  email?: string;
  orderId?: string;
  question: string;
}
```

### tRPC Endpoints

- **POST** `/api/trpc/orderInquiry` - Stream AI response for order questions
  - Input: `QueryInput` (validated with Zod)
  - Output: Streamed text response
  - Errors: HTTP 400 for invalid input

### Order Lookup Service

```typescript
findOrders(opts: { 
  orderId?: string; 
  emailOrName?: string 
}): Result<Order[], { 
  error: "INVALID_INPUT" | "NOT_FOUND"; 
  message: string 
}>
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.
