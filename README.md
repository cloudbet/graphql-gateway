# GraphQL Gateway

A GraphQL wrapper for the Cloudbet Sports API that provides a unified interface for sports betting data, account management, and trading operations.

## Overview

This service acts as a GraphQL gateway that wraps the Cloudbet Sports API, providing a more developer-friendly interface for accessing sports betting data. It consolidates three main API domains:

- **Feed API**: Sports data, competitions, events, and odds
- **Account API**: User account information and balances
- **Trading API**: Bet placement and management

## Key Features

### Sports Data

- List available sports and categories
- Get competitions for specific sports and dates
- Retrieve detailed event information with markets and odds
- Real-time odds updates via selection and line queries

### Account Management

- View account information
- Check balances across multiple currencies
- List available currencies

### Trading Operations

- Place bets with market selections
- Retrieve bet history with pagination
- Get bet details by reference ID

## Getting Started

### Installation

```bash
# Install dependencies
yarn install

# Generate GraphQL types
yarn generate

# Start development server
yarn dev
```

### Environment Configuration

Create environment files for different environments:

- `.env.development` - Development settings
- `.env.production` - Production settings

Copy `.env.sample` as a starting point:

Required environment variables:

```bash
# API Endpoints (defaults to Cloudbet production)
SPORTS_API_HOSTNAME=https://sports-api.cloudbet.com
ACCOUNT_HOSTNAME=https://sports-api.cloudbet.com
TRADING_HOSTNAME=https://sports-api.cloudbet.com

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: Enable mock server for development
ENABLE_MOCK_SERVER=true
```

### Development Commands

```bash
# Start development server with hot reload
yarn dev

# Build for production
yarn build

# Run linting
yarn lint

# Generate GraphQL types
yarn generate
```

## Deployment

### Docker

The service is containerized using a multi-stage Docker build based on public `node:24-alpine` images.

**Build and run:**

```bash
# Build image
docker build -t graphql-gateway .

# Run container (detached)
docker run -d --rm -p 3000:3000 --name gateway graphql-gateway
```

**Verify it's up:**

```bash
# Health probe (no API key needed)
curl http://localhost:3000/health
# => Okay!
```

**Query the gateway:**

The Cloudbet API key is provided per request via the `x-api-key` header (see [Header Proxying](#header-proxying)):

```bash
curl -X POST "http://localhost:3000/" \
  -H "content-type: application/json" \
  -H "x-api-key: YOUR_CLOUDBET_API_KEY" \
  -d '{"query":"{ sports { key name competitionCount } }"}'
```

GraphQL playground (Apollo Sandbox) is available at `http://localhost:3000/` in a browser — add an `x-api-key` request header before running authenticated queries.

**Stop the container:**

```bash
docker stop gateway
```

## API Usage

### Example Queries

**Get all available sports:**

```graphql
query {
  sports {
    key
    name
    competitionCount
    eventCount
  }
}
```

**Get competitions for a sport:**

```graphql
query {
  competitions(sportKey: "football", date: "2026-01-15", limit: 10) {
    key
    name
    eventCount
    events {
      id
      name
      status
      cutoffTime
    }
  }
}
```

**Get account balance:**

```graphql
query {
  accountBalance(currency: "EUR") {
    currency
    amount
  }
}
```

**Place a bet:**

```graphql
mutation {
  placeBet(
    input: {
      referenceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      eventId: "12118347"
      marketUrl: "tennis.winner/home"
      currency: "EUR"
      price: "1.85"
      stake: "10.00"
    }
  ) {
    referenceId
    betStatus
  }
}
```

## Development Notes

### Code Generation

GraphQL types and resolvers are auto-generated using GraphQL Code Generator. After schema changes:

1. Update `src/schema.graphql`
2. Run `yarn generate`
3. Types will be generated in `src/generated/`

### Error Handling

- All errors are masked to prevent internal information leakage
- URLs in error messages are automatically masked
- GraphQL errors include appropriate HTTP status codes

### Header Proxying

The service automatically proxies all `x-` prefixed headers to downstream APIs, enabling authentication and other header-based features.

## TODOs

- Add pagination for `sports` graphql query (`competitions` and `bets` already support `limit`/`offset`)

## Contributing

1. Follow the existing code structure and patterns
2. Update GraphQL schema when adding new features
3. Run `yarn generate` after schema changes
4. Ensure linting is clean (`yarn lint`)
5. Update documentation for new features
