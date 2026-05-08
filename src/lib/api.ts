let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://procurement-backend-production-d647.up.railway.app/api';
if (apiUrl.includes('YOUR-RAILWAY-URL')) {
  apiUrl = 'https://procurement-backend-production-d647.up.railway.app/api';
}
export const API = apiUrl;
