export type StackCategory = 'ml-ai' | 'frontend' | 'backend' | 'automation'

export type StackItem = {
  name: string
  category: StackCategory
  context: string // one line: how YOU actually used it, not a generic description
  iconPath: string // update to wherever the icon assets actually live in /public
}

// context fields marked [[fill in]] are placeholders — write the real one-liner,
// don't leave a generic tool description, it'll read as filler on the grid.
export const stack: StackItem[] = [
  // ML / AI
  { name: 'Python', category: 'ml-ai', context: '[[fill in]]', iconPath: '/icons/python.svg' },
  { name: 'PyTorch', category: 'ml-ai', context: '[[fill in]]', iconPath: '/icons/pytorch.svg' },
  { name: 'Scikit-Learn', category: 'ml-ai', context: '[[fill in]]', iconPath: '/icons/sklearn.svg' },
  { name: 'XGBoost', category: 'ml-ai', context: 'Ensemble classifier research', iconPath: '/icons/xgboost.svg' },
  { name: 'SHAP', category: 'ml-ai', context: 'Feature attribution & XAI', iconPath: '/icons/shap.svg' },
  { name: 'FLAML', category: 'ml-ai', context: '[[fill in]]', iconPath: '/icons/flaml.svg' },
  { name: 'Optuna', category: 'ml-ai', context: '[[fill in]]', iconPath: '/icons/optuna.svg' },
  { name: 'SMOTE', category: 'ml-ai', context: '[[fill in]]', iconPath: '/icons/smote.svg' },
  { name: 'Pandas', category: 'ml-ai', context: '[[fill in]]', iconPath: '/icons/pandas.svg' },
  { name: 'Pydantic', category: 'ml-ai', context: '[[fill in]]', iconPath: '/icons/pydantic.svg' },
  { name: 'LangGraph', category: 'ml-ai', context: 'Multi-agent swarm orchestration', iconPath: '/icons/langgraph.svg' },
  { name: 'Gemini API', category: 'ml-ai', context: '[[fill in]]', iconPath: '/icons/gemini.svg' },
  { name: 'NumPy', category: 'ml-ai', context: '[[fill in]]', iconPath: '/icons/numpy.svg' },
  // Frontend
  { name: 'Next.js', category: 'frontend', context: '[[fill in]]', iconPath: '/icons/nextjs.svg' },
  { name: 'React', category: 'frontend', context: '[[fill in]]', iconPath: '/icons/react.svg' },
  { name: 'TypeScript', category: 'frontend', context: '[[fill in]]', iconPath: '/icons/typescript.svg' },
  { name: 'Tailwind CSS', category: 'frontend', context: '[[fill in]]', iconPath: '/icons/tailwind.svg' },
  { name: 'Zustand', category: 'frontend', context: '[[fill in]]', iconPath: '/icons/zustand.svg' },
  { name: 'Flutter', category: 'frontend', context: '[[fill in]]', iconPath: '/icons/flutter.svg' },
  // Backend
  { name: 'FastAPI', category: 'backend', context: '[[fill in]]', iconPath: '/icons/fastapi.svg' },
  { name: 'Supabase', category: 'backend', context: '[[fill in]]', iconPath: '/icons/supabase.svg' },
  { name: 'Redis', category: 'backend', context: '[[fill in]]', iconPath: '/icons/redis.svg' },
  { name: 'MySQL', category: 'backend', context: '[[fill in]]', iconPath: '/icons/mysql.svg' },
  { name: 'PostgreSQL (pgvector)', category: 'backend', context: 'Hybrid vector + relational ranking', iconPath: '/icons/postgresql.svg' },
  { name: 'Firestore', category: 'backend', context: '[[fill in]]', iconPath: '/icons/firestore.svg' },
  { name: 'Stripe', category: 'backend', context: '[[fill in]]', iconPath: '/icons/stripe.svg' },
  { name: 'Cloud Run', category: 'backend', context: '[[fill in]]', iconPath: '/icons/cloudrun.svg' },
  // Automation
  { name: 'n8n', category: 'automation', context: 'Workflow automation', iconPath: '/icons/n8n.svg' },
  { name: 'Google Workspace APIs', category: 'automation', context: '[[fill in]]', iconPath: '/icons/google-workspace.svg' },
  { name: 'LangSmith', category: 'automation', context: '[[fill in]]', iconPath: '/icons/langsmith.svg' },
  { name: 'Android Studio', category: 'automation', context: '[[fill in]]', iconPath: '/icons/android-studio.svg' },
]
