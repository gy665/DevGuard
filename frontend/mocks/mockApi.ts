// frontend/src/mocks/mockApi.ts

// CORRECT PATH: Go up one level from 'mocks' to 'frontend', then down into 'src/types'
import { DashboardData } from '../src/types'; 

// All interface definitions should be in types/index.ts

// 1. A successful data response
export const mockSuccessData: DashboardData = {
    projects: [
        { 
            id: 1, 
            name: 'frontend-app', 
            source: 'GitHub', 
            lastScanned: '2025-10-20', 
            vulnerabilities: { critical: 5, high: 10, medium: 15, low: 20 } 
        },
        { 
            id: 2, 
            name: 'backend-api', 
            source: 'GitHub', 
            lastScanned: '2025-10-19', 
            vulnerabilities: { critical: 7, high: 18, medium: 30, low: 43 } 
        },
    ],
    recentActivity: [],
    severityOverview: {
        critical: 12,
        high: 28,
        medium: 45,
        low: 63,
    },
    topProjects: [
        { name: 'frontend-app', vulnerabilities: 45 },
        { name: 'backend-api', vulnerabilities: 38 },
        { name: 'mobile-client', vulnerabilities: 32 },
        { name: 'admin-dashboard', vulnerabilities: 28 },
        { name: 'microservice-auth', vulnerabilities: 25 },
    ],
};

// 2. An empty response for testing "no data" states
export const mockEmptyData: DashboardData = {
    projects: [],
    recentActivity: [],
    severityOverview: { critical: 0, high: 0, medium: 0, low: 0 },
    topProjects: [],
};