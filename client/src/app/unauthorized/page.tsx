import ClientLayout from "../components/layouts/client-layout";

export default function UnauthorizedPage() {
  return (
    <ClientLayout>
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold text-red-600">Unauthorized Access</h1>
        <p className="mt-2 text-gray-700">You don’t have permission to view this page.</p>
        <a href="/login" className="mt-4 text-blue-500 underline">
          Go to Login
        </a>
      </div>
    </ClientLayout>
  );
}
