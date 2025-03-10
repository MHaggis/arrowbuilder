"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, ArrowRight, Crosshair, AlertCircle } from 'lucide-react';

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
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="bg-green-800 text-white">
          <CardTitle className="text-2xl flex items-center">
            <Crosshair className="mr-2" />
            Bowhunter Arrow Tuning Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-700">
            Optimize your arrow setup for hunting by tuning each component and viewing calculated metrics including FOC (Front of Center).
          </p>
          
          <Tabs defaultValue="setup">
            <TabsList className="mb-4">
              <TabsTrigger value="setup">Arrow Setup</TabsTrigger>
              <TabsTrigger value="bow">Bow Settings</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="space-y-6">
              {/* Arrow Shaft Settings */}
              <Card>
                <CardHeader className="bg-gray-100">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowRight className="mr-2" size={18} />
                    Arrow Shaft
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <select 
                      className="w-full p-2 border rounded" 
                      value={shaft.material}
                      onChange={(e) => setShaft({...shaft, material: e.target.value})}
                    >
                      {shaftMaterials.map(mat => (
                        <option key={mat} value={mat}>{mat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Length (inches)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={shaft.length}
                      onChange={(e) => setShaft({...shaft, length: parseFloat(e.target.value) || 0})}
                      step="0.5"
                      min="20"
                      max="35"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diameter (mm)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={shaft.diameter * 25.4} // Convert inches to mm for display
                      onChange={(e) => setShaft({...shaft, diameter: (parseFloat(e.target.value) || 0) / 25.4})} // Store as inches internally for calculations
                      step="0.1"
                      min="4"
                      max="12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (grains per inch)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={shaft.weight}
                      onChange={(e) => setShaft({...shaft, weight: parseFloat(e.target.value) || 0})}
                      step="0.1"
                      min="5"
                      max="15"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow Tip Settings */}
              <Card>
                <CardHeader className="bg-gray-100">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowLeft className="mr-2" size={18} />
                    Tip/Broadhead
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select 
                      className="w-full p-2 border rounded" 
                      value={tip.type}
                      onChange={(e) => setTip({...tip, type: e.target.value})}
                    >
                      {tipTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (grains)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={tip.weight}
                      onChange={(e) => setTip({...tip, weight: parseFloat(e.target.value) || 0})}
                      step="5"
                      min="75"
                      max="200"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Insert Settings */}
              <Card>
                <CardHeader className="bg-gray-100">
                  <CardTitle className="text-lg">Insert</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (grains)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={insert.weight}
                      onChange={(e) => setInsert({...insert, weight: parseFloat(e.target.value) || 0})}
                      step="1"
                      min="0"
                      max="100"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Vanes Settings */}
              <Card>
                <CardHeader className="bg-gray-100">
                  <CardTitle className="text-lg">Vanes/Fletching</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select 
                      className="w-full p-2 border rounded" 
                      value={vanes.type}
                      onChange={(e) => setVanes({...vanes, type: e.target.value})}
                    >
                      {vaneTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Count
                    </label>
                    <select 
                      className="w-full p-2 border rounded" 
                      value={vanes.count}
                      onChange={(e) => setVanes({...vanes, count: parseInt(e.target.value) || 3})}
                    >
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Length (inches)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={vanes.length}
                      onChange={(e) => setVanes({...vanes, length: parseFloat(e.target.value) || 0})}
                      step="0.1"
                      min="1"
                      max="5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (inches)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={vanes.height}
                      onChange={(e) => setVanes({...vanes, height: parseFloat(e.target.value) || 0})}
                      step="0.1"
                      min="0.1"
                      max="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (grains per vane)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={vanes.weight}
                      onChange={(e) => setVanes({...vanes, weight: parseFloat(e.target.value) || 0})}
                      step="0.5"
                      min="1"
                      max="20"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Nock Settings */}
              <Card>
                <CardHeader className="bg-gray-100">
                  <CardTitle className="text-lg">Nock</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (grains)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={nock.weight}
                      onChange={(e) => setNock({...nock, weight: parseFloat(e.target.value) || 0})}
                      step="1"
                      min="5"
                      max="20"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bow" className="space-y-6">
              <Card>
                <CardHeader className="bg-gray-100">
                  <CardTitle className="text-lg">Bow Settings</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Draw Weight (lbs)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={drawWeight}
                      onChange={(e) => setDrawWeight(parseFloat(e.target.value) || 0)}
                      step="5"
                      min="30"
                      max="90"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Draw Length (inches)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={drawLength}
                      onChange={(e) => setDrawLength(parseFloat(e.target.value) || 0)}
                      step="0.5"
                      min="24"
                      max="32"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arrow Speed (fps)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={arrowSpeed}
                      onChange={(e) => setArrowSpeed(parseFloat(e.target.value) || 0)}
                      step="5"
                      min="200"
                      max="350"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      From chronograph or manufacturer IBO/ATA rating
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results">
              <Card>
                <CardHeader className="bg-gray-100">
                  <CardTitle className="text-lg">Arrow Performance Results</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2">FOC (Front of Center)</h3>
                      <div className="text-3xl font-bold text-green-800">{results.foc}%</div>
                      <p className="text-sm text-gray-600 mt-2">
                        Ideal for hunting: 10-15%
                      </p>
                      {parseFloat(results.foc) < 8 && (
                        <div className="flex items-center text-amber-600 mt-2 text-sm">
                          <AlertCircle size={16} className="mr-1" /> 
                          Consider adding tip weight for better FOC
                        </div>
                      )}
                      {parseFloat(results.foc) > 19 && (
                        <div className="flex items-center text-amber-600 mt-2 text-sm">
                          <AlertCircle size={16} className="mr-1" /> 
                          FOC is very high - may impact accuracy
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-2">Total Arrow Weight</h3>
                      <div className="text-3xl font-bold text-blue-800">{results.totalWeight} grains</div>
                      <p className="text-sm text-gray-600 mt-2">
                        Hunting: 400-500gr | Target: 300-400gr
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-purple-800 mb-2">Kinetic Energy</h3>
                      <div className="text-3xl font-bold text-purple-800">{results.kineticEnergy} ft-lbs</div>
                      <p className="text-sm text-gray-600 mt-2">
                        Small game: 25+ | Deer: 40+ | Elk: 60+
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-gray-800 mb-2">Momentum</h3>
                      <div className="text-3xl font-bold text-gray-800">{results.momentum}</div>
                      <p className="text-sm text-gray-600 mt-2">
                        Higher values = better penetration
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Arrow Balance Point</h3>
                    <div className="relative h-12 bg-gray-200 rounded-md overflow-hidden mt-2">
                      <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center">
                        <div 
                          className="absolute h-full w-1 bg-red-500"
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
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
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
      
      <div className="text-sm text-gray-500 mt-2">
        <p>This calculator provides estimates based on component weights and simple physics. Actual arrow performance may vary. Always test your setup before hunting.</p>
      </div>
    </div>
  );
};

export default ArrowTuningCalculator;
