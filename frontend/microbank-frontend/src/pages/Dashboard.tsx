import { Header } from "@/components/Header";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";

const Dashboard = () => {
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