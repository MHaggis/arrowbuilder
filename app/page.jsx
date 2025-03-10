"use client";

import ArrowTuningCalculator from '../components/ArrowTuningCalculator'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold my-4 text-center text-green-800">
          Arrow Builder
        </h1>
        <ArrowTuningCalculator />
        <footer className="text-center text-gray-500 text-sm mt-6 mb-8">
          <p>Built for archers. Happy hunting!</p>
        </footer>
      </div>
    </main>
  )
} 