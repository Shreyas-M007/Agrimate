/**
 * API Client Configuration
 * Automatically detects whether the app is running locally (Vite/Express proxy)
 * or deployed live on AWS S3, routing requests to the production API Gateway.
 */
export const API_BASE = 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? '/api'
    : 'https://2nvi2atdoc.execute-api.ap-south-1.amazonaws.com/prod';

export function apiUrl(endpoint: string): string {
  const clean = endpoint.replace(/^\/?(api\/)?/, '');
  return `${API_BASE}/${clean}`;
}
