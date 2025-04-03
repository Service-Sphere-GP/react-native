import { Redirect } from 'expo-router';

export default function AdminIndex() {
  // Redirect to the admin login page
  return <Redirect href="/admin/login" />;
} 