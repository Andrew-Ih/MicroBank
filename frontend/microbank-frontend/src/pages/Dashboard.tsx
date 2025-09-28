import { Header } from "@/components/Header";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";
import { useAuth0 } from '@auth0/auth0-react';

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <DashboardComponent />
      </main>
    </div>
  );
};

export default Dashboard;