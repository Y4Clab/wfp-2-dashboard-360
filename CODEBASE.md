# WFP Admin Portal Codebase Documentation

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Technical Implementation](#technical-implementation)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Routing](#routing)
- [Authentication](#authentication)
- [Development Guidelines](#development-guidelines)

## Overview

The WFP Admin Portal is a comprehensive dashboard application built with React and TypeScript, designed to manage food distribution operations. The application follows a feature-based architecture with modern React practices and a robust component system.

## Project Structure

```
src/
├── components/                # Shared components
│   ├── dashboard/            # Dashboard-specific components
│   │   ├── Navbar.tsx       # Top navigation bar
│   │   └── Sidebar.tsx      # Dashboard sidebar navigation
│   ├── mission-form/        # Mission form components
│   ├── missions/           # Mission-related components
│   └── ui/                 # Reusable UI components
│
├── features/               # Feature-based modules
│   ├── auth/              # Authentication feature
│   ├── invertory/         # Inventory management
│   ├── missions/          # Mission management
│   ├── trucks/           # Truck management
│   └── vendors/          # Vendor management
│
├── layouts/              # Layout components
├── lib/                 # Utility libraries
├── pages/              # Main application pages
├── services/          # API services
├── hooks/            # Custom React hooks
└── types/           # TypeScript type definitions
```

### Key Directories Explained

#### `components/`
Contains reusable UI components organized by domain:
- `ui/`: Base UI components (buttons, inputs, cards)
- `dashboard/`: Dashboard-specific components
- `mission-form/`: Form components for mission management
- `missions/`: Mission-specific components

#### `features/`
Feature-based modules, each containing:
- `pages/`: Route components
- `components/`: Feature-specific components
- `api/`: API integration
- `types/`: Feature-specific types
- `utils/`: Feature-specific utilities

## Core Features

### 1. Authentication System
- Login and registration functionality
- Protected routes
- Token-based authentication
- User session management

### 2. Dashboard Layout
```typescript
// DashboardLayout.tsx
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // ... layout implementation
};
```
Features:
- Responsive sidebar navigation
- Collapsible menu
- Breadcrumb navigation
- User profile section

### 3. Vendor Management
- CRUD operations for vendors
- Vendor categorization
- Vendor performance metrics
- Document management

### 4. Mission Management
- Mission creation and tracking
- Real-time status updates
- Route optimization
- Resource allocation

### 5. Fleet Management
- Vehicle tracking
- Maintenance scheduling
- Driver assignment
- Route planning

## Technical Implementation

### Component Architecture

#### Sidebar Navigation
```typescript
// Sidebar.tsx
interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isOpen: boolean;
  isActive: boolean;
  subItems?: { label: string; to: string }[];
}

const NavItem = ({ icon: Icon, label, to, isOpen, isActive, subItems }: NavItemProps) => {
  // ... navigation item implementation
};
```

#### Form Components
- Standardized form handling
- Validation integration
- Error handling
- Loading states

### State Management

1. **React Query Implementation**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

2. **Context Usage**
- Authentication context
- Theme context
- Navigation context

### Routing System

```typescript
// App.tsx routing configuration
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Protected Dashboard Routes */}
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="vendors/*" element={<VendorRoutes />} />
    <Route path="missions/*" element={<MissionRoutes />} />
    // ... other routes
  </Route>
</Routes>
```

## Development Guidelines

### 1. Component Creation
- Use functional components with TypeScript
- Implement proper prop typing
- Include component documentation
- Follow naming conventions

### 2. State Management
- Use React Query for server state
- Implement context for global state
- Use local state for component-specific data
- Consider performance implications

### 3. Styling Approach
- Use Tailwind CSS for styling
- Follow design system guidelines
- Maintain responsive design
- Implement proper dark mode support

### 4. Code Organization
- Follow feature-based architecture
- Maintain clear file structure
- Use proper naming conventions
- Implement proper type definitions

### 5. Performance Considerations
- Implement code splitting
- Use proper memoization
- Optimize bundle size
- Monitor render performance

## API Integration

### Base Configuration
```typescript
// api/axios.ts
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### API Hooks
```typescript
// hooks/useApi.ts
export const useApi = <T = any>(options: UseApiOptions = {}) => {
  // ... API hook implementation
};
```

## Testing Strategy

### Unit Testing
- Component testing
- Hook testing
- Utility function testing
- Mock service workers

### Integration Testing
- Feature testing
- Route testing
- API integration testing

## Deployment

### Build Process
```bash
# Production build
npm run build

# Development server
npm run dev
```

### Environment Configuration
- Development environment
- Staging environment
- Production environment

## Future Improvements

1. **Enhanced Type Safety**
   - Stricter TypeScript configurations
   - Complete type coverage
   - API type generation

2. **Performance Optimization**
   - Implement React.memo where needed
   - Optimize bundle size
   - Add performance monitoring

3. **Testing Coverage**
   - Add comprehensive test suite
   - Implement E2E testing
   - Add visual regression testing

4. **Documentation**
   - Add JSDoc comments
   - Create component storybook
   - Maintain changelog

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 