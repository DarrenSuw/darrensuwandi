export type StackCategory = 'ml-ai' | 'frontend' | 'backend' | 'automation'

export type StackItem = {
  name: string
  category: StackCategory
  context: string // one line: how YOU actually used it, not a generic description
  iconPath: string // update to wherever the icon assets actually live in /public
}

export const stack: StackItem[] = [
  // ML / AI
  { name: 'Python', category: 'ml-ai', context: 'Primary research and backend language', iconPath: '/icons/python.svg' },
  { name: 'PyTorch', category: 'ml-ai', context: 'Deep learning framework for ML research', iconPath: '/icons/pytorch.svg' },
  { name: 'Scikit-Learn', category: 'ml-ai', context: 'Baseline models and ML preprocessing pipelines', iconPath: '/icons/sklearn.svg' },
  { name: 'XGBoost', category: 'ml-ai', context: 'Ensemble classifier research', iconPath: '/icons/xgboost.svg' },
  { name: 'SHAP', category: 'ml-ai', context: 'Feature attribution & XAI', iconPath: '/icons/shap.svg' },
  { name: 'FLAML', category: 'ml-ai', context: 'AutoML tuning for WhatIf Forecaster', iconPath: '/icons/flaml.svg' },
  { name: 'Optuna', category: 'ml-ai', context: 'Hyperparameter optimization for research models', iconPath: '/icons/optuna.svg' },
  { name: 'SMOTE', category: 'ml-ai', context: 'Class imbalance handling for defect detection data', iconPath: '/icons/smote.svg' },
  { name: 'Pandas', category: 'ml-ai', context: 'Data wrangling across every ML pipeline', iconPath: '/icons/pandas.svg' },
  { name: 'Pydantic', category: 'ml-ai', context: 'Schema validation for Startup EMP risk models', iconPath: '/icons/pydantic.svg' },
  { name: 'LangGraph', category: 'ml-ai', context: 'Multi-agent swarm orchestration', iconPath: '/icons/langgraph.svg' },
  { name: 'Gemini API', category: 'ml-ai', context: 'LLM backbone for Resume Forge editor and KerjaCerdas', iconPath: '/icons/gemini.svg' },
  { name: 'NumPy', category: 'ml-ai', context: 'Numerical computing foundation across ML projects', iconPath: '/icons/numpy.svg' },
  // Frontend
  { name: 'Next.js', category: 'frontend', context: 'Frontend framework across every shipped product', iconPath: '/icons/nextjs.svg' },
  { name: 'React', category: 'frontend', context: 'Component layer for all web frontends', iconPath: '/icons/react.svg' },
  { name: 'TypeScript', category: 'frontend', context: 'Type safety across every frontend project', iconPath: '/icons/typescript.svg' },
  { name: 'Tailwind CSS', category: 'frontend', context: 'Styling system across every frontend', iconPath: '/icons/tailwind.svg' },
  { name: 'Zustand', category: 'frontend', context: 'State management in Resume Forge', iconPath: '/icons/zustand.svg' },
  { name: 'Flutter', category: 'frontend', context: 'Mobile development for StudyBuddy', iconPath: '/icons/flutter.svg' },
  // Backend
  { name: 'FastAPI', category: 'backend', context: 'Backend API layer for Resume Forge', iconPath: '/icons/fastapi.svg' },
  { name: 'Supabase', category: 'backend', context: 'Auth and persistence for Resume Forge', iconPath: '/icons/supabase.svg' },
  { name: 'Redis', category: 'backend', context: 'Caching layer for Resume Forge', iconPath: '/icons/redis.svg' },
  { name: 'MySQL', category: 'backend', context: 'Worker availability queries and job scheduling for AskA Automation', iconPath: '/icons/mysql.svg' },
  { name: 'PostgreSQL (pgvector)', category: 'backend', context: 'Hybrid vector + relational ranking', iconPath: '/icons/postgresql.svg' },
  { name: 'Firestore', category: 'backend', context: 'Document store for Startup EMP on Cloud Run', iconPath: '/icons/firestore.svg' },
  { name: 'Stripe', category: 'backend', context: 'Billing and subscription management for Resume Forge', iconPath: '/icons/stripe.svg' },
  { name: 'Cloud Run', category: 'backend', context: 'Serverless deployment for Startup EMP backend', iconPath: '/icons/cloudrun.svg' },
  // Automation
  { name: 'n8n', category: 'automation', context: 'Workflow automation', iconPath: '/icons/n8n.svg' },
  { name: 'Google Workspace APIs', category: 'automation', context: 'Automation workflows for AskA at XMUM MQA', iconPath: '/icons/google-workspace.svg' },
  { name: 'LangSmith', category: 'automation', context: 'Tracing and eval for LangGraph agent pipelines', iconPath: '/icons/langsmith.svg' },
  { name: 'Android Studio', category: 'automation', context: 'Android development environment for StudyBuddy', iconPath: '/icons/android-studio.svg' },
]
