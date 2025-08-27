# EcomFlow AI

EcomFlow AI is an intelligent e-commerce order management platform that provides AI-powered customer support for order inquiries. Built with Next.js and powered by advanced AI capabilities, it helps customers get instant answers about their orders, shipping status, and general e-commerce queries.

## 🌟 Features

- **AI-Powered Order Assistant**: Meet Nolan, an intelligent AI agent that can help customers with order status, shipping information, and general support
- **Real-time Communication**: Powered by Inngest for reliable background job processing and real-time updates
- **Smart Order Lookup**: Advanced order search by order ID, customer email, or customer name
- **Comprehensive Database**: SQLite database with Drizzle ORM for efficient order management
- **Modern UI**: Beautiful, responsive interface built with React and TailwindCSS
- **LLM Evaluation**: Built-in evaluation system using Evalite for testing AI agent performance

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Node.js, tRPC-like API with oRPC
- **Database**: SQLite with Drizzle ORM
- **AI/ML**: OpenAI GPT models, AI SDK
- **Real-time**: Inngest for background jobs and streaming
- **Evaluation**: Evalite for LLM testing and evaluation
- **Form Handling**: TanStack Form with Zod validation
- **State Management**: TanStack Query
- **Type Safety**: TypeScript throughout

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (recommended package manager)
- **Git**

You'll also need:
- **OpenAI API Key** for AI functionality
- **Database file** (SQLite) - will be created automatically

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecomflow-ai-nextjs
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database
DB_FILE_NAME="./local.db"

# OpenAI Configuration
OPENAI_API_KEY="your-openai-api-key-here"

# Inngest Configuration (for development)
INNGEST_SIGNING_KEY="your-inngest-signing-key"
INNGEST_EVENT_KEY="your-inngest-event-key"

# Optional: For production deployment
# Add any additional environment variables as needed
```

### 4. Database Setup

Initialize and push the database schema:

```bash
# Push database schema
pnpm db:push

# Seed the database with sample order data
pnpm db:seed
```

The seeding process will:
- Parse the included CSV file (`src/server/db/data_case_study_q325.csv`)
- Import sample order data into your SQLite database
- Create realistic e-commerce order records for testing

## 🏃‍♂️ Development Workflows

### Frontend Development

Start the Next.js development server with Turbopack:

```bash
pnpm frontend:dev
```

This will start the application at `http://localhost:3000` with:
- Hot module replacement
- TypeScript checking
- TailwindCSS compilation
- Fast refresh

### Backend Development with Inngest

For full functionality including AI features and background jobs, run Inngest in development mode:

```bash
# In a separate terminal
pnpm inngest:dev
```

This starts the Inngest development server for:
- Background job processing
- Real-time streaming
- Event handling
- Function debugging

### Database Management

Useful database commands:

```bash
# Open database studio (visual interface)
pnpm db:studio

# Push schema changes
pnpm db:push

# Re-seed database
pnpm db:seed
```

## 🧪 LLM Evaluation

The project includes a comprehensive evaluation system for testing the AI agent's performance.

### Running Evaluations

Start the evaluation watcher:

```bash
pnpm eval:dev
```

This will:
- Watch for changes in evaluation files
- Run test cases automatically
- Provide detailed scoring and feedback
- Test various AI agent scenarios

### Evaluation Features

- **Answer Correctness**: Measures how accurate the AI responses are
- **Factuality**: Ensures responses contain only factual information
- **Order Lookup Testing**: Validates order ID lookup functionality
- **Customer Service Scenarios**: Tests various customer support situations

### Evaluation Files

- `src/server/ai/agents/nolan-agent.eval.ts`: Main evaluation suite
- `src/server/ai/scorers.ts`: Custom scoring functions
- Test cases cover order status inquiries, customer lookups, and error handling

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm frontend:dev` | Start Next.js development server |
| `pnpm inngest:dev` | Start Inngest development server |
| `pnpm build` | Build production application |
| `pnpm start` | Start production server |
| `pnpm db:push` | Push database schema changes |
| `pnpm db:studio` | Open database visual interface |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm eval:dev` | Start LLM evaluation watcher |

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── inngest/       # Inngest webhook
│   │   └── rpc/           # oRPC endpoints
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── order-form.tsx     # Main order inquiry form
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and actions
├── server/                # Backend logic
│   ├── ai/                # AI agent and tools
│   │   ├── agents/        # AI agent definitions and evaluations
│   │   ├── tools.ts       # Database query tools for AI
│   │   └── scorers.ts     # Evaluation scoring functions
│   ├── db/                # Database layer
│   │   ├── schema.ts      # Drizzle schema definitions
│   │   ├── seed-order-table.ts # Database seeding script
│   │   └── data_case_study_q325.csv # Sample order data
│   ├── inngest/           # Background job functions
│   └── orpc/              # API router and client
```

## 🚦 Getting Started Guide

1. **Complete the installation steps above**
2. **Start the development servers**:
   ```bash
   # Terminal 1: Frontend
   pnpm frontend:dev
   
   # Terminal 2: Background jobs
   pnpm inngest:dev
   ```
3. **Visit `http://localhost:3000`** to see the application
4. **Test the AI assistant** by:
   - Entering an order ID from the seeded data
   - Asking questions like "What is the status of my order?"
   - Testing customer email lookups

## 🎯 Usage Examples

### Order Status Inquiry
- **Order ID**: `297b2cc5e3c97637`
- **Question**: "What is the status of my order?"

### Customer Lookup
- **Customer Email**: Use any email from the seeded data
- **Question**: "Show me all my orders"

### General Support
- **Question**: "How can I track my package?"

## 🔧 Configuration

### AI Model Configuration
The AI agent uses OpenAI's models configured in `src/server/ai/openai.ts`. You can adjust:
- Model selection (GPT-4, GPT-3.5, etc.)
- Temperature settings
- Token limits
- System prompts

### Database Configuration
Database settings are in `drizzle.config.ts`:
- SQLite database location
- Schema location
- Migration settings
