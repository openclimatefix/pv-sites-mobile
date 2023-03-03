export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-3xl font-bold mb-6">You are offline</h1>
      <p className="text-gray-600 text-center mb-8">
        Please check your internet connection and try again.
      </p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Try Again
      </button>
    </div>
  );
}
