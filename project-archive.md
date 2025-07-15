# Political Violence Tracker Dashboard - Complete Project Archive

## Project Overview
This is a comprehensive Political Violence Tracker Dashboard built with React, TypeScript, Express, and PostgreSQL. The application tracks political violence incidents in Bangladesh with advanced filtering, data visualization, and export capabilities.

## System Requirements
- Node.js 18 or higher
- PostgreSQL (or use in-memory storage for development)
- Modern web browser

## Quick Start Guide

### 1. Installation
```bash
# Clone or download the project
npm install

# Start the development server
npm run dev
```

### 2. Database Setup (Optional)
The application uses in-memory storage by default. To use PostgreSQL:
- Set up a PostgreSQL database
- Add DATABASE_URL environment variable
- Run migrations with Drizzle Kit

### 3. Access the Application
- Open http://localhost:5000 in your browser
- Use the filtering system to explore incidents
- Export data as CSV or JSON

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Charts**: Recharts for data visualization

### Backend (Express + TypeScript)
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful endpoints with JSON responses
- **Storage**: Abstracted storage interface (memory/database)

### Key Features
1. **Interactive Dashboard**: Real-time metrics and visualizations
2. **Advanced Filtering**: By location, date, party, severity, casualties
3. **Multi-language Support**: Bengali and English
4. **Data Export**: CSV and JSON export functionality
5. **Responsive Design**: Mobile-first approach
6. **AI Analysis**: Confidence scoring and entity extraction
7. **Geographic Visualization**: Interactive maps with incident locations

## File Structure
```
project-root/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions and constants
├── server/                 # Backend Express application
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite development integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── package.json           # Dependencies and scripts
```

## API Endpoints

### GET /api/incidents
Retrieve incidents with filtering options
```typescript
Query Parameters:
- search: string (optional)
- division: string (optional)
- district: string (optional)
- party: string (optional)
- severity: string[] (optional)
- dateFrom: string (optional)
- dateTo: string (optional)
- fatalOnly: boolean (optional)
- injuredOnly: boolean (optional)
- sortBy: 'date' | 'severity' | 'casualties' (optional)
- page: number (optional)
- limit: number (optional)
```

### GET /api/statistics
Get dashboard statistics
```typescript
Response:
{
  totalIncidents: number;
  totalKilled: number;
  totalInjured: number;
  highSeverityCount: number;
  mediumSeverityCount: number;
  lowSeverityCount: number;
  avgConfidence: number;
}
```

### GET /api/charts
Get chart data for visualizations
```typescript
Response:
{
  partyData: Array<{name: string; incidents: number; killed: number; injured: number}>;
  timelineData: Array<{date: string; incidents: number; killed: number; injured: number}>;
  severityData: Array<{name: string; value: number; color: string}>;
  divisionData: Array<{name: string; incidents: number}>;
}
```

### GET /api/export
Export incidents as CSV
```typescript
Query Parameters: Same as /api/incidents
Response: CSV file download
```

## Data Models

### Incident
```typescript
interface Incident {
  id: number;
  description: string;
  location: string;
  date: string;
  division: string;
  district: string;
  upazila: string;
  policeStation: string;
  coordinates: {lat: number; lng: number};
  party: string;
  injured: number;
  killed: number;
  severity: 'low' | 'medium' | 'high';
  sourceUrl: string;
  crawledAt: string;
  lastUpdated: string;
  aiAnalysis: {
    confidence: number;
    entities: string[];
    sentiment: string;
  };
  images: string[];
  witnesses: string[];
  tags: string[];
}
```

### NewsSource
```typescript
interface NewsSource {
  id: number;
  name: string;
  url: string;
  type: string;
  status: string;
  lastCrawled: string;
  dailyArticles: number;
  reliability: number;
}
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Database migrations
npm run db:generate
npm run db:migrate
npm run db:studio

# Type checking
npm run type-check

# Linting
npm run lint
```

## Environment Variables

```env
# Database connection (optional - uses in-memory storage by default)
DATABASE_URL=postgresql://username:password@localhost:5432/database

# Development settings
NODE_ENV=development
PORT=5000
```

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## Key Components

### Dashboard Components
- **DashboardMetrics**: Key statistics display
- **DashboardCharts**: Data visualization components
- **DashboardTimeline**: Chronological incident view
- **DashboardMap**: Geographic incident mapping

### Filter Components
- **FiltersSidebar**: Advanced filtering interface
- **IncidentCard**: Individual incident display
- **IncidentModal**: Detailed incident view

### UI Components
- **Button, Input, Select**: Form controls
- **Card, Badge, Progress**: Layout components
- **Toast, Dialog, Tooltip**: Interactive elements

## Styling System

### Tailwind CSS Classes
```css
/* Custom component classes */
.dashboard-card: Glass morphism effect with backdrop blur
.metric-card: Gradient background with hover effects
.filter-card: Semi-transparent card with blur
.incident-card: Clean card with hover animations
.gradient-text: Orange to red gradient text
.severity-high: Red gradient for high severity
.severity-medium: Yellow to orange gradient
.severity-low: Green gradient for low severity
```

### Color Scheme
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Error: Red (#EF4444)
- Background: Light gray gradient

## Data Sources

### Bangladesh Administrative Divisions
- 8 divisions with respective districts
- Support for filtering by division and district
- Upazila and police station data

### Political Parties
- Major political parties in Bangladesh
- Party-specific incident tracking
- Color-coded visualization

### Severity Levels
- High: Fatal incidents or major violence
- Medium: Injuries or property damage
- Low: Minor incidents or threats

## Performance Optimizations

1. **React Query**: Efficient data fetching and caching
2. **Lazy Loading**: Dynamic imports for large components
3. **Memoization**: React.memo and useMemo for expensive operations
4. **Pagination**: Server-side pagination for large datasets
5. **Image Optimization**: Responsive images with lazy loading
6. **Bundle Splitting**: Code splitting for better load times

## Security Considerations

1. **Input Validation**: Zod schema validation on all inputs
2. **SQL Injection Prevention**: Parameterized queries with Drizzle
3. **XSS Protection**: Sanitized outputs and CSP headers
4. **CORS Configuration**: Proper cross-origin request handling
5. **Rate Limiting**: API rate limiting for abuse prevention

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request

## License

MIT License - Open source project for educational and research purposes

## Support

For issues or questions:
1. Check the troubleshooting guide
2. Review the API documentation
3. Create an issue with detailed description

## Troubleshooting

### Common Issues

1. **Build Errors**: Check Node.js version and dependencies
2. **Database Connection**: Verify DATABASE_URL environment variable
3. **Port Conflicts**: Change PORT in environment variables
4. **Memory Issues**: Increase Node.js memory limit

### Debug Mode
```bash
NODE_ENV=development npm run dev
```

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Analytics**: Machine learning for pattern detection
3. **Mobile App**: React Native mobile application
4. **API Rate Limiting**: Enhanced security measures
5. **Internationalization**: Additional language support
6. **Audit Trail**: Complete change tracking system

---

This project represents a comprehensive solution for tracking and analyzing political violence incidents with modern web technologies and best practices.