# Huron Portal Constitution

## Project Overview
**Business Context**: Huron Portal is a modern business application for a CNC Machine Company, designed to streamline operations, enhance customer interactions, and provide data-driven insights for manufacturing excellence.

**Brand Identity**: Modern, sleek, and simple — reflecting precision engineering and cutting-edge manufacturing technology.

## Core Principles

### I. Azure-First with Cost Optimization
All infrastructure and services must prioritize Azure platform services with free tier utilization wherever possible.

**Key Requirements:**
- Deploy frontend as Azure Static Web App (free tier)
- Use Azure Cosmos DB for all data persistence
- Leverage Azure free tier limits before considering paid services
- Monitor and optimize Resource Units (RU) consumption in Cosmos DB
- Use Azure DevOps or GitHub Actions for CI/CD pipelines
- **Resource Group**: All Azure resources must be deployed to `huronportal-rg`

### II. Modern Frontend Stack
The application must use Next.js with React and TypeScript as the foundation, ensuring type safety and modern development practices.

**Technology Stack (Mandatory):**
- **Next.js** ^14.2.33 (App Router, SSR/SSG)
- **React** ^18.3.1 with React DOM ^18.3.1
- **TypeScript** ^5.9.3 (strict mode enabled)
- **Tailwind CSS** ^3.4.18 for styling
- **TanStack Query** ^5.90.5 for state and data fetching
- **SimpleWebAuthn Browser** ^13.2.2 for authentication flows
- **Microsoft SignalR** ^9.0.6 for real-time features

**Frontend Standards:**
- All components must be TypeScript with explicit types
- Use Server Components by default, Client Components when necessary
- Implement responsive design mobile-first
- Follow Tailwind CSS utility-first approach

### III. Business-Focused Design System (NON-NEGOTIABLE)
The application must embody modern, sleek, and simple design principles appropriate for a professional CNC Machine Company business application.

**Design Philosophy:**
- **Modern**: Contemporary design patterns, current best practices, cutting-edge visual language
- **Sleek**: Clean lines, minimal clutter, sophisticated aesthetic reflecting precision engineering
- **Simple**: Intuitive navigation, clear information hierarchy, friction-free user experience

**Localization:**
- **Primary Language**: French (Canadian French preferred for CNC industry terminology)
- All UI text, labels, messages, and content must be in French
- Date, time, and number formatting must follow French locale standards
- Error messages and validation feedback in French
- Documentation and help content in French

**Design Requirements:**
- Industrial-inspired color palette with professional neutrals and precision-focused accents
- Clean, minimalist interface with purposeful use of whitespace
- Subtle, professional animations (avoid flashy effects)
- Consistent design system reflecting manufacturing precision
- Typography: Clean, modern sans-serif fonts (Inter, Roboto, or similar)
- Business-appropriate visual language (data visualization, dashboards, operational metrics)
- Accessibility standards (WCAG 2.1 AA minimum)
- Professional micro-interactions that enhance usability without distraction
- Mobile-responsive design for factory floor and office use

### IV. Cosmos DB Data Modeling Best Practices
All database interactions must follow Azure Cosmos DB recommended patterns for performance and cost efficiency.

**Data Modeling Rules:**
- Minimize cross-partition queries through proper data modeling
- Embed related data when access patterns retrieve them together (respect 2 MB item limit)
- Use Hierarchical Partition Keys (HPK) when applicable
- Choose high-cardinality partition keys (userId, tenantId, deviceId)
- Avoid low-cardinality keys (status, country)
- Model data for query patterns, not normalized forms

**SDK Best Practices:**
- Use latest Azure Cosmos DB SDK
- Reuse CosmosClient singleton instances
- Enable async APIs for better throughput
- Handle 429 (Request Rate Too Large) with retry-after logic
- Log diagnostic strings for latency issues
- Monitor and optimize RU consumption

### V. Deployment Automation & GitOps
All deployments must be automated, repeatable, and version-controlled.

**Frontend Deployment:**
- GitHub Actions workflow for CI/CD
- Automatic deployment to Azure Static Web Apps
- Preview deployments for pull requests
- Environment-specific configurations

**Backend Deployment:**
- Azure CLI scripts for infrastructure provisioning
- Automated deployment pipelines
- Configuration managed through environment variables
- Secrets stored in Azure Key Vault

## Technology & Infrastructure Standards

### Frontend Architecture
- **Framework**: Next.js App Router with file-based routing
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state, React Context for UI state
- **Authentication**: WebAuthn/Passkeys via SimpleWebAuthn
- **Real-time**: SignalR for live updates
- **Type Safety**: TypeScript strict mode, no implicit any
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

### Backend Architecture
- **Database**: Azure Cosmos DB (NoSQL API)
- **API Layer**: Next.js API Routes (serverless functions in Azure Static Web Apps)
- **Backend Execution**: All backend API calls must execute in production environment (Azure)
- **Frontend Execution**: Frontend can run locally (development) or in production (Azure Static Web Apps)
- **Development Model**: Local frontend development connects to production backend API endpoints
- **Authentication**: Azure AD B2C or custom WebAuthn implementation
- **Real-time**: Azure SignalR Service
- **Configuration**: Environment variables, Azure Key Vault for secrets

### Development Tools
- **Local Development**: Cosmos DB Emulator for testing
- **VS Code Extensions**: Azure Cosmos DB extension (`ms-azure-tools.azure-cosmos-db`)
- **Version Control**: Git with conventional commits
- **Package Manager**: npm or pnpm

### Performance & Monitoring
- **Frontend Performance**: Lighthouse score > 90
- **Database Monitoring**: Azure Monitor for Cosmos DB
- **Logging**: Structured logging with diagnostic context
- **Error Tracking**: Application Insights integration

## Development Workflow

### Code Standards
- All code must be TypeScript with explicit return types
- Components must be documented with JSDoc comments
- No console.log in production code (use structured logging)
- Prefer composition over inheritance
- Follow SOLID principles

### Testing Strategy
- Unit tests for utility functions and hooks
- Component testing with React Testing Library
- Integration tests for API routes
- E2E tests for critical user flows (Playwright recommended)
- Test Cosmos DB interactions with emulator

### Code Review Process
- All changes require pull request review
- Automated checks must pass (lint, type-check, tests)
- Preview deployment must be verified
- Constitution compliance verification required
- No direct commits to main branch

### Database Development
- Use Cosmos DB Emulator for local development
- Test partition key strategies before production
- Document query patterns and RU costs
- Use Azure Cosmos DB VS Code extension for data inspection
- Monitor diagnostic logs for optimization opportunities

## Governance

This constitution is the authoritative source for all architectural and development decisions in the Huron Portal project. All code, infrastructure, and processes must comply with these principles.

**Compliance:**
- All pull requests must demonstrate adherence to core principles
- Deviations require documented justification and approval
- Regular architecture reviews to ensure alignment
- Constitution violations must be remediated or approved as exceptions

**Amendment Process:**
- Proposed changes require team discussion and consensus
- Major principle changes require version increment (MAJOR)
- New principles or sections increment MINOR version
- Clarifications and corrections increment BUILD version
- All amendments must be documented with rationale

**Enforcement:**
- Automated checks in CI/CD pipeline
- Code review checklist includes constitution compliance
- Quarterly architecture health checks
- Team members empowered to flag violations

**Version**: 1.0.0 | **Ratified**: 2025-11-04 | **Last Amended**: 2025-11-04