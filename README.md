# ImageFlow

ImageFlow is a Next.js application that combines ai powered image generation with intelligent chat capabilities. Create images and chat with ai, all in one place.

## Tech Stack

- **Next.js** - React framework for production
- **Convex** - Backend-as-a-Service for real-time data and functions
- **AI SDK** - AI model integrations for chat and image generation
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

## Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)

## Getting Started

### Step 1: Install Dependencies

First, install all project dependencies:

```bash
pnpm i
```

### Step 2: Configure Environment Variables

Create the necessary environment files and configure your API keys:

#### Create `.env` file in the root directory:

```bash
UPLOADTHING_TOKEN=your_uploadthing_token_here
```

#### Create `.env.local` file in the root directory:

```bash
CONVEX_DEPLOYMENT=your_convex_deployment_name
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
NEXT_PUBLIC_CONVEX_SITE_URL=your_convex_site_url_here
SITE_URL=http://localhost:3000
```

**Note:** The Convex URLs (`NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL`) will be provided when you run `pnpm convex dev` for the first time. You can add them to `.env.local` after the initial Convex setup.

#### Configure Convex Environment Variables

Set the following environment variables in your Convex dashboard or using the Convex CLI:

```bash
AI_GATEWAY_API_KEY=your_ai_gateway_api_key
BETTER_AUTH_SECRET=your_better_auth_secret
EXA_API_KEY=your_exa_api_key
FAL_KEY=your_fal_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SITE_URL=http://localhost:3000
```

You can set these using the Convex CLI:

```bash
npx convex env set AI_GATEWAY_API_KEY your_ai_gateway_api_key
npx convex env set BETTER_AUTH_SECRET your_better_auth_secret
npx convex env set EXA_API_KEY your_exa_api_key
npx convex env set FAL_KEY your_fal_key
npx convex env set GOOGLE_CLIENT_ID your_google_client_id
npx convex env set GOOGLE_CLIENT_SECRET your_google_client_secret
npx convex env set SITE_URL http://localhost:3000
```

Or configure them in your Convex dashboard at [https://dashboard.convex.dev](https://dashboard.convex.dev).

### Step 3: Setup Convex

In your first terminal, start the Convex development server. This will set up your Convex backend and sync your functions:

```bash
pnpm convex dev
```

This command will:
- Initialize your Convex project (if not already done)
- Start the Convex development server
- Watch for changes in your Convex functions
- Provide you with deployment URLs and configuration

**Note:** Keep this terminal running throughout development.

### Step 4: Start the Development Server

Open a **second terminal** and start the Next.js development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Development Workflow

1. Install dependencies: `pnpm i`
2. Configure environment variables (`.env`, `.env.local`, and Convex env vars)
3. **Terminal 1**: Run `pnpm convex dev` (keep running)
4. **Terminal 2**: Run `pnpm dev` (keep running)
5. Open [http://localhost:3000](http://localhost:3000) in your browser

Both servers will automatically reload when you make changes to your code.

## Project Structure

- `/src/app` - Next.js app router pages and routes
- `/src/components` - React components and UI elements
- `/convex` - Convex backend functions and schema

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [AI SDK Documentation](https://sdk.vercel.ai/docs)
