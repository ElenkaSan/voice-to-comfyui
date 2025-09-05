## Voice-to-ComfyUI Converter application

An innovative AI tool that converts natural voice commands into ComfyUI workflow configurations. The application features a sophisticated interface with real-time voice recognition, intelligent workflow generation, and beautiful visualizations that meet production-quality standards.

The app includes advanced voice processing that matches natural language commands to appropriate ComfyUI workflows, supports multiple languages, and provides visual feedback through an animated audio visualizer. Users can export their generated workflows as JSON files and review their session history with confidence scores for each voice command.

Try the app [Voice-to-ComfyUI Converter](https://voice-to-comfyui.vercel.app/)

Immediate Outputs (In the App):
  - Generated Workflow: Displays on the right side with visual nodes
  - Session History: Shows previous voice commands and their workflows
  - Real-time Transcript: Shows what the app heard from your voice

### Exported Outputs:
  - JSON File: Click "Export" to download the workflow as a JSON file
  - Download Location: Goes to your browser's default download folder
  - File Name: comfyui-workflow-[timestamp].json

### ComfyUI Integration:
  - Open ComfyUI in your browser
  - Load the exported JSON file into ComfyUI's workflow editor
  - Run the workflow in ComfyUI
  - Generated images will appear in ComfyUI's output directory (usually ComfyUI/output/)

### Next Steps:
  - Test voice commands like "create a realistic portrait" or "generate an anime character"
  - Export the workflow using the green Export button
  - Import into ComfyUI to actually generate images
  - Check ComfyUI's output folder for your generated images


<img width="1031" height="753" alt="Screenshot 2025-09-04 at 9 45 50 PM" src="https://github.com/user-attachments/assets/f1aca543-4e4c-49e1-9db5-69ff66e7f261" />

JSON
```
{
  "nodes": [
    {
      "id": "input-1",
      "name": "Text Prompt Input",
      "type": "input",
      "description": "Input text prompt for image generation",
      "parameters": {
        "prompt": "beautiful artwork",
        "negative_prompt": "blurry, low quality"
      }
    },
    {
      "id": "gen-1",
      "name": "Stable Diffusion Model",
      "type": "generation",
      "description": "AI model for generating images from text",
      "parameters": {
        "model": "stable-diffusion-v1-5",
        "steps": 30,
        "cfg_scale": 7.5,
        "width": 512,
        "height": 512,
        "seed": -1,
        "prompt": "funny cat was running around and laughing"
      }
    },
    {
      "id": "output-1",
      "name": "Image Output",
      "type": "output",
      "description": "Save generated image",
      "parameters": {
        "format": "png",
        "quality": 100
      }
    }
  ],
  "metadata": {
    "created": "2025-09-05T01:46:05.818Z",
    "source": "voice-command",
    "transcript": " funny cat was running around and laughing"
  }
}
```

Author [Elena Nurullina](https://www.linkedin.com/in/elena-nurullina/)
