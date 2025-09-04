import { WorkflowTemplate } from '../types/workflow';

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'general-image-generation',
    name: 'General Image Generation',
    description: 'Basic text-to-image generation workflow',
    keywords: ['create', 'generate', 'image', 'picture', 'draw', 'make'],
    nodes: [
      {
        id: 'input-1',
        name: 'Text Prompt Input',
        type: 'input',
        description: 'Input text prompt for image generation',
        parameters: {
          prompt: 'beautiful artwork',
          negative_prompt: 'blurry, low quality'
        }
      },
      {
        id: 'gen-1',
        name: 'Stable Diffusion Model',
        type: 'generation',
        description: 'AI model for generating images from text',
        parameters: {
          model: 'stable-diffusion-v1-5',
          steps: 30,
          cfg_scale: 7.5,
          width: 512,
          height: 512,
          seed: -1
        }
      },
      {
        id: 'output-1',
        name: 'Image Output',
        type: 'output',
        description: 'Save generated image',
        parameters: {
          format: 'png',
          quality: 100
        }
      }
    ]
  },
  {
    id: 'portrait-generation',
    name: 'Portrait Generation',
    description: 'Specialized workflow for generating portraits',
    keywords: ['portrait', 'face', 'person', 'character', 'headshot'],
    nodes: [
      {
        id: 'input-2',
        name: 'Portrait Prompt',
        type: 'input',
        description: 'Text prompt optimized for portrait generation',
        parameters: {
          prompt: 'professional portrait',
          negative_prompt: 'blurry, low quality, distorted face'
        }
      },
      {
        id: 'proc-2',
        name: 'Face Enhancement',
        type: 'processing',
        description: 'Enhance facial features and details',
        parameters: {
          face_restoration: true,
          skin_smoothing: 0.3
        }
      },
      {
        id: 'gen-2',
        name: 'Portrait Model',
        type: 'generation',
        description: 'Specialized model for portrait generation',
        parameters: {
          model: 'realistic-vision',
          steps: 40,
          cfg_scale: 8.0,
          width: 512,
          height: 768,
          seed: -1
        }
      },
      {
        id: 'output-2',
        name: 'Portrait Output',
        type: 'output',
        description: 'Save enhanced portrait',
        parameters: {
          format: 'png',
          quality: 95
        }
      }
    ]
  },
  {
    id: 'anime-generation',
    name: 'Anime Style Generation',
    description: 'Generate anime and manga style artwork',
    keywords: ['anime', 'manga', 'japanese', 'cartoon', 'waifu'],
    nodes: [
      {
        id: 'input-3',
        name: 'Anime Prompt',
        type: 'input',
        description: 'Text prompt for anime-style generation',
        parameters: {
          prompt: 'anime character, detailed',
          negative_prompt: 'realistic, photo, blurry'
        }
      },
      {
        id: 'proc-3',
        name: 'Style Transfer',
        type: 'processing',
        description: 'Apply anime styling effects',
        parameters: {
          style_strength: 0.8,
          color_saturation: 1.2
        }
      },
      {
        id: 'gen-3',
        name: 'Anime Model',
        type: 'generation',
        description: 'AI model trained on anime artwork',
        parameters: {
          model: 'anything-v4',
          steps: 35,
          cfg_scale: 9.0,
          width: 512,
          height: 768,
          seed: -1
        }
      },
      {
        id: 'output-3',
        name: 'Anime Output',
        type: 'output',
        description: 'Save anime-style artwork',
        parameters: {
          format: 'png',
          quality: 100
        }
      }
    ]
  },
  {
    id: 'landscape-generation',
    name: 'Landscape Generation',
    description: 'Generate beautiful landscape and scenery images',
    keywords: ['landscape', 'scenery', 'nature', 'mountain', 'forest', 'ocean', 'sky'],
    nodes: [
      {
        id: 'input-4',
        name: 'Landscape Prompt',
        type: 'input',
        description: 'Text prompt for landscape generation',
        parameters: {
          prompt: 'beautiful landscape, scenic view',
          negative_prompt: 'people, buildings, urban'
        }
      },
      {
        id: 'proc-4',
        name: 'Depth Processing',
        type: 'processing',
        description: 'Enhance depth and perspective',
        parameters: {
          depth_enhancement: true,
          atmospheric_perspective: 0.7
        }
      },
      {
        id: 'gen-4',
        name: 'Landscape Model',
        type: 'generation',
        description: 'Model specialized for landscape generation',
        parameters: {
          model: 'landscape-diffusion',
          steps: 45,
          cfg_scale: 7.0,
          width: 768,
          height: 512,
          seed: -1
        }
      },
      {
        id: 'proc-5',
        name: 'Color Grading',
        type: 'processing',
        description: 'Apply cinematic color grading',
        parameters: {
          contrast: 1.1,
          saturation: 1.05,
          temperature: 0.95
        }
      },
      {
        id: 'output-4',
        name: 'Landscape Output',
        type: 'output',
        description: 'Save processed landscape image',
        parameters: {
          format: 'jpg',
          quality: 95
        }
      }
    ]
  },
  {
    id: 'upscale-enhance',
    name: 'Image Upscaling & Enhancement',
    description: 'Upscale and enhance existing images',
    keywords: ['upscale', 'enhance', 'improve', 'quality', 'resolution', 'sharpen'],
    nodes: [
      {
        id: 'input-5',
        name: 'Image Input',
        type: 'input',
        description: 'Load image for enhancement',
        parameters: {
          source: 'upload',
          format: 'auto'
        }
      },
      {
        id: 'proc-6',
        name: 'Noise Reduction',
        type: 'processing',
        description: 'Remove noise and artifacts',
        parameters: {
          noise_reduction: 0.6,
          artifact_removal: true
        }
      },
      {
        id: 'gen-5',
        name: 'AI Upscaler',
        type: 'generation',
        description: 'AI-powered image upscaling',
        parameters: {
          model: 'real-esrgan',
          scale_factor: 4,
          face_enhance: true
        }
      },
      {
        id: 'proc-7',
        name: 'Post-Processing',
        type: 'processing',
        description: 'Final image refinement',
        parameters: {
          sharpening: 0.4,
          clarity: 0.2
        }
      },
      {
        id: 'output-5',
        name: 'Enhanced Output',
        type: 'output',
        description: 'Save upscaled image',
        parameters: {
          format: 'png',
          quality: 100
        }
      }
    ]
  }
];