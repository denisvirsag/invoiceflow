import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="dashboard-layout">
      <Sidebar currentUser={session?.user} />
      <div className="dashboard-main">

        <main className="dashboard-content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

