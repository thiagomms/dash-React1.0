import { FaUserCircle, FaSearch, FaGem } from "react-icons/fa";

export default function CustomerInsights() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Header */}
      <header className="w-full bg-zinc-900 border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FaGem size={24} className="text-white" />
          <span className="text-xl font-bold">Sales Metrics Dashboard</span>
        </div>
        <nav className="hidden md:flex gap-8 ml-12">
          <a href="#" className="text-zinc-200 hover:text-white font-medium">Home</a>
          <a href="#" className="text-zinc-200 hover:text-white font-medium">Reports</a>
          <a href="#" className="text-zinc-200 hover:text-white font-medium">Customers</a>
          <a href="#" className="text-zinc-200 hover:text-white font-medium">Settings</a>
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search"
              className="bg-zinc-800 text-zinc-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-400 w-48"
            />
          </div>
          <FaUserCircle size={36} className="text-white" />
        </div>
      </header>
      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Customer Insights</h1>
        <p className="text-zinc-400 mb-8 text-center max-w-xl">Search for customers by name or ID to view their average order value and lifetime value.</p>
        <div className="w-full max-w-3xl mb-12">
          <div className="bg-zinc-800 rounded-xl flex items-center px-6 py-4 shadow-md">
            <FaSearch className="text-zinc-400 mr-3" />
            <input
              type="text"
              placeholder="Search by name or ID"
              className="bg-transparent text-zinc-200 flex-1 outline-none placeholder:text-zinc-400 text-lg"
            />
          </div>
        </div>
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-6">Customer Details</h2>
          <div className="flex flex-col gap-4 text-zinc-300 text-lg">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span>Average Order Value</span>
              <span className="text-white font-semibold">$150</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Lifetime Value</span>
              <span className="text-white font-semibold">$1,200</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 