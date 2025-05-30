import { Tool, CategoryInfo } from '../types/Tool';

export const categories: CategoryInfo[] = [
  {
    id: 'writing',
    title: 'Writing & Prompting',
    icon: '📝',
    description: 'Text generation, writing assistance, and prompt engineering tools'
  },
  {
    id: 'research',
    title: 'Research',
    icon: '🔍',
    description: 'Research, information gathering, and knowledge exploration tools'
  },
  {
    id: 'video',
    title: 'Video Generation',
    icon: '🎬',
    description: 'AI-based video generation and production tools'
  },
  {
    id: 'coding',
    title: 'Base Coding',
    icon: '💻',
    description: 'Code generation and development support tools'
  },
  {
    id: 'visualization',
    title: 'Visualization & PPT',
    icon: '📊',
    description: 'Data visualization and presentation creation tools'
  },
  {
    id: 'images',
    title: 'Image Editing',
    icon: '🖌️',
    description: 'AI-powered image editing and enhancement tools'
  },
  {
    id: 'notes',
    title: 'Meeting Notes & Records',
    icon: '📝',
    description: 'Meeting minutes and voice-to-text conversion tools'
  },
  {
    id: 'design',
    title: 'Web/UI/UX Design',
    icon: '🎨',
    description: 'Web, UI, UX design and prototyping tools'
  },
  {
    id: 'art',
    title: 'Image Generation',
    icon: '🎭',
    description: 'AI-based image generation tools'
  },
  {
    id: 'editing',
    title: 'Video Editing',
    icon: '🎞️',
    description: 'AI video editing and post-production tools'
  },
  {
    id: 'avatars',
    title: 'AI Avatars',
    icon: '👤',
    description: 'AI avatar and digital human generation tools'
  },
  {
    id: 'academic',
    title: 'Academic Research',
    icon: '📚',
    description: 'Academic research and scientific information tools'
  },
  {
    id: 'models',
    title: 'AI Models',
    icon: '🧬',
    description: 'AI model repositories and execution platforms'
  },
  {
    id: 'comics',
    title: 'AI Comics & Storyboards',
    icon: '📖',
    description: 'AI tools for comic creation and storyboard generation'
  },
  {
    id: 'automation',
    title: 'Automation',
    icon: '⚙️',
    description: 'AI workflow tools for automating repetitive tasks'
  },
  {
    id: 'voice',
    title: 'Voice Synthesis',
    icon: '🗣️',
    description: 'AI tools for generating and transforming voice'
  },
  {
    id: 'translation',
    title: 'Translation',
    icon: '🌐',
    description: 'AI-based real-time translation and language conversion tools'
  },
  {
    id: 'music',
    title: 'Music Generation',
    icon: '🎵',
    description: 'AI music composition and arrangement tools'
  },
  {
    id: 'local',
    title: 'Local AI',
    icon: '💾',
    description: 'Open-source AI tools running in local environment'
  },
  {
    id: 'chatbot',
    title: 'Character Chatbots',
    icon: '🧑‍🚀',
    description: 'AI chatbots with personality and world-building'
  },
  {
    id: 'inference',
    title: 'Inference AI',
    icon: '📈',
    description: 'AI model platforms for high-speed inference'
  },
  {
    id: 'agents',
    title: 'AI Agents',
    icon: '🤖',
    description: 'AI assistant agents performing various tasks'
  },
  {
    id: 'utility',
    title: 'Utilities',
    icon: '🛠️',
    description: 'Practical AI tools for specific purposes'
  },
  {
    id: 'college',
    title: 'Smart College Life',
    icon: '🎓',
    description: 'Collection of AI tools useful for college students'
  }
];

// Update all tool categories to match the new IDs
export const tools = [
  // ... rest of the tools array with updated category IDs
].map(tool => ({
  ...tool,
  category: tool.category
    .replace('video-generation', 'video')
    .replace('image-generation', 'art')
    .replace('image-editing', 'images')
    .replace('meeting-notes', 'notes')
    .replace('ui-design', 'design')
    .replace('video-editing', 'editing')
    .replace('voice-generation', 'voice')
    .replace('music-generation', 'music')
    .replace('local-ai', 'local')
    .replace('character-chatbot', 'chatbot')
    .replace('inference-ai', 'inference')
    .replace('ai-agent', 'agents')
    .replace('college-life', 'college')
}));