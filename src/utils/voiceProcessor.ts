import { WorkflowNode, WorkflowTemplate } from '../types/workflow';
import { workflowTemplates } from './workflowTemplates';

export const processVoiceCommand = async (command: string): Promise<WorkflowNode[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lowerCommand = command.toLowerCase();
  
  // Find the best matching template based on keywords
  let bestMatch: WorkflowTemplate | null = null;
  let highestScore = 0;
  
  workflowTemplates.forEach(template => {
    const score = template.keywords.reduce((acc, keyword) => {
      return acc + (lowerCommand.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = template;
    }
  });
  
  // If no good match, use the general image generation template
  if (!bestMatch || highestScore === 0) {
    bestMatch = workflowTemplates.find(t => t.id === 'general-image-generation') || workflowTemplates[0];
  }
  
  // Customize the workflow based on the voice command
  const customizedWorkflow = customizeWorkflow(bestMatch.nodes, command);
  
  return customizedWorkflow;
};

const customizeWorkflow = (baseNodes: WorkflowNode[], command: string): WorkflowNode[] => {
  const lowerCommand = command.toLowerCase();
  
  return baseNodes.map(node => {
    const customNode = { ...node, parameters: { ...node.parameters } };
    
    // Extract and apply common parameters from voice command
    if (node.type === 'generation') {
      // Extract style keywords
      if (lowerCommand.includes('realistic') || lowerCommand.includes('photorealistic')) {
        customNode.parameters.style = 'photorealistic';
      } else if (lowerCommand.includes('anime') || lowerCommand.includes('manga')) {
        customNode.parameters.style = 'anime';
      } else if (lowerCommand.includes('cartoon') || lowerCommand.includes('comic')) {
        customNode.parameters.style = 'cartoon';
      } else if (lowerCommand.includes('art') || lowerCommand.includes('painting')) {
        customNode.parameters.style = 'artistic';
      }
      
      // Extract quality keywords
      if (lowerCommand.includes('high quality') || lowerCommand.includes('4k') || lowerCommand.includes('detailed')) {
        customNode.parameters.quality = 'high';
        customNode.parameters.steps = 50;
      }
      
      // Extract size keywords
      if (lowerCommand.includes('portrait')) {
        customNode.parameters.width = 512;
        customNode.parameters.height = 768;
      } else if (lowerCommand.includes('landscape')) {
        customNode.parameters.width = 768;
        customNode.parameters.height = 512;
      } else if (lowerCommand.includes('square')) {
        customNode.parameters.width = 512;
        customNode.parameters.height = 512;
      }
      
      // Extract the main subject/prompt
      const promptMatch = extractPromptFromCommand(command);
      if (promptMatch) {
        customNode.parameters.prompt = promptMatch;
      }
    }
    
    // Customize processing nodes
    if (node.type === 'processing') {
      if (lowerCommand.includes('blur') || lowerCommand.includes('smooth')) {
        customNode.parameters.blur_strength = 0.5;
      }
      if (lowerCommand.includes('sharp') || lowerCommand.includes('detailed')) {
        customNode.parameters.sharpen = true;
      }
    }
    
    return customNode;
  });
};

const extractPromptFromCommand = (command: string): string => {
  // Simple prompt extraction - in a real app, this would use more sophisticated NLP
  const cleanCommand = command
    .replace(/create|generate|make|draw|paint/gi, '')
    .replace(/an image of|a picture of|a photo of/gi, '')
    .replace(/realistic|anime|cartoon|artistic/gi, '')
    .replace(/high quality|4k|detailed/gi, '')
    .replace(/portrait|landscape|square/gi, '')
    .trim();
  
  return cleanCommand || 'beautiful artwork';
};