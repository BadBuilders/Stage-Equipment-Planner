
import React, { useState } from 'react';
import { Trash2, RotateCw } from 'lucide-react';
import { EQUIPMENT_TYPES } from './constants';
import type { PlacedItem, EquipmentTypeId, EquipmentType } from './types';

const App: React.FC = () => {
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [selectedType, setSelectedType] = useState<EquipmentTypeId | null>(null);
  const [draggedItem, setDraggedItem] = useState<PlacedItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<PlacedItem | null>(null);

  const handleStageClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!selectedType) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newItem: PlacedItem = {
      id: Date.now(),
      type: selectedType,
      x: x - 24, // offset to center the item (48px / 2)
      y: y - 24,
      rotation: 0,
    };
    
    setItems([...items, newItem]);
  };

  const handleItemMouseDown = (e: React.MouseEvent<HTMLDivElement>, item: PlacedItem) => {
    e.stopPropagation();
    setDraggedItem(item);
    setSelectedItem(item);
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!draggedItem) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left - 24;
    let y = e.clientY - rect.top - 24;
    
    // Constrain to stage boundaries
    const itemSize = 48;
    x = Math.max(0, Math.min(x, rect.width - itemSize));
    y = Math.max(0, Math.min(y, rect.height - itemSize));

    setItems(items.map(item => 
      item.id === draggedItem.id 
        ? { ...item, x, y }
        : item
    ));
  };

  const handleMouseUp = () => {
    setDraggedItem(null);
  };

  const deleteItem = () => {
    if (selectedItem) {
      setItems(items.filter(item => item.id !== selectedItem.id));
      setSelectedItem(null);
    }
  };

  const rotateItem = () => {
    if (selectedItem) {
      const newRotation = (selectedItem.rotation + 45) % 360;
      setItems(items.map(item => 
        item.id === selectedItem.id 
          ? { ...item, rotation: newRotation }
          : item
      ));
      setSelectedItem({ ...selectedItem, rotation: newRotation });
    }
  };

  const clearStage = () => {
    setItems([]);
    setSelectedItem(null);
  };

  const getEquipmentConfig = (typeId: EquipmentTypeId): EquipmentType => {
    const config = EQUIPMENT_TYPES.find(t => t.id === typeId);
    if (!config) {
        throw new Error(`Configuration for equipment type "${typeId}" not found.`);
    }
    return config;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-8 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">Stage Equipment Planner</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Design your perfect stage layout. Select equipment, place it on the grid, and arrange it exactly how you want.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 h-fit lg:sticky top-8">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Equipment</h2>
            <div className="space-y-2">
              {EQUIPMENT_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                      selectedType === type.id
                        ? `${type.color} text-white shadow-lg scale-105 ring-2 ring-white`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{type.name}</span>
                  </button>
                );
              })}
            </div>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4 border-b border-gray-700 pb-2">Controls</h2>
            <div className="mt-4 space-y-2">
              <button
                onClick={rotateItem}
                disabled={!selectedItem}
                className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              >
                <RotateCw size={20} />
                Rotate Selected
              </button>
              <button
                onClick={deleteItem}
                disabled={!selectedItem}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              >
                <Trash2 size={20} />
                Delete Selected
              </button>
              <button
                onClick={clearStage}
                className="w-full mt-4 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all"
              >
                Clear Stage
              </button>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700">
              <div
                className="relative bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg overflow-hidden cursor-crosshair"
                style={{ height: '600px' }}
                onClick={handleStageClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={`v-${i}`} className="absolute h-full w-px bg-white" style={{ left: `${i * 5}%` }} />
                  ))}
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={`h-${i}`} className="absolute w-full h-px bg-white" style={{ top: `${(i * 100) / 15}%` }} />
                  ))}
                </div>

                {items.map((item) => {
                  const config = getEquipmentConfig(item.type);
                  const Icon = config.icon;
                  return (
                    <div
                      key={item.id}
                      className={`absolute w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing rounded-lg transition-all duration-100 ${
                        selectedItem?.id === item.id ? 'ring-4 ring-cyan-400 shadow-2xl' : 'ring-2 ring-transparent'
                      }`}
                      style={{
                        left: `${item.x}px`,
                        top: `${item.y}px`,
                        transform: `rotate(${item.rotation}deg)`,
                      }}
                      onMouseDown={(e) => handleItemMouseDown(e, item)}
                    >
                      <div className={`${config.color} p-3 rounded-lg shadow-lg hover:shadow-xl transition-all w-full h-full flex items-center justify-center`}>
                        <Icon size={24} className="text-white" />
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center text-gray-400 p-4 bg-black bg-opacity-20 rounded-lg">
                      <p className="text-lg font-medium">Select equipment from the left panel</p>
                      <p className="text-sm mt-1">Then click on the stage to place it</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedItem && (
                <div className="mt-4 p-3 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700">
                  <p className="text-white text-sm text-center">
                    Selected: <span className="font-semibold text-cyan-400">{getEquipmentConfig(selectedItem.type).name}</span>
                    <span className="text-gray-400"> | Drag to move, or use controls to rotate/delete.</span>
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
