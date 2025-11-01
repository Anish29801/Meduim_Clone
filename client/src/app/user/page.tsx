"use client";

import ClientLayout from "../components/layouts/client-layout";

export default function UserPage() {
  return (
    <ClientLayout>
      <div>
        <h2 className="text-xl font-semibold mb-4">User Dashboard</h2>
        <p>Welcome back! Here are your articles and stats.</p>
      </div>
    </ClientLayout>
  );
}
