import React from 'react';
import { WorkflowNode } from '../types/workflow';
import { Box, Image, Sliders, Zap, Play, Download } from 'lucide-react';

interface WorkflowDisplayProps {
  workflow: WorkflowNode[];
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'input':
      return Image;
    case 'processing':
      return Sliders;
    case 'generation':
      return Zap;
    case 'output':
      return Download;
    default:
      return Box;
  }
};

const getNodeColor = (type: string) => {
  switch (type) {
    case 'input':
      return 'from-green-500 to-emerald-600';
    case 'processing':
      return 'from-blue-500 to-cyan-600';
    case 'generation':
      return 'from-purple-500 to-violet-600';
    case 'output':
      return 'from-orange-500 to-red-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const WorkflowDisplay: React.FC<WorkflowDisplayProps> = ({ workflow }) => {
  if (workflow.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 h-96 flex items-center justify-center">
        <div className="text-center">
          <Box className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Workflow Generated</h3>
          <p className="text-gray-500">Start recording to generate your ComfyUI workflow</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Play className="w-5 h-5 mr-2 text-blue-400" />
          Generated Workflow
        </h3>
        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          {workflow.length} nodes
        </span>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {workflow.map((node, index) => {
          const Icon = getNodeIcon(node.type);
          const colorClass = getNodeColor(node.type);
          
          return (
            <div key={node.id} className="relative">
              {/* Connection Line */}
              {index < workflow.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-600"></div>
              )}
              
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{node.name}</h4>
                      <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded capitalize">
                        {node.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">{node.description}</p>
                    
                    {/* Parameters */}
                    {Object.keys(node.parameters).length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Parameters
                        </h5>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(node.parameters).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center text-sm">
                              <span className="text-gray-400 capitalize">{key}:</span>
                              <span className="text-white font-medium">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Workflow Stats */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {workflow.filter(n => n.type === 'input').length}
            </div>
            <div className="text-xs text-gray-400">Inputs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {workflow.filter(n => n.type === 'processing').length}
            </div>
            <div className="text-xs text-gray-400">Processing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {workflow.filter(n => n.type === 'generation').length}
            </div>
            <div className="text-xs text-gray-400">Generation</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {workflow.filter(n => n.type === 'output').length}
            </div>
            <div className="text-xs text-gray-400">Outputs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDisplay;