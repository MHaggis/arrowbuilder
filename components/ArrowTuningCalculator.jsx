"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, ArrowRight, Crosshair, AlertCircle, Target, Award, Clock } from 'lucide-react';

const ArrowTuningCalculator = () => {
  // State for arrow components and measurements
  const [shaft, setShaft] = useState({
    length: 28.5, // inches
    weight: 8.5, // grains per inch
    diameter: 0.246, // inches (standard carbon arrow)
    material: 'Carbon'
  });
  
  const [tip, setTip] = useState({
    type: 'Field Point',
    weight: 100, // grains
  });
  
  const [vanes, setVanes] = useState({
    type: 'Plastic',
    length: 2.1, // inches
    height: 0.5, // inches
    weight: 8, // grains per vane
    count: 3
  });
  
  const [nock, setNock] = useState({
    weight: 10, // grains
  });
  
  const [insert, setInsert] = useState({
    weight: 20, // grains
  });
  
  // Calculated results
  const [results, setResults] = useState({
    totalWeight: 0,
    foc: 0,
    balancePoint: 0,
    kineticEnergy: 0,
    momentum: 0
  });
  
  const [drawWeight, setDrawWeight] = useState(70); // pounds
  const [drawLength, setDrawLength] = useState(29); // inches
  const [arrowSpeed, setArrowSpeed] = useState(280); // fps - estimated or chronographed
  
  // Calculate all metrics when any input changes
  useEffect(() => {
    calculateResults();
  }, [shaft, tip, vanes, nock, insert, drawWeight, drawLength, arrowSpeed]);
  
  const calculateResults = () => {
    // Calculate total arrow weight
    const shaftWeight = shaft.length * shaft.weight;
    const vanesWeight = vanes.weight * vanes.count;
    const totalWeight = shaftWeight + tip.weight + vanesWeight + nock.weight + insert.weight;
    
    // Calculate balance point
    // This is a simplified calculation - in reality this would require more physics
    const frontWeight = tip.weight + insert.weight;
    const rearWeight = nock.weight + vanesWeight;
    const shaftMidpoint = shaft.length / 2;
    
    // Simplified balance point calculation
    const momentFront = frontWeight * 0; // At the front
    const momentShaft = shaftWeight * shaftMidpoint;
    const momentRear = rearWeight * shaft.length;
    const totalMoment = momentFront + momentShaft + momentRear;
    
    const balancePoint = totalMoment / totalWeight;
    
    // Calculate FOC (Front of Center)
    // FOC = ((shaft midpoint - balance point) / shaft length) * 100
    const foc = ((shaftMidpoint - balancePoint) / shaft.length) * 100;
    
    // Calculate kinetic energy (KE = 0.5 * mass * velocity^2)
    // Convert grains to kg: 1 grain = 0.0000648 kg
    // Convert fps to m/s: 1 fps = 0.3048 m/s
    const massKg = totalWeight * 0.0000648;
    const velocityMs = arrowSpeed * 0.3048;
    const kineticEnergy = 0.5 * massKg * velocityMs * velocityMs;
    
    // Convert back to ft-lbs (1 joule = 0.737562 ft-lbs)
    const kineticEnergyFtLbs = kineticEnergy * 0.737562;
    
    // Calculate momentum (p = m * v)
    const momentumKgMs = massKg * velocityMs;
    // Convert to slug-fps for display
    const momentum = momentumKgMs * 0.3048 / 0.0000648;
    
    setResults({
      totalWeight: totalWeight.toFixed(1),
      foc: foc.toFixed(2),
      balancePoint: balancePoint.toFixed(2),
      kineticEnergy: kineticEnergyFtLbs.toFixed(1),
      momentum: momentum.toFixed(2)
    });
  };

  // Arrow component selection options
  const shaftMaterials = ['Carbon', 'Aluminum', 'Carbon/Aluminum Hybrid'];
  const tipTypes = ['Field Point', 'Bullet Point', 'Broadhead - Fixed', 'Broadhead - Mechanical', 'Broadhead - Hybrid'];
  const vaneTypes = ['Plastic', 'Feather', 'Hybrid'];
  
  return (
    <div className="w-full max-w-4xl mx-auto z-10">
      <Card className="arrow-card">
        <CardHeader className="arrow-header">
          <CardTitle className="text-xl md:text-2xl flex items-center justify-center">
            <Target className="mr-2 h-6 w-6" />
            Arrow Tuning Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="build" className="w-full">
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 mb-6 p-1 tab-gradient rounded-lg">
              <TabsTrigger value="build" className="text-white data-[state=active]:bg-white data-[state=active]:text-green-800">
                <span className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Build Arrow</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-white data-[state=active]:bg-white data-[state=active]:text-green-800">
                <span className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Bow Settings</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="results" className="text-white data-[state=active]:bg-white data-[state=active]:text-green-800">
                <span className="flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  <span>Results</span>
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="build">
              <Card className="border-0 shadow-none">
                <CardContent className="pt-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-6 text-green-800 border-b pb-2">Arrow Components</h2>

                  <div className="space-y-8">
                    <div className="shaft-bg p-4 rounded-xl shadow-sm">
                      <h3 className="font-semibold mb-4 text-gray-800 flex items-center">
                        <ArrowRight className="mr-2 h-5 w-5 text-green-600" />
                        Shaft
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Length (inches)</label>
                          <input 
                            type="number" 
                            value={shaft.length} 
                            onChange={(e) => setShaft({...shaft, length: parseFloat(e.target.value)})}
                            className="arrow-input w-full p-2 border"
                            step="0.25"
                            min="20"
                            max="36"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Weight (grains/inch)</label>
                          <input 
                            type="number" 
                            value={shaft.weight} 
                            onChange={(e) => setShaft({...shaft, weight: parseFloat(e.target.value)})}
                            className="arrow-input w-full p-2 border"
                            step="0.1"
                            min="5"
                            max="15"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Material</label>
                          <select 
                            className="arrow-input w-full p-2 border"
                            value={shaft.material}
                            onChange={(e) => setShaft({...shaft, material: e.target.value})}
                          >
                            {shaftMaterials.map(mat => (
                              <option key={mat} value={mat}>{mat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Diameter (mm)</label>
                          <input 
                            type="number" 
                            value={shaft.diameter * 25.4} // Convert inches to mm for display
                            onChange={(e) => setShaft({...shaft, diameter: (parseFloat(e.target.value) || 0) / 25.4})} // Store as inches internally for calculations
                            className="arrow-input w-full p-2 border"
                            step="0.1"
                            min="4"
                            max="12"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="tip-bg p-4 rounded-xl shadow-sm">
                      <h3 className="font-semibold mb-4 text-gray-800 flex items-center">
                        <ArrowLeft className="mr-2 h-5 w-5 text-blue-600" />
                        Tip/Broadhead
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Type</label>
                          <select 
                            className="arrow-input w-full p-2 border"
                            value={tip.type}
                            onChange={(e) => setTip({...tip, type: e.target.value})}
                          >
                            {tipTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Weight (grains)</label>
                          <input 
                            type="number" 
                            value={tip.weight} 
                            onChange={(e) => setTip({...tip, weight: parseFloat(e.target.value)})}
                            className="arrow-input w-full p-2 border"
                            step="5"
                            min="75"
                            max="200"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="nock-bg p-4 rounded-xl shadow-sm">
                      <h3 className="font-semibold mb-4 text-gray-800 flex items-center">
                        <div className="mr-2 h-4 w-4 bg-orange-400 rounded-full"></div>
                        Insert
                      </h3>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Weight (grains)</label>
                        <input 
                          type="number" 
                          value={insert.weight} 
                          onChange={(e) => setInsert({...insert, weight: parseFloat(e.target.value)})}
                          className="arrow-input w-full p-2 border"
                          step="1"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <div className="vanes-bg p-4 rounded-xl shadow-sm">
                      <h3 className="font-semibold mb-4 text-gray-800 flex items-center">
                        <div className="mr-2 h-4 w-4 border-r-2 border-t-2 border-b-2 border-purple-400 rounded-r-full"></div>
                        Vanes/Fletching
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Type</label>
                          <select 
                            className="arrow-input w-full p-2 border"
                            value={vanes.type}
                            onChange={(e) => setVanes({...vanes, type: e.target.value})}
                          >
                            {vaneTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Count</label>
                          <select 
                            className="arrow-input w-full p-2 border"
                            value={vanes.count}
                            onChange={(e) => setVanes({...vanes, count: parseInt(e.target.value) || 3})}
                          >
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Length (inches)</label>
                          <input 
                            type="number" 
                            value={vanes.length} 
                            onChange={(e) => setVanes({...vanes, length: parseFloat(e.target.value)})}
                            className="arrow-input w-full p-2 border"
                            step="0.1"
                            min="1"
                            max="5"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Height (inches)</label>
                          <input 
                            type="number" 
                            value={vanes.height} 
                            onChange={(e) => setVanes({...vanes, height: parseFloat(e.target.value)})}
                            className="arrow-input w-full p-2 border"
                            step="0.1"
                            min="0.1"
                            max="2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Weight (grains per vane)</label>
                          <input 
                            type="number" 
                            value={vanes.weight} 
                            onChange={(e) => setVanes({...vanes, weight: parseFloat(e.target.value)})}
                            className="arrow-input w-full p-2 border"
                            step="0.5"
                            min="1"
                            max="20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="nock-bg p-4 rounded-xl shadow-sm">
                      <h3 className="font-semibold mb-4 text-gray-800 flex items-center">
                        <div className="mr-2 h-5 w-2 bg-orange-500 rounded-full"></div>
                        Nock
                      </h3>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Weight (grains)</label>
                        <input 
                          type="number" 
                          value={nock.weight} 
                          onChange={(e) => setNock({...nock, weight: parseFloat(e.target.value)})}
                          className="arrow-input w-full p-2 border"
                          step="1"
                          min="5"
                          max="20"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card className="border-0 shadow-none">
                <CardContent className="pt-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-6 text-green-800 border-b pb-2">Bow Settings</h2>

                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 rounded-xl shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Draw Weight (lbs)</label>
                          <input 
                            type="number" 
                            value={drawWeight} 
                            onChange={(e) => setDrawWeight(parseFloat(e.target.value))}
                            className="arrow-input w-full p-2 border"
                            step="5"
                            min="30"
                            max="80"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Typical hunting bows: 45-70 lbs
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">Draw Length (inches)</label>
                          <input 
                            type="number" 
                            value={drawLength} 
                            onChange={(e) => setDrawLength(parseFloat(e.target.value))}
                            className="arrow-input w-full p-2 border"
                            step="0.5"
                            min="24"
                            max="32"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            From bow measurements or wingspan/2.5
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-gray-700">Arrow Speed (fps)</label>
                          <input 
                            type="number" 
                            value={arrowSpeed} 
                            onChange={(e) => setArrowSpeed(parseFloat(e.target.value))}
                            className="arrow-input w-full p-2 border"
                            step="5"
                            min="200"
                            max="350"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            From chronograph or manufacturer IBO/ATA rating
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              <Card className="border-0 shadow-none">
                <CardContent className="pt-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-6 text-green-800 border-b pb-2">Arrow Specifications</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="result-card result-green p-4">
                      <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                        <Target className="mr-2 h-4 w-4" />
                        FOC
                      </h3>
                      <div className="text-2xl md:text-3xl font-bold text-green-800">{results.foc}%</div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">
                        Target: 10-15% | Hunting: 12-19%
                      </p>
                      {parseFloat(results.foc) < 7 && (
                        <div className="flex items-center text-amber-600 mt-2 text-xs sm:text-sm">
                          <AlertCircle size={14} className="mr-1" /> 
                          FOC is too low - may cause instability
                        </div>
                      )}
                      {parseFloat(results.foc) > 20 && (
                        <div className="flex items-center text-amber-600 mt-2 text-xs sm:text-sm">
                          <AlertCircle size={14} className="mr-1" /> 
                          FOC is very high - may impact accuracy
                        </div>
                      )}
                    </div>
                    
                    <div className="result-card result-blue p-4">
                      <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5"></path>
                          <path d="M2 12l10 5 10-5"></path>
                        </svg>
                        Total Weight
                      </h3>
                      <div className="text-2xl md:text-3xl font-bold text-blue-800">{results.totalWeight} gr</div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">
                        Hunting: 400-500gr | Target: 300-400gr
                      </p>
                    </div>
                    
                    <div className="result-card result-purple p-4">
                      <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                          <line x1="12" y1="2" x2="12" y2="12"></line>
                        </svg>
                        Kinetic Energy
                      </h3>
                      <div className="text-2xl md:text-3xl font-bold text-purple-800">{results.kineticEnergy} ft-lbs</div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">
                        Small game: 25+ | Deer: 40+ | Elk: 60+
                      </p>
                    </div>
                    
                    <div className="result-card result-gray p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v4M5 5l2.5 2.5M19 5l-2.5 2.5M5 19l2.5-2.5M19 19l-2.5-2.5M2 12h4M18 12h4M12 18v4"></path>
                        </svg>
                        Momentum
                      </h3>
                      <div className="text-2xl md:text-3xl font-bold text-gray-800">{results.momentum}</div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">
                        Higher values = better penetration
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-4 text-gray-800">Arrow Balance Point</h3>
                    <div className="relative h-10 sm:h-12 bg-white rounded-md overflow-hidden mt-2 border">
                      <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center">
                        <div 
                          className="absolute h-full w-1 bg-green-500"
                          style={{ left: `${(parseFloat(results.balancePoint) / shaft.length) * 100}%` }}
                        ></div>
                        
                        <div 
                          className="absolute h-full w-1 bg-blue-500"
                          style={{ left: '50%' }}
                        ></div>
                      </div>
                      
                      <div className="absolute top-0 h-full w-full flex justify-between px-2">
                        <span className="text-xs text-gray-600 self-end mb-1">Tip</span>
                        <span className="text-xs text-gray-600 self-end mb-1">Nock</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-600 mt-1">
                      <span>Balance: {results.balancePoint}" from tip</span>
                      <span>Shaft Length: {shaft.length}"</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="text-xs sm:text-sm text-gray-500 mt-2 px-1">
        <p>This calculator provides estimates based on component weights and simple physics. Actual arrow performance may vary.</p>
      </div>
    </div>
  );
};

export default ArrowTuningCalculator;
