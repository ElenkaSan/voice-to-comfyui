export interface WorkflowNode {
  id: string;
  name: string;
  type: 'input' | 'processing' | 'generation' | 'output';
  description: string;
  parameters: Record<string, any>;
  connections?: {
    inputs: string[];
    outputs: string[];
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  nodes: WorkflowNode[];
}