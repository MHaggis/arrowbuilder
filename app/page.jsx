"use client";

import ArrowTuningCalculator from '../components/ArrowTuningCalculator'

export default function Home() {
  return (
    <main className="min-h-screen p-2 sm:p-4 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold my-4 md:mb-6 text-center">Arrow Builder</h1>
        <ArrowTuningCalculator />
      </div>
    </main>
  )
} 