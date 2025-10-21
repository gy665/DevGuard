// This file will be the single source of truth for our data shapes.

// 1. Define the possible severity levels
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

// 2. Define the shape of a single Vulnerability
export interface Vulnerability {
  id: string | number;
  severity: Severity;
  name: string; // Package name
  version: string; // Vulnerable version
  description: string;
  detailsUrl: string;
}

// 3. Define the shape of a single Project/ScannedAsset
export interface Project {
  id: string | number;
  name: string;
  source: string;
  lastScanned: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}




// --- ADD THESE TYPES HERE ---
// These were previously in mockApi.ts

// 4. Define the shape of the data for the Top Projects chart
export interface TopProject {
  name: string;
  vulnerabilities: number;
}

// 5. Define the shape for the main severity overview
export interface SeverityOverview {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

// 6. Define the complete shape for the entire dashboard API response
export interface DashboardData {
  projects: Project[];
  recentActivity: any[]; // You can define a proper type for this later
  severityOverview: SeverityOverview;
  topProjects: TopProject[];
}