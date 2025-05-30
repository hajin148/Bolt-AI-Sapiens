import { Tool, CategoryInfo } from '../types/Tool';

export const categories: CategoryInfo[] = [
  {
    id: 'writing',
    title: ' 글쓰기 및 프롬프트 작업',
    icon: '📝',
    description: '텍스트 생성, 글쓰기 보조, 프롬프트 엔지니어링 도구'
  },
  {
    id: 'research',
    title: ' 리서치 작업',
    icon: '🔍',
    description: '리서치, 정보 수집, 지식 탐색 도구'
  },
  {
    id: 'video-generation',
    title: ' 동영상 생성',
    icon: '🎬',
    description: 'AI 기반 동영상 생성 및 제작 도구'
  },
  {
    id: 'coding',
    title: ' 베이스 코딩',
    icon: '💻',
    description: '코드 생성 및 개발 지원 도구'
  },
  {
    id: 'visualization',
    title: ' 시각화 / PPT',
    icon: '📊',
    description: '데이터 시각화 및 프레젠테이션 제작 도구'
  },
  {
    id: 'image-editing',
    title: ' 이미지 편집',
    icon: '🖌️',
    description: 'AI 기반 이미지 편집 및 향상 도구'
  },
  {
    id: 'meeting-notes',
    title: ' 회의록 / 기록 작성',
    icon: '📝',
    description: '회의록 작성 및 음성 텍스트 변환 도구'
  },
  {
    id: 'ui-design',
    title: ' 웹/UI/UX 디자인',
    icon: '🎨',
    description: '웹, UI, UX 디자인 및 프로토타이핑 도구'
  },
  {
    id: 'image-generation',
    title: ' 이미지 생성',
    icon: '🎭',
    description: 'AI 기반 이미지 생성 도구'
  },
  {
    id: 'video-editing',
    title: ' 동영상 편집',
    icon: '🎞️',
    description: 'AI 동영상 편집 및 후반 작업 도구'
  },
  {
    id: 'avatars',
    title: ' AI 아바타',
    icon: '👤',
    description: 'AI 아바타 및 디지털 휴먼 생성 도구'
  },
  {
    id: 'academic',
    title: ' 연구 및 리서치',
    icon: '📚',
    description: '학술 연구 및 과학적 정보 탐색 도구'
  },
  {
    id: 'models',
    title: ' AI 모델',
    icon: '🧬',
    description: 'AI 모델 저장소 및 실행 플랫폼'
  },
  {
  id: 'storyboard',
  title: 'AI 만화 / 스토리보드',
  icon: '📖',
  description: 'AI를 활용한 만화 제작 및 스토리보드 생성 도구'
  },
  {
    id: 'automation',
    title: '자동화',
    icon: '⚙️',
    description: '반복 작업을 자동화해주는 AI 워크플로우 도구'
  },
  {
    id: 'voice-generation',
    title: '음성 합성',
    icon: '🗣️',
    description: '음성을 생성하고 변환하는 AI 도구'
  },
  {
    id: 'translation',
    title: '번역',
    icon: '🌐',
    description: 'AI 기반 실시간 번역 및 언어 변환 도구'
  },
  {
    id: 'music-generation',
    title: '음악 생성',
    icon: '🎵',
    description: 'AI를 통한 음악 작곡 및 편곡 도구'
  },
  {
    id: 'local-ai',
    title: '로컬 AI',
    icon: '💾',
    description: '로컬 환경에서 실행되는 오픈소스 AI 도구'
  },
  {
    id: 'character-chatbot',
    title: '캐릭터 챗봇',
    icon: '🧑‍🚀',
    description: '성격과 세계관이 있는 AI 챗봇'
  },
  {
    id: 'inference-ai',
    title: '추론 AI',
    icon: '📈',
    description: '고속 추론을 위한 AI 모델 플랫폼'
  },
  {
    id: 'ai-agent',
    title: 'AI 에이전트',
    icon: '🤖',
    description: '다양한 작업을 수행하는 AI 비서형 에이전트'
  },
  {
    id: 'utility',
    title: '유틸리티',
    icon: '🛠️',
    description: '특정 목적의 실용적인 AI 도구'
  },
  {
    id: 'college-life',
    title: '슬기로운 대학생활',
    icon: '🎓',
    description: '대학생에게 유용한 AI 도구 모음'
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
    name: '라이너',
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
    url: 'https://hailuoai.video/?utm_source=googleads&utm_medium=pmax&utm_campaign=Adsmarch_Hailuo_pmax_US_purchase_250120_bid45&gad_source=1&gad_campaignid=22237278371&gclid=CjwKCAjwi-DBBhA5EiwAXOHsGfxiupNDkKckty3khiFp1HnmCo7kemCRJbL4HEnxozumZMLVeTdh5hoCbDoQAvD_BwE',
    iconUrl: 'https://hailuoai.video/favicon.ico',
    description: 'AI video generation with advanced editing capabilities',
    category: 'video-generation'
  },
  {
    name: 'Vidu',
    url: 'https://www.vidu.com/?utm_source=google&utm_medium=pmax&utm_campaign=YM-usmixfeatures&utm_content=YMApplication-Avery-0415&gad_source=1&gad_campaignid=22287560292&gclid=CjwKCAjwi-DBBhA5EiwAXOHsGXc30IMDneiCOU350pJ_B8MeZAQwMPeX1gneSoWPko3XIYbeEZii8RoCGckQAvD_BwE',
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
    iconUrl: '	https://www.google.com/s2/favicons?sz=64&domain=v0.dev',
    description: 'AI-powered UI component generation from text descriptions',
    category: 'coding'
  },
  {
    name: 'Bolt',
    url: 'https://bolt.new/',
    iconUrl: '	https://www.google.com/s2/favicons?sz=64&domain=bolt.new',
    description: 'AI-powered web development platform',
    category: 'coding'
  },
  {
    name: 'Lovable',
    url: 'https://lovable.dev/?via=68ghkl68&gad_source=1&gad_campaignid=22087262552&gclid=CjwKCAjwi-DBBhA5EiwAXOHsGX8D-WZM1XAyFuTYjTC4h5Ba7RMGa5jb3O-bdE0XP5qFptQcZlm0fRoCorcQAvD_BwE',
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
    iconUrl: '	https://www.google.com/s2/favicons?sz=64&domain=rork.ai',
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
    iconUrl: '	https://www.reweb.so/favicon.ico',
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
    name: '클로바노트',
    url: 'https://clovanote.naver.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=clovanote.naver.com',
    description: 'AI meeting assistant and transcription tool',
    category: 'meeting-notes'
  },
  {
    name: 'Tiro',
    url: 'https://tiro.ooo/ko/',
    iconUrl: '	https://www.google.com/s2/favicons?sz=64&domain=tiro.ooo',
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
    name: '미드저니',
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
    name: '노트북LM',
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
    name: '허깅페이스',
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
  // AI 만화 / 스토리보드
  {
    name: 'AniFusion',
    url: 'https://www.anifusion.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=anifusion.ai',
    description: 'AI 기반 만화 제작 도구',
    category: 'storyboard'
  },
  {
    name: 'Novel AI',
    url: 'https://novelai.net/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=novelai.net',
    description: '스토리 생성 및 소설 작성 AI',
    category: 'storyboard'
  },
  {
    name: 'Story Tribe',
    url: 'https://storytribeapp.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=storytribeapp.com',
    description: '스토리텔링을 위한 AI 도우미',
    category: 'storyboard'
  },
  
  // 자동화
  {
    name: 'Make',
    url: 'https://www.make.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=make.com',
    description: '노코드 워크플로우 자동화 플랫폼',
    category: 'automation'
  },
  {
    name: 'Dify',
    url: 'https://dify.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=dify.ai',
    description: 'AI 기반 앱 자동화 도구',
    category: 'automation'
  },
  {
    name: 'n8n',
    url: 'https://n8n.io/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=n8n.io',
    description: '오픈소스 워크플로우 자동화 도구',
    category: 'automation'
  },
  {
    name: 'Zapier',
    url: 'https://zapier.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=zapier.com',
    description: '앱 간 연결 및 작업 자동화',
    category: 'automation'
  },
  
  // 음성 합성
  {
    name: 'ElevenLabs',
    url: 'https://www.elevenlabs.io/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=elevenlabs.io',
    description: '고품질 음성 생성 및 보이스 클로닝',
    category: 'voice-generation'
  },
  
  // 번역
  {
    name: 'DeepL',
    url: 'https://www.deepl.com/',
    iconUrl: 'https://www.deepl.com/favicon.ico',
    description: '정확한 AI 기반 번역기',
    category: 'translation'
  },
  {
    name: 'Genspark',
    url: 'https://genspark.ai/',
    iconUrl: 'https://genspark.ai/favicon.ico',
    description: '리서치 및 번역을 포함한 생성형 AI',
    category: 'translation'
  },
  
  // 음악 생성
  {
    name: 'Suno',
    url: 'https://suno-ai.org/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=suno-ai.org',
    description: 'AI 기반 음악 생성 플랫폼',
    category: 'music-generation'
  },
  {
    name: 'Udio',
    url: 'https://www.udio.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=udio.com',
    description: 'AI 작곡 도우미',
    category: 'music-generation'
  },
  {
    name: 'MusicFX',
    url: 'https://labs.google/fx/tools/music-fx-dj',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=labs.google',
    description: 'Google의 AI 음악 프로젝트',
    category: 'music-generation'
  },
  
  // 로컬 AI
  {
    name: 'Pinokio',
    url: 'https://pinokio.computer/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=pinokio.computer',
    description: '앱 설치 자동화 및 로컬 AI 환경',
    category: 'local-ai'
  },
  {
    name: 'ComfyUI',
    url: 'hhttps://www.comfy.org/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=comfy.org',
    description: '로컬 이미지 생성용 워크플로우 UI',
    category: 'local-ai'
  },
  {
    name: 'Ollama',
    url: 'https://ollama.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=ollama.com',
    description: '로컬에서 LLM 실행 가능',
    category: 'local-ai'
  },
  {
    name: 'LmStudio',
    url: 'https://lmstudio.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=lmstudio.ai',
    description: '로컬 LLM 실행 및 인터페이스',
    category: 'local-ai'
  },
  
  // 캐릭터 챗봇
  {
    name: '캐릭터AI',
    url: 'https://beta.character.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=character.ai',
    description: '성격 있는 캐릭터 챗봇 생성 플랫폼',
    category: 'character-chatbot'
  },
  {
    name: '크랙',
    url: 'https://crack.wrtn.ai/superchat',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=wrtn.ai',
    description: '한국형 캐릭터 기반 AI 챗봇',
    category: 'character-chatbot'
  },
  
  // 추론 AI
  {
    name: 'Groq',
    url: 'https://groq.com/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=groq.com',
    description: '초고속 AI 추론 칩셋 및 플랫폼',
    category: 'inference-ai'
  },
  {
    name: 'Cerebras',
    url: 'https://www.cerebras.net/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=cerebras.net',
    description: '대규모 AI 모델 추론 플랫폼',
    category: 'inference-ai'
  },
  {
    name: 'Together AI',
    url: 'https://www.together.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=together.ai',
    description: 'AI 모델 호스팅 및 추론 서비스',
    category: 'inference-ai'
  },
  
  // AI 에이전트
  {
    name: 'Manus',
    url: 'https://manus.im/guest',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=manus.im',
    description: 'AI 에이전트 멀티 툴',
    category: 'ai-agent'
  },
  {
    name: 'OpenWebUI',
    url: 'https://github.com/open-webui/open-webui',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=github.com',
    description: '로컬 LLM용 Web UI',
    category: 'ai-agent'
  },
  {
    name: 'Transformers',
    url: 'https://huggingface.co/docs/transformers/index',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=huggingface.co',
    description: 'Hugging Face의 모델 실행 프레임워크',
    category: 'ai-agent'
  },
  {
    name: 'Hunyuan / Wan 2.1',
    url: 'https://www.tencent.com/en-us/articles/2201636.html',
    iconUrl: 'https://www.tencent.com/favicon.ico',
    description: 'Tencent의 LLM 및 AI 플랫폼',
    category: 'ai-agent'
  },
  
  // 유틸리티
  {
    name: 'Firecrawl',
    url: 'https://www.firecrawl.dev/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=firecrawl.dev',
    description: '웹사이트를 실시간 분석하고 요약',
    category: 'utility'
  },
  
  // 슬기로운 대학생활
  {
    name: 'Lilys AI',
    url: 'https://www.lilys.ai/',
    iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=lilys.ai',
    description: '논문 정리 및 대학 리서치 도우미',
    category: 'college-life'
  }

];