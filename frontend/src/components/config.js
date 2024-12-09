// Exporting the API base URL from environment variables
export const API_URL = process.env.REACT_APP_BACKEND_BASE_URL; // This URL is used to make API calls to the backend

// Important Notes:
// - Ensure that REACT_APP_BACKEND_BASE_URL is defined in your .env file
// - This allows your application to work with different backend URLs for different environments (development, production, etc.)
// - The variable will be replaced during the build process with the appropriate environment variable value
