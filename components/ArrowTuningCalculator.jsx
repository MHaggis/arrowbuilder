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
  const shaftMaterials = ['Carbon', 'Aluminum', 'Carbon/Aluminum Hybrid', 'Wood'];
  const tipTypes = ['Field Point', 'Broadhead - Fixed', 'Broadhead - Mechanical', 'Judo Point', 'Fishing Point'];
  const vaneTypes = ['Plastic', 'Feather', 'Rubber'];
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader className="bg-green-700 text-white">
          <CardTitle className="text-xl md:text-2xl text-center">
            Arrow Tuning Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="build" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="build">
                <ArrowLeft className="mr-2 h-4 w-4 hidden sm:inline-block" />
                <span>Build Arrow</span>
              </TabsTrigger>
              <TabsTrigger value="performance">
                <ArrowRight className="mr-2 h-4 w-4 hidden sm:inline-block" />
                <span>Bow Settings</span>
              </TabsTrigger>
              <TabsTrigger value="results">
                <Crosshair className="mr-2 h-4 w-4 hidden sm:inline-block" />
                <span>Results</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="build">
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4">Arrow Components</h2>
                
                {/* Shaft section */}
                <div className="component-section">
                  <h3 className="component-title flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4 text-green-600" />
                    Shaft
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Length (inches)</label>
                      <input 
                        type="number" 
                        value={shaft.length} 
                        onChange={(e) => setShaft({...shaft, length: parseFloat(e.target.value)})}
                        className="form-input"
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
                        className="form-input"
                        step="0.1"
                        min="5"
                        max="15"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Material</label>
                      <select 
                        className="form-input"
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
                        onChange={(e) => setShaft({...shaft, diameter: (parseFloat(e.target.value) || 0) / 25.4})}
                        className="form-input"
                        step="0.1"
                        min="4"
                        max="12"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Tip section */}
                <div className="component-section">
                  <h3 className="component-title flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4 text-green-600" />
                    Tip/Broadhead
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Type</label>
                      <select 
                        className="form-input"
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
                        className="form-input"
                        step="5"
                        min="75"
                        max="200"
                      />
                    </div>
                  </div>
                </div>

                {/* Insert section */}
                <div className="component-section">
                  <h3 className="component-title">Insert</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Weight (grains)</label>
                    <input 
                      type="number" 
                      value={insert.weight} 
                      onChange={(e) => setInsert({...insert, weight: parseFloat(e.target.value)})}
                      className="form-input"
                      step="1"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {/* Vanes section */}
                <div className="component-section">
                  <h3 className="component-title">Vanes/Fletching</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Type</label>
                      <select 
                        className="form-input"
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
                        className="form-input"
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
                        className="form-input"
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
                        className="form-input"
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
                        className="form-input"
                        step="0.5"
                        min="1"
                        max="20"
                      />
                    </div>
                  </div>
                </div>

                {/* Nock section */}
                <div className="component-section">
                  <h3 className="component-title">Nock</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Weight (grains)</label>
                    <input 
                      type="number" 
                      value={nock.weight} 
                      onChange={(e) => setNock({...nock, weight: parseFloat(e.target.value)})}
                      className="form-input"
                      step="1"
                      min="5"
                      max="20"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4">Bow Settings</h2>
                
                <div className="component-section">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Draw Weight (lbs)</label>
                      <input 
                        type="number" 
                        value={drawWeight} 
                        onChange={(e) => setDrawWeight(parseFloat(e.target.value))}
                        className="form-input"
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
                        className="form-input"
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
                        className="form-input"
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
            </TabsContent>

            <TabsContent value="results">
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4">Arrow Specifications</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="result-item border-green-200">
                    <h3 className="font-medium text-green-800 mb-2">FOC</h3>
                    <div className="text-2xl font-bold text-green-800">{results.foc}%</div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      Target: 10-15% | Hunting: 12-19%
                    </p>
                  </div>
                  
                  <div className="result-item border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">Total Weight</h3>
                    <div className="text-2xl font-bold text-blue-800">{results.totalWeight} gr</div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      Hunting: 400-500gr | Target: 300-400gr
                    </p>
                  </div>
                  
                  <div className="result-item border-purple-200">
                    <h3 className="font-medium text-purple-800 mb-2">Kinetic Energy</h3>
                    <div className="text-2xl font-bold text-purple-800">{results.kineticEnergy} ft-lbs</div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      Small game: 25+ | Deer: 40+ | Elk: 60+
                    </p>
                  </div>
                  
                  <div className="result-item border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-2">Momentum</h3>
                    <div className="text-2xl font-bold text-gray-800">{results.momentum}</div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      Higher values = better penetration
                    </p>
                  </div>
                </div>
                
                <div className="component-section">
                  <h3 className="component-title">Arrow Balance Point</h3>
                  <div className="relative h-10 sm:h-12 bg-gray-100 rounded-md overflow-hidden mt-2 border">
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
              </div>
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
