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
    id: 'video-generation',
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
    id: 'image-editing',
    title: 'Image Editing',
    icon: '🖌️',
    description: 'AI-powered image editing and enhancement tools'
  },
  {
    id: 'meeting-notes',
    title: 'Meeting Notes & Records',
    icon: '📝',
    description: 'Meeting minutes and voice-to-text conversion tools'
  },
  {
    id: 'ui-design',
    title: 'Web/UI/UX Design',
    icon: '🎨',
    description: 'Web, UI, UX design and prototyping tools'
  },
  {
    id: 'image-generation',
    title: 'Image Generation',
    icon: '🎭',
    description: 'AI-based image generation tools'
  },
  {
    id: 'video-editing',
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
    id: 'storyboard',
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
    id: 'voice-generation',
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
    id: 'music-generation',
    title: 'Music Generation',
    icon: '🎵',
    description: 'AI music composition and arrangement tools'
  },
  {
    id: 'local-ai',
    title: 'Local AI',
    icon: '💾',
    description: 'Open-source AI tools running in local environment'
  },
  {
    id: 'character-chatbot',
    title: 'Character Chatbots',
    icon: '🧑‍🚀',
    description: 'AI chatbots with personality and world-building'
  },
  {
    id: 'inference-ai',
    title: 'Inference AI',
    icon: '📈',
    description: 'AI model platforms for high-speed inference'
  },
  {
    id: 'ai-agent',
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
    id: 'college-life',
    title: 'Smart College Life',
    icon: '🎓',
    description: 'Collection of AI tools useful for college students'
  }
];

