// TODO: Replace githubUrl placeholders with individual repo URLs per project.
// liveUrl: '' - the Live Demo button will not render until a URL is provided (intentional).
export const PROJECTS = [
  {
    id: '01',
    slug: 'ai-qa-tool',
    title: 'AI Q&A Tool',
    year: '2026',
    stack: ['RAG', 'GCP', 'Next.js', 'GitHub Actions', 'Vercel', 'LangChain', 'Claude API'],
    description:
      "Durham College's first AI-powered Q&A system. Students and staff can ask questions about programs, policies, and campus life and get accurate grounded answers instead of digging through PDFs.",
    problem:
      'Students were spending too much time searching through documents and portals to find basic information. There was no central intelligent system that could answer questions accurately and point back to the source.',
    approach:
      'Built a RAG pipeline that ingests institutional documents, chunks and embeds them, retrieves the most relevant context, and generates grounded answers using the Claude API. Deployed on GCP with GitHub Actions CI/CD and 25 passing tests.',
    outcome:
      'A working Q&A system that answers domain-specific queries accurately, cites its sources, and is fast enough for real student use. Currently being extended with live web scraping to keep the knowledge base automatically updated.',
    previewImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&fm=webp',
    liveUrl: '',
    githubUrl: 'https://github.com/Retr0Rat/AI-QA-Tools.git',
    versions: [
      {
        version: 'v1.0',
        date: 'January 2026',
        title: 'Foundation',
        description:
          "Built the core RAG pipeline from scratch. Document ingestion, chunking, embedding, retrieval, and answer generation all wired together. Deployed on GCP with CI/CD and 25 passing tests. This was Durham College's first AI-powered Q&A system and the starting point for everything after.",
      },
      {
        version: 'v2.0',
        date: 'March 2026, Ongoing',
        title: 'Live Web Scraping',
        description:
          "Extended the pipeline with automatic web scraping of Durham College's public pages. The knowledge base now stays current without manual re-ingestion. Still actively being developed and improved.",
      },
      {
        version: 'v3.0',
        date: 'Future',
        title: 'Conversational Memory',
        description:
          'Adding session-aware follow-up questions using LangChain memory. Context will carry between turns so students can ask follow-ups naturally without repeating themselves.',
      },
      {
        version: 'v4.0',
        date: 'Future',
        title: 'Voice Interface',
        description:
          'Web Speech API for speech-to-text input and text-to-speech responses. No API key needed, runs natively in Chrome. Useful for accessibility and mobile use between classes.',
      },
      {
        version: 'v5.0',
        date: 'Future',
        title: 'Personalized Answers',
        description:
          'Profile selector changes the answer context based on program, year, and semester. A first-year AI student gets different answers than a second-year Cybersecurity student.',
      },
      {
        version: 'v6.0',
        date: 'Future',
        title: 'Multi-Institution Expansion',
        description:
          'Parameterized architecture so any college can deploy their own version by pointing at their public documents. Real SaaS potential.',
      },
      {
        version: 'v7.0',
        date: 'Future',
        title: 'Evaluation Layer',
        description:
          'LLM-as-judge using Ollama or Claude API scores answer quality automatically and flags low-confidence responses for human review.',
      },
    ],
  },
  {
    id: '02',
    slug: 'social-media-integrity-platform',
    title: 'Social Media Integrity Platform',
    year: '2026',
    stack: ['DistilBERT', 'Random Forest', 'MediaPipe', 'OpenCV', 'FastAPI', 'Docker', 'Chrome Extension MV3', 'AWS EC2', 'Streamlit', 'TwiBot-22'],
    description:
      'A six-person Durham College capstone project that detects bot accounts and assesses profile image risk on social media using machine learning. Built, trained, and deployed as a full system with a Chrome extension that runs live on X (Twitter).',
    problem:
      'Social media platforms are flooded with bot accounts that manipulate conversations, spread misinformation, and distort public perception. Existing tools are slow, opaque, or locked behind enterprise paywalls.',
    approach:
      'Trained a Random Forest classifier on 700,000 real accounts from the TwiBot-22 dataset. Added a MediaPipe and OpenCV profile image risk pipeline. Blended both scores into a combined bot probability using an 80/20 ensemble. Deployed on AWS EC2 with a FastAPI backend, Streamlit dashboard, and a Chrome MV3 extension that shows live risk badges on X profiles. My specific contribution was transformer fine-tuning.',
    outcome:
      'A working end-to-end system that detects bot accounts with 92.2% accuracy and shows live risk scores directly on X profiles. The Chrome extension works without any user setup once pointed at the API.',
    previewImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&fm=webp',
    liveUrl: '',
    githubUrl: 'https://github.com/subashshrestha189/misinfo-mvp.git',
    versions: [
      {
        version: 'v1.0',
        date: 'September 2025 - April 2026',
        title: 'Full System Build',
        description:
          'Six-person team. Built the complete pipeline from dataset preprocessing through model training, API deployment, Streamlit dashboard, and Chrome extension. TwiBot-22 dataset, 700,000 accounts, Random Forest with calibrated probabilities, MediaPipe face analysis, AWS EC2 deployment. Durham College AIDI1003 Capstone.',
      },
    ],
  },
  {
    id: '03',
    slug: 'fraud-detection-api',
    title: 'Fraud Detection API',
    year: '2026',
    stack: ['XGBoost', 'Python', 'FastAPI', 'Docker', 'SMOTE', 'scikit-learn', 'REST API'],
    description:
      'A machine learning API that detects fraudulent transactions in real time. Trained on heavily imbalanced data and built to be fast enough for production use.',
    problem:
      'Fraud detection on imbalanced datasets is genuinely hard. Naive models learn to ignore the minority class entirely and still score high accuracy. The real challenge is catching fraud without drowning analysts in false positives.',
    approach:
      'Used SMOTE to handle class imbalance, XGBoost as the core classifier, and tuned the decision threshold specifically for the fraud detection use case. Wrapped everything in a FastAPI REST API and containerized with Docker so it deploys anywhere.',
    outcome:
      '95.62% F1-score on the fraud class. Fast enough for real-time inference. Fully containerized and documented.',
    previewImage: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&fm=webp',
    liveUrl: '',
    githubUrl: 'https://github.com/Retr0Rat/fraud-detection-api.git',
    versions: [
      {
        version: 'v1.0',
        date: 'March 2026',
        title: 'Foundation',
        description:
          'Core XGBoost pipeline with SMOTE for class imbalance. Initial model training, threshold tuning, and baseline evaluation. Got the fraud detection working reliably before wrapping it in an API.',
      },
      {
        version: 'v2.0',
        date: 'May 2026',
        title: 'Production API',
        description:
          'Wrapped the model in FastAPI, containerized with Docker, wrote full API documentation. 95.62% F1-score. Ready for production deployment.',
      },
      {
        version: 'v3.0',
        date: 'Future',
        title: 'Real-Time Streaming',
        description:
          'Process live transaction streams instead of batch API calls. Kafka or Redis Streams ingestion, sub-second detection latency for high-volume payment systems.',
      },
      {
        version: 'v4.0',
        date: 'Future',
        title: 'Explainability Layer',
        description:
          'SHAP values per prediction showing exactly which features pushed the score toward fraud. Regulators and banks require this in production fraud systems.',
      },
      {
        version: 'v5.0',
        date: 'Future',
        title: 'Adaptive Retraining Pipeline',
        description:
          'Model retrains automatically on new flagged data on a schedule. Fraud patterns evolve constantly and a static model degrades over time without this.',
      },
      {
        version: 'v6.0',
        date: 'Future',
        title: 'Analyst Dashboard',
        description:
          'React frontend for fraud analysts. Live flagged transaction feed, severity heatmap, case management, and false positive feedback loop back into model retraining.',
      },
    ],
  },
  {
    id: '04',
    slug: 'insightboard',
    title: 'InsightBoard',
    year: '2025',
    stack: ['Tableau', 'Business Intelligence', 'Data Visualization', 'Retail Analytics'],
    description:
      'A business intelligence dashboard that turns raw retail data into clear decisions. Built to give executives and managers a single place to track what is selling, what is not, where inventory is falling short, and which customers are worth the most, without needing to touch a spreadsheet.',
    problem:
      'Retail managers were drowning in raw data with no clean way to see what actually mattered. Spreadsheets were being passed around, numbers were being misread, and decisions were getting made on gut feeling instead of evidence.',
    approach:
      'Built three interconnected Tableau dashboards over a 2,172-row retail dataset. Designed each view for a specific decision-maker, kept the UI clean enough that anyone could use it without training, and made sure every number on screen was actionable.',
    outcome:
      'Three dashboards that each answer a specific business question clearly. Executives can go from raw data to a decision in under two minutes.',
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&fm=webp',
    liveUrl: '',
    githubUrl: '',
    versions: [
      {
        version: '01',
        date: 'Placeholder 2025',
        title: 'Sales Performance Overview',
        description:
          'Tracks revenue trends over time, top performing products, and regional breakdowns. Filters by date range, category, and region. Built for the executive team to monitor overall business health at a glance.',
      },
      {
        version: '02',
        date: 'Placeholder 2025',
        title: 'Inventory Gap Analysis',
        description:
          'Highlights stock levels against sales velocity. Flags products at risk of stockout and identifies slow-moving inventory tying up capital. Operations team uses this to make restocking decisions.',
      },
      {
        version: '03',
        date: 'Placeholder 2025',
        title: 'Customer Lifetime Value',
        description:
          'Segments customers by purchase frequency, average order value, and recency. Surfaces the top 20% of customers driving 80% of revenue. Marketing uses this to decide where to focus retention spend.',
      },
    ],
  },
  {
    id: '05',
    slug: 'expense-splitter',
    title: 'Expense Splitter',
    year: '2026',
    stack: ['React', 'Vite', 'Vitest', 'TDD', 'JavaScript'],
    description:
      'A clean web app for splitting expenses in groups. Built test-first with 25 passing Vitest tests. The kind of tool you actually want to use after a trip with friends.',
    problem:
      'Splitting expenses in a group is always awkward. Someone pays for dinner, someone else pays for the hotel, and by the end nobody knows who owes what. Most apps are either too simple or too complicated for casual use.',
    approach:
      'Built test-first using Vitest TDD. Wrote the tests before the features so every split calculation is provably correct. Equal and custom split modes, running totals, clear debt summary.',
    outcome:
      '25 passing tests. A working app that handles real group expense scenarios correctly and is simple enough that anyone picks it up without explanation.',
    previewImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&fm=webp',
    liveUrl: '',
    githubUrl: 'https://github.com/Retr0Rat/expense-splitter.git',
    versions: [
      {
        version: 'v1.0',
        date: 'December 2025',
        title: 'Foundation',
        description:
          'Core splitting logic and basic React UI. The foundation of the app including component structure and initial expense management flow.',
      },
      {
        version: 'v2.0',
        date: 'February 2026',
        title: 'Final Build',
        description:
          'Complete app with Vitest TDD, 25 passing tests, equal and custom split modes, running total, and full expense management. This is the current stable version.',
      },
      {
        version: 'v3.0',
        date: 'Future',
        title: 'Accounts and Persistent History',
        description:
          'Login with email or Google, expenses saved to a database so you can come back to a group trip weeks later. Backend with Node.js and MongoDB.',
      },
      {
        version: 'v4.0',
        date: 'Future',
        title: 'Smart Settlement and Groups',
        description:
          'Named groups, invite by link, minimum transaction algorithm that calculates the fewest payments needed to settle everyone. No more 10 individual debts in a group of 5.',
      },
      {
        version: 'v5.0',
        date: 'Future',
        title: 'Receipt Scanning',
        description:
          'Photo of a bill, OCR extracts items and prices, tap who had what. Auto-splits without manual entry using Tesseract.js or Claude API vision.',
      },
      {
        version: 'v6.0',
        date: 'Future',
        title: 'React Native Mobile App',
        description:
          'Same core logic and components, native iOS and Android. Multi-currency support with live exchange rates for travel groups.',
      },
    ],
  },
  {
    id: '06',
    slug: 'selene',
    title: 'Selene',
    year: '2024',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'REST API'],
    description:
      'A boutique e-commerce platform built twice. First as a real client project during an internship, then rebuilt from scratch as a personal project using a proper modern stack. The name is new, the lessons are real.',
    problem:
      'The original client needed a working online store fast. The first version got the job done but left a lot of technical debt. Rebuilding it later was about doing it properly, not just making it work.',
    approach:
      'v1 was built during an internship for a real boutique startup client. Core layout, product listings, cart, and checkout. v2 was a complete rebuild: React frontend, Node and Express backend, MongoDB, JWT authentication, cart management, order history, and a full admin dashboard for products and inventory.',
    outcome:
      'A fully functional boutique e-commerce platform that handles real transactions, user authentication, and inventory management. Built twice and better for it.',
    previewImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&fm=webp',
    liveUrl: '',
    githubUrl: 'https://github.com/Retr0Rat/mon-amour-ecommerce.git',
    versions: [
      {
        version: 'v1.0',
        date: '2023',
        title: 'Client Build (Internship)',
        description:
          'Built for a real boutique startup client during my internship. First production website built for an actual business. Core e-commerce layout, product listings, cart, and checkout. It worked, shipped, and people used it. That part felt good.',
      },
      {
        version: 'v2.0',
        date: '2024',
        title: 'Personal Rebuild',
        description:
          'Rebuilt the whole thing properly using a modern stack. React, Node.js, Express, MongoDB, JWT authentication, cart management, order history, and an admin dashboard. The kind of rebuild you do when you know what you should have done the first time.',
      },
      {
        version: 'v3.0',
        date: 'Future',
        title: 'AI Product Recommendations',
        description:
          'Recommendation engine using purchase history and browsing behavior. Surfaces products the customer is likely to want before they go looking for them.',
      },
      {
        version: 'v4.0',
        date: 'Future',
        title: 'Multi-Vendor Marketplace',
        description:
          'Other boutiques can list their products on the same platform. Selene becomes a marketplace for independent fashion brands instead of a single store.',
      },
      {
        version: 'v5.0',
        date: 'Future',
        title: 'React Native Mobile App',
        description:
          'Native iOS and Android app with push notifications for new arrivals and sales. Same core logic, mobile-first experience.',
      },
      {
        version: 'v6.0',
        date: 'Future',
        title: 'Store Owner Analytics',
        description:
          'Revenue trends, top products, customer segments, and inventory insights all in one dashboard. Built for store owners who want data without complexity.',
      },
    ],
  },
  {
    id: '07',
    slug: 'siem-anomaly-detector',
    title: 'SIEM Anomaly Detector',
    year: '2025',
    stack: ['Isolation Forest', 'FastAPI', 'Docker', 'Python', 'scikit-learn', 'REST API'],
    description:
      'A machine learning system that finds anomalies in security event logs. Built for the kind of threats that do not match any known signature, the ones that only show up when you look at patterns instead of individual events.',
    problem:
      'Traditional SIEM tools rely on rules and known signatures. They miss novel attacks and generate huge amounts of noise. What was needed was something that could find genuinely unusual behavior without being told what to look for.',
    approach:
      'Isolation Forest for unsupervised anomaly detection on network log data. FastAPI REST API for inference, Docker for deployment. Trained to flag statistically unusual events without requiring labeled attack data.',
    outcome:
      'Macro F1 of 0.71 on the test set. A working anomaly detection API that can be pointed at any log stream and start flagging suspicious activity.',
    previewImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&fm=webp',
    liveUrl: '',
    githubUrl: 'https://github.com/Retr0Rat',
    versions: [
      {
        version: 'v1.0',
        date: '2025',
        title: 'Core Detection Pipeline',
        description:
          'Isolation Forest trained on network log data. FastAPI REST API wrapping the model, Docker containerized. Detects anomalies without needing labeled attack samples. Macro F1 of 0.71.',
      },
      {
        version: 'v2.0',
        date: 'Future',
        title: 'Threat Intelligence Layer',
        description:
          'My original idea. Enrich detected anomalies with live threat intelligence feeds: VirusTotal, AbuseIPDB, and MISP. Automatically cross-references flagged IPs, domains, and hashes against known threat databases. Turns a generic anomaly into a contextualized threat with severity scoring.',
      },
      {
        version: 'v3.0',
        date: 'Future',
        title: 'Real-Time Streaming',
        description:
          'Process live log streams instead of batch. Kafka or Redis Streams ingestion, sub-second detection latency for high-volume security operations centers.',
      },
      {
        version: 'v4.0',
        date: 'Future',
        title: 'MITRE ATT&CK Mapping',
        description:
          'Each detected anomaly automatically mapped to the closest MITRE ATT&CK technique. Gives security analysts immediate context on attack type and kill chain stage without manual lookup.',
      },
      {
        version: 'v5.0',
        date: 'Future',
        title: 'Analyst Dashboard',
        description:
          'React frontend with live anomaly feed, severity heatmap, case management, and false positive feedback loop back into model retraining. Built for real SOC analyst workflow.',
      },
    ],
  },
  {
    id: '08',
    slug: 'macrocanvas',
    title: 'MacroCanvas',
    year: '2025',
    stack: ['Next.js 14', 'TypeScript', 'Tailwind', 'Framer Motion', 'FastAPI', 'LangGraph', 'PostgreSQL', 'WebAuthn'],
    description:
      'A nutrition coaching SaaS built for dietitians and their clients. The kind of tool that makes tracking macros feel less like homework and more like having a coach in your pocket.',
    problem:
      'Most nutrition apps are built for consumers who want to log food. Dietitians need something different. They need to manage multiple clients, set individual targets, track progress over time, and communicate recommendations without switching between five different tools.',
    approach:
      'Next.js 14 App Router with TypeScript for the frontend. FastAPI and LangGraph for the AI coaching layer. PostgreSQL for data, WebAuthn passkeys for authentication. Designed for dietitians first, with a client-facing dashboard as the secondary surface.',
    outcome:
      'Core architecture built, food search wired, AI meal planning pipeline in progress. Active development with the full coaching workflow coming together.',
    previewImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&fm=webp',
    liveUrl: '',
    githubUrl: 'https://github.com/Retr0Rat',
    versions: [
      {
        version: 'v1.0',
        date: '2025',
        title: 'Foundation',
        description:
          'UI/UX design, font selection, mobile strategy, and core architecture. Basic food search wired with zero TypeScript errors. The skeleton everything else builds on.',
      },
      {
        version: 'v2.0',
        date: 'Ongoing',
        title: 'Full Coaching Platform',
        description:
          'AI meal planning via LangGraph, food database integration, macro tracking, client management dashboard, and passkey authentication. Currently in active development.',
      },
      {
        version: 'v3.0',
        date: 'Future',
        title: 'AI Coaching Conversations',
        description:
          'LangGraph agent that has ongoing dialogue with clients. Asks about energy, sleep, and stress, then adjusts macros dynamically based on responses, not just numbers.',
      },
      {
        version: 'v4.0',
        date: 'Future',
        title: 'Wearable Integration',
        description:
          "Sync with Apple Health, Google Fit, and Garmin. Nutrition recommendations adjust automatically based on actual activity data from the client's smartwatch.",
      },
      {
        version: 'v5.0',
        date: 'Future',
        title: 'Dietitian Marketplace',
        description:
          'Coaches list their services, clients browse and book sessions, payments handled in platform. Full SaaS business model with MacroCanvas as the infrastructure.',
      },
      {
        version: 'v6.0',
        date: 'Future',
        title: 'Meal Photo Logging',
        description:
          'Client photographs a meal, vision model estimates macros automatically. No manual entry needed. Claude API vision or a fine-tuned food recognition model.',
      },
    ],
  },
]
