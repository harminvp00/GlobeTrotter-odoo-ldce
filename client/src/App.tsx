import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';

function SetupDashboard() {
  const [serverHealth, setServerHealth] = useState<{ status: string; database: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setChecking(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }
      const data = await res.json();
      setServerHealth({ status: data.status, database: data.database });
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to backend server');
      setServerHealth(null);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-purple-200">
              GT
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">GlobeTrotter</h1>
              <p className="text-xs text-slate-500 m-0">Hackathon Foundation Setup</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-600">Client Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto py-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Initial Setup &amp; Architecture <span className="text-primary">Verified</span>
          </h2>
          <p className="text-lg text-slate-600">
            Decoupled React client &amp; Express server are initialized with strict TypeScript and Prisma 6 ORM PostgreSQL bindings. Ready for feature modules!
          </p>
        </section>

        {/* Status Check Panel */}
        <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Environment Verification</h3>
              <p className="text-sm text-slate-500">
                Check client-to-server integration and server-to-database connection status.
              </p>
            </div>
            <button
              onClick={checkHealth}
              disabled={checking}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl shadow-md shadow-purple-100 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2 cursor-pointer self-start md:self-auto"
            >
              {checking ? 'Testing Connection...' : 'Re-verify Integration'}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Client Status */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Frontend Client</span>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-800">React + TS</span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                  Online
                </span>
              </div>
            </div>

            {/* Server Status */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Backend Server</span>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-800">Express.js</span>
                {checking ? (
                  <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
                ) : serverHealth ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                    {serverHealth.status}
                  </span>
                ) : error ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
                    Offline
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Unknown</span>
                )}
              </div>
            </div>

            {/* Database Status */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Database Engine</span>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-800">PostgreSQL</span>
                {checking ? (
                  <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
                ) : serverHealth ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                    {serverHealth.database}
                  </span>
                ) : error ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
                    Disconnected
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Unknown</span>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 text-sm text-red-700 font-medium">
              ⚠️ {error}. Ensure backend is running by executing <code className="bg-red-100/50 px-1 py-0.5 rounded text-xs">npm run dev</code> inside <code className="bg-red-100/50 px-1 py-0.5 rounded text-xs">server/</code>.
            </div>
          )}
        </section>

        {/* Project Context Panels */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tech Stack */}
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 space-y-4">
            <h4 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2">Technology Stack</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                <span><strong>Frontend:</strong> React, TS, Context API</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                <span><strong>Styling:</strong> Tailwind CSS v4</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                <span><strong>Backend:</strong> Express, Node.js, TS</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                <span><strong>Database:</strong> PostgreSQL + Prisma 6 ORM</span>
              </li>
            </ul>
          </div>

          {/* Development Team */}
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 space-y-4">
            <h4 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2">Project Team</h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-800">Harmin Vekariya</p>
                <p className="text-xs text-slate-500">Frontend Developer (React, Tailwind)</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Ashish Vekariya</p>
                <p className="text-xs text-slate-500">Backend Developer (Express, Prisma)</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Ashish Gokani</p>
                <p className="text-xs text-slate-500">Testing &amp; Integration Developer</p>
              </div>
            </div>
          </div>

          {/* Git Workflow */}
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 space-y-4">
            <h4 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2">Git Flow Rules</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                <span>Work on feature branches (e.g. <code className="bg-purple-50 text-primary px-1 rounded text-xs font-semibold">server-auth</code>)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                <span>Frontend pulls backend feature branch to integrate</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></span>
                <span>Testing dev verifies integrations before merging to main</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-50 py-8 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} GlobeTrotter Travel Planner. All setup files verified.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SetupDashboard />
    </AuthProvider>
  );
}

export default App;
