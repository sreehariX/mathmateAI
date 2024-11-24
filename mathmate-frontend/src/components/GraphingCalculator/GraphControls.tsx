import React from 'react';
import { Graph } from '../../types';
import { Grid, ZoomIn, ZoomOut } from 'lucide-react';

interface GraphControlsProps {
  settings: Graph['settings'];
  onViewportChange: (viewport: Graph['settings']['viewport']) => void;
  onGridToggle: () => void;
}

const GraphControls: React.FC<GraphControlsProps> = ({
  settings,
  onViewportChange,
  onGridToggle,
}) => {
  const handleZoom = (factor: number) => {
    const { xmin, xmax, ymin, ymax } = settings.viewport;
    const xcenter = (xmin + xmax) / 2;
    const ycenter = (ymin + ymax) / 2;
    const xrange = (xmax - xmin) / factor;
    const yrange = (ymax - ymin) / factor;

    onViewportChange({
      xmin: xcenter - xrange / 2,
      xmax: xcenter + xrange / 2,
      ymin: ycenter - yrange / 2,
      ymax: ycenter + yrange / 2,
    });
  };

  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Graph Controls</h2>
      
      <div className="flex space-x-2">
        <button
          onClick={() => handleZoom(1.5)}
          className="flex items-center justify-center p-2 rounded-lg 
                   bg-blue-500 text-white hover:bg-blue-600"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleZoom(0.67)}
          className="flex items-center justify-center p-2 rounded-lg 
                   bg-blue-500 text-white hover:bg-blue-600"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={onGridToggle}
          className={`flex items-center justify-center p-2 rounded-lg 
                    ${settings.grid 
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
                    }`}
        >
          <Grid className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Viewport Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={settings.viewport.xmin}
            onChange={(e) => onViewportChange({
              ...settings.viewport,
              xmin: parseFloat(e.target.value),
            })}
            className="p-1 rounded border dark:bg-gray-800 dark:border-gray-600"
          />
          <input
            type="number"
            value={settings.viewport.xmax}
            onChange={(e) => onViewportChange({
              ...settings.viewport,
              xmax: parseFloat(e.target.value),
            })}
            className="p-1 rounded border dark:bg-gray-800 dark:border-gray-600"
          />
          <input
            type="number"
            value={settings.viewport.ymin}
            onChange={(e) => onViewportChange({
              ...settings.viewport,
              ymin: parseFloat(e.target.value),
            })}
            className="p-1 rounded border dark:bg-gray-800 dark:border-gray-600"
          />
          <input
            type="number"
            value={settings.viewport.ymax}
            onChange={(e) => onViewportChange({
              ...settings.viewport,
              ymax: parseFloat(e.target.value),
            })}
            className="p-1 rounded border dark:bg-gray-800 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default GraphControls;