export const tools: Tool[] = [
  // Writing & Prompting Tools
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
    iconUrl: 'https://chat.openai.com/favicon.ico',
    description: 'Conversational AI assistant for text generation and information',
    category: 'writing'
  },
  {
    name: 'Claude',
    url: 'https://claude.ai/',
    iconUrl: 'https://claude.ai/favicon.ico',
    description: 'Advanced AI assistant with strong reasoning capabilities',
    category: 'writing'
  },
  {
    name: 'Grok',
    url: 'https://x.ai/grok',
    iconUrl: 'https://x.ai/favicon.ico',
    description: 'Conversational AI with real-time data access',
    category: 'writing'
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com',
    description: 'Google\'s multimodal AI model for text and image understanding',
    category: 'writing'
  },
  {
    name: 'Qwen',
    url: 'https://chat.qwen.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=chat.qwen.ai',
    description: 'Alibaba\'s large language model for text generation',
    category: 'writing'
  },
  {
    name: 'DeepSeek',
    url: 'https://deepseek.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=deepseek.com',
    description: 'Advanced AI assistant with specialized capabilities',
    category: 'writing'
  },
  {
    name: 'Le Chat',
    url: 'https://chat.mistral.ai/chat',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=chat.mistral.ai',
    description: 'Conversational AI assistant with natural language processing',
    category: 'writing'
  },
  {
    name: 'Copilot',
    url: 'https://copilot.microsoft.com/',
    iconUrl: 'https://copilot.microsoft.com/favicon.ico',
    description: 'Microsoft\'s AI assistant integrated across applications',
    category: 'writing'
  },
  {
    name: 'Poe',
    url: 'https://poe.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=poe.com',
    description: 'Platform for accessing multiple AI models in one interface',
    category: 'writing'
  },

  // Research Tools
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
    iconUrl: 'https://chat.openai.com/favicon.ico',
    description: 'Conversational AI assistant for text generation and information',
    category: 'research'
  },
  {
    name: 'Grok',
    url: 'https://x.ai/grok',
    iconUrl: 'https://x.ai/favicon.ico',
    description: 'Conversational AI with real-time data access',
    category: 'research'
  },
  {
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/',
    iconUrl: 'https://www.perplexity.ai/favicon.ico',
    description: 'AI search engine for instant answers with cited sources',
    category: 'research'
  },
  {
    name: 'Felo',
    url: 'https://felo.ai/search',
    iconUrl: 'https://felo.ai/favicon.ico',
    description: 'Research assistant for information gathering and synthesis',
    category: 'research'
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com',
    description: 'Google\'s multimodal AI model for text and image understanding',
    category: 'research'
  },
  {
    name: 'Genspark',
    url: 'https://genspark.ai/',
    iconUrl: 'https://genspark.ai/favicon.ico',
    description: 'AI-powered research and content generation platform',
    category: 'research'
  },
  {
    name: 'Liner',
    url: 'https://getliner.com/',
    iconUrl: 'https://getliner.com/favicon.ico',
    description: 'Web highlighter and research organization tool',
    category: 'research'
  },
  {
    name: 'Storm',
    url: 'https://storm.genie.stanford.edu/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=storm.dev',
    description: 'AI-powered research and development platform',
    category: 'research'
  },

  // Video Generation
  {
    name: 'Kling',
    url: 'https://klingai.com/global/',
    iconUrl: 'https://klingai.com/favicon.ico',
    description: 'AI video generation from text prompts',
    category: 'video-generation'
  },
  {
    name: 'Sora',
    url: 'https://openai.com/sora',
    iconUrl: 'https://openai.com/favicon.ico',
    description: 'OpenAI\'s text-to-video generation model',
    category: 'video-generation'
  },
  {
    name: 'Veo2',
    url: 'https://deepmind.google/models/veo/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=deepmind.google',
    description: 'Advanced AI video generation platform',
    category: 'video-generation'
  },
  {
    name: 'Runway',
    url: 'https://runwayml.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=runwayml.com',
    description: 'Creative tools for AI-powered video editing and generation',
    category: 'video-generation'
  },
  {
    name: 'Krea',
    url: 'https://krea.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=krea.ai',
    description: 'AI-powered creative content generation platform',
    category: 'video-generation'
  },
  {
    name: 'Freepik',
    url: 'https://www.freepik.com/',
    iconUrl: 'https://www.freepik.com/favicon.ico',
    description: 'Resource for free vector designs and illustrations',
    category: 'video-generation'
  },
  {
    name: 'Pika',
    url: 'https://pika.art/',
    iconUrl: 'https://pika.art/favicon.ico',
    description: 'Text-to-video generation with creative controls',
    category: 'video-generation'
  },
  {
    name: 'Luma',
    url: 'https://lumalabs.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=lumalabs.ai',
    description: '3D content creation and visualization platform',
    category: 'video-generation'
  },
  {
    name: 'Hailuo',
    url: 'https://hailuoai.video/',
    iconUrl: 'https://hailuoai.video/favicon.ico',
    description: 'AI video generation with advanced editing capabilities',
    category: 'video-generation'
  },
  {
    name: 'Vidu',
    url: 'https://www.vidu.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=vidu.ai',
    description: 'AI video creation and editing platform',
    category: 'video-generation'
  },

  // Coding Tools
  {
    name: 'Cursor',
    url: 'https://www.cursor.so/',
    iconUrl: 'https://www.cursor.so/favicon.ico',
    description: 'AI-powered code editor built for pair programming',
    category: 'coding'
  },
  {
    name: 'Windsurf',
    url: 'https://windsurf.ai/',
    iconUrl: 'https://windsurf.ai/favicon.ico',
    description: 'AI-assisted code generation and refactoring',
    category: 'coding'
  },
  {
    name: 'Trae',
    url: 'https://www.trae.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=trae.ai',
    description: 'AI programming assistant for developers',
    category: 'coding'
  },
  {
    name: 'V0',
    url: 'https://v0.dev/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=v0.dev',
    description: 'AI-powered UI component generation from text descriptions',
    category: 'coding'
  },
  {
    name: 'Bolt',
    url: 'https://bolt.new/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=bolt.new',
    description: 'AI-powered web development platform',
    category: 'coding'
  },
  {
    name: 'Lovable',
    url: 'https://lovable.dev/',
    iconUrl: 'https://lovable.dev/favicon.ico',
    description: 'AI-assisted software development platform',
    category: 'coding'
  },
  {
    name: 'Replit',
    url: 'https://replit.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=replit.com',
    description: 'Online IDE with AI coding assistance',
    category: 'coding'
  },
  {
    name: 'Rork',
    url: 'https://rork.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=rork.ai',
    description: 'AI pair programming assistant',
    category: 'coding'
  },
  {
    name: 'Codev',
    url: 'https://www.co.dev/',
    iconUrl: 'https://www.co.dev/favicon.ico',
    description: 'AI coding assistant for developers',
    category: 'coding'
  },
  {
    name: 'Reweb',
    url: 'https://www.reweb.so/',
    iconUrl: 'https://www.reweb.so/favicon.ico',
    description: 'AI-powered web development automation',
    category: 'coding'
  },

  // Visualization/PPT Tools
  {
    name: 'Claude',
    url: 'https://claude.ai/',
    iconUrl: 'https://claude.ai/favicon.ico',
    description: 'Advanced AI assistant with strong reasoning capabilities',
    category: 'visualization'
  },
  {
    name: 'Gamma',
    url: 'https://gamma.app/',
    iconUrl: 'https://gamma.app/favicon.ico',
    description: 'AI-powered presentation creation platform',
    category: 'visualization'
  },
  {
    name: 'Canva',
    url: 'https://www.canva.com/',
    iconUrl: 'https://www.canva.com/favicon.ico',
    description: 'Design platform with AI-powered features',
    category: 'visualization'
  },
  {
    name: 'Napkin',
    url: 'https://www.napkin.ai/',
    iconUrl: 'https://www.napkin.ai/favicon.ico',
    description: 'Visual thinking and ideation platform',
    category: 'visualization'
  },
  {
    name: 'Felo',
    url: 'https://felo.ai/search',
    iconUrl: 'https://felo.ai/favicon.ico',
    description: 'Research assistant for information gathering and synthesis',
    category: 'visualization'
  },
  {
    name: 'Mapify',
    url: 'https://mapify.so/',
    iconUrl: 'https://mapify.so/favicon.ico',
    description: 'AI-powered mind mapping and visualization tool',
    category: 'visualization'
  },
  {
    name: 'AIPPT',
    url: 'https://www.aippt.com/',
    iconUrl: 'https://www.aippt.com/favicon.ico',
    description: 'AI presentation generation from text prompts',
    category: 'visualization'
  },

  // Image Editing Tools
  {
    name: 'Leonardo',
    url: 'https://leonardo.ai/',
    iconUrl: 'https://leonardo.ai/favicon.ico',
    description: 'AI image generation platform with advanced editing',
    category: 'image-editing'
  },
  {
    name: 'AI Studio',
    url: 'https://aistudio.google.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com',
    description: 'Google\'s platform for AI image creation and editing',
    category: 'image-editing'
  },
  {
    name: 'Photoshop',
    url: 'https://www.adobe.com/products/photoshop.html',
    iconUrl: 'https://www.adobe.com/favicon.ico',
    description: 'Industry-standard image editing with AI features',
    category: 'image-editing'
  },
  {
    name: 'Magnific',
    url: 'https://magnific.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=magnific.ai',
    description: 'AI image enhancement and upscaling tool',
    category: 'image-editing'
  },
  {
    name: 'Firefly',
    url: 'https://firefly.adobe.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=firefly.adobe.com',
    description: 'Adobe\'s AI image generation and editing tool',
    category: 'image-editing'
  },
  {
    name: 'Scenario',
    url: 'https://scenario.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=scenario.com',
    description: 'AI image generation for gaming and creative contexts',
    category: 'image-editing'
  },
  {
    name: 'Playground',
    url: 'https://playgroundai.com/',
    iconUrl: 'https://playgroundai.com/favicon.ico',
    description: 'AI image generation playground with various models',
    category: 'image-editing'
  },
  {
    name: 'Microsoft Designer',
    url: 'https://designer.microsoft.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=designer.microsoft.com',
    description: 'AI-powered design tool for creating visuals',
    category: 'image-editing'
  },

  // Meeting Notes/Recording Tools
  {
    name: 'Clova Note',
    url: 'https://clovanote.naver.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=clovanote.naver.com',
    description: 'AI meeting assistant and transcription tool',
    category: 'meeting-notes'
  },
  {
    name: 'Tiro',
    url: 'https://tiro.ooo/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=tiro.ooo',
    description: 'AI meeting transcription and summarization',
    category: 'meeting-notes'
  },
  {
    name: 'Felo',
    url: 'https://felo.ai/search',
    iconUrl: 'https://felo.ai/favicon.ico',
    description: 'Research assistant for information gathering and synthesis',
    category: 'meeting-notes'
  },
  {
    name: 'Notta',
    url: 'https://notta.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=notta.ai',
    description: 'AI transcription for meetings and recordings',
    category: 'meeting-notes'
  },
  {
    name: 'Notion',
    url: 'https://www.notion.so/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=notion.so',
    description: 'All-in-one workspace with AI writing assistance',
    category: 'meeting-notes'
  },
  {
    name: 'Obsidian',
    url: 'https://obsidian.md/',
    iconUrl: 'https://obsidian.md/favicon.ico',
    description: 'Knowledge base and note-taking application',
    category: 'meeting-notes'
  },

  // Web/UI/UX Design Tools
  {
    name: 'Figma',
    url: 'https://www.figma.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=figma.com',
    description: 'Collaborative design platform with AI features',
    category: 'ui-design'
  },
  {
    name: 'Ugic',
    url: 'https://ugic.ai/',
    iconUrl: 'https://cdn.wegic.ai/assets/onepage/thread/icon/49727332-8254-46af-9a2e-696aebdd8210.png?format=webp',
    description: 'AI-powered UI/UX design assistant',
    category: 'ui-design'
  },
  {
    name: 'Creatie',
    url: 'https://creatie.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=creatie.ai',
    description: 'AI-assisted design and prototyping platform',
    category: 'ui-design'
  },
  {
    name: 'Wegic',
    url: 'https://wegic.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=wegic.ai',
    description: 'AI web design generator from text descriptions',
    category: 'ui-design'
  },
  {
    name: 'Framer',
    url: 'https://www.framer.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=framer.com',
    description: 'Web design and prototyping with AI capabilities',
    category: 'ui-design'
  },
  {
    name: 'Dora',
    url: 'https://dora.run/',
    iconUrl: 'https://dora.run/favicon.ico',
    description: 'AI website builder from text prompts',
    category: 'ui-design'
  },
  {
    name: 'Uizard',
    url: 'https://uizard.io/',
    iconUrl: 'https://uizard.io/favicon.ico',
    description: 'AI-powered design to code platform',
    category: 'ui-design'
  },
  {
    name: 'Galileo',
    url: 'https://www.usegalileo.ai/explore',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=usegalileo.ai',
    description: 'AI UI/UX design assistant',
    category: 'ui-design'
  },

  // Image Generation Tools
  {
    name: 'Midjourney',
    url: 'https://www.midjourney.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=midjourney.com',
    description: 'Text-to-image AI that creates detailed visuals',
    category: 'image-generation'
  },
  {
    name: 'ImageFX',
    url: 'https://deepmind.google/models/imagen/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=deepmind.google',
    description: 'Google\'s text-to-image generation platform',
    category: 'image-generation'
  },
  {
    name: 'Grok',
    url: 'https://x.ai/grok',
    iconUrl: 'https://x.ai/favicon.ico',
    description: 'Conversational AI with real-time data access',
    category: 'image-generation'
  },
  {
    name: 'Redraft',
    url: 'https://redraft.ai/',
    iconUrl: 'https://redraft.ai/favicon.ico',
    description: 'AI image generation with iterative refinement',
    category: 'image-generation'
  },
  {
    name: 'Ideogram',
    url: 'https://ideogram.ai/',
    iconUrl: 'https://ideogram.ai/favicon.ico',
    description: 'Text-to-image AI specializing in typography',
    category: 'image-generation'
  },
  {
    name: 'Flux',
    url: 'https://flux.ai/',
    iconUrl: 'https://flux.ai/favicon.ico',
    description: 'AI image generation platform for creators',
    category: 'image-generation'
  },

  // Video Editing Tools
  {
    name: 'Capcut',
    url: 'https://www.capcut.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=capcut.com',
    description: 'All-in-one video editing platform with AI features',
    category: 'video-editing'
  },
  {
    name: 'Vrew',
    url: 'https://vrew.voyagerx.com/',
    iconUrl: 'https://vrew.voyagerx.com/favicon.ico',
    description: 'AI-powered video editing through text',
    category: 'video-editing'
  },
  {
    name: 'Veed',
    url: 'https://www.veed.io/',
    iconUrl: 'https://www.veed.io/favicon.ico',
    description: 'Online video editor with AI capabilities',
    category: 'video-editing'
  },
  {
    name: 'Invideo',
    url: 'https://invideo.io/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=invideo.io',
    description: 'AI video creation and editing platform',
    category: 'video-editing'
  },

  // AI Avatar Tools
  {
    name: 'Heygen',
    url: 'https://www.canva.com/apps/AAFSMHx80yA/heygen-ai-avatars',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=canva.com',
    description: 'AI video generation with virtual presenters',
    category: 'avatars'
  },
  {
    name: 'Synthesis',
    url: 'https://synthesis.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=synthesis.ai',
    description: 'AI avatar creation for virtual environments',
    category: 'avatars'
  },

  // Academic Research Tools
  {
    name: 'Consensus',
    url: 'https://consensus.app/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=consensus.app',
    description: 'AI search engine for scientific papers',
    category: 'academic'
  },
  {
    name: 'Notebook LM',
    url: 'https://notebooklm.google/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=notebooklm.google',
    description: 'AI-powered note-taking for researchers',
    category: 'academic'
  },
  {
    name: 'AlphaXiv',
    url: 'https://alphaxiv.org/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=alphaxiv.org',
    description: 'Repository for AI research papers',
    category: 'academic'
  },

  // AI Models
  {
    name: 'Hugging Face',
    url: 'https://huggingface.co/',
    iconUrl: 'https://huggingface.co/favicon.ico',
    description: 'Open-source platform for machine learning models',
    category: 'models'
  },
  {
    name: 'Replicate',
    url: 'https://replicate.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=replicate.com',
    description: 'Platform for running AI models in the cloud',
    category: 'models'
  },
  {
    name: 'Fal AI',
    url: 'https://fal.ai/',
    iconUrl: 'https://fal.ai/favicon.ico',
    description: 'Infrastructure for running AI models at scale',
    category: 'models'
  },
  {
    name: 'Tost AI',
    url: 'https://tost.ai/',
    iconUrl: 'https://tost.ai/favicon.ico',
    description: 'AI model deployment platform',
    category: 'models'
  },
  
  // AI Comics & Storyboard
  {
    name: 'AniFusion',
    url: 'https://www.anifusion.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=anifusion.ai',
    description: 'AI-based comic creation tool',
    category: 'storyboard'
  },
  {
    name: 'Novel AI',
    url: 'https://novelai.net/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=novelai.net',
    description: 'Story generation and novel writing AI',
    category: 'storyboard'
  },
  {
    name: 'Story Tribe',
    url: 'https://storytribeapp.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=storytribeapp.com',
    description: 'AI assistant for storytelling',
    category: 'storyboard'
  },
  
  // Automation
  {
    name: 'Make',
    url: 'https://www.make.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=make.com',
    description: 'No-code workflow automation platform',
    category: 'automation'
  },
  {
    name: 'Dify',
    url: 'https://dify.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=dify.ai',
    description: 'AI-based app automation tool',
    category: 'automation'
  },
  {
    name: 'n8n',
    url: 'https://n8n.io/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=n8n.io',
    description: 'Open-source workflow automation tool',
    category: 'automation'
  },
  {
    name: 'Zapier',
    url: 'https://zapier.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=zapier.com',
    description: 'App integration and task automation',
    category: 'automation'
  },
  
  // Voice Generation
  {
    name: 'ElevenLabs',
    url: 'https://www.elevenlabs.io/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=elevenlabs.io',
    description: 'High-quality voice generation and voice cloning',
    category: 'voice-generation'
  },
  
  // Translation
  {
    name: 'DeepL',
    url: 'https://www.deepl.com/',
    iconUrl: 'https://www.deepl.com/favicon.ico',
    description: 'Accurate AI-based translator',
    category: 'translation'
  },
  {
    name: 'Genspark',
    url: 'https://genspark.ai/',
    iconUrl: 'https://genspark.ai/favicon.ico',
    description: 'Generative AI including research and translation',
    category: 'translation'
  },
  
  // Music Generation
  {
    name: 'Suno',
    url: 'https://suno-ai.org/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=suno-ai.org',
    description: 'AI-based music generation platform',
    category: 'music-generation'
  },
  {
    name: 'Udio',
    url: 'https://www.udio.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=udio.com',
    description: 'AI composition assistant',
    category: 'music-generation'
  },
  {
    name: 'MusicFX',
    url: 'https://labs.google/fx/tools/music-fx-dj',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=labs.google',
    description: 'Google\'s AI music project',
    category: 'music-generation'
  },
  
  // Local AI
  {
    name: 'Pinokio',
    url: 'https://pinokio.computer/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=pinokio.computer',
    description: 'App installation automation and local AI environment',
    category: 'local-ai'
  },
  {
    name: 'ComfyUI',
    url: 'https://www.comfy.org/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=comfy.org',
    description: 'Workflow UI for local image generation',
    category: 'local-ai'
  },
  {
    name: 'Ollama',
    url: 'https://ollama.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=ollama.com',
    description: 'Run LLMs locally',
    category: 'local-ai'
  },
  {
    name: 'LmStudio',
    url: 'https://lmstudio.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=lmstudio.ai',
    description: 'Local LLM execution and interface',
    category: 'local-ai'
  },
  
  // Character Chatbots
  {
    name: 'Character AI',
    url: 'https://beta.character.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=character.ai',
    description: 'Platform for creating character-based chatbots',
    category: 'character-chatbot'
  },
  {
    name: 'Crack',
    url: 'https://crack.wrtn.ai/superchat',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=wrtn.ai',
    description: 'Character-based AI chatbot',
    category: 'character-chatbot'
  },
  
  // Inference AI
  {
    name: 'Groq',
    url: 'https://groq.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=groq.com',
    description: 'Ultra-fast AI inference chipset and platform',
    category: 'inference-ai'
  },
  {
    name: 'Cerebras',
    url: 'https://www.cerebras.net/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=cerebras.net',
    description: 'Large-scale AI model inference platform',
    category: 'inference-ai'
  },
  {
    name: 'Together AI',
    url: 'https://www.together.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=together.ai',
    description: 'AI model hosting and inference service',
    category: 'inference-ai'
  },
  
  // AI Agents
  {
    name: 'Manus',
    url: 'https://manus.im/guest',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=manus.im',
    description: 'AI agent multi-tool',
    category: 'ai-agent'
  },
  {
    name: 'OpenWebUI',
    url: 'https://github.com/open-webui/open-webui',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=github.com',
    description: 'Web UI for local LLMs',
    category: 'ai-agent'
  },
  {
    name: 'Transformers',
    url: 'https://huggingface.co/docs/transformers/index',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=huggingface.co',
    description: 'Hugging Face\'s model execution framework',
    category: 'ai-agent'
  },
  {
    name: 'Hunyuan / Wan 2.1',
    url: 'https://www.tencent.com/en-us/articles/2201636.html',
    iconUrl: 'https://www.tencent.com/favicon.ico',
    description: 'Tencent\'s LLM and AI platform',
    category: 'ai-agent'
  },
  
  // Utilities
  {
    name: 'Firecrawl',
    url: 'https://www.firecrawl.dev/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=firecrawl.dev',
    description: 'Real-time website analysis and summarization',
    category: 'utility'
  },
  
  // Smart College Life
  {
    name: 'Lilys AI',
    url: 'https://www.lilys.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=lilys.ai',
    description: 'Paper summarization and academic research assistant',
    category: 'college-life'
  }
];