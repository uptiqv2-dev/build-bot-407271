# Frontend Implementation Plan - Advisor Intelligence Assistant

## Tech Stack Overview

- **React 19** with TypeScript
- **Vite** for build tooling
- **Shadcn/ui** component library
- **Tailwind CSS v4** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **React Hook Form** with Zod validation

## Application Architecture

### Core Features

1. **Meeting Preparation Dashboard** - Primary workflow for advisors
2. **Client Search & Context** - Quick client lookup and history
3. **Document Intelligence** - Upload and process client documents
4. **Opportunity Detection** - AI-driven insights and recommendations
5. **Integration Hub** - System connectivity status and management

## Page-by-Page Implementation Plan

### 1. Authentication & Layout Pages

#### `/login` - Authentication Page

- **Components**: LoginForm, AuthLayout
- **Features**: OAuth 2.0 integration, role-based redirects
- **API**: `/auth/login`, `/auth/refresh`
- **Utils**: authService, tokenManager
- **Types**: User, AuthResponse, Role

#### **Layout Components** (Shared)

- **AppLayout**: Main application wrapper with sidebar
- **Sidebar**: Navigation with role-based menu items
- **Header**: User profile, notifications, system status
- **Breadcrumbs**: Dynamic navigation context
- **Components**: AppSidebar, AppHeader, PageBreadcrumbs

### 2. Dashboard & Meeting Prep (Primary Workflow)

#### `/` - Main Dashboard

- **Components**: DashboardOverview, UpcomingMeetings, ClientSummary
- **Features**: Meeting queue, recent activity, system health
- **API**: `/dashboard/overview`, `/meetings/upcoming`
- **Types**: DashboardData, Meeting, ClientSummary

#### `/meeting-prep/:clientId` - Meeting Preparation (Core Feature)

- **Components**:
    - MeetingBriefContainer
    - ClientContextCard
    - PortfolioSnapshot
    - OpportunityList
    - ActionItemsPanel
    - RecentInteractions
- **Features**:
    - AI-generated meeting brief (<5 sec load time)
    - Portfolio changes since last meeting
    - Detected opportunities with priority scoring
    - Action items status tracking
- **API**: `/clients/{id}/meeting-brief`, `/portfolio/{id}/snapshot`
- **Types**: MeetingBrief, Portfolio, Opportunity, ActionItem
- **Utils**: meetingPrepService, opportunityScoring

### 3. Client Management Pages

#### `/clients` - Client Directory

- **Components**: ClientTable, ClientFilters, SearchBar
- **Features**: Paginated client list, advanced filtering, search
- **API**: `/clients`, `/clients/search`
- **Types**: Client, ClientFilter, SearchParams

#### `/clients/:id` - Client Detail Page

- **Components**:
    - ClientHeader (name, status, AUM)
    - ClientTabs (Overview, Interactions, Documents, Portfolio)
    - InteractionTimeline
    - DocumentGrid
    - PortfolioCharts
- **Features**: Complete client 360 view, deep-link integrations
- **API**: `/clients/{id}`, `/clients/{id}/interactions`, `/clients/{id}/documents`
- **Types**: ClientDetail, Interaction, Document

#### `/clients/:id/search` - Client History Search

- **Components**: HistorySearch, SearchResults, SearchFilters
- **Features**: Natural language search across client interactions
- **API**: `/clients/{id}/search`
- **Types**: SearchResult, SearchQuery
- **Utils**: searchService, resultRanking

### 4. Document Intelligence Pages

#### `/documents` - Document Management

- **Components**:
    - DocumentUpload (drag-and-drop)
    - DocumentTable
    - ProcessingQueue
    - ClassificationReview
- **Features**:
    - Multi-file upload with progress
    - Real-time processing status
    - Manual classification override
- **API**: `/documents/upload`, `/documents/process`
- **Types**: DocumentUpload, ProcessingStatus, Classification
- **Utils**: fileUploadService, documentProcessor

#### `/documents/:id` - Document Detail

- **Components**: DocumentViewer, ExtractedDataPanel, ValidationErrors
- **Features**: PDF viewer, extracted data review, error correction
- **API**: `/documents/{id}`, `/documents/{id}/extracted-data`
- **Types**: DocumentDetail, ExtractedData, ValidationError

### 5. Integration & System Management

#### `/integrations` - System Connections

- **Components**:
    - IntegrationStatus (CRM, Portfolio, Custodian, Email)
    - ConnectionHealth
    - SyncStatus
    - DataFreshness
- **Features**: Real-time system health monitoring, sync controls
- **API**: `/integrations/status`, `/integrations/sync`
- **Types**: IntegrationHealth, SyncStatus, DataFreshness
- **Utils**: integrationMonitor, healthChecker

#### `/settings` - User & System Settings

