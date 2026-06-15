import { CONTACT } from './constants'

export const RESPONSES = [
  {
    keywords: ['who', 'about', 'yourself', 'background', 'from', 'origin', 'indian', 'canada'],
    response: "I'm Aman Bansal, a full-stack developer and AI engineer originally from India, now based in Oshawa, Ontario, Canada. I'm a perfectionist who takes pride in building things properly. I completed dual post-graduate certificates in Cybersecurity and AI at Durham College, on top of 4+ years of full-stack development experience. I work at the intersection of machine learning, cybersecurity, and scalable software.",
  },
  {
    keywords: ['favourite', 'favorite', 'best', 'proud', 'impressive', 'coolest'],
    response: "My favourite is the Social Media Integrity Platform. A six-person Durham College capstone where I contributed transformer fine-tuning to a system that detects bot accounts using a Random Forest trained on 700,000 real accounts from TwiBot-22. We built the whole thing end to end: FastAPI backend, Streamlit dashboard, AWS EC2 deployment, and a Chrome extension that shows live risk scores on X profiles. It is the project that pushed me hardest and the one I am most proud of.",
  },
  {
    keywords: ['project', 'built', 'work', 'portfolio', 'demo', 'github', 'code'],
    response: `I have shipped 8 projects so far. The Social Media Integrity Platform is my favourite, a six-person capstone where we built a bot detection system trained on 700,000 real social media accounts. I also built an AI Q&A Tool for Durham College using RAG on GCP, a Fraud Detection API hitting 95.62% F1-score, a SIEM Anomaly Detector for security log analysis, InsightBoard for retail BI in Tableau, Expense Splitter with full TDD, MacroCanvas which is a nutrition coaching SaaS I am actively building, and Selene, a boutique e-commerce platform I built twice. Check GitHub: ${CONTACT.githubDisplay}`,
  },
  {
    keywords: ['skill', 'tech', 'stack', 'language', 'framework', 'know', 'use', 'tools', 'experience'],
    response: "I'm strongest in: React, Node.js, Python, and TypeScript on the dev side. For AI/ML: PyTorch, scikit-learn, HuggingFace, LangChain, and RAG pipelines. Cloud: GCP and AWS. Security: network fundamentals, OWASP, threat modelling. I'm also comfortable with Docker, GitHub Actions CI/CD, PostgreSQL, and MongoDB.",
  },
  {
    keywords: ['hire', 'available', 'job', 'role', 'position', 'opportunity', 'open', 'looking', 'fulltime', 'full-time', 'recruit'],
    response: `Yes, I'm actively looking for full-time roles in AI, cybersecurity, or full-stack development within Ontario. I'm open to remote, hybrid, or onsite. Available to start immediately. If you have a role in mind, reach me at ${CONTACT.email} or connect on LinkedIn.`,
  },
  {
    keywords: ['contact', 'reach', 'email', 'linkedin', 'connect', 'message', 'talk', 'meeting'],
    response: `Best ways to reach me:\n📧 ${CONTACT.email}\n💼 ${CONTACT.linkedinDisplay}\n🐙 ${CONTACT.githubDisplay}\nOr just use the Connect page on this site!`,
  },
  {
    keywords: ['education', 'degree', 'college', 'durham', 'study', 'graduate', 'certificate', 'school'],
    response: "I have a Bachelor's in Computer Applications from GL Bajaj Institute in India, and two Post-Graduate Certificates from Durham College in Oshawa: one in Cybersecurity, one in AI (graduating 2026). Durham is where I really levelled up. The AI program pushed me into real ML engineering, not just theory.",
  },
  {
    keywords: ['where', 'location', 'based', 'city', 'oshawa', 'ontario', 'gta'],
    response: "I'm based in Oshawa, Ontario, right in the GTA corridor. I'm targeting roles within Ontario but open to remote anywhere in Canada.",
  },
]

export const FALLBACK = "Hmm, I'm not sure about that one. Try asking about my projects, skills, background, or how to hire me. Or just head to the Connect page and message me directly!"
