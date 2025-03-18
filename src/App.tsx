import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import tempoRoutes from "tempo-routes";
import appRoutes from "./routes";
import { AuthProvider } from "./lib/auth";

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-10 w-10 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-4 text-gray-600">Loading application...</p>
            </div>
          </div>
        }
      >
        {/* For Tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(tempoRoutes)}

        {/* Main app routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {useRoutes(appRoutes)}
      </Suspense>
    </AuthProvider>
  );
}

export default App;