- **Components**: UserProfile, SystemPreferences, ApiKeys, AuditLog
- **Features**: User management, system configuration, audit trails
- **API**: `/users/profile`, `/audit-logs`
- **Types**: UserSettings, AuditLog, SystemConfig

## Common Components Library

### UI Components (Shadcn-based)

- **DataTable**: Sortable, filterable tables with pagination
- **LoadingStates**: Skeleton loaders, spinners, progress bars
- **ErrorBoundary**: Global error handling with retry logic
- **Toast**: Notification system with different severity levels
- **Modal**: Confirmation dialogs, form modals
- **Charts**: Portfolio allocation, performance charts using Recharts

### Business Components

- **ClientCard**: Reusable client display card
- **OpportunityBadge**: Priority-based opportunity indicators
- **DataFreshness**: Shows last update timestamps with warnings
- **DeepLink**: External system integration links
- **ActionItemStatus**: Visual status indicators for tasks

## State Management & Data Flow

### React Query Setup

- **Queries**: Client data, meeting briefs, documents
- **Mutations**: Document uploads, action item updates
- **Cache Strategy**: 5-minute cache for meeting data, 24hr for client data
- **Optimistic Updates**: Action item completions, document status

### Global State (Context API)

- **AuthContext**: User authentication, permissions
- **NotificationContext**: Toast messages, alerts
- **SystemHealthContext**: Integration status monitoring

## API Integration Layer

### Services Structure

```
/services/
  ├── api.ts           # Axios configuration, interceptors
  ├── auth.ts          # Authentication service
  ├── clients.ts       # Client CRUD operations
  ├── meetings.ts      # Meeting prep service
  ├── documents.ts     # Document processing
  ├── integrations.ts  # System health monitoring
  └── search.ts        # Search functionality
```

### Error Handling

- **Global Error Boundary**: Catches unhandled React errors
- **API Error Interceptor**: Handles 401, 403, 500 errors
- **Retry Logic**: Automatic retry for transient failures
- **Offline Support**: Basic offline indication and queuing

## Security Implementation

### Authentication

- **JWT Tokens**: Access + refresh token pattern
- **Role-Based Access**: Advisor, Operations, Compliance, Admin roles
- **Session Management**: Auto-logout on token expiry

### Data Protection

- **Input Validation**: Zod schemas for all forms
- **XSS Prevention**: Sanitize user inputs
- **CSRF Protection**: Include CSRF tokens in state-changing requests

## Performance Optimization

### Core Web Vitals

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format, lazy loading
- **Bundle Optimization**: Tree shaking, minification

### Meeting Prep Performance (<5 sec requirement)

- **Parallel API Calls**: Fetch client data, portfolio, opportunities simultaneously
- **Streaming Responses**: Show data as it loads
- **Preloading**: Prefetch upcoming meetings data

## Development Phases

### Phase 1: Foundation (Week 1-2)

1. Authentication system and routing
2. Basic layout and navigation
3. Core API service layer
4. Main dashboard skeleton

### Phase 2: Meeting Prep Workflow (Week 3-4)

1. Meeting preparation page (primary feature)
2. Client context and portfolio integration
3. AI-generated brief display
4. Opportunity detection UI

### Phase 3: Document Intelligence (Week 5-6)

1. Document upload and processing
2. Classification review interface
3. Extracted data visualization
4. Error handling and validation

### Phase 4: Search & History (Week 7-8)

1. Client directory and search
2. Natural language history search
3. Results ranking and display
4. Deep-link integrations

### Phase 5: System Integration (Week 9-10)

1. Integration health monitoring
2. Sync status and controls
3. Settings and configuration
4. Audit logging interface

### Phase 6: Polish & Testing (Week 11-12)

1. Error boundary implementation
2. Performance optimization
3. Accessibility compliance
4. End-to-end testing

## Key Technical Considerations

### Real-time Updates

- **WebSocket Connection**: For processing status updates
- **Server-Sent Events**: For system health monitoring
- **Polling Fallback**: For clients without WebSocket support

### Responsive Design

- **Mobile-First**: Responsive design for tablet usage
- **Touch-Friendly**: Appropriately sized touch targets
- **Keyboard Navigation**: Full keyboard accessibility

### Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Progressive Enhancement**: Core features work without JS
- **Polyfills**: Required only for critical features

## Testing Strategy

### Unit Testing

- **Components**: Test component rendering and interactions
- **Services**: Test API calls and error handling
- **Utils**: Test utility functions and calculations

### Integration Testing

- **API Integration**: Mock API responses for consistent testing
- **User Flows**: Test complete user workflows
- **Error Scenarios**: Test error handling and recovery

### E2E Testing

- **Critical Paths**: Meeting prep workflow, document upload
- **Cross-Browser**: Test on major browsers
- **Performance**: Monitor load times and responsiveness

This plan provides a structured approach to building the Advisor Intelligence Assistant frontend, focusing on the core meeting preparation workflow while ensuring scalability and maintainability.
