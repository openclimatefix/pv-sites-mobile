export default function Offline() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <h1 className="mb-6 text-3xl font-bold">You are offline</h1>
      <p className="mb-8 text-center text-gray-600">
        Please check your internet connection and try again.
      </p>
      <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Try Again
      </button>
    </div>
  );
}
