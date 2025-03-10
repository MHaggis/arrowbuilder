"use client";

import ArrowTuningCalculator from '../components/ArrowTuningCalculator'

export default function Home() {
  return (
    <main className="min-h-screen p-2 sm:p-4 md:p-8 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800 drop-shadow-sm">
          Arrow Builder
        </h1>
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg transform -skew-y-1 rounded-3xl opacity-20"></div>
          <ArrowTuningCalculator />
        </div>
        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>Built with precision for archers. Happy hunting!</p>
        </footer>
      </div>
    </main>
  )
} 