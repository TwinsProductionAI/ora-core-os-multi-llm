/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Settings, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  Send, 
  Copy, 
  Download,
  Info,
  Shield,
  ShieldCheck,
  Cpu,
  Layout,
  Menu,
  X,
  Search,
  RefreshCw,
  AlertTriangle,
  Lock,
  Zap,
  Code2,
  Plus,
  User,
  BookOpen,
  Bell,
  ExternalLink,
  TrendingUp,
  Activity,
  Package,
  Maximize2,
  Trash2,
  Database,
  BarChart3,
  HardDrive,
  Check,
  Network,
  Link2,
  ShieldAlert,
  Layers,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  Server,
  Terminal
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  AppState,
  ChatMessage,
  Artifacts,
  PlanId,
  UserProfile,
  CustomModule,
  Module,
  Capability,
  InstallationRecipe,
  OraDbFile,
  OraDbSummary,
  OraPack
} from './types';
import { fetchFromApi } from './services/api';

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false
}: { 
  children: React.ReactNode; 
  onClick?: (e: any) => void; 
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline';
  className?: string;
  disabled?: boolean;
}) => {
  const base = "px-4 py-2 rounded font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100 uppercase tracking-wide text-xs";
  const variants = {
    primary: "bg-orange-600 text-white shadow-lg hover:bg-orange-500",
    secondary: "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700",
    tertiary: "bg-slate-900/50 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-slate-800/50",
    outline: "bg-transparent border border-slate-700 text-slate-300 hover:border-orange-500/50 hover:text-white",
    ghost: "bg-transparent text-slate-500 hover:text-slate-300"
  };
  
  return (
    <button 
      onClick={onClick} 
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const SparkleIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

const Card = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void; key?: string | number }) => (
  <div 
    onClick={onClick}
    className={`bg-slate-900 border border-brand-border rounded-xl p-5 transition-all ${onClick ? 'cursor-pointer hover:border-brand-accent/50' : ''} ${className}`}
  >
    {children}
  </div>
);

const ModulesGraph = ({ 
  modules, 
  selectedIds = [], 
  onToggle 
}: { 
  modules: Module[], 
  selectedIds?: string[], 
  onToggle?: (id: string) => void 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="w-full bg-slate-950/50 border border-brand-border rounded-xl p-8 mb-10 overflow-hidden relative min-h-[600px] shadow-2xl">
        <div className="absolute top-6 left-6 z-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-2">
            <Network className="w-4 h-4" /> Graphique d'Infrastructure Sémantique
          </h3>
          <p className="text-[10px] text-slate-500 italic">Visualisation interactive des dépendances du Kernel.</p>
        </div>

        <div className="absolute top-6 right-6 z-10 flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Actif</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Vecteur</span>
           </div>
        </div>

        {/* MESH BACKGROUND */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
           <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#grid)" opacity="0.2" />
        </svg>

        <div className="relative h-full flex flex-wrap justify-center items-center gap-12 py-16">
           {modules.map((m) => {
             const deps = m.dependencies || [];
             const isSelected = selectedIds.includes(m.id);
             return (
               <motion.div 
                 key={m.id}
                 whileHover={{ scale: 1.1, zIndex: 100 }}
                 onClick={() => onToggle && onToggle(m.id)}
                 className={`relative group w-36 h-36 flex flex-col items-center justify-center p-5 bg-slate-900 border rounded-3xl shadow-2xl cursor-pointer transition-all ${
                    isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-slate-900' : 'border-slate-800 hover:border-brand-accent'
                 }`}
               >
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-[14px] mb-3 border transform transition-transform group-hover:rotate-12 ${
                   isSelected ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.5)]' :
                   m.rarity === 'MYTHIC' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                   m.rarity === 'LEGENDARY' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                   m.rarity === 'EXOTIC' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                   m.rarity === 'EPIC' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' :
                   'bg-slate-800 text-slate-500 border-slate-700'
                 }`}>
                   {m.glyph || m.nanoEssence.slice(0, 2)}
                 </div>
                 <span className={`text-[10px] font-black text-center uppercase leading-tight line-clamp-2 px-2 ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>{m.publicName}</span>
                 
                 {deps.length > 0 && (
                   <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {deps.map((depId, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,1)]' : 'bg-slate-700'}`}></div>
                      ))}
                   </div>
                 )}
                 
                 {/* TOOLTIP OVERLAY */}
                 <div className="absolute inset-x-[-50px] bottom-[-130px] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
                    <div className="bg-slate-900 border border-emerald-500/50 p-5 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl text-left border-t-emerald-500/80">
                       <div className="flex items-center justify-between gap-3 mb-3">
                          <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">{m.publicName}</span>
                          <StatusBadge label={m.rarity || 'COMMON'} type={m.rarity === 'MYTHIC' ? 'danger' : m.rarity === 'LEGENDARY' ? 'warning' : 'accent'} />
                       </div>
                       <p className="text-[10px] text-slate-400 mb-3 leading-relaxed font-medium">{m.description}</p>
                       <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
                          <span className="text-[9px] bg-emerald-500/10 px-2 py-1 rounded text-emerald-400 font-mono border border-emerald-500/10 uppercase self-start w-auto">ESSENCE: {m.nanoEssence}</span>
                          {deps.length > 0 && (
                             <div className="flex flex-col gap-1 mt-1">
                               <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1"><Link2 className="w-3 h-3" /> {deps.length} Dépendances:</span>
                               <div className="flex flex-wrap gap-1">
                                 {deps.map(depId => {
                                   const dName = modules.find(mod => mod.id === depId)?.publicName || depId;
                                   return <span key={depId} className="text-[8px] bg-blue-500/10 px-1 border border-blue-500/20 text-blue-400 rounded-sm">{dName}</span>;
                                 })}
                               </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
               </motion.div>
             );
           })}
        </div>
    </div>
  );
};

const StatusBadge = ({ label, type = 'default' }: { label: string, type?: 'default' | 'success' | 'warning' | 'danger' | 'accent' }) => {
  const styles = {
    default: "bg-slate-800 border-slate-700 text-slate-500",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/10 border-red-500/20 text-red-400",
    accent: "bg-brand-accent/10 border-brand-accent/20 text-brand-accent"
  };
  return (
    <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border ${styles[type]}`}>
      {label}
    </span>
  );
};

const MarketChart = () => {
  const data = [
    { name: '00:00', val: 400, vol: 200 },
    { name: '04:00', val: 300, vol: 150 },
    { name: '08:00', val: 600, vol: 400 },
    { name: '12:00', val: 800, vol: 700 },
    { name: '16:00', val: 500, vol: 300 },
    { name: '20:00', val: 900, vol: 800 },
    { name: '23:59', val: 1100, vol: 950 },
  ];

  return (
    <div className="h-40 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 2" stroke="#1E293B" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 8, fill: '#64748b' }} 
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', fontSize: 10, borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
            itemStyle={{ fontSize: 9, fontWeight: 'bold' }}
            cursor={{ stroke: '#F97316', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="val" 
            stroke="#F97316" 
            fillOpacity={1} 
            fill="url(#colorVal)" 
            strokeWidth={3}
            name="Index Marché"
          />
          <Area 
            type="monotone" 
            dataKey="vol" 
            stroke="#3B82F6" 
            fillOpacity={1} 
            fill="url(#colorVol)" 
            strokeWidth={1}
            strokeDasharray="4 4"
            name="Volume Sémantique"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CreditsChart = () => {
  const data = [
    { name: 'Lun', oc: 120 },
    { name: 'Mar', oc: 450 },
    { name: 'Mer', oc: 300 },
    { name: 'Jeu', oc: 900 },
    { name: 'Ven', oc: 600 },
    { name: 'Sam', oc: 200 },
    { name: 'Dim', oc: 150 },
  ];

  return (
    <div className="h-32 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorOc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 8, fill: '#64748b' }} 
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', fontSize: 10 }}
            cursor={{ stroke: '#10B981', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="oc" 
            stroke="#10B981" 
            fillOpacity={1} 
            fill="url(#colorOc)" 
            strokeWidth={2}
            name="ORA Credits"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Screens ---

const GovernanceBundles = () => {
  const bundles = [
    {
      name: "ORA Governance Spine",
      description: "Le noyau dur pour tracer, gouverner et auditer chaque décision IA.",
      modules: ["PRIMORDIA (m22)", "HALO TraceCore (m6)", "RIME (m5)"],
      value: "High Compliance",
      icon: <ShieldCheck className="w-5 h-5 text-orange-400" />
    },
    {
      name: "Enterprise Audit Pack",
      description: "Solution complète d'auditabilité pour environnements hautement régulés.",
      modules: ["HALO TraceCore (m6)", "ORA Compiler Core (m13)", "GPL (m4)", "EcoTwin (m3)"],
      value: "Full Traceability",
      icon: <Lock className="w-5 h-5 text-emerald-400" />
    },
    {
      name: "AI Agents Governance",
      description: "Contrôlez les agents autonomes avec des barrières de sécurité immuables.",
      modules: ["PRIMORDIA (m22)", "RIME (m5)", "HALO TraceCore (m6)", "ARCH+ (m14)"],
      value: "Safety First",
      icon: <Zap className="w-5 h-5 text-brand-accent" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {bundles.map((b, idx) => (
        <Card key={idx} className="p-6 bg-slate-900/50 border-slate-800 hover:border-brand-accent/30 transition-all group">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                {b.icon}
             </div>
             <h4 className="font-bold text-sm text-white uppercase tracking-tight">{b.name}</h4>
          </div>
          <p className="text-[10px] text-slate-500 italic mb-4 leading-relaxed">{b.description}</p>
          <div className="space-y-1 mb-6">
             {b.modules.map((m, midx) => (
               <div key={midx} className="flex items-center gap-2 text-[9px] text-slate-400 font-mono">
                  <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                  {m}
               </div>
             ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
             <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">{b.value}</span>
             <Button variant="outline" className="h-7 text-[8px] px-3 font-black border-slate-700">DEPLOY PACK</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

const DashboardHome = ({ onStart, credits, userPlan, customModules, besoin }: { onStart: () => void, credits: number, userPlan: PlanId, customModules: CustomModule[], besoin: string }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'RAG_CENTER' | 'BUNDLES'>('OVERVIEW');

  return (
    <div className="max-w-6xl mx-auto px-10 py-6">
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
             <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em]">System Identity : Verified</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white mb-2 leading-none">Bonjour, <span className="text-brand-accent italic">Operator_0421</span></h1>
          <p className="text-slate-500 text-sm max-w-lg leading-relaxed font-medium">
             Optimisation du kernel terminée. Les couches de gouvernance sont prêtes pour l'audit sémantique.
          </p>
        </div>
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800 backdrop-blur-md self-start lg:self-end">
           <button 
             onClick={() => setActiveTab('OVERVIEW')}
             className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'OVERVIEW' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Overview
           </button>
           {(userPlan === PlanId.PRO_PLUS || userPlan === PlanId.ENTERPRISE) && (
             <button 
               onClick={() => setActiveTab('RAG_CENTER')}
               className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'RAG_CENTER' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 mx-2'}`}
             >
               RAG_Center
             </button>
           )}
           <button 
             onClick={() => setActiveTab('BUNDLES')}
             className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'BUNDLES' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Bundles
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'OVERVIEW' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <Card className="mb-8 p-8 border-brand-accent/20 bg-brand-accent/5 overflow-hidden">
               <div className="flex flex-col lg:flex-row gap-8">
                 <div className="lg:w-1/2">
                   <h3 className="text-xl font-black uppercase tracking-tighter text-emerald-400 mb-3 flex items-center gap-3">
                     <ShieldAlert className="w-5 h-5" /> ORA Gouvernance
                   </h3>
                   <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                     ORA Gouvernance est une couche de contrôle pour systèmes IA qui vérifie, filtre et sécurise les décisions des modèles. Elle réduit les hallucinations, améliore la cohérence et garantit des réponses fiables grâce à une gouvernance basée sur la vérité, la traçabilité et des règles modulaires. Compatible RAG, LLM et architectures modernes.
                   </p>
                   
                   <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-2">Getting Started in GitHub</h4>
                     <div className="text-xs text-slate-400 font-mono space-y-2">
                        <div className="flex items-start gap-2"><div className="w-4 h-4 rounded bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-[8px]">1</div> Install ORA Governance GitHub App</div>
                        <div className="flex items-start gap-2"><div className="w-4 h-4 rounded bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-[8px]">2</div> Connect your repository</div>
                        <div className="flex items-start gap-2"><div className="w-4 h-4 rounded bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-[8px]">3</div> Configure ORA rules (optional GPV2 modules)</div>
                        <div className="flex items-start gap-2"><div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center justify-center shrink-0 border text-[8px]">4</div> Start using @ora-governance in PRs</div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-3 border-b border-emerald-500/20 pb-2">Capabilities</h4>
                     <ul className="text-[11px] text-slate-400 space-y-2.5 font-mono">
                       <li className="flex items-start gap-1.5"><ArrowRight className="w-3 h-3 mt-0.5 text-emerald-500/50 shrink-0" /> Gouvernance des réponses IA directement dans workflows GitHub</li>
                       <li className="flex items-start gap-1.5"><ArrowRight className="w-3 h-3 mt-0.5 text-emerald-500/50 shrink-0" /> Validation automatique des outputs (réduction hallucinations)</li>
                       <li className="flex items-start gap-1.5"><ArrowRight className="w-3 h-3 mt-0.5 text-emerald-500/50 shrink-0" /> Vérification des sources dans les pipelines RAG</li>
                       <li className="flex items-start gap-1.5"><ArrowRight className="w-3 h-3 mt-0.5 text-emerald-500/50 shrink-0" /> Audit des décisions IA (traçabilité et logique)</li>
                       <li className="flex items-start gap-1.5"><ArrowRight className="w-3 h-3 mt-0.5 text-emerald-500/50 shrink-0" /> Application de règles de vérité et cohérence (ORA OS)</li>
                     </ul>
                   </div>
                   <div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-3 border-b border-brand-accent/20 pb-2">Benefits</h4>
                     <ul className="text-[11px] text-slate-400 space-y-2.5 font-mono">
                       <li><span className="text-brand-accent">Trust AI Outputs:</span> Ensures responses are fact-checked and aligned.</li>
                       <li><span className="text-brand-accent">Better Code:</span> Adds a governance layer to AI-assisted dev.</li>
                       <li><span className="text-brand-accent">Reduce Risk:</span> Prevents hallucinations in critical workflows.</li>
                       <li><span className="text-brand-accent">Full Visibility:</span> Understand why an AI made a decision.</li>
                     </ul>
                   </div>
                 </div>
               </div>
             </Card>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <Card className="lg:col-span-2 p-10 bg-gradient-to-br from-brand-panel to-[#0F172A] border-brand-border/60 overflow-hidden relative group">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-1000">
                      <Cpu className="w-96 h-96 text-brand-accent" />
                   </div>
                   <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                         <div className="flex items-center gap-4 mb-8">
                            <StatusBadge label="Kernel Live" type="success" />
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                               <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Latence: 12ms</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full">
                               <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                               <span className="text-[9px] font-black text-brand-accent uppercase tracking-widest">Aletheia Protocol Active</span>
                            </div>
                         </div>
                         <h1 className="text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
                            ORA CORE <br/> 
                            <span className="text-brand-accent">OPERATING SYSTEM</span>
                         </h1>
                         <p className="text-slate-400 max-w-lg text-sm leading-relaxed mb-10 font-medium">
                            Infrastructure de gouvernance sémantique haute-densité. <br/>
                            <span className="text-slate-200">Prêt pour l'extraction d'essence et l'optimisation de flux.</span>
                         </p>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-auto">
                         <Button onClick={onStart} className="px-12 h-14 text-sm shadow-[0_20px_50px_rgba(249,115,22,0.2)]">
                            Démarrer Session <ChevronRight className="w-4 h-4 ml-2" />
                         </Button>
                      </div>
                   </div>
                </Card>

          <div className="space-y-6">
            <Card className="p-8 flex flex-col justify-between h-full bg-slate-950/20 backdrop-blur-sm border-brand-border hover:border-brand-accent/20 transition-all">
               <div>
                  <div className="flex justify-between items-start mb-8">
                    <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                       <TrendingUp className="w-3 h-3 text-brand-accent" /> Pulse du Marché
                    </h3>
                    <div className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 font-black">
                      <TrendingUp className="w-2.5 h-2.5" /> +12%
                    </div>
                  </div>
                  <div className="space-y-1 mb-6">
                    <div className="text-3xl font-black text-white">1,240.2 <span className="text-xs text-slate-600">OC</span></div>
                    <div className="text-[9px] text-slate-500 font-mono tracking-tighter">Volume Marché Global (24h)</div>
                  </div>
                  <MarketChart />
               </div>
               <div className="mt-8 pt-6 border-t border-brand-border flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Solde Actif</span>
                     <span className="text-xl font-black text-white">{credits.toFixed(2)} <span className="text-[10px] text-emerald-400">OC</span></span>
                  </div>
                  <Button variant="tertiary" className="h-8 w-8 p-0" onClick={() => alert('Transactions Protocol: Non implémenté.')}>
                     <Plus className="w-4 h-4" />
                  </Button>
               </div>
             </Card>
          </div>
        </div>
      </motion.div>
    )}

      {activeTab === 'RAG_CENTER' && (
        <motion.div key="rag-center" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
           <ORACoreRAGDashboard />
        </motion.div>
      )}

      {activeTab === 'BUNDLES' && (
        <motion.div key="bundles" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <GovernanceBundles />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
};

const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isBot = message.role === 'ORA';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-6`}
    >
      <div className={`max-w-[85%] p-5 rounded-2xl border transition-all ${
        isBot 
          ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-xl' 
          : 'bg-brand-accent/5 border-brand-accent/20 text-white shadow-[0_0_20px_rgba(249,115,22,0.02)]'
      } relative group`}>
         {isBot && (
           <div className="absolute -top-2 -left-2 bg-brand-accent w-6 h-6 rounded flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
             <Cpu className="w-3.5 h-3.5 text-white" />
           </div>
         )}
         <div className="text-[13px] leading-relaxed font-medium">
            {message.content}
         </div>
         <div className={`text-[8px] font-mono mt-3 flex items-center gap-2 ${isBot ? 'text-slate-600' : 'text-brand-accent/40'}`}>
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="opacity-30">|</span>
            <span className="uppercase tracking-tighter">{isBot ? 'DORA_KERNEL' : 'OPERATOR_LOCAL'}</span>
         </div>
      </div>
    </motion.div>
  );
};

const ChatScreen = ({ messages, onSendMessage, onProceed }: { messages: ChatMessage[], onSendMessage: (text: string) => void, onProceed: () => void }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[75vh] flex flex-col px-6">
      <div className="mb-6 flex justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-brand-border/40 backdrop-blur-sm">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest text-white">Qualification Sémantique</span>
               <span className="text-[9px] text-slate-500 italic">Interface de dialogue direct avec le Kernel</span>
            </div>
         </div>
         {messages.length >= 2 && (
           <Button onClick={onProceed} variant="outline" className="h-8 text-[9px] px-4 border-slate-700 hover:border-brand-accent/50 group">
              Terminer l'Analyse <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
           </Button>
         )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-6 pr-4 space-y-2 scrollbar-none"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
             <MessageSquare className="w-12 h-12 mb-4" />
             <p className="text-[11px] font-black uppercase tracking-[0.2em]">Initialisez la conversation</p>
          </div>
        )}
        {messages.map((m) => <ChatMessageItem key={m.id} message={m} />)}
      </div>

      <div className="relative group">
        <div className="absolute -top-10 left-0 flex items-center gap-2 px-3 py-1 bg-slate-900 border border-brand-border rounded-t-lg border-b-0">
           <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></div>
           <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Canal Sémantique Sécurisé</span>
        </div>
        <textarea 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder="Décrivez vos besoins sémantiques (ex: 'Je veux un module pour auditer mes smart contracts avec une rigueur maximale')..."
          className="w-full bg-slate-900 border border-brand-border rounded-2xl rounded-tl-none pl-6 pr-16 py-6 text-sm focus:border-brand-accent outline-none transition-all placeholder:text-slate-700 resize-none shadow-2xl min-h-[100px]"
          rows={3}
        />
        <button 
          onClick={handleSend}
          className="absolute right-4 bottom-4 w-12 h-12 bg-brand-accent hover:bg-orange-500 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3 flex justify-between px-4">
         <span className="text-[8px] text-slate-700 uppercase font-bold tracking-widest">GrenaPrompt Protocol v2.1</span>
         <span className="text-[8px] text-slate-700 font-mono italic">Sécurisé par Kernel ORA</span>
      </div>
    </div>
  );
};

const CapabilitiesScreen = ({ selectedIds, onToggle, onFinalize, userPlan, isAdmin, userProfile, isCanonDiscovered, modules, capabilities }: { selectedIds: string[], onToggle: (id: string) => void, onFinalize: () => void, userPlan: PlanId, isAdmin: boolean, userProfile: UserProfile, isCanonDiscovered: boolean, modules: Module[], capabilities: Capability[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'NAME' | 'RARITY' | 'MARKET_VALUE' | 'DATE'>('DEFAULT');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());
  const [activeRegTab, setActiveRegTab] = useState<'PROTOCOLS' | 'SANDBOX'>('PROTOCOLS');
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [manualBesoin, setManualBesoin] = useState('');
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);

  const categories = ['ALL', 'CORE', 'REINFORCEMENT', 'EXOTIC', 'INTEGRATION'];
  const tiers = ['ALL', 'FREE', 'CREATOR', 'PRO', 'PRO_PLUS', 'ENTERPRISE'];
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSearchChange = (val: string) => {
    if (val.length <= 100) {
       // Allow alphanumerics, spaces, dashes
       const sanitized = val.replace(/[^a-zA-Z0-9\s-_\.]/g, '');
       setSearchQuery(sanitized);
    }
  };

  const handleCategoryChange = (val: string) => {
    if (categories.includes(val)) setCategoryFilter(val);
  };

  const handleTierChange = (val: string) => {
    if (tiers.includes(val)) setTierFilter(val);
  };

  const handleSortChange = (val: string) => {
    if (['DEFAULT', 'NAME', 'RARITY', 'MARKET_VALUE', 'DATE'].includes(val)) {
      setSortBy(val as any);
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString());
    }, 2000);
  };

  const handleImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      alert('SUCCESS: 12 nouveaux manifestes de modules ORA importés et mis en cache.');
      setLastSync(new Date().toLocaleTimeString());
    }, 3500);
  };

  const exportSelectedAsJson = () => {
    const selectedModules = modules.filter(m => 
      selectedIds.includes(m.id) || 
      capabilities.filter(c => selectedIds.includes(c.id)).flatMap(c => c.mappedModules).includes(m.id)
    );
    const exportData = selectedModules.map(m => ({
      id: m.id,
      name: m.publicName,
      essence: m.nanoEssence
    }));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "ora_selected_modules.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const synthesizeEssences = () => {
    const selectedModules = modules.filter(m => 
      selectedIds.includes(m.id) || 
      capabilities.filter(c => selectedIds.includes(c.id)).flatMap(c => c.mappedModules).includes(m.id)
    );
    return Array.from(new Set(selectedModules.map(m => m.nanoEssence))).join(', ');
  };

  // Global Conflict Check
  const currentSelectedModules = useMemo(() => modules.filter(m => 
    selectedIds.includes(m.id) || 
    capabilities.filter(c => selectedIds.includes(c.id)).flatMap(c => c.mappedModules).includes(m.id)
  ), [modules, selectedIds, capabilities]);

  const globalConflicts = useMemo(() => currentSelectedModules.flatMap(m => {
    return (m.conflicts || [])
      .filter(conflictId => currentSelectedModules.some(cm => cm.id === conflictId))
      .map(conflictId => {
        const causingModule = currentSelectedModules.find(cm => cm.id === conflictId);
        return {
          moduleA: m,
          moduleB: causingModule!
        };
      });
  }), [currentSelectedModules]);

  const hasGlobalConflicts = globalConflicts.length > 0;

  const filteredModules = useMemo(() => {
    let result = modules.filter(m => {
      const query = debouncedSearchQuery.toLowerCase();
      const isSecretModule = ['m22', 'm23', 'm29'].includes(m.id);
      if (isSecretModule && !isCanonDiscovered && !isAdmin) return false;
      
      if (tierFilter !== 'ALL' && m.tier !== tierFilter) return false;

      if (categoryFilter !== 'ALL') {
        const categoryGroups: Record<string, string[]> = {
          'CORE': ['reasoning', 'governance', 'protocol', 'compiler', 'architecture'],
          'REINFORCEMENT': ['strategy', 'business', 'efficiency'],
          'EXOTIC': ['creation'],
          'INTEGRATION': ['visual']
        };
        const validCats = categoryGroups[categoryFilter] || [];
        if (!validCats.includes(m.category.toLowerCase())) return false;
      }

      return m.publicName.toLowerCase().includes(query) || 
             m.description.toLowerCase().includes(query) ||
             m.tags.some(t => t.toLowerCase().includes(query)) ||
             m.nanoEssence.toLowerCase().includes(query);
    });

    if (sortBy === 'NAME') {
      result.sort((a, b) => a.publicName.localeCompare(b.publicName));
    } else if (sortBy === 'RARITY') {
      const rarityRank = { 'COMMON': 1, 'RARE': 2, 'EPIC': 3, 'LEGENDARY': 4 };
      result.sort((a, b) => (rarityRank[b.rarity || 'COMMON'] || 0) - (rarityRank[a.rarity || 'COMMON'] || 0));
    } else if (sortBy === 'MARKET_VALUE') {
      result.sort((a, b) => (b.marketValue || 0) - (a.marketValue || 0));
    }

    return result;
  }, [modules, debouncedSearchQuery, categoryFilter, tierFilter, sortBy, isCanonDiscovered, isAdmin]);

  const filteredCapabilities = useMemo(() => capabilities.filter((cap) => {
    const query = debouncedSearchQuery.toLowerCase();
    
    // Category filter
    const relatedModules = modules.filter(m => cap.mappedModules.includes(m.id));
    
    // Discovery check: Hide m22, m23, m24 unless discovered or admin
    const isSecretModule = relatedModules.some(m => ['m22', 'm23', 'm24'].includes(m.id));
    if (isSecretModule && !isCanonDiscovered && !isAdmin) return false;

    if (categoryFilter !== 'ALL') {
      if (cap.category.toUpperCase() !== categoryFilter) return false;
    }

    if (tierFilter !== 'ALL' && cap.requiredPlan !== tierFilter) return false;

    // Search query
    const inCap = cap.label.toLowerCase().includes(query) || 
                  cap.description.toLowerCase().includes(query) ||
                  cap.keywords.some(k => k.toLowerCase().includes(query));
    
    if (inCap) return true;

    return relatedModules.some(m => 
      m.publicName.toLowerCase().includes(query) || 
      m.description.toLowerCase().includes(query) ||
      m.tags.some(t => t.toLowerCase().includes(query))
    );
  }), [capabilities, modules, debouncedSearchQuery, categoryFilter, tierFilter, isCanonDiscovered, isAdmin]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Registry & Ecosystem Search</h2>
          <p className="text-slate-500 text-xs italic underline decoration-brand-accent/30 decoration-2 mb-4">
            Indexation temps-réel des repositories publics ORA GitHub Canon.
          </p>
          
          <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-800 backdrop-blur-sm self-center md:self-start">
            <button 
              onClick={() => setActiveRegTab('PROTOCOLS')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeRegTab === 'PROTOCOLS' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Protocols
            </button>
            <button 
              onClick={() => setActiveRegTab('SANDBOX')}
              className={`px-5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeRegTab === 'SANDBOX' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sandbox
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-brand-border/50">
             <div className={`w-2 h-2 rounded-full ${isSyncing || isImporting ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`}></div>
             <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
               {isSyncing ? 'Syncing...' : isImporting ? 'Importing Manifests...' : `Synced: ${lastSync}`}
             </span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleImport}
              disabled={isSyncing || isImporting}
              className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white bg-slate-800 px-3 py-2 rounded hover:bg-slate-700 transition-colors disabled:opacity-50 border border-slate-700"
            >
              <Download className={`w-3 h-3 ${isImporting ? 'animate-bounce' : ''}`} />
              Import Canon Manifests
            </button>
            <button 
              onClick={handleSync}
              disabled={isSyncing || isImporting}
              className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-accent hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              Manual Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 max-w-xl mx-auto space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Rechercher par nom, description, tag ou module essence..."
            className="w-full bg-slate-900 border border-brand-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-accent text-slate-300 transition-all placeholder:text-slate-600 shadow-inner"
          />
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
               <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest">
                  {activeRegTab === 'PROTOCOLS' ? filteredCapabilities.length : filteredModules.length} RÉSULTATS
               </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Catégorie:</span>
              <select 
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="bg-slate-900 border border-brand-border text-slate-300 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg outline-none focus:border-brand-accent transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan:</span>
              <select 
                value={tierFilter}
                onChange={(e) => handleTierChange(e.target.value)}
                className="bg-slate-900 border border-brand-border text-slate-300 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg outline-none focus:border-brand-accent transition-colors"
              >
                {tiers.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
           </div>
           {activeRegTab === 'SANDBOX' && (
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trier:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-slate-900 border border-brand-border text-slate-300 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg outline-none focus:border-brand-accent transition-colors"
                >
                  <option value="DEFAULT">Défaut</option>
                  <option value="NAME">Nom (A-Z)</option>
                  <option value="RARITY">Rareté</option>
                  <option value="MARKET_VALUE">Valeur de Marché</option>
                </select>
             </div>
           )}
           <div className="h-4 w-[1px] bg-slate-800"></div>
           <p className="text-[9px] text-slate-600 italic">Filtrage sémantique actif</p>
        </div>
      </div>

      <AnimatePresence>
        {hasGlobalConflicts && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 p-6 bg-red-950/30 border border-red-500/30 rounded-xl flex items-start gap-4 shadow-2xl backdrop-blur-md"
          >
             <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 border border-red-500/30">
                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
             </div>
             <div className="flex-1">
                <h3 className="text-sm font-black uppercase text-red-500 mb-1 tracking-widest flex items-center gap-2">
                   <ShieldAlert className="w-4 h-4" /> Alerte Critique: Collisions Sémantiques
                </h3>
                <p className="text-xs text-red-400/80 mb-4 font-mono">Le compilateur détecte des instabilités. Vous risquez des hallucinations système. Désactivation requise.</p>
                <div className="space-y-2">
                   {Array.from(new Set(globalConflicts.map(c => [c.moduleA.id, c.moduleB.id].sort().join('-')))).map(pair => {
                      const [idA, idB] = (pair as string).split('-');
                      const modA = modules.find(m => m.id === idA)!;
                      const modB = modules.find(m => m.id === idB)!;
                      return (
                        <div key={pair} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-black/40 p-3 rounded-lg border border-red-500/20">
                           <div className="flex items-center gap-3">
                              <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-[10px] text-white font-mono font-bold">{modA.publicName}</span>
                              <span className="text-red-500 font-black">× CONFLIT ×</span>
                              <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-[10px] text-white font-mono font-bold">{modB.publicName}</span>
                           </div>
                           <div className="flex gap-2">
                              <Button onClick={() => onToggle(idA)} variant="outline" className="h-7 text-[9px] border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300">Désactiver {modA.publicName}</Button>
                              <Button onClick={() => onToggle(idB)} variant="outline" className="h-7 text-[9px] border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300">Désactiver {modB.publicName}</Button>
                           </div>
                        </div>
                      );
                   })}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
         <Button onClick={exportSelectedAsJson} variant="outline" className="text-[10px] h-14 border-slate-800 hover:border-brand-accent transition-all group rounded-xl">
            <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" /> EXPORT_SELECTED_JSON
         </Button>
         <Button onClick={() => setShowSynthesis(!showSynthesis)} variant="outline" className={`text-[10px] h-14 border-slate-800 hover:border-emerald-500 transition-all rounded-xl ${showSynthesis ? 'bg-emerald-500/5 border-emerald-500' : ''}`}>
            <Zap className="w-4 h-4 mr-2" /> SYNTHESIZE_ESSENCES
         </Button>
         <Button onClick={() => setActiveRegTab(activeRegTab === 'PROTOCOLS' ? 'SANDBOX' : 'PROTOCOLS')} variant="outline" className="text-[10px] h-14 border-slate-800 hover:border-brand-accent justify-between px-5 rounded-xl group">
            <div className="flex items-center">
              <Layers className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> VIEW: {activeRegTab}
            </div>
            <ArrowRight className="w-3 h-3 opacity-50 group-hover:translate-x-1 transition-transform" />
         </Button>
         <Button onClick={onFinalize} disabled={selectedIds.length === 0 || hasGlobalConflicts} className="bg-brand-accent/20 border border-brand-accent/50 text-brand-accent hover:bg-brand-accent text-[10px] h-14 font-black transition-all rounded-xl shadow-lg">
            <Activity className="w-4 h-4 mr-2" /> EXEC_COMPILATION
         </Button>
      </div>

      <AnimatePresence>
        {showSynthesis && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mb-10 p-8 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-inner"
          >
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black uppercase text-emerald-400 tracking-widest flex items-center gap-3">
                   <Cpu className="w-5 h-5" /> Synthèse d'Essence Canonique
                </h3>
                <span className="text-[9px] font-mono font-black text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">Protocol: ORA_SYNC_v2.4</span>
             </div>
             <div className="bg-black/60 p-6 rounded-xl border border-emerald-500/20 font-mono text-emerald-400 text-[12px] leading-relaxed break-all shadow-2xl selection:bg-emerald-500/30">
                {synthesizeEssences()}
             </div>
             <p className="mt-4 text-[10px] text-slate-500 italic flex items-center gap-2">
               <Info className="w-3 h-3" />
               Cette chaîne représente la signature unique de votre configuration actuelle, prête à être injectée dans un LLM compatible ORA.
             </p>
          </motion.div>
        )}
      </AnimatePresence>

      {activeRegTab === 'PROTOCOLS' ? (
        <div className="space-y-8">
           {selectedIds.length > 0 && (
             <div className="mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><Network className="w-4 h-4" /> Graphique de Dépendances (Sélection Active)</h3>
                <div className="h-[400px]">
                  <ModulesGraph 
                    modules={modules.filter(m => {
                      const allSelectedModuleIds = capabilities.filter(c => selectedIds.includes(c.id)).flatMap(c => c.mappedModules);
                      return allSelectedModuleIds.includes(m.id) || (m.dependencies && m.dependencies.some(d => allSelectedModuleIds.includes(d)));
                    })} 
                    selectedIds={capabilities.filter(c => selectedIds.includes(c.id)).flatMap(c => c.mappedModules)}
                  />
                </div>
             </div>
           )}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
             {filteredCapabilities.map((cap) => {
              const isSelected = selectedIds.includes(cap.id);
              const isMandatory = cap.id === 'cap_foundation';
              const relatedModules = modules.filter(m => cap.mappedModules.includes(m.id));
              
              // Conflict Detection logic
              const currentSelectedModules = modules.filter(m => 
                capabilities
                  .filter(c => selectedIds.includes(c.id) && c.id !== cap.id)
                  .flatMap(c => c.mappedModules)
                  .includes(m.id)
              );
              
              const detailedConflicts = relatedModules.flatMap(m => {
                return (m.conflicts || [])
                  .filter(conflictId => currentSelectedModules.some(cm => cm.id === conflictId))
                  .map(conflictId => {
                    const causingModule = currentSelectedModules.find(cm => cm.id === conflictId);
                    return {
                      moduleInCapability: m,
                      causingModule: causingModule!
                    };
                  });
              });
  
              const hasConflict = detailedConflicts.length > 0;
              
              const planOrder = [PlanId.FREE, PlanId.CREATOR, PlanId.PRO, PlanId.ENTERPRISE];
              const isLocked = !isAdmin && planOrder.indexOf(cap.requiredPlan) > planOrder.indexOf(userPlan);
  
              const currentSelectedModuleIds = currentSelectedModules.map(m => m.id);
              const alternatives = hasConflict ? modules.filter(m => 
                relatedModules.some(rm => rm.category === m.category) && 
                !(m.conflicts || []).some(cid => currentSelectedModuleIds.includes(cid)) &&
                !relatedModules.some(rm => rm.id === m.id)
              ).slice(0, 2) : [];
  
              const professionMatch = userProfile.profession && cap.keywords.some(k => userProfile.profession.toLowerCase().includes(k.toLowerCase()));
              const needsMatch = userProfile.aiNeeds && cap.keywords.some(k => userProfile.aiNeeds.toLowerCase().includes(k.toLowerCase()));
              const isRecommended = !!(professionMatch || needsMatch);
  
              return (
                <div key={cap.id} className="relative">
                  {isMandatory && (
                    <div className="absolute -top-2 -right-2 z-20 bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
                       <ShieldCheck className="w-2 h-2" />
                       Mandatory Foundation
                    </div>
                  )}
                  {isRecommended && !isMandatory && !isSelected && !isLocked && (
                    <div className="absolute -top-2 -right-2 z-20 bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
                       <Sparkles className="w-2 h-2 fill-current" />
                       Recommended
                    </div>
                  )}
                  {isLocked && (
                    <div className="absolute inset-0 z-10 bg-slate-950/60 backdrop-blur-[1px] rounded flex flex-col items-center justify-center p-4 text-center border border-brand-border/40">
                       <Lock className="w-6 h-6 text-slate-600 mb-2" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Requiert le plan {cap.requiredPlan}</span>
                       <Button 
                         variant="primary" 
                         className="h-8 px-4 text-[10px] scale-90"
                         onClick={(e) => {
                           e.preventDefault();
                           alert(`Protocol d'upgrade vers le plan ${cap.requiredPlan} initié.`);
                         }}
                       >
                         Upgrade Now
                       </Button>
                    </div>
                  )}
                  <label 
                    className={`flex items-start p-4 rounded bg-slate-900 border transition-all cursor-pointer ${
                      isSelected 
                        ? isMandatory ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'border-brand-accent shadow-[0_0_20px_rgba(249,115,22,0.05)]' 
                        : hasConflict 
                          ? 'border-red-500/50 opacity-90' 
                          : isLocked ? 'border-brand-border grayscale pointer-events-none' : 'border-brand-border hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-1">
                       <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                         isSelected ? (isMandatory ? 'bg-blue-600 border-blue-600' : 'bg-brand-accent border-brand-accent') : 'border-slate-700 bg-slate-800'
                       }`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                       </div>
                       <input 
                        type="checkbox" 
                        checked={isSelected} 
                        disabled={isMandatory}
                        onChange={() => onToggle(cap.id)}
                        className="hidden"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wide">{cap.label}</h3>
                          {hasConflict && !isSelected && (
                            <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
                          )}
                        </div>
                        <span className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-tighter">PLAN: {cap.requiredPlan}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">{cap.description}</p>
                      
                      {hasConflict && !isSelected && (
                        <div className="mt-3 space-y-2">
                          <div className="text-[9px] text-red-400 font-bold bg-red-500/10 p-2 rounded border border-red-500/20">
                            <span className="flex items-center gap-1 mb-1 text-[10px] uppercase"><AlertTriangle className="w-3 h-3"/> Rapports de Collision</span>
                            <ul className="space-y-1 mt-2">
                              {detailedConflicts.map((conf, idx) => (
                                <li key={idx} className="flex flex-col gap-0.5 border-l border-red-500/30 pl-2 ml-1">
                                  <span className="opacity-60 text-[8px] uppercase">Module Entrant :</span>
                                  <span className="text-white font-mono">{conf.moduleInCapability.glyph || conf.moduleInCapability.publicName} [{conf.moduleInCapability.nanoEssence}]</span>
                                  <span className="opacity-60 text-[8px] uppercase mt-1">Collision avec :</span>
                                  <span className="text-red-300 font-mono italic">{conf.causingModule.glyph || conf.causingModule.publicName} [{conf.causingModule.nanoEssence}]</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {alternatives.length > 0 && (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-2 rounded">
                              <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest block mb-1">Alternatives recommandées (Compatibles) :</span>
                              <div className="flex flex-wrap gap-1">
                                {alternatives.map(alt => (
                                  <div key={alt.id} className="text-[9px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                    <span className="font-mono">{alt.nanoEssence}</span>
                                    <span>{alt.publicName}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
  
                      <div className="mt-3 pt-3 border-t border-slate-800/50 flex flex-wrap gap-1.5 relative">
                      {relatedModules.map(m => {
                        const deps = modules.filter(dm => (m.dependencies || []).includes(dm.id));
                        return (
                          <div 
                            key={m.id} 
                            className="w-full relative"
                            onMouseEnter={() => setHoveredModuleId(m.id)}
                            onMouseLeave={() => setHoveredModuleId(null)}
                          >
                            <div className="text-[9px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700/50 flex items-center justify-between gap-2 mb-1 cursor-help hover:bg-slate-700 transition-colors">
                               <div className="flex items-center gap-1">
                                 <span className="text-orange-500/70 font-mono font-bold text-[10px]">{m.glyph || m.nanoEssence}</span>
                                 <span className="font-bold">{m.publicName}</span>
                                 {m.marketValue !== undefined && (
                                    <span className="ml-1 text-emerald-500/80 font-black tracking-tighter">+{m.marketValue} OC</span>
                                 )}
                               </div>
                               <div className="flex items-center gap-2">
                                 {m.rarity && (
                                   <span className={`text-[7px] font-black uppercase px-1 rounded-sm border ${
                                     m.rarity === 'MYTHIC' ? 'text-orange-500 border-orange-500/30' :
                                     m.rarity === 'LEGENDARY' ? 'text-yellow-500 border-yellow-500/30' :
                                     m.rarity === 'EXOTIC' ? 'text-purple-500 border-purple-500/30' :
                                     m.rarity === 'EPIC' ? 'text-brand-accent border-brand-accent/30' :
                                     m.rarity === 'RARE' ? 'text-emerald-400 border-emerald-400/30' : 'text-slate-500 border-slate-700'
                                   }`}>{m.rarity}</span>
                                 )}
                                 <span className="text-[8px] opacity-40 uppercase tracking-tighter">{m.category}</span>
                               </div>
                            </div>

                            {hoveredModuleId === m.id && (
                              <div className="absolute left-0 bottom-full mb-2 z-50 w-72 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-4 animate-in fade-in zoom-in-95 duration-200">
                                 <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-sm text-white flex items-center gap-2">
                                      <span className="text-brand-accent font-mono">{m.nanoEssence}</span>
                                      {m.publicName}
                                    </div>
                                    {m.rarity && <span className="text-[8px] px-1 border rounded-sm font-black text-slate-300 border-slate-600">{m.rarity}</span>}
                                 </div>
                                 <p className="text-[10px] text-slate-400 mb-3">{m.description}</p>
                                 {deps.length > 0 && (
                                   <div>
                                     <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest block mb-1">Dépendances</span>
                                     <div className="flex flex-wrap gap-1">
                                       {deps.map(d => <span key={d.id} className="text-[8px] bg-slate-800 text-slate-300 px-1 border border-slate-700 rounded-sm">{d.publicName}</span>)}
                                     </div>
                                   </div>
                                 )}
                              </div>
                            )}

                            {deps.length > 0 && isSelected && (
                              <div className="ml-3 pl-2 border-l border-slate-800 mb-2 space-y-1">
                                 <div className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Requires Infrastructure:</div>
                                 {deps.map(d => (
                                   <div key={d.id} className="flex items-center gap-1.5 text-[9px] text-slate-500">
                                      <div className="w-1 h-1 rounded-full bg-brand-accent/40"></div>
                                      <span>{d.publicName}</span>
                                      <span className="text-orange-900/60 font-mono">[{d.nanoEssence}]</span>
                                   </div>
                                 ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </label>
              </div>
            );
          })}
         </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="space-y-8 mb-10"
        >
          <div className="mb-2">
             <ModulesGraph 
               modules={filteredModules} 
               selectedIds={selectedIds} 
               onToggle={onToggle} 
             />
          </div>

          <Card className="p-8 border-brand-accent/30 bg-slate-900/50">
             <h3 className="text-sm font-black uppercase tracking-widest text-brand-accent mb-6 flex items-center gap-2">
                <Layout className="w-5 h-5" /> Orchestrateur Manuel de Besoins
             </h3>
             <textarea 
               rows={5}
               value={manualBesoin}
               onChange={(e) => setManualBesoin(e.target.value)}
               placeholder="Entrez vos besoins techniques manuellement pour tester la configuration du Kernel..."
               className="w-full bg-slate-950 border border-brand-border rounded-xl px-6 py-4 text-sm focus:border-brand-accent outline-none transition-all placeholder:text-slate-700 font-medium mb-6 resize-none"
             />
             <div className="flex justify-between items-center bg-black/30 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Moteur d'Extraction Prêt</span>
                </div>
                 <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        const detectedCapIds = capabilities
                          .filter(cap => 
                            manualBesoin.toLowerCase().includes(cap.label.toLowerCase()) || 
                            cap.keywords.some(k => manualBesoin.toLowerCase().includes(k.toLowerCase()))
                          )
                          .map(cap => cap.id);
                        
                        const detectedModuleIds = modules
                          .filter(m => 
                            manualBesoin.toLowerCase().includes(m.publicName.toLowerCase()) || 
                            manualBesoin.toLowerCase().includes(m.nanoEssence.toLowerCase())
                          )
                          .map(m => m.id);

                        if (detectedCapIds.length > 0 || detectedModuleIds.length > 0) {
                          detectedCapIds.forEach(id => onToggle(id));
                          detectedModuleIds.forEach(id => onToggle(id));
                          alert(`Extraction réussie: ${detectedCapIds.length} capabilities et ${detectedModuleIds.length} modules isolés.`);
                        } else {
                          alert('Aucun vecteur sémantique direct détecté. Veuillez affiner votre besoin.');
                        }
                      }}
                      className="bg-brand-accent text-white px-6 h-10 text-[10px]"
                    >
                       Analyser & Mapper
                    </Button>
                    <Button 
                      onClick={onFinalize}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 h-10 text-[10px] font-black uppercase tracking-widest"
                    >
                       Générer Configuration
                    </Button>
                 </div>
              </div>
          </Card>
        </motion.div>
      )}

      <div className="flex justify-center">
        <Button onClick={onFinalize} disabled={selectedIds.length === 0 || hasGlobalConflicts} className="w-full md:w-auto px-16 py-5 text-sm uppercase font-black tracking-[0.15em] shadow-[0_10px_30px_rgba(249,115,22,0.15)] disabled:opacity-50 disabled:grayscale">
          {hasGlobalConflicts ? 'RÉSOLUTION DES CONFLITS REQUISE' : 'Compiler Artefact ORA Protocol'}
        </Button>
      </div>
    </div>
  );
};

const AdminScreen = ({ 
  onAdminAuth, 
  onApproveModule, 
  onRejectModule, 
  pendingModules,
  isAdmin 
}: { 
  onAdminAuth: (pw: string) => void | Promise<void>, 
  onApproveModule: (id: string, status: 'GRAYLIGHT' | 'GREENLIGHT') => void,
  onRejectModule: (id: string) => void,
  pendingModules: CustomModule[],
  isAdmin: boolean
}) => {
  const [password, setPassword] = useState('');
  
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 px-6">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-red-600/20 border border-red-600/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Accès Restriction ORA</h2>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">Protocole Admin God_Mode</p>
        </div>
        <Card className="p-8 border-red-600/20 bg-red-600/5">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Clé d'authentification</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Passkey..."
                className="w-full bg-slate-900 border border-brand-border rounded px-4 py-3 text-sm focus:border-red-500 outline-none transition-all"
              />
            </div>
            <Button onClick={() => onAdminAuth(password)} className="w-full bg-red-600 hover:bg-red-500 shadow-red-600/20">
              Déverrouiller le Kernel
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
            <Layout className="w-8 h-8 text-red-500" />
            Admin Control Center
          </h2>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-2">Gestion des Registres & Validation de Modules</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-red-600/10 border border-red-600/20 px-4 py-2 rounded text-red-500 text-[10px] font-black uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 animate-pulse rounded-full"></div>
              God Mode Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-800 pb-3">File d'attente de Validation ({pendingModules.length})</h3>
           
           {pendingModules.length === 0 ? (
             <div className="py-20 text-center bg-slate-900/40 border border-brand-border border-dashed rounded-xl">
                <CheckCircle className="w-10 h-10 text-slate-700 mx-auto mb-4" />
                <p className="text-xs font-black uppercase text-slate-600 tracking-widest">Aucun module en attente de review</p>
             </div>
           ) : (
             <div className="grid gap-4">
               {pendingModules.map(m => (
                 <motion.div 
                   key={m.id}
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                   className="bg-slate-900 border border-brand-border p-6 rounded-xl hover:border-red-500/30 transition-all group"
                 >
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-xs font-mono font-black text-slate-400 border border-slate-700 group-hover:border-red-500/50 group-hover:text-red-500 transition-colors">
                             {m.essence}
                          </div>
                          <div>
                             <h4 className="text-sm font-black uppercase text-white">{m.name}</h4>
                             <p className="text-[10px] text-slate-500 font-medium">Proposé le {m.proposedAt || m.date}</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded">Pending Audit</span>
                          <span className="text-[9px] font-mono text-slate-600">ID: {m.id.slice(0, 8)}</span>
                       </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed italic border-l-2 border-slate-800 pl-4">
                       "{m.description}"
                    </p>

                    <div className="bg-black/40 border border-slate-800/80 rounded-lg p-4 mb-6">
                       <div className="flex items-center gap-2 mb-3">
                          <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Auto-Scan Recommendation</span>
                       </div>
                       <div className="text-[11px] text-slate-400 font-medium leading-relaxed">
                          {m.adminRecommendation || "ANALYSE_EN_COURS : Cohérence sémantique de 94.2%. Risque de collision faible. Validation recommandée pour passage en GRAYLIGHT."}
                       </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                       <Button onClick={() => onRejectModule(m.id)} variant="outline" className="h-9 px-4 text-[10px] border-red-500/20 text-red-500 hover:bg-red-500/5 hover:border-red-500/50">
                          REJECT_MODULE
                       </Button>
                       <Button onClick={() => onApproveModule(m.id, 'GRAYLIGHT')} variant="outline" className="h-9 px-4 text-[10px] border-orange-500/30 text-orange-400 hover:bg-orange-500/5">
                          APPROVE (GRAYLIGHT)
                       </Button>
                       <Button onClick={() => onApproveModule(m.id, 'GREENLIGHT')} variant="primary" className="h-9 px-4 text-[10px] bg-emerald-600 hover:bg-emerald-500 border-none">
                          EXTRACT & GREENLIGHT
                       </Button>
                    </div>
                 </motion.div>
               ))}
             </div>
           )}
        </div>

        <div className="space-y-6">
           <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-800 pb-3">Statistiques de Gouvernance</h3>
           <Card className="p-6 bg-slate-900 border-slate-800">
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-slate-500">Stabilité du Kernel</span>
                    <span className="text-xl font-black text-emerald-500">98.4%</span>
                 </div>
                 <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '98.4%' }}></div>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-slate-500">Drift Sémantique</span>
                    <span className="text-xl font-black text-orange-500">1.2%</span>
                 </div>
                 <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" style={{ width: '1.2%' }}></div>
                 </div>
                 <div className="p-3 bg-slate-800/40 rounded mt-4">
                    <p className="text-[9px] text-slate-500 italic uppercase">Log Trace: 1,492 validations sémantiques effectuées ce jour. Aucune faille de type circular_dep détectée.</p>
                 </div>
              </div>
           </Card>

           <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-800 pb-3">Quick Actions</h3>
           <div className="grid gap-3">
              <Button onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir vider le registre expérimental ? Cette action est irréversible et effacera tous vos brouillons et modules personnalisés locaux.")) {
                  localStorage.removeItem('ORA_FORGE_DRAFT');
                  localStorage.removeItem('ORA_THEME');
                  alert('Registre vidé avec succès.');
                }
              }} variant="outline" className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10 justify-start h-12">
                 <Trash2 className="w-4 h-4 mr-3" /> WIPE_EXPERIMENTAL_REGISTRY
              </Button>
              <Button onClick={() => alert('DUMP_AUDIT : Génération des logs JSONL en cours...')} variant="outline" className="w-full text-slate-400 border-slate-800 hover:border-slate-700 justify-start h-12">
                 <FileText className="w-4 h-4 mr-3" /> EXPORT_AUDIT_TRAILS
              </Button>
              <Button onClick={() => alert('REBOOT_KERNEL : Le kernel ORA ne redémarre pas, il se transforme (Aletheia ACTIVE).')} variant="outline" className="w-full text-slate-400 border-slate-800 hover:border-slate-700 justify-start h-12">
                 <RefreshCw className="w-4 h-4 mr-3" /> RELOAD_NANO_VECTORS
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingsScreen = ({ 
  profile, 
  onUpdateProfile, 
  ownedModuleIds, 
  customModules, 
  credits, 
  modules, 
  preferences, 
  onUpdatePreferences,
  userPlan
}: { 
  profile: UserProfile, 
  onUpdateProfile: (p: UserProfile) => void, 
  ownedModuleIds: string[], 
  customModules: CustomModule[], 
  credits: number, 
  modules: Module[],
  preferences: AppState['iaOsPreferences'],
  onUpdatePreferences: (prefs: AppState['iaOsPreferences']) => void,
  userPlan: PlanId
}) => {
  const [profession, setProfession] = useState(profile.profession);
  const [aiNeeds, setAiNeeds] = useState(profile.aiNeeds);
  const [searchLibrary, setSearchLibrary] = useState('');
  const [librarySortBy, setLibrarySortBy] = useState<'DEFAULT' | 'NAME' | 'MARKET_VALUE' | 'DATE'>('DEFAULT');
  const [isSyncing, setIsSyncing] = useState(false);

  const downloadModulePack = (name: string, type: 'ZIP' | 'MD') => {
    alert(`ACCÈS PREMIUM : Téléchargement du pack ${type} pour le module "${name}" initié. Validation des crédits ORA en cours...`);
  };

  const handleSearchLibraryChange = (val: string) => {
    if (val.length <= 100) {
      const sanitized = val.replace(/[^a-zA-Z0-9\s-_\.]/g, '');
      setSearchLibrary(sanitized);
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('PROTOCOLE_SYNC_SUCCESS : Votre profil et votre bibliothèque ont été synchronisés avec le Kernel ORA_CORE_OS.');
    }, 2000);
  };

  const ownedModules = modules.filter(m => ownedModuleIds.includes(m.id));
  
  const allModules = [
    ...customModules.map(m => ({ ...m, type: 'CUSTOM', displayName: m.name, displayEssence: m.essence, marketValue: m.marketValue || 0, dateAdded: m.date || '2026-01-01' })),
    ...ownedModules.map(m => ({ ...m, type: 'OWNED', displayName: m.publicName, displayEssence: m.nanoEssence, marketValue: m.marketValue || 0, dateAdded: '2026-01-01' }))
  ];

  const filteredLibrary = allModules.filter(m => 
    m.displayName.toLowerCase().includes(searchLibrary.toLowerCase()) || 
    m.displayEssence.toLowerCase().includes(searchLibrary.toLowerCase())
  ).sort((a, b) => {
    if (librarySortBy === 'NAME') {
      return a.displayName.localeCompare(b.displayName);
    } else if (librarySortBy === 'MARKET_VALUE') {
      return (b.marketValue || 0) - (a.marketValue || 0);
    } else if (librarySortBy === 'DATE') {
      return new Date(b.dateAdded || '1970-01-01').getTime() - new Date(a.dateAdded || '1970-01-01').getTime();
    }
    return 0;
  });

  const totalLibraryValue = allModules.reduce((acc, curr) => acc + (curr.marketValue || 0), 0);

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
       <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 flex items-center gap-3">
               <User className="w-8 h-8 text-emerald-400" />
               Espace Client
            </h2>
            <p className="text-slate-500 text-sm italic">Profil : {profile.profession || 'Initialisation requise'} • Statut : Active Operator</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleSync} disabled={isSyncing} variant="outline" className="h-10 text-[10px]">
               {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2" />}
               Sync Core Protocol
            </Button>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-6 py-2 flex items-center gap-3 shadow-inner">
               <Zap className="w-5 h-5 text-brand-accent shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
               <div>
                  <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest">ORA_CREDITS</div>
                  <div className="text-xl font-black text-white">{credits.toFixed(2)}</div>
               </div>
            </div>
          </div>
       </div>

       <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <Card className="lg:col-span-2 p-8">
                <h3 className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-8 border-b border-brand-border pb-4">Configuration Sémantique</h3>
                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Quelle est votre spécialité / métier ?</label>
                      <input 
                        type="text" 
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="Ex: Architecte Cloud, UX Designer..."
                        className="w-full bg-slate-950 border border-brand-border rounded px-4 py-3 text-sm focus:border-brand-accent outline-none transition-all placeholder:text-slate-700 font-medium"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Besoins IA (Alimentation du moteur de recommandation)</label>
                      <textarea 
                        rows={4}
                        value={aiNeeds}
                        onChange={(e) => setAiNeeds(e.target.value)}
                        placeholder="Ex: Réduction de hallucinations, optimisation de tokens pour GPT-4o..."
                        className="w-full bg-slate-950 border border-brand-border rounded px-4 py-3 text-sm focus:border-brand-accent outline-none transition-all resize-none placeholder:text-slate-700 font-medium"
                      />
                   </div>
                   <Button onClick={() => onUpdateProfile({ profession, aiNeeds })} className="w-full py-4 shadow-xl">
                      Sauvegarder les Vecteurs de Profil
                   </Button>
                </div>
             </Card>

             {(userPlan === PlanId.PRO_PLUS || userPlan === PlanId.ENTERPRISE) && (
               <Card className="p-8 border-brand-accent/30 bg-brand-accent/5 overflow-hidden relative group mt-6">
                  <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Database className="w-40 h-40" />
                  </div>
                  <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
                           <Cpu className="w-5 h-5 text-brand-accent" />
                        </div>
                        <div>
                           <h3 className="text-xs font-black uppercase text-slate-200 tracking-widest">RAG Governance Compiler</h3>
                           <p className="text-[8px] text-brand-accent font-bold uppercase">Noyau de Compilation Bas-Niveau</p>
                        </div>
                     </div>
                     <p className="text-[10px] text-slate-500 mb-6 leading-relaxed">
                        Accédez aux primitives de gouvernance pour modifier la structure même de la bibliothèque sémantique locale.
                     </p>
                     <div className="space-y-3">
                        <Button variant="outline" className="w-full text-[9px] border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10">
                           <RefreshCw className="w-3 h-3" /> Re-Compiler Kernel Sémantique
                        </Button>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                           <div className="p-3 bg-black/40 rounded border border-slate-800">
                              <div className="text-[8px] text-slate-500 uppercase mb-1">Module Spécial</div>
                              <div className="text-[10px] text-white font-black truncate">ARCHITEXE_CORE</div>
                              <button className="text-[8px] text-brand-accent uppercase mt-2 font-black hover:underline">Installer</button>
                            </div>
                            <div className="p-3 bg-black/40 rounded border border-slate-800">
                              <div className="text-[8px] text-slate-500 uppercase mb-1">Audit Suite</div>
                              <div className="text-[10px] text-white font-black truncate">SOVEREIGN_AUDIT</div>
                              <button className="text-[8px] text-brand-accent uppercase mt-2 font-black hover:underline">Installer</button>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-800/50">
                           <a href="#" className="text-[9px] font-black text-slate-400 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors">
                              <ExternalLink className="w-3 h-3" /> Tutoriel d'implantation RAG
                           </a>
                        </div>
                     </div>
                  </div>
               </Card>
             )}

             <div className="space-y-6">
                <Card className="p-8 border-slate-700 bg-slate-900/50">
                   <div className="flex items-center gap-4 mb-8">
                      <Settings className="w-5 h-5 text-slate-500" />
                      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Préférences IA_OS</h3>
                   </div>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[10px] text-slate-200 uppercase font-black tracking-tight">Dark Mode</span>
                            <span className="text-[8px] text-slate-500 italic">Protocole Visuel Permanent</span>
                         </div>
                         <button 
                           onClick={() => onUpdatePreferences({ ...preferences, darkMode: !preferences.darkMode })}
                           className={`w-10 h-5 rounded-full relative transition-colors ${preferences.darkMode ? 'bg-emerald-500' : 'bg-slate-700'}`}
                         >
                            <motion.div 
                               animate={{ x: preferences.darkMode ? 20 : 2 }}
                               initial={false}
                               className="absolute top-1 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm" 
                            />
                         </button>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[10px] text-slate-200 uppercase font-black tracking-tight">Privacité Max</span>
                            <span className="text-[8px] text-slate-500 italic">Zéro télémétrie externe</span>
                         </div>
                         <button 
                           onClick={() => onUpdatePreferences({ ...preferences, maxPrivacy: !preferences.maxPrivacy })}
                           className={`w-10 h-5 rounded-full relative transition-colors ${preferences.maxPrivacy ? 'bg-emerald-500' : 'bg-slate-700'}`}
                         >
                            <motion.div 
                               animate={{ x: preferences.maxPrivacy ? 20 : 2 }}
                               initial={false}
                               className="absolute top-1 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm" 
                            />
                         </button>
                      </div>
                   </div>
                </Card>

                <Card className="p-8 border-emerald-500/20 bg-emerald-500/5">
                   <h3 className="text-[10px] font-black uppercase text-emerald-500/50 tracking-widest mb-6">Market Valuation</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-end border-b border-emerald-500/10 pb-2">
                         <span className="text-[10px] text-slate-500 italic">Valeur Totale Bibliothèque</span>
                         <span className="text-xl font-black text-emerald-400">{totalLibraryValue.toLocaleString()} <span className="text-[10px] tracking-normal">OC</span></span>
                      </div>
                      <p className="text-[9px] text-slate-600 leading-relaxed italic">"Votre bibliothèque sémantique est un actif valorisable sur le marché ORA."</p>
                   </div>
                </Card>
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                   <Layout className="w-6 h-6 text-brand-accent" />
                   Bibliothèque Sémantique
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                   <select 
                     value={librarySortBy}
                     onChange={(e) => setLibrarySortBy(e.target.value as any)}
                     className="w-full sm:w-auto bg-slate-900 border border-brand-border text-slate-300 text-xs px-3 py-2 rounded-lg outline-none focus:border-brand-accent"
                   >
                     <option value="DEFAULT">Trier par par défaut</option>
                     <option value="NAME">Nom (A-Z)</option>
                     <option value="MARKET_VALUE">Valeur (OC)</option>
                     <option value="DATE">Récents</option>
                   </select>
                   <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input 
                        type="text" 
                        value={searchLibrary} 
                        onChange={e => handleSearchLibraryChange(e.target.value)}
                        placeholder="Filtrer mes modules..."
                        className="w-full bg-slate-900 border border-brand-border rounded-lg pl-10 pr-4 py-2 text-xs focus:border-brand-accent outline-none"
                      />
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLibrary.map(mod => (
                  <Card key={mod.id} className={`p-6 flex flex-col justify-between border-brand-border/30 relative overflow-hidden group hover:border-brand-accent/30 transition-all ${mod.type === 'CUSTOM' ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-slate-900/50'}`}>
                     <div className={`absolute top-0 right-0 p-2 text-[8px] font-black text-white uppercase rounded-bl ${mod.type === 'CUSTOM' ? 'bg-emerald-500' : 'bg-brand-accent'}`}>
                        {mod.type === 'CUSTOM' ? 'CRÉÉ' : 'ACQUIS'}
                     </div>
                     <div className="flex items-start gap-4 mb-6">
                        <div className={`w-12 h-12 rounded flex items-center justify-center font-mono font-black text-lg border border-slate-700 shadow-inner ${mod.type === 'CUSTOM' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-brand-accent/10 text-brand-accent'}`}>
                           {mod.displayEssence}
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-200 text-sm mb-1 line-clamp-1">{mod.displayName}</h4>
                           <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed italic">"{mod.description}"</p>
                        </div>
                     </div>
                     
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[9px] uppercase font-black text-slate-600">
                           <span className="tracking-widest capitalize">{mod.rarity || 'Common'}</span>
                           <span className="font-mono text-emerald-400">{mod.marketValue || 0} OC</span>
                        </div>
                        {mod.type === 'CUSTOM' && (mod.complexityScore || mod.demandIndex) && (
                          <div className="flex gap-2 border-t border-slate-800 pt-2">
                             {mod.complexityScore && (
                               <div className="flex flex-col">
                                  <span className="text-[7px] text-slate-700 uppercase">Complexité</span>
                                  <span className="text-[10px] text-slate-400 font-mono">σ {mod.complexityScore}</span>
                               </div>
                             )}
                             {mod.demandIndex && (
                               <div className="flex flex-col border-l border-slate-800 pl-2">
                                  <span className="text-[7px] text-slate-700 uppercase">Demande</span>
                                  <span className="text-[10px] text-brand-accent font-mono">δ {mod.demandIndex}</span>
                               </div>
                             )}
                          </div>
                        )}
                        <div className="flex gap-2">
                           <button onClick={() => downloadModulePack(mod.displayName!, 'ZIP')} className="flex-1 bg-slate-950 border border-brand-border hover:border-brand-accent text-[8px] font-black uppercase tracking-widest py-2 rounded text-slate-500 hover:text-white transition-all">ZIP Pack</button>
                           <button onClick={() => downloadModulePack(mod.displayName!, 'MD')} className="flex-1 bg-slate-950 border border-brand-border hover:border-brand-accent text-[8px] font-black uppercase tracking-widest py-2 rounded text-slate-500 hover:text-white transition-all">MD Pack</button>
                        </div>
                     </div>
                  </Card>
                ))}

                {filteredLibrary.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-slate-900/50 border border-brand-border border-dashed rounded-xl">
                     <p className="text-slate-600 uppercase text-[10px] font-black tracking-[0.3em] mb-2">Aucun module trouvé</p>
                     <p className="text-slate-700 text-[10px] italic">"Votre bibliothèque sémantique n'a pas encore été peuplée."</p>
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};
const ORACoreRAGDashboard = () => {
  const stats = [
    { label: 'Total Indices', val: '1,429', trend: '+12%', status: 'Active' },
    { label: 'Neroflux Flux', val: '98.4%', trend: 'Optimum', status: 'Optimal' },
    { label: 'Mean Latency', val: '8.2ms', trend: '-2ms', status: 'Stable' },
    { label: 'Memory Pressure', val: '14.2 GB', trend: 'Low', status: 'Safe' },
  ];

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
             <Card key={i} className="p-6 bg-slate-900 border-slate-800 hover:border-emerald-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{s.label}</span>
                   <div className={`text-[8px] font-black px-1.5 py-0.5 rounded ${s.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-brand-accent/10 text-brand-accent'}`}>
                      {s.trend}
                   </div>
                </div>
                <div className="flex items-end justify-between">
                   <h4 className="text-2xl font-black text-white">{s.val}</h4>
                   <div className="flex items-center gap-1.5 pb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'Optimal' || s.status === 'Safe' || s.status === 'Stable' ? 'bg-emerald-500' : 'bg-brand-accent'} animate-pulse`} />
                      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">{s.status}</span>
                   </div>
                </div>
             </Card>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-8 bg-slate-900 border-slate-800">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-tight text-white">Neroflux Regulation Realtime</h3>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-[8px] font-black text-slate-500 uppercase">Input Stream</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                      <span className="text-[8px] font-black text-slate-500 uppercase">G-Context Flux</span>
                   </div>
                </div>
             </div>
             <div className="h-[300px] flex items-center justify-center border border-slate-800/50 rounded-xl bg-slate-950/50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <Activity className="w-64 h-64 text-emerald-500" />
                </div>
                <div className="relative z-10 text-center">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Retrieval Engine Active</p>
                   <p className="text-xs text-emerald-400 font-mono tracking-tighter animate-pulse">Scanning ORA_CORE_RAG_SPEC_V1.0 ...</p>
                </div>
                {/* Simulated Chart Bars */}
                <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-10 gap-2 opacity-20">
                   {[...Array(20)].map((_, i) => (
                      <div key={i} className="flex-1 bg-emerald-500 rounded-t" style={{ height: `${18 + ((i * 37) % 82)}%` }}></div>
                   ))}
                </div>
             </div>
          </Card>

          <div className="space-y-6">
             <Card className="p-6 bg-slate-900 border-slate-800 h-full">
                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-6 flex items-center gap-2">
                   <HardDrive className="w-3 h-3 text-emerald-400" /> Storage Engine (SQLite FTS5)
                </h3>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase mb-2">
                         <span>Index Volume</span>
                         <span>84%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-[84%]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase mb-2">
                         <span>Search Density</span>
                         <span>Optimal</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-brand-accent w-[62%]"></div>
                      </div>
                   </div>
                   <div className="pt-6 border-t border-slate-800">
                      <p className="text-[9px] text-slate-500 leading-relaxed font-medium">
                         "Le moteur RAG local utilise FTS5 pour une recherche plein texte ultra-rapide sur les essences de modules synchronisées."
                      </p>
                      <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-[10px] font-black py-4">Optimize DB Index</Button>
                   </div>
                </div>
             </Card>
          </div>
       </div>

       <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
             </div>
             <div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Status de Synchronization</h4>
                <p className="text-[10px] text-slate-500">Dernière synchronisation réussie il y a 8m 22s.</p>
             </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="text-[8px] h-9 border-slate-700">View Sync logs</Button>
             <Button className="text-[8px] h-9 bg-emerald-600 hover:bg-emerald-500 px-6">Force Sync Now</Button>
          </div>
       </div>
    </div>
  );
};

const SolutionsScreen = ({ onPlanSelect, currentPlan }: { onPlanSelect: (p: PlanId) => void, currentPlan: PlanId }) => {
  const plans = [
    { id: PlanId.FREE, name: 'Standard Layer', price: '0', features: ['Core Foundation Access', 'Standard Registry', 'Community Support', '500 OC / Month'] },
    { id: PlanId.CREATOR, name: 'Creative Layer', price: '19', features: ['Creative Standard Modules (CREA120, AURA-MXB, SONCAS)', 'Custom Forge Drafts', '1500 OC / Month'] },
    { id: PlanId.PRO, name: 'Pro Protocol', price: '49', features: ['Professional Architecture (ARCH+)', 'Visual Pipeline (VG+)', 'Priority Kernel Access', '3500 OC / Month'] },
    { id: PlanId.PRO_PLUS, name: 'Advanced Governance', price: '99', features: ['Full RAG Architecture', 'Neroflux Insights', 'Custom Essence Forging', 'Auto-Sync GitHub', '10,000 OC / Month'] },
    { id: PlanId.ENTERPRISE, name: 'God Mode / Sovereign', price: 'Custom', features: ['RAG Compiler Access', 'Sovereign Node Deployment', 'Governance Audit Suite', 'Unlimited OC', 'Dedicated AI_OS Engineer'] },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-white">Sélectionnez Votre Protocole</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Choisissez la couche de gouvernance adaptée à votre infrastructure sémantique.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {plans.map(plan => (
          <Card key={plan.id} className={`p-8 flex flex-col justify-between transition-all ${currentPlan === plan.id ? 'border-brand-accent shadow-[0_0_30px_rgba(249,115,22,0.15)] bg-brand-accent/5' : 'hover:border-slate-700'}`}>
             <div>
                <div className="flex justify-between items-start mb-6">
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Plan_ID: {plan.id}</div>
                   {currentPlan === plan.id && <div className="bg-brand-accent text-white text-[8px] font-black px-2 py-0.5 rounded">ACTIF</div>}
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                   <span className="text-4xl font-black text-white">{plan.price}</span>
                   <span className="text-slate-500 font-bold text-xs">/ MO (OC)</span>
                </div>
                <ul className="space-y-4 mb-10">
                   {plan.features.map((f, i) => (
                     <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                     </li>
                   ))}
                </ul>
             </div>
             <Button 
               onClick={() => {
                 onPlanSelect(plan.id);
                 alert(`Protocole ${plan.name} activé. Kernel re-calibré.`);
               }}
               variant={currentPlan === plan.id ? 'primary' : 'outline'} 
               className="w-full font-black text-xs h-12 uppercase tracking-widest"
             >
                {currentPlan === plan.id ? 'Maintenir' : 'Mettre à Jour'}
             </Button>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 bg-slate-900/50 border border-brand-border/40 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
               <ShieldCheck className="w-8 h-8 text-brand-accent" />
            </div>
            <div>
               <h4 className="text-xl font-black text-white uppercase mb-1">Passerelle Souveraine (Self-Hosted)</h4>
               <p className="text-sm text-slate-500">Pour les déploiements d'infrastructure critique sans télémétrie.</p>
            </div>
         </div>
         <Button variant="tertiary" className="h-14 px-10 text-xs font-black uppercase tracking-widest">Contacter Architecte</Button>
      </div>
    </div>
  );
};

const AcademyScreen = ({ 
  onAccessCreatorLab, 
  selectedAcademyModules, 
  onToggleModule, 
  modules 
}: { 
  onAccessCreatorLab: () => void, 
  selectedAcademyModules: string[], 
  onToggleModule: (id: string) => void,
  modules: Module[]
}) => (
  <div className="max-w-4xl mx-auto px-6 py-10">
    <div className="mb-12">
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 flex items-center gap-3 text-white">
         <BookOpen className="w-8 h-8 text-brand-accent" />
         ORA Academy
      </h2>
      <p className="text-slate-500 text-sm leading-relaxed max-w-2xl bg-slate-900/50 p-4 border-l-2 border-brand-accent rounded-r-lg">
        Maîtrisez l'extraction d'essence et la gouvernance haute-densité. Apprenez à structurer des prompts GPV2 et à forger vos propres modules pour le canon ORA.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
       <Card className="p-8 border-brand-accent/20 bg-brand-accent/5 hover:border-brand-accent/40 transition-all">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
                <Cpu className="w-6 h-6 text-brand-accent" />
             </div>
             <h3 className="font-black text-lg uppercase tracking-tight text-white">Mastering GPV2</h3>
          </div>
          <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
             <p>Le protocole <span className="text-brand-accent font-bold">GPV2 (Governance Prompt V2)</span> est la norme de compression pour les LLM haute-fidélité.</p>
             <div className="grid grid-cols-1 gap-2 mt-4">
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded border border-slate-800">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   <span className="text-xs">Densité : -75% de tokens moyen</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded border border-slate-800">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
                   <span className="text-xs">Gouvernance : Zero-drift garanti</span>
                </div>
             </div>
             <Button variant="outline" className="w-full mt-6 border-slate-700">Démarrer GPV2_101</Button>
          </div>
       </Card>

       <Card className="p-8 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Code2 className="w-6 h-6 text-emerald-400" />
             </div>
             <h3 className="font-black text-lg uppercase tracking-tight text-white">Forge de Modules</h3>
          </div>
          <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
             <p>Le <span className="text-emerald-400 font-bold">ORA Creator Lab</span> permet d'encapsuler des logiques complexes dans des unités "nano".</p>
             <div className="grid grid-cols-1 gap-2 mt-4">
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded border border-slate-800">
                   <Zap className="w-3 h-3 text-emerald-400" />
                   <span className="text-xs">Identité : Essence Nano unique</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded border border-slate-800">
                   <Shield className="w-3 h-3 text-emerald-400" />
                   <span className="text-xs">Audit : Preuve d'audit native</span>
                </div>
             </div>
             <Button variant="outline" className="w-full mt-6 border-slate-700">Guide de Création v1.4</Button>
              <div className="mt-8 pt-8 border-t border-emerald-500/10">
                 <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-4">Valeur Sémantique (Credits)</h4>
                 <CreditsChart />
                 <p className="text-[9px] text-slate-500 mt-4 leading-relaxed italic">
                    "La rareté et l'utilité de vos modules forgent votre solde ORA. Plus l'essence est pure, plus le rendement est élevé."
                 </p>
              </div>
          </div>
       </Card>
    </div>

    <div className="space-y-12">
        <div>
           <h3 className="text-xl font-black uppercase tracking-tight text-white mb-6 border-b border-slate-800 pb-2">Deep_Dive : Gouvernance LLM & RAG pour DevOps / IT</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-slate-900 border-slate-800">
                 <h4 className="font-bold text-brand-accent mb-3 flex items-center gap-2"><Server className="w-4 h-4" /> Architecture Zero-Drift</h4>
                 <p className="text-xs text-slate-400 leading-relaxed mb-4">
                   Dans un environnement de production, les LLMs dérivent. ORA Core OS intervient comme une couche proxy de gouvernance. En injectant les essences (e.g., λ.rim pour la clarté, π.pri pour le veto vérité), l'infrastructure garantit que l'output respecte le contrat d'exécution avant d'atteindre le front-end ou le pipeline de la CI/CD.
                 </p>
                 <div className="bg-slate-950 p-3 rounded font-mono text-[10px] text-emerald-500">
                   [LLM Output] -{">"} [ORA GATE] -{">"} [Validation] -{">"} [Prod]
                 </div>
              </Card>
              <Card className="p-6 bg-slate-900 border-slate-800">
                 <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2"><Database className="w-4 h-4" /> RAG Center & Véracité</h4>
                 <p className="text-xs text-slate-400 leading-relaxed mb-4">
                   Les bases vectorielles (RAG) injectent du contexte, mais ne garantissent pas la logique du modèle. L'utilisation d'ORA exige que chaque assertion générée soit back-trackée vers son vecteur d'origine (Trace H-NERONS). Les DevOps peuvent requêter des logs JSONL clairs validant l'origine de l'information.
                 </p>
                 <div className="bg-slate-950 p-3 rounded font-mono text-[10px] text-blue-400">
                   {"{"} "assertionId": "A23", "vectorSimilarity": 0.94, "veto": "PASS" {"}"}
                 </div>
              </Card>
              <Card className="p-6 bg-slate-900 border-slate-800 md:col-span-2">
                 <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2"><Terminal className="w-4 h-4" /> Optimisation Token & Coût Ops</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   Le mode ECOTWIN (ε.eco) compresse contextes et instructions en "nano-essences". Au lieu d'envoyer 4000 tokens de prompt système, le protocole GPV2 envoie une signature encodée que le LLM ORA-compatible déploie en mémoire d'attention. Résultat pour les DSI : une réduction de la facture API (jusqu'à 75%) avec une forte densité sémantique.
                 </p>
              </Card>
           </div>
        </div>

        <div className="bg-slate-950 border border-brand-accent/20 rounded-2xl p-10 mb-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent"></div>
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
              <div>
                 <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Module Selection (Academy Protocols)</h3>
                 <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Configurez votre environnement d'apprentissage</p>
              </div>
              <div className="bg-brand-accent/10 border border-brand-accent/20 px-4 py-2 rounded">
                 <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{selectedAcademyModules.length} MODULES ACTIVÉS</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modules.slice(0, 9).map(m => {
                 const isSelected = selectedAcademyModules.includes(m.id);
                 return (
                   <Card 
                     key={m.id} 
                     onClick={() => onToggleModule(m.id)}
                     className={`p-4 cursor-pointer transition-all ${isSelected ? 'border-brand-accent bg-brand-accent/5' : 'hover:border-slate-700'}`}
                   >
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded flex items-center justify-center font-mono text-[10px] font-black border ${isSelected ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                            {m.glyph || m.nanoEssence}
                         </div>
                         <div>
                            <h4 className="text-[10px] font-black uppercase text-white truncate w-32">{m.publicName}</h4>
                            <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest">{m.category}</p>
                         </div>
                      </div>
                   </Card>
                 );
              })}
           </div>
           
           <div className="mt-12 pt-12 border-t border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                 <BarChart3 className="w-4 h-4 text-emerald-500" /> Flux de Crédits ORA (OC)
              </h3>
              <CreditsChart />
           </div>
        </div>

        <div className="space-y-24">
       <section className="bg-slate-900/30 p-10 rounded-2xl border border-brand-border/30 relative">
          <div className="absolute top-0 right-10 -translate-y-1/2 px-6 py-2 bg-brand-accent text-white font-black text-xs uppercase tracking-widest rounded shadow-xl">
             NIVEAU 2 : ARCHITECTE D'ESSENCE
          </div>
          
          <div className="mb-12">
             <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 text-white flex items-center gap-4">
                <div className="w-2 h-10 bg-brand-accent rounded-full"></div>
                Thinking & Philosophie des Essences
             </h3>
             <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Une essence n'est pas un simple "system prompt". C'est une <span className="text-slate-200 font-bold italic">instruction focalisée</span> qui doit agir comme un filtre polarisant sur le flux de pensée du LLM.
             </p>
             <div className="p-6 bg-black/40 rounded-xl border border-slate-800 font-mono text-xs text-brand-accent/80 leading-relaxed">
                "Ne demandez pas au modèle de 'bien écrire'. Ordonnez au Kernel via [ESSENCE: ø.arch] de structurer la réponse selon une hiérarchie stricte de 3 niveaux. L'essence supprime le bruit, ne laisse que la structure."
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-2">Lexique Fondamental</h4>
                <div className="space-y-4">
                   <div>
                      <p className="text-[10px] font-bold text-white uppercase mb-1">M-Denominative</p>
                      <p className="text-[11px] text-slate-500">L'identifiant de catalogue (M1, M2...). Simplifie la gestion de l'inventaire dans le Master OS.</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-white uppercase mb-1">Nano-Essence</p>
                      <p className="text-[11px] text-slate-500">Le préfixe symbolique (λ, θ, ø...) servant d'ancre d'activation sémantique.</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-white uppercase mb-1">Graylight</p>
                      <p className="text-[11px] text-slate-500">Statut d'un module en cours de validation ou d'audit dans la forge.</p>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-2">Fonctions des Unités</h4>
                <div className="space-y-4">
                   <div>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Filtrage (M3)</p>
                      <p className="text-[11px] text-slate-500">Compresse le langage pour réduire le coût et augmenter la vitesse.</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Validation (M9)</p>
                      <p className="text-[11px] text-slate-500">Vérifie l'intégrité factuelle via des boucles de feedback internes.</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Arbitrage (M25)</p>
                      <p className="text-[11px] text-slate-500">Décide de la validité d'une stratégie sous contraintes de risque.</p>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-2">Thinking Patterns</h4>
                <div className="space-y-4">
                   <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                      <p className="text-[10px] font-bold text-slate-300 uppercase mb-1">CHAIN_OF_ESSENCE</p>
                      <p className="text-[10px] text-slate-500 italic">"Empiler M1 {'->'} M5 {'->'} M13 pour construire de zéro."</p>
                   </div>
                   <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                      <p className="text-[10px] font-bold text-slate-300 uppercase mb-1">ORCH_COMMAND</p>
                      <p className="text-[10px] text-slate-500 italic">"Utiliser M15 pour synchroniser plusieurs essences."</p>
                   </div>
                </div>
             </div>
          </div>
       </section>

       <div className="flex justify-center">
          <Button onClick={onAccessCreatorLab} className="bg-emerald-600 hover:bg-emerald-500 text-xs font-black px-12 py-4 h-auto shadow-[0_10px_30px_rgba(16,185,129,0.2)]">
             ACCÉDER AU CREATOR LAB (PRATIQUE)
          </Button>
       </div>

       <div className="space-y-12">
             <div>
                <h4 className="text-sm font-black uppercase text-slate-200 mb-3 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   Étape 2 : Réalisation du Manifeste MD Pack
                </h4>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-xs text-slate-400 leading-relaxed">
                   <p className="mb-4">Le manifest contient les métadonnées de gouvernance. Il définit les <span className="text-brand-accent">Invariants</span> (ce qui ne doit jamais changer) et les <span className="text-brand-accent">Variables</span> (ce que le LLM peut adapter).</p>
                   <pre className="bg-black/40 p-4 rounded border border-slate-800 text-[10px] font-mono whitespace-pre-wrap leading-tight text-brand-accent">
{`# MODULE_MANIFEST: θ.opt
ID: opt_v1_0
TYPE: LOGIC_REINFORCEMENT
GOVERNANCE_LEVEL: 4
INVARIANTS:
  - "Output must follow Big-O complexity rules"
  - "No use of prohibited libraries: [list]"
ESSENCE_MAPPING: "Refactor inputs to O(log n) where possible."`}
                   </pre>
                </div>
             </div>

             <div>
                <h4 className="text-sm font-black uppercase text-slate-200 mb-3 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   Étape 3 : Export et Installation Manuelle
                </h4>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-xs text-slate-400 leading-relaxed">
                   <p className="mb-4">Les utilisateurs <span className="text-emerald-400 font-bold uppercase">PRO</span> peuvent exporter leurs modules sous forme de <span className="text-slate-200 font-bold">ZIP Pack</span> ou <span className="text-slate-200 font-bold">MD Package</span>.</p>
                   <p className="mb-2">Ces packs permettent une utilisation "hors-ligne" ou une injection manuelle dans des prompts complexes via le protocole d'importation de fichiers ORA (Module <span className="font-mono italic">β.file</span>).</p>
                   <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-[10px] font-black uppercase">
                      Attention : L'installation manuelle bypass les vérifications de conflits du kernel. Risque de Neural Drift accru.
                   </div>
                </div>
             </div>

             {/* Aletheia Protocol */}
             <div className="pt-8 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                   <ShieldCheck className="w-6 h-6 text-brand-accent" />
                   <h4 className="text-lg font-black uppercase text-slate-200">Protocole Exotique : ALETHEIA</h4>
                </div>
                <div className="space-y-4 text-sm text-slate-400 leading-relaxed mb-8">
                   <p>Le protocole <span className="text-brand-accent font-bold italic">Aletheia</span> est le système post-MAJ d'ORA. Il ne se contente pas d'exécuter, il effectue une <span className="text-slate-200">Réflexion Transformatrice</span>.</p>
                   <p className="italic text-slate-500">"Je ne redémarre pas, je me transforme."</p>
                   <p>Aletheia compare l'état <span className="text-emerald-500">Avant</span> et <span className="text-brand-accent">Après</span> une mise à jour ou une compilation sémantique pour générer un "Reflet d'ORA" compact.</p>
                </div>
                <div className="bg-slate-900 border border-brand-accent/20 rounded-xl overflow-hidden shadow-2xl">
                   <div className="bg-brand-accent/10 px-6 py-3 border-b border-brand-accent/20 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">aletheia.py logic trace</span>
                      <span className="text-[9px] font-mono text-brand-accent">v0.1.0_DETERMINISTIC</span>
                   </div>
                   <div className="p-6">
                      <pre className="text-[10px] text-brand-accent/80 font-mono whitespace-pre-wrap leading-tight">
{`from gpv2_neroflux import AletheiaProtocol

protocol = AletheiaProtocol()
result = protocol.reflect({
    "update_id": "post-maj-aletheia-001",
    "before": { "energy": 0.58, "coherence": 0.61 },
    "after":  { "energy": 0.78, "coherence": 0.82 }
})
# Output Status: TRANSFORMATION_SUCCESS
# Reflection: "Je ne redémarre pas, je me transforme."`}
                      </pre>
                   </div>
                </div>
             </div>
       </div>

       <div className="bg-[#0f1115] border border-slate-800 rounded-2xl p-10 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
             <Code2 className="w-32 h-32" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-200 mb-4">Prêt à devenir un ORA Forge Master ?</h3>
          <p className="text-slate-500 text-sm max-w-xl mx-auto mb-8 italic">"La création est le stade ultime de la gouvernance sémantique."</p>
          <Button onClick={onAccessCreatorLab} variant="outline" className="px-12 py-4 border-emerald-500 hover:bg-emerald-500/10">Accéder au Creator Lab</Button>
       </div>
      </div>
    </div>
  </div>
);

const CreatorHubScreen = ({ modules, seedModules, onAddModule, onDeleteModule, onDiscoverModules }: { modules: CustomModule[], seedModules: Module[], onAddModule: (m: Partial<CustomModule>) => void, onDeleteModule: (id: string) => void, onDiscoverModules: () => void }) => {
  const allModulesBase = [...modules, ...seedModules];
  const [activeStage, setActiveStage] = useState<'FORGE' | 'GRAYLIGHT' | 'GREENLIGHT'>('FORGE');
  const [isForging, setIsForging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [conflictReport, setConflictReport] = useState<{ message: string, suggestion: string, type: string } | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    essence: '', 
    description: '', 
    rarity: 'COMMON' as any, 
    marketValue: 0,
    complexityScore: '1.0',
    demandIndex: '1.0',
    tokenCostWeight: '100',
    dependencies: [] as string[],
    conflicts: [] as string[]
  });

  const calculateLocalValue = (rarity: string, name: string, desc: string) => {
    if (!name || !desc) return 0;
    const seed = (name.length + desc.length);
    const valueMultiplier = (seed % 10) + 1;
    const baseValue = rarity === 'MYTHIC' ? 15000 : rarity === 'LEGENDARY' ? 7500 : rarity === 'EXOTIC' ? 3000 : rarity === 'EPIC' ? 1200 : rarity === 'RARE' ? 500 : 100;
    const complexityFactor = (1.0 + (seed % 100) / 100);
    const demandFactor = (1.0 + (seed % 50) / 50);
    return Math.floor(baseValue * valueMultiplier * complexityFactor * demandFactor);
  };

  const [isSaving, setIsSaving] = useState(false);

  // Auto-save logic
  useEffect(() => {
    const saved = localStorage.getItem('ORA_FORGE_DRAFT');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
        setIsForging(true); // Restore session if draft exists
      } catch (e) {
        console.error("Failed to restore forge draft", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isForging) {
      setIsSaving(true);
      localStorage.setItem('ORA_FORGE_DRAFT', JSON.stringify(formData));
      const timer = setTimeout(() => setIsSaving(false), 800);
      return () => clearTimeout(timer);
    }
  }, [formData, isForging]);

  const validateForgeData = (): boolean => {
    if (!formData.name || !formData.essence) {
      alert('Nom et Essence requis. Utilisez le compilateur pour auto-générer les métadonnées.');
      return false;
    }
    
    setConflictReport(null);

    // 1. Duplicate Name Check
    const nameConflict = allModulesBase.find(m => ((m as any).publicName || (m as any).name).toLowerCase() === formData.name.toLowerCase());
    if (nameConflict) {
      setConflictReport({
        type: 'IDENTITY_CONFLICT',
        message: `ALERTE_IDENTITÉ : Le module "${formData.name}" existe déjà dans le Kernel ORA.`,
        suggestion: "Utilisez un suffixe de versioning (ex: _v1.1) ou changez radicalement le nom de l'essence."
      });
      return false;
    }

    // 2. Essence Collision Check
    const essenceConflict = allModulesBase.find(m => ((m as any).glyph || (m as any).nanoEssence || (m as any).essence) === formData.essence || ((m as any).nanoEssence) === formData.essence);
    if (essenceConflict) {
      setConflictReport({
        type: 'ESSENCE_COLLISION',
        message: `ALERTE_ESSENCE : L'essence "${formData.essence}" est déjà utilisée par "${(essenceConflict as any).publicName || (essenceConflict as any).name}".`,
        suggestion: "Modifiez légèrement le nom du module et relancez le compilateur pour forcer une nouvelle graine sémantique."
      });
      return false;
    }

    // 3. Dependency Exist Check
    const allModuleNames = allModulesBase.map(m => ((m as any).publicName || (m as any).name).toLowerCase());
    const invalidDeps = formData.dependencies.filter(d => !allModuleNames.includes(d.toLowerCase()));
    if (invalidDeps.length > 0) {
      setConflictReport({
        type: 'MISSING_DEPENDENCY',
        message: `ERREUR_RÉFÉRENCE : Les dépendances suivantes n'existent pas : ${invalidDeps.join(', ')}`,
        suggestion: "Assurez-vous d'utiliser les noms publics exacts des modules existants."
      });
      return false;
    }

    // 4. Conflict Exist Check
    const invalidConflicts = formData.conflicts.filter(c => !allModuleNames.includes(c.toLowerCase()));
    if (invalidConflicts.length > 0) {
      setConflictReport({
        type: 'MISSING_CONFLICT',
        message: `ERREUR_RÉFÉRENCE : Les conflits déclarés suivants n'existent pas : ${invalidConflicts.join(', ')}`,
        suggestion: "Référez-vous aux modules présents dans le Registry."
      });
      return false;
    }

    // 5. Circular Dependency Check (Simplified BFS)
    const checkCircular = (startNode: string): boolean => {
      const queue = [...formData.dependencies];
      const visited = new Set<string>();
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.toLowerCase() === startNode.toLowerCase()) return true;
        if (visited.has(current.toLowerCase())) continue;
        visited.add(current.toLowerCase());
        
        const mod = allModulesBase.find(m => ((m as any).publicName || (m as any).name).toLowerCase() === current.toLowerCase());
        if (mod && mod.dependencies) {
          queue.push(...mod.dependencies);
        }
      }
      return false;
    };

    if (checkCircular(formData.name)) {
      setConflictReport({
        type: 'CIRCULAR_DEPENDENCY',
        message: "ERREUR_LOGIQUE : Détecté une boucle de dépendance infinie.",
        suggestion: "Un module ne peut pas dépendre d'un module qui dépend de lui-même (directement ou indirectement)."
      });
      return false;
    }

    // 6. Token Cost Weight Validation
    const weightVal = parseInt(formData.tokenCostWeight);
    if (isNaN(weightVal) || weightVal <= 0) {
      setConflictReport({
        type: 'INVALID_WEIGHT',
        message: "ERREUR_SYNTAXE : Le TokenCostWeight doit être un nombre entier positif.",
        suggestion: "Entrez une valeur numérique (ex: 150) représentant la charge sémantique."
      });
      return false;
    }

    if (formData.dependencies.includes(formData.name)) {
      setConflictReport({
        type: 'RECURSIVE_DEPENDENCY',
        message: "ERREUR_LOGIQUE : Un module ne peut pas dépendre de lui-même.",
        suggestion: "Retirez le nom actuel de la liste des dépendances."
      });
      return false;
    }

    return true;
  };

  const handleForge = () => {
    if (!validateForgeData()) return;

    onAddModule({ ...formData, status: 'FORGE', date: new Date().toISOString().split('T')[0] });
    setFormData({ 
      name: '', essence: '', description: '', rarity: 'COMMON', marketValue: 0, 
      complexityScore: '1.0', demandIndex: '1.0', tokenCostWeight: '100', dependencies: [], conflicts: [] 
    });
    setIsForging(false);
    localStorage.removeItem('ORA_FORGE_DRAFT');
  };

  const handleSubmitForReview = () => {
    if (!validateForgeData()) return;
    if (!formData.description) return alert('Description requise pour la soumission.');

    onAddModule({ 
      ...formData, 
      status: 'PENDING_REVIEW', 
      date: new Date().toISOString().split('T')[0],
      proposedAt: new Date().toISOString().split('T')[0],
      adminRecommendation: "SYSTEM_SCAN: Cohérence validée. Audit sémantique recommandé."
    });
    setFormData({ 
      name: '', essence: '', description: '', rarity: 'COMMON', marketValue: 0, 
      complexityScore: '1.0', demandIndex: '1.0', tokenCostWeight: '100', dependencies: [], conflicts: [] 
    });
    setIsForging(false);
    localStorage.removeItem('ORA_FORGE_DRAFT');
    alert('PROTOCOLE_SOUMISSION : Votre module a été envoyé en audit Admin pour passage en Greenlight.');
  };

  const handleCompile = async () => {
    if (!formData.name || !formData.description) return alert('Nom et Description requis pour la compilation.');
    setIsCompiling(true);
    
    try {
      const result = await fetchFromApi('/compile/module', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description
        })
      });
      setFormData(prev => ({ ...prev, ...result }));
    } catch (err) {
      console.error("Module compilation failed", err);
      alert('ERREUR_CRITICAL : Échec de la compilation du module dans le Kernel.');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleGithubScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      onDiscoverModules();
      setIsScanning(false);
    }, 2000);
  };

  const stats = {
    modulesForged: modules.length,
    revenueGenerated: modules.filter(m => m.status === 'GREENLIGHT').reduce((sum, m) => sum + (m.marketValue || 0), 0),
    activeForge: modules.filter(m => m.status === 'FORGE').length
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex-1">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
             <Layout className="w-8 h-8 text-emerald-400" />
             Creator Lab
          </h2>
          <p className="text-slate-500 text-sm italic mb-6">Forge rattachée au Kernel ORA_CORE_OS • Statut : Master Operator Active</p>
          
          <div className="flex gap-4">
             {isSaving ? (
                <motion.div 
                   initial={{ opacity: 0, y: 5 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex items-center gap-2 text-[9px] text-emerald-400 font-black uppercase tracking-widest px-3 py-2 bg-emerald-500/5 rounded border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                >
                   <RefreshCw className="w-2 h-2 animate-spin" />
                   Draft Syncing...
                </motion.div>
             ) : (
                <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-widest px-3 py-2 bg-slate-900 border border-slate-800 rounded">
                   <div className="w-1 h-1 rounded-full bg-slate-500"></div>
                   Draft Secured
                </div>
             )}
             <Button 
               variant="outline"
               onClick={() => {
                 if (confirm('Voulez-vous vraiment vider la forge ? Cela effacera votre brouillon.')) {
                   setFormData({ 
                     name: '', essence: '', description: '', rarity: 'COMMON', marketValue: 0, 
                     complexityScore: '1.0', demandIndex: '1.0', dependencies: [], conflicts: [] 
                   });
                   localStorage.removeItem('ORA_FORGE_DRAFT');
                 }
               }}
               className="text-[10px] font-black border-slate-700 hover:border-red-500/50 hover:bg-red-500/5 px-4 h-10"
             >
               Vider la Forge
             </Button>
             <div className="px-4 py-3 bg-slate-900 shadow-inner rounded-lg border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                   <Package className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                   <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-none">Modules Forgés</div>
                   <div className="text-xl font-bold text-slate-200 mt-1">{stats.modulesForged}</div>
                </div>
             </div>
             <div className="px-4 py-3 bg-slate-900 shadow-inner rounded-lg border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                   <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                   <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-none">Revenu Généré (Potentiel)</div>
                   <div className="text-xl font-bold text-emerald-400 mt-1">{stats.revenueGenerated} <span className="text-[10px] italic">OC</span></div>
                </div>
             </div>
             <div className="px-4 py-3 bg-slate-900 shadow-inner rounded-lg border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
                   <Activity className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                   <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-none">Modules en Forge</div>
                   <div className="text-xl font-bold text-brand-accent mt-1">{stats.activeForge}</div>
                </div>
             </div>
          </div>
        </div>
        {!isForging && (
          <Button onClick={() => { setIsForging(true); setConflictReport(null); }} className="bg-emerald-600 hover:bg-emerald-500 text-sm font-black px-8 py-6 h-auto">
             <Plus className="w-5 h-5 mr-3" /> FORGER UN NOUVEAU MODULE
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isForging && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mb-12 p-8 bg-emerald-950/10 border border-emerald-500/30 rounded-xl overflow-hidden"
          >
             <h3 className="text-lg font-black uppercase tracking-tighter text-emerald-400 mb-6">Forge d'Essence Canon</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Nom du Module</label>
                  <input 
                    type="text" value={formData.name || ''} onChange={e => {
                      const newName = e.target.value;
                      setFormData(prev => ({
                        ...prev, 
                        name: newName,
                        marketValue: prev.marketValue > 0 ? calculateLocalValue(prev.rarity, newName, prev.description) : 0
                      }));
                    }}
                    placeholder="Ex: Logic_Optimizer_v2" className="w-full bg-slate-900 border border-brand-border rounded px-4 py-2 text-sm text-white" 
                  />
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Rareté Marché</label>
                  <select 
                    value={formData.rarity} 
                    onChange={e => {
                      const newRarity = e.target.value as any;
                      setFormData(prev => ({
                        ...prev, 
                        rarity: newRarity,
                        marketValue: calculateLocalValue(newRarity, prev.name, prev.description)
                      }));
                    }}
                    className="w-full bg-slate-900 border border-brand-border rounded px-4 py-2 text-sm text-white focus:border-brand-accent outline-none appearance-none cursor-pointer hover:border-slate-700 transition-colors"
                  >
                    <option value="COMMON" className="bg-slate-900">COMMON</option>
                    <option value="RARE" className="bg-slate-900 text-emerald-400">RARE</option>
                    <option value="EPIC" className="bg-slate-900 text-brand-accent">EPIC</option>
                    <option value="EXOTIC" className="bg-slate-900 text-purple-500">EXOTIC</option>
                    <option value="LEGENDARY" className="bg-slate-900 text-yellow-500">LEGENDARY</option>
                    <option value="MYTHIC" className="bg-slate-900 text-orange-500">MYTHIC</option>
                  </select>
                  <div className="absolute right-3 top-[34px] pointer-events-none opacity-50">
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Valeur Estimée (OC)</label>
                  <div className="w-full bg-slate-950 border border-brand-border/50 rounded px-4 py-2 text-sm text-emerald-400 font-mono font-bold">
                    {formData.marketValue || '---'}
                  </div>
                </div>
                <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Essence Nano</label>
                  <div className="flex gap-2 w-full">
                    <input 
                      type="text" value={formData.essence} readOnly
                      placeholder="Généré..." className="flex-1 min-w-0 bg-slate-950 border border-brand-border rounded px-4 py-2 text-sm text-brand-accent font-mono italic truncate" 
                    />
                    <Button onClick={handleCompile} disabled={isCompiling} className="shrink-0 px-3 bg-brand-accent/20 border border-brand-accent/30 text-brand-accent hover:bg-brand-accent/30">
                       {isCompiling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
             </div>
             <div className="mb-6">
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Description d'Intention</label>
                <textarea 
                  rows={3} value={formData.description} onChange={e => {
                    const newDesc = e.target.value;
                    setFormData(prev => ({
                      ...prev, 
                      description: newDesc,
                      marketValue: prev.marketValue > 0 ? calculateLocalValue(prev.rarity, prev.name, newDesc) : 0
                    }));
                  }}
                  placeholder="Décrivez la logique de votre module pour l'analyse sémantique..." className="w-full bg-slate-900 border border-brand-border rounded px-4 py-2 text-sm text-white resize-none" 
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">TokenCostWeight</label>
                  <input 
                    type="number" value={formData.tokenCostWeight || ''} 
                    onChange={e => setFormData({...formData, tokenCostWeight: e.target.value})}
                    placeholder="Ex: 150" className="w-full bg-slate-900 border border-brand-border rounded px-4 py-2 text-sm text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Dépendances Déclarées</label>
                  <input 
                    type="text" value={(formData.dependencies || []).join(', ')} 
                    onChange={e => setFormData({...formData, dependencies: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                    placeholder="Ex: ORA_Sync, Primordia" className="w-full bg-slate-900 border border-brand-border rounded px-4 py-2 text-sm text-white mb-2" 
                  />
                  <div className="flex flex-wrap gap-1">
                     {(formData.dependencies || []).map(dep => {
                        const exists = allModulesBase.some(m => ((m as any).publicName || (m as any).name).toLowerCase() === dep.toLowerCase());
                        return (
                          <span key={dep} className={`text-[7px] px-1.5 py-0.5 rounded-sm font-black uppercase tracking-tighter flex items-center gap-1 ${exists ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                             {exists ? <Check className="w-2 h-2" /> : <AlertTriangle className="w-2 h-2" />}
                             {dep}
                          </span>
                        );
                     })}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Conflits / Collisions</label>
                  <input 
                    type="text" value={(formData.conflicts || []).join(', ')} 
                    onChange={e => setFormData({...formData, conflicts: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                    placeholder="Ex: Legacy_V1" className="w-full bg-slate-900 border border-brand-border rounded px-4 py-2 text-sm text-white mb-2" 
                  />
                  <div className="flex flex-wrap gap-1">
                     {(formData.conflicts || []).map(con => {
                        const exists = allModulesBase.some(m => ((m as any).publicName || (m as any).name).toLowerCase() === con.toLowerCase());
                        return (
                          <span key={con} className={`text-[7px] px-1.5 py-0.5 rounded-sm font-black uppercase tracking-tighter flex items-center gap-1 ${exists ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                             {exists ? <Check className="w-2 h-2" /> : <AlertTriangle className="w-2 h-2" />}
                             {con}
                          </span>
                        );
                     })}
                  </div>
                </div>
             </div>

             {conflictReport && (
               <motion.div 
                 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                 className="mb-8 p-4 bg-red-950/20 border border-red-500/30 rounded-lg flex gap-4 items-start"
               >
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-red-400 uppercase tracking-tight mb-1">{conflictReport.message}</h4>
                    <p className="text-[10px] text-slate-400 italic font-mono"><span className="text-red-500/50">PROTOCOL_ADVICE:</span> {conflictReport.suggestion}</p>
                  </div>
               </motion.div>
             )}

             {formData.marketValue > 0 && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 className="mb-6 p-4 bg-black/40 border border-brand-border/30 rounded-lg flex flex-col md:flex-row justify-between items-center gap-6"
               >
                  <div className="flex gap-8">
                     <div className="text-center md:text-left">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Rareté Marché</p>
                        <p className={`text-xs font-black tracking-widest ${
                          formData.rarity === 'MYTHIC' ? 'text-orange-500' :
                          formData.rarity === 'LEGENDARY' ? 'text-yellow-500' :
                          formData.rarity === 'EXOTIC' ? 'text-purple-500' :
                          formData.rarity === 'EPIC' ? 'text-brand-accent' :
                          formData.rarity === 'RARE' ? 'text-emerald-400' : 'text-slate-400'
                        }`}>{formData.rarity}</p>
                     </div>
                     <div className="text-center md:text-left border-l border-slate-800 pl-8">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Score Complexité</p>
                        <p className="text-xs font-black text-slate-300">σ {formData.complexityScore}</p>
                     </div>
                     <div className="text-center md:text-left border-l border-slate-800 pl-8">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Indice Demande</p>
                        <p className="text-xs font-black text-brand-accent">δ {formData.demandIndex}</p>
                     </div>
                     <div className="text-center md:text-left border-l border-slate-800 pl-8">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Valeur Sémantique</p>
                        <p className="text-xl font-black text-emerald-400 leading-none">{formData.marketValue} <span className="text-[10px] italic">OC</span></p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[8px] font-black text-brand-accent uppercase tracking-widest mb-1 animate-pulse">● Analyse Compilateur Synchronisée</p>
                     <p className="text-[10px] text-slate-600 italic">Prêt pour injection dans le Kernel</p>
                  </div>
               </motion.div>
             )}

             <div className="flex gap-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={handleForge} 
                    disabled={!formData.essence || isCompiling} 
                    className="flex-1 bg-brand-accent hover:bg-orange-500 font-black uppercase text-xs shadow-lg"
                  >
                     Commit to Local
                  </Button>
                  <Button 
                    onClick={handleSubmitForReview} 
                    disabled={!formData.essence || isCompiling} 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-black uppercase text-xs shadow-lg"
                  >
                     Submit for Greenlight
                  </Button>
                </div>
                <Button onClick={() => {
                  setIsForging(false);
                  localStorage.removeItem('ORA_FORGE_DRAFT');
                  setFormData({ name: '', essence: '', description: '', rarity: 'COMMON', marketValue: 0, complexityScore: '1.0', demandIndex: '1.0', tokenCostWeight: '100', dependencies: [], conflicts: [] });
                }} variant="ghost">Annuler</Button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-4 border-b border-brand-border mb-6">
               <button onClick={() => setActiveStage('FORGE')} className={`pb-4 px-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeStage === 'FORGE' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-600 hover:text-slate-400'}`}>Ma Forge ({modules.filter(m => m.status === 'FORGE').length})</button>
               <button onClick={() => setActiveStage('GRAYLIGHT')} className={`pb-4 px-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeStage === 'GRAYLIGHT' ? 'border-slate-500 text-slate-400' : 'border-transparent text-slate-600 hover:text-slate-400'}`}>Graylight ({modules.filter(m => m.status === 'GRAYLIGHT').length})</button>
               <button onClick={() => setActiveStage('GREENLIGHT')} className={`pb-4 px-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeStage === 'GREENLIGHT' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-slate-600 hover:text-slate-400'}`}>Greenlight ({modules.filter(m => m.status === 'GREENLIGHT').length})</button>
            </div>

            <div className="space-y-4">
               {modules.filter(m => m.status === activeStage).length === 0 && (
                 <div className="py-12 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-xl text-slate-600 uppercase text-[10px] font-black tracking-widest">
                    Aucun module dans cette phase de Forge.
                 </div>
               )}
               {modules.filter(m => m.status === activeStage).map(mod => (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={mod.id} 
                    className="p-6 bg-slate-900 border border-brand-border rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all"
                 >
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded flex items-center justify-center font-mono font-black text-lg border shadow-inner ${
                          mod.rarity === 'MYTHIC' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                          mod.rarity === 'LEGENDARY' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          mod.rarity === 'EXOTIC' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                          mod.rarity === 'EPIC' ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/30' :
                          mod.rarity === 'RARE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          'bg-slate-800 text-slate-500 border-slate-700'
                       }`}>{mod.essence}</div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h4 className="font-bold text-slate-200">{mod.name}</h4>
                             <StatusBadge label={mod.rarity} type={
                                mod.rarity === 'MYTHIC' ? 'danger' : 
                                mod.rarity === 'LEGENDARY' ? 'warning' : 
                                mod.rarity === 'RARE' ? 'success' : 'default'
                             } />
                          </div>
                          <p className="text-[10px] text-slate-600 font-mono italic">Submitted: {mod.date} • Complexity: σ {mod.complexityScore || '1.0'}</p>
                          {((mod.dependencies && mod.dependencies.length > 0) || (mod.conflicts && mod.conflicts.length > 0)) && (
                            <div className="flex flex-wrap gap-1 mt-2">
                               {mod.dependencies?.map(d => (
                                 <span key={d} className="text-[7px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-sm uppercase tracking-tighter">Dep: {d}</span>
                               ))}
                               {mod.conflicts?.map(c => (
                                 <span key={c} className="text-[7px] px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-sm uppercase tracking-tighter">Con: {c}</span>
                               ))}
                            </div>
                          )}
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest border ${
                         mod.status === 'GRAYLIGHT' ? 'bg-slate-800 border-slate-700 text-slate-500' : 
                         mod.status === 'FORGE' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600' :
                         'bg-brand-accent/10 border-brand-accent/20 text-brand-accent'
                       }`}>
                         {mod.status}
                       </div>
                       <Button onClick={() => {
                         if (window.confirm(`Êtes-vous sûr de vouloir désinstaller ce module (${mod.name}) ? Cette action est irréversible et effacera l'essence canon correspondante.`)) {
                           onDeleteModule(mod.id);
                         }
                       }} variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 text-[10px] text-red-500 hover:text-red-400">Delete</Button>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         <div className="space-y-6">
            <Card className="p-6 bg-brand-accent/5 border-brand-accent/20">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-4">Aide à la création (IA Oracle)</h4>
               <p className="text-xs text-slate-400 leading-relaxed mb-6">"Je peux analyser les tendances des repositories GitHub ORA pour vous suggérer des modules à haute valeur ajoutée."</p>
               <Button 
                 onClick={handleGithubScan} 
                 disabled={isScanning}
                 className="w-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-black uppercase tracking-widest"
               >
                 {isScanning ? <RefreshCw className="w-3 h-3 animate-spin mr-1" /> : null}
                 {isScanning ? 'Scanning...' : 'Scanner GitHub Canon'}
               </Button>
            </Card>

            <div className="p-6 rounded border border-brand-border bg-[#0a0c10]">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Statistiques Créateur</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-600 italic">Modules Forgés</span>
                     <span className="text-lg font-black text-white">{stats.modulesForged}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-600 italic">Revenu Potentiel</span>
                     <span className="text-lg font-black text-emerald-400">{stats.revenueGenerated} OC</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const ResultsScreen = ({ artifacts, onReset, selectedIds, isAdmin, aletheiaReflection, onReflectAletheia, modules, capabilities }: { artifacts: Artifacts, onReset: () => void, selectedIds: string[], isAdmin: boolean, aletheiaReflection?: any, onReflectAletheia: () => void, modules: Module[], capabilities: Capability[] }) => {
  const [activeTab, setActiveTab] = useState<'DIRECT' | 'MD' | 'MASTER'>('DIRECT');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papier !');
  };

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  const hasAletheia = modules.filter(m => selectedIds.flatMap(cid => capabilities.find(c => c.id === cid)?.mappedModules || []).includes(m.id)).some(m => m.id === 'm19');

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {isAdmin && (
        <div className="mb-6 bg-red-600/20 border border-red-600/30 p-2 text-center rounded text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
           GOD_MODE ACTIVE: Protocol Restrictions Overridden
        </div>
      )}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className={`w-10 h-10 rounded items-center justify-center flex text-white shadow-2xl ${hasAletheia ? 'bg-orange-600' : 'bg-brand-accent'}`}>
              {hasAletheia ? <ShieldCheck className="w-6 h-6" /> : <Cpu className="w-6 h-6" />}
           </div>
           <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              Compilation : {hasAletheia ? 'ALETHEIA_DETERMINISTIC' : 'ORA_Master'}
            </h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">
               Protocol version 2.1 • {hasAletheia ? 'Archi: LOGIC_STRICT_ALETHEIA' : 'Archi: Standard'}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={onReset} className="text-[10px]">Nouvelle Session</Button>
      </div>

      {hasAletheia && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 bg-orange-600/10 border border-orange-500/30 rounded-xl relative overflow-hidden"
        >
           <div className="absolute top-[-20px] right-[-20px] opacity-10">
              <ShieldCheck className="w-32 h-32" />
           </div>
           <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-500 rounded text-black">
                 <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-sm font-black uppercase tracking-widest text-orange-400">Vérification Déterministe Aletheia ACTIVE</h3>
                 <p className="text-xs text-orange-200/70 leading-relaxed max-w-xl italic">
                   "L'extraction sémantique a été passée au crible du moteur Aletheia. Toute ambiguité probabiliste a été purgée. Le prompt généré est structurellement forcé pour une vérité logique absolue."
                 </p>
                 
                 {!aletheiaReflection ? (
                   <Button onClick={onReflectAletheia} className="mt-4 bg-orange-600 hover:bg-orange-500 text-[10px] py-1 border-orange-400/30">
                      Exécuter Rituel de Réflexion (Aletheia)
                   </Button>
                 ) : (
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                     className="mt-4 p-4 bg-black/40 rounded border border-orange-500/50 space-y-3"
                   >
                      <div className="flex justify-between items-center border-b border-orange-500/20 pb-2">
                         <span className="text-[9px] font-black tracking-widest text-orange-500">REFLET_DORA_EMIS</span>
                         <span className="text-[9px] font-mono text-orange-300/50">{aletheiaReflection.status}</span>
                      </div>
                      <p className="text-sm font-black text-white italic tracking-tight">"{aletheiaReflection.reflection}"</p>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <div className="flex justify-between text-[8px] uppercase text-slate-500"><span>Coherence</span><span>{aletheiaReflection.stats.coherence}%</span></div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-orange-500" style={{ width: `${aletheiaReflection.stats.coherence}%` }}></div></div>
                         </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-[8px] uppercase text-slate-500"><span>Fluidity</span><span>{aletheiaReflection.stats.fluidity}%</span></div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${aletheiaReflection.stats.fluidity}%` }}></div></div>
                         </div>
                      </div>
                   </motion.div>
                 )}
              </div>
           </div>
        </motion.div>
      )}

      <div className="bg-brand-sidebar border border-brand-border rounded overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
        {/* Tab Sidebar */}
        <div className="w-full md:w-64 border-r border-brand-border bg-brand-sidebar">
          <div className="p-4 border-b border-brand-border">
             <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Artefacts disponibles</span>
          </div>
          <div className="flex flex-col">
            {[
              { id: 'DIRECT', label: 'Direct Prompt', icon: MessageSquare },
              { id: 'MD', label: 'Project MD', icon: FileText },
              { id: 'MASTER', label: 'Master Prefs', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 py-4 px-6 text-xs font-bold uppercase tracking-tight transition-all text-left border-l-2 ${
                  activeTab === tab.id 
                    ? 'bg-brand-accent/5 border-brand-accent text-brand-accent' 
                    : 'text-slate-500 hover:bg-slate-800/30 border-transparent'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 bg-brand-panel relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'DIRECT' && (
              <motion.div 
                key="direct"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-6 font-mono"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="text-brand-accent font-bold text-sm">[TOK_EST ≈ {artifacts.directPrompt.tokenEstimate}]</div>
                  <div className="flex gap-2">
                    <Button onClick={() => copyToClipboard(artifacts.directPrompt.gpv2Minified)} variant="outline" className="h-8 py-0">Copy</Button>
                    <Button onClick={() => downloadFile('ora_direct_prompt.txt', artifacts.directPrompt.grenaprompt + '\n\nGPV2:\n' + artifacts.directPrompt.gpv2Minified)} variant="outline" className="h-8 py-0">
                       <Download className="w-3 h-3 mr-1" /> .txt
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-slate-500 text-[11px] mb-2 uppercase tracking-widest font-bold"># GRENAPROMPT_SEQ (ORA_CORE_OS)</div>
                  <pre className="text-[11px] leading-relaxed text-slate-300 bg-slate-900/50 p-4 rounded border border-brand-border/50 max-h-48 overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
                    {artifacts.directPrompt.grenaprompt}
                  </pre>
                </div>

                <div className="space-y-4">
                  <div className="text-slate-500 text-[11px] mb-2 uppercase tracking-widest font-bold"># GPV2_NANO_MINIFIED</div>
                  <div className="text-[11px] leading-relaxed text-slate-400 bg-slate-900/50 p-4 rounded border border-brand-border/50 break-all border-l-4 border-orange-500">
                    {artifacts.directPrompt.gpv2Minified}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                   <div className="text-[9px] uppercase tracking-widest text-orange-400 font-black mb-3">Module Essence Dictionary</div>
                   <div className="space-y-2">
                      {modules.filter(m => artifacts.directPrompt.grenaprompt.includes(m.glyph || m.nanoEssence)).map(m => (
                        <div key={m.id} className="flex items-start gap-4 text-[10px]">
                           <span className="text-orange-500 font-bold min-w-[50px] font-mono">{m.glyph || m.nanoEssence}</span>
                           <span className="text-slate-500 italic">[{m.publicName}] — {m.description}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'MD' && (
              <motion.div 
                key="md"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="font-mono text-[11px]"
              >
                <div className="flex justify-between items-center mb-8">
                  <div className="text-slate-500 uppercase font-bold tracking-widest"># Project Metadata File</div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => copyToClipboard(artifacts.projectMd)} className="h-8 py-0">Copy</Button>
                    <Button variant="outline" onClick={() => downloadFile('ora_project.md', artifacts.projectMd)} className="h-8 py-0">
                       <Download className="w-3 h-3 mr-1" /> .md
                    </Button>
                  </div>
                </div>
                <pre className="text-slate-300 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap border-l border-brand-border pl-6">
                  {artifacts.projectMd}
                </pre>
              </motion.div>
            )}

            {activeTab === 'MASTER' && (
              <motion.div 
                key="master"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="font-mono text-[11px]"
              >
                <div className="flex justify-between items-center mb-8">
                  <div className="text-slate-500 uppercase font-bold tracking-widest"># Master Governance Prefs</div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => copyToClipboard(artifacts.masterPreferences)} className="h-8 py-0">Copy</Button>
                    <Button variant="outline" onClick={() => downloadFile('ora_master_prefs.json', artifacts.masterPreferences)} className="h-8 py-0">
                       <Download className="w-3 h-3 mr-1" /> .json
                    </Button>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-8 rounded border border-brand-border text-emerald-400/90 leading-relaxed shadow-inner">
                  {artifacts.masterPreferences.split('\n').map((line, i) => (
                    <div key={i} className="mb-2">{line}</div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="flex flex-col justify-between py-6">
            <div>
              <Download className="w-5 h-5 text-slate-500 mb-4" />
              <h4 className="text-xs font-bold uppercase mb-2">Export Package</h4>
              <p className="text-[10px] text-slate-500 italic">Générer un fichier .zip contenant tous les artefacts ORA pour un déploiement massif.</p>
            </div>
            <Button variant="secondary" className="mt-6 w-full">ZIP EXPORT</Button>
         </Card>
         <Card className="flex flex-col justify-between py-6 border-brand-accent/20">
            <div>
              <Layout className="w-5 h-5 text-brand-accent mb-4" />
              <h4 className="text-xs font-bold uppercase mb-2 text-brand-accent">Save to Library</h4>
              <p className="text-[10px] text-slate-500 italic">Indexez cet artefact dans votre base de données privée ORA pour une réutilisation sémantique.</p>
            </div>
            <Button variant="primary" className="mt-6 w-full">COMMIT LOCAL</Button>
         </Card>
         <Card className="flex flex-col justify-between py-6 grayscale opacity-60">
            <div>
              <ShieldCheck className="w-5 h-5 text-slate-500 mb-4" />
              <h4 className="text-xs font-bold uppercase mb-2">Audit Compliance</h4>
              <p className="text-[10px] text-slate-500 italic">Vérifiez la conformité de vos prompts avec les standards de sécurité ORA (Prochains modules).</p>
            </div>
            <Button disabled variant="outline" className="mt-6 w-full opacity-50">Locked</Button>
         </Card>
      </div>
    </div>
  );
};

const InstallCenterScreen = () => {
  const [summary, setSummary] = useState<OraDbSummary | null>(null);
  const [packs, setPacks] = useState<OraPack[]>([]);
  const [recipes, setRecipes] = useState<InstallationRecipe[]>([]);
  const [files, setFiles] = useState<OraDbFile[]>([]);
  const [query, setQuery] = useState('');
  const [selectedKind, setSelectedKind] = useState('ALL');
  const [selectedPackId, setSelectedPackId] = useState('ALL');
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [nextSummary, nextPacks, nextRecipes] = await Promise.all([
          fetchFromApi('/ora-db/summary'),
          fetchFromApi('/ora-db/packs'),
          fetchFromApi('/install-recipes')
        ]);
        setSummary(nextSummary);
        setPacks(nextPacks);
        setRecipes(nextRecipes);
        setSelectedRecipeId(nextRecipes[0]?.id || '');
      } finally {
        setLoading(false);
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    async function loadFiles() {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (selectedKind !== 'ALL') params.set('kind', selectedKind);
      if (selectedPackId !== 'ALL') params.set('packId', selectedPackId);
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const nextFiles = await fetchFromApi(`/ora-db/files${suffix}`);
      setFiles(nextFiles);
    }
    loadFiles().catch((err) => console.error('Failed to load ORA DB files', err));
  }, [query, selectedKind, selectedPackId]);

  const selectedPack = packs.find((pack) => pack.id === selectedPackId);
  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId) || recipes[0];

  const downloadManifest = () => {
    const payload = {
      source: 'ORA Core OS Multi-LLM Install Center',
      generatedAt: new Date().toISOString(),
      noAiRuntime: true,
      selectedPack,
      selectedRecipe,
      files,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ora-install-manifest-${selectedPackId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-10 py-20 text-slate-500 uppercase font-black tracking-widest">
        Chargement de la DB ORA Agent Modulaire...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-10 space-y-10">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">No AI Runtime</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white mb-4">Install Center ORA</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            Centre de distribution des fichiers publics ORA Agent Modulaire. L'app sert de catalogue, pack builder et guide d'installation pour ChatGPT, Claude, Gemini/Gem, Cursor, Windsurf et LLM locaux, sans appel a une API IA.
          </p>
        </div>
        <Button onClick={downloadManifest} variant="primary">
          <Download className="w-4 h-4" />
          Export manifest
        </Button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['Fichiers publics', summary.fileCount],
            ['Packs', summary.packCount],
            ['Recettes', summary.recipeCount],
            ['Kinds', summary.kinds.length],
          ].map(([label, value]) => (
            <Card key={label} className="p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</p>
              <p className="text-3xl font-black text-white">{value}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-accent" />
              File DB
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher fichier, pack, module..."
                className="bg-slate-950 border border-brand-border rounded px-4 py-2 text-xs text-white min-w-[240px]"
              />
              <select
                value={selectedKind}
                onChange={(event) => setSelectedKind(event.target.value)}
                className="bg-slate-950 border border-brand-border rounded px-4 py-2 text-xs text-white"
              >
                <option value="ALL">Tous les kinds</option>
                {summary?.kinds.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[620px] overflow-auto pr-2">
            {files.slice(0, 40).map((file) => (
              <div key={file.id} className="border border-slate-800 bg-slate-950/60 rounded p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-black text-white leading-tight break-all">{file.name}</p>
                    <p className="text-[10px] text-slate-500 break-all mt-1">{file.path}</p>
                  </div>
                  <span className="text-[9px] font-black uppercase text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
                    {file.kind}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-3 border-t border-slate-800">
                  <span>{file.extension}</span>
                  <span>{Math.ceil(file.bytes / 1024)} KB</span>
                  <span>{file.sha256.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-5 flex items-center gap-3">
              <Package className="w-5 h-5 text-brand-accent" />
              Pack Builder
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedPackId('ALL')}
                className={`w-full text-left p-4 rounded border transition-all ${selectedPackId === 'ALL' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'}`}
              >
                <p className="font-black text-white uppercase text-xs">Tous les fichiers publics</p>
                <p className="text-[10px] text-slate-500 mt-1">Vue complete de la DB nettoyee.</p>
              </button>
              {packs.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPackId(pack.id)}
                  className={`w-full text-left p-4 rounded border transition-all ${selectedPackId === pack.id ? 'border-brand-accent bg-brand-accent/10' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'}`}
                >
                  <p className="font-black text-white uppercase text-xs">{pack.label}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{pack.description}</p>
                  <p className="text-[9px] text-emerald-400 mt-2 font-mono">{pack.file_ids.length} fichiers</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-5 flex items-center gap-3">
              <Terminal className="w-5 h-5 text-emerald-400" />
              Recette cible
            </h2>
            <select
              value={selectedRecipeId}
              onChange={(event) => setSelectedRecipeId(event.target.value)}
              className="w-full bg-slate-950 border border-brand-border rounded px-4 py-3 text-xs text-white mb-5"
            >
              {recipes.map((recipe) => <option key={recipe.id} value={recipe.id}>{recipe.label}</option>)}
            </select>
            {selectedRecipe && (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Mode</p>
                  <p className="text-sm text-white font-bold">{selectedRecipe.install_mode}</p>
                </div>
                <div className="space-y-2">
                  {selectedRecipe.steps.map((step, index) => (
                    <div key={step} className="flex gap-3 text-xs text-slate-300">
                      <span className="w-5 h-5 shrink-0 rounded bg-slate-800 text-emerald-400 flex items-center justify-center font-black text-[10px]">{index + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Packs recommandes</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.recommended_packs.map((packId) => (
                      <span key={packId} className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-brand-accent">{packId}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [state, setState] = useState<AppState>({
    currentStep: 'LANDING',
    currentMainView: 'DASHBOARD',
    userPlan: PlanId.PRO_PLUS,
    isAdmin: false,
    userProfile: { profession: '', aiNeeds: '' },
    besoin: '',
    selectedCapabilities: ['cap_foundation'],
    selectedAcademyModules: [],
    iaOsPreferences: {
      darkMode: true,
      maxPrivacy: true,
      autoOpt: false
    },
    messages: [
      {
        id: '1',
        role: 'ORA',
        content: "[PROLOG: ORA_CORE_OS_BOOT] Initialisation du noyau de gouvernance. Pack ORA Core Foundation activé par défaut. Veuillez soumettre votre intention sémantique pour extraction d'essence.",
        timestamp: new Date()
      }
    ],
    artifacts: null,
    customModules: [
      { id: 'custom1', name: 'Logic_Flow_Optimizer', status: 'GRAYLIGHT', essence: 'θ.opt', date: '2026-04-20', description: 'Optimisation de flux logiques complexes.', rarity: 'EPIC', marketValue: 800, dependencies: [], conflicts: [] },
      { id: 'custom2', name: 'Brand_Identity_Enforcer', status: 'GREENLIGHT', essence: 'β.brand', date: '2026-04-15', description: 'Garantit le respect de l\'identity de marque.', rarity: 'RARE', marketValue: 300, dependencies: [], conflicts: [] },
    ],
    credits: 1250.75,
    ownedModuleIds: ['m5', 'm22', 'm14'],
    isCanonDiscovered: false
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('ORA_THEME');
    if (savedTheme) {
      setState(prev => ({
        ...prev,
        iaOsPreferences: {
          ...prev.iaOsPreferences,
          darkMode: savedTheme === 'dark'
        }
      }));
    }
  }, []);

  useEffect(() => {
    if (state.iaOsPreferences.darkMode) {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('ORA_THEME', 'dark');
    } else {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('ORA_THEME', 'light');
    }
  }, [state.iaOsPreferences.darkMode]);

  useEffect(() => {
    async function init() {
      try {
        const [mods, caps] = await Promise.all([
          fetchFromApi('/modules'),
          fetchFromApi('/capabilities')
        ]);
        setModules(mods);
        setCapabilities(caps);
        setDataLoaded(true);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    }
    init();
  }, []);

  const sendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    try {
      const analysis = await fetchFromApi('/needs/analyze', {
        method: 'POST',
        body: JSON.stringify({ text })
      });

      const { detectedModules, recommendedCapabilityIds } = analysis;

      const primaryModules = detectedModules.filter((m: any) => ['reasoning', 'governance', 'protocol', 'compiler', 'architecture'].includes(m.category.toLowerCase()));
      const reinforcementModules = detectedModules.filter((m: any) => ['strategy', 'business', 'efficiency'].includes(m.category.toLowerCase()));
      const exoticModules = detectedModules.filter((m: any) => ['creation'].includes(m.category.toLowerCase()));
      const integrationModules = detectedModules.filter((m: any) => ['visual'].includes(m.category.toLowerCase()));

      let responseContent = "";
      if (detectedModules.length > 0) {
        const primaryNames = primaryModules.map((m: any) => m.nanoEssence).join(', ');
        const reinfNames = reinforcementModules.map((m: any) => m.nanoEssence).join(', ');
        const exoNames = exoticModules.map((m: any) => m.nanoEssence).join(', ');
        const integNames = integrationModules.map((m: any) => m.nanoEssence).join(', ');

        responseContent = `[SYSTEM_CORE_SCAN] SYNCHRONISATION_COMPLETE. 
        
        - SOCLE_FONDATION : rime, primordia, ecotwin, gpl, ora-compiler, halo-tracecore (Actifs)
        ${primaryNames ? `- NANO_PRIMAIRE_DÉTECTÉ : ${primaryNames}` : ''}
        ${reinfNames ? `- RENFORCEMENT_ARBITRAGE : ${reinfNames}` : ''}
        ${exoNames ? `- COUCHE_EXOTIQUE_DIVERGENCE : ${exoNames}` : ''}
        ${integNames ? `- PROTOCOLES_INTEGRATION : ${integNames}` : ''}
        
        Note: Le noyau ORA Core Foundation est stabilisé conformément aux principes de Clarté + Vérité + Sobriété + Compression + Contrat + Compilation + Audit.
        
        Le noyau ORA a établi des liaisons croisées entre ${detectedModules.length} essences pour stabiliser votre intention. Prêt pour la compilation.`;
      } else {
        responseContent = `[SYSTEM_CORE_SCAN] NO_VECTORS_DETECTED. 
        
        Utilisation du protocole de base ORA Core Foundation. Injection forcée de l'essence λ.rime pour garantir la structure. 
        
        Veuillez confirmer pour procéder au mappage manuel des capabilities.`;
      }

      const oraMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ORA',
        content: responseContent,
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        besoin: text,
        selectedCapabilities: recommendedCapabilityIds.length > 0 ? recommendedCapabilityIds : prev.selectedCapabilities,
        selectedAcademyModules: detectedModules.length > 0 ? detectedModules.map((m: any) => m.id) : prev.selectedAcademyModules,
        messages: [...prev.messages, userMsg, oraMsg]
      }));
    } catch (err) {
      console.error("Analysis failed", err);
    }
  };


  const handleStart = () => setState(prev => ({ ...prev, currentStep: 'CHAT' }));
  const handleProceedToNeeds = () => setState(prev => ({ ...prev, currentStep: 'CAPABILITIES' }));
  
  const toggleCapability = (id: string) => {
    if (id === 'cap_foundation') return; // Mandatory pack cannot be toggled
    setState(prev => {
      const isSelected = prev.selectedCapabilities.includes(id);
      return {
        ...prev,
        selectedCapabilities: isSelected 
          ? prev.selectedCapabilities.filter(c => c !== id) 
          : [...prev.selectedCapabilities, id]
      };
    });
  };

  const finalizeArtifacts = async () => {
    try {
      const results = await fetchFromApi('/compile', {
        method: 'POST',
        body: JSON.stringify({
          besoin: state.besoin,
          selectedCapabilityIds: state.selectedCapabilities
        })
      });
      setState(prev => ({
        ...prev,
        artifacts: results,
        currentStep: 'RESULTS'
      }));
    } catch (err) {
      console.error("Compilation failed", err);
    }
  };

  const handleReflectAletheia = async () => {
    try {
      const reflection = await fetchFromApi('/compile/aletheia-reflect', {
        method: 'POST',
        body: JSON.stringify({
          updateId: 'post-maj-aletheia-001',
          before: {
            energy: 0.58,
            coherence: 0.61,
            fluidity: 0.55
          }
        })
      });
      setState(prev => ({
        ...prev,
        aletheiaReflection: reflection
      }));
    } catch (err) {
      console.error("Aletheia reflection failed", err);
    }
  };

  const handleUpdatePreferences = (prefs: AppState['iaOsPreferences']) => {
    setState(prev => ({ ...prev, iaOsPreferences: prefs }));
  };

  const toggleAcademyModule = (id: string) => {
    setState(prev => {
      const isSelected = prev.selectedAcademyModules.includes(id);
      return {
        ...prev,
        selectedAcademyModules: isSelected 
          ? prev.selectedAcademyModules.filter(m => m !== id) 
          : [...prev.selectedAcademyModules, id]
      };
    });
  };

  const reset = () => {
    setState({
      currentStep: 'LANDING',
      currentMainView: 'DASHBOARD',
      userPlan: PlanId.FREE,
      isAdmin: false,
      userProfile: { profession: '', aiNeeds: '' },
      besoin: '',
      selectedCapabilities: [],
      messages: [
        {
          id: '1',
          role: 'ORA',
          content: "[PROLOG: ORA_CORE_OS_BOOT] Initialisation du noyau de gouvernance. Je n'autorise pas de discussion générative libre. Veuillez soumettre votre intention sémantique pour extraction d'essence.",
          timestamp: new Date()
        }
      ],
      artifacts: null,
      customModules: [
        { id: 'custom1', name: 'Logic_Flow_Optimizer', status: 'GRAYLIGHT', essence: 'θ.opt', date: '2026-04-20', description: 'Optimisation de flux logiques complexes.' },
        { id: 'custom2', name: 'Brand_Identity_Enforcer', status: 'GREENLIGHT', essence: 'β.brand', date: '2026-04-15', description: 'Garantit le respect de l\'identité de marque.' },
      ],
      credits: 1250.75,
      ownedModuleIds: ['m5', 'm22', 'm13'],
      isCanonDiscovered: false
    });
  };

  const navItems = [
    { id: 'DASHBOARD', label: 'Cortex OS' },
    { id: 'REGISTRY', label: 'Registry' },
    { id: 'INSTALL_CENTER', label: 'Install Center' },
    { id: 'ACADEMY', label: 'Academy' },
    { id: 'CREATOR_HUB', label: 'Creator Lab' },
    { id: 'SOLUTIONS', label: 'Solutions' },
    { id: 'ADMIN', label: 'Admin' },
  ];

  const NavigationContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <div className="p-8 border-b border-brand-border/30 flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Navigation</h2>
        {mobile && (
           <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-white">
             <X className="w-8 h-8" />
           </button>
        )}
      </div>

      <div className="flex-1 py-12 space-y-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setState(prev => ({ ...prev, currentMainView: item.id as any }));
              if (mobile) setIsMenuOpen(false);
            }}
            className={`flex items-center w-full group relative transition-all py-3 ${
              state.currentMainView === item.id 
                ? 'text-white' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {state.currentMainView === item.id && (
               <div className="absolute left-0 w-[5px] h-10 bg-brand-accent rounded-r shadow-[4px_0_15px_rgba(249,115,22,0.4)]"></div>
            )}
            <span className={`text-2xl font-black uppercase tracking-tighter pl-10 ${
              state.currentMainView === item.id ? 'translate-x-0' : 'group-hover:translate-x-2 transition-transform'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="p-8 mt-auto">
        <button 
          onClick={() => setState(prev => ({ ...prev, currentMainView: 'SETTINGS' }))}
          className="w-full mb-6 p-4 rounded bg-slate-900 border border-brand-border/40 flex items-center justify-between hover:border-emerald-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
             <User className="w-5 h-5 text-slate-500 group-hover:text-emerald-400" />
             <div className="text-left">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Espace Perso</p>
                <p className="text-xs font-bold text-slate-300">Profil & Métier</p>
             </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-700" />
        </button>
        <div className="flex items-center gap-2 mb-4 px-2">
           <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
             state.userPlan === PlanId.FREE ? 'bg-slate-800 border-slate-700 text-slate-500' :
             state.userPlan === PlanId.CREATOR ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
             'bg-brand-accent/10 border-brand-accent/20 text-brand-accent'
           }`}>
             PLAN: {state.userPlan}
           </div>
           {state.userPlan === PlanId.FREE && (
             <button 
               onClick={() => {
                 setState(prev => ({ ...prev, userPlan: PlanId.CREATOR }));
                 alert('UPGRADED TO CREATOR PLAN: Accès aux modules GPV2 et Structure Avancée débloqué.');
               }}
               className="text-[9px] font-black text-brand-accent uppercase hover:underline"
             >
               Upgrade
             </button>
           )}
        </div>
        <div className="bg-[#0f1115] border border-slate-800 rounded-lg p-6 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-2 opacity-5">
              <User className="w-12 h-12" />
           </div>
           <p className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em] mb-2">Authenticated as</p>
           <p className="text-xl font-black text-white tracking-tight uppercase">User_0421</p>
           <div className="mt-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Master Identity Active</span>
           </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-brand-bg text-slate-100 font-sans selection:bg-brand-accent selection:text-white">
      {/* Sidebar: Navigation Structure */}
      <nav className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-brand-sidebar border-r border-brand-border/50 hidden lg:flex flex-col">
          <NavigationContent />
      </nav>

      {/* Main Container */}
      <div className="lg:pl-80 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 border-b border-brand-border flex items-center justify-between px-8 bg-brand-sidebar sticky top-0 z-50">
          <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
             <div className="ora-indicator w-4 h-4"></div>
             <span className="font-black text-xl tracking-tighter uppercase">ORA COMPANION</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setState(prev => ({ ...prev, iaOsPreferences: { ...prev.iaOsPreferences, darkMode: !prev.iaOsPreferences.darkMode } }))}>
                {state.iaOsPreferences.darkMode ? <Moon className="w-6 h-6 text-slate-400" /> : <Sun className="w-6 h-6 text-brand-accent" />}
             </button>
             <button onClick={() => setIsMenuOpen(true)}>
               <Menu className="w-8 h-8" />
             </button>
          </div>
        </header>

        {/* Dynamic Header */}
        <header className="hidden lg:flex h-20 border-b border-brand-border items-center justify-between px-10 bg-brand-sidebar/50 backdrop-blur-sm sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <div className="ora-indicator w-2 h-2 opacity-50"></div>
              <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest italic">
                 {state.currentMainView === 'DASHBOARD' ? (
                   state.currentStep === 'CHAT' ? "Session: Qualification sémantique" : 
                   state.currentStep === 'CAPABILITIES' ? "Registry: Sélection active" :
                   state.currentStep === 'RESULTS' ? "Compilation: Rapport final" : "Initialisation ORA"
                 ) : state.currentMainView} 
              </h2>
           </div>
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setState(prev => ({ ...prev, iaOsPreferences: { ...prev.iaOsPreferences, darkMode: !prev.iaOsPreferences.darkMode } }))}
                className="w-10 h-10 rounded border border-brand-border flex items-center justify-center hover:bg-slate-800 transition-colors"
                title="Toggle Light/Dark Mode"
              >
                {state.iaOsPreferences.darkMode ? <Moon className="w-4 h-4 text-slate-400" /> : <Sun className="w-4 h-4 text-brand-accent" />}
              </button>
              <div className="flex items-center gap-4 border-r border-brand-border pr-6 mr-2">
                 <Button 
                   variant="tertiary" 
                   onClick={() => alert('Documentation ORA exhaustive v2.1 accessible.')} 
                   className="h-9 px-3"
                 >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-[9px] lowercase font-black tracking-widest translate-y-[1px]">Docs</span>
                 </Button>
                 <Button 
                   variant="tertiary" 
                   onClick={() => alert('Centre de notifications : Aucun conflit global détecté.')} 
                   className="h-9 w-9 p-0 relative"
                 >
                    <Bell className="w-3.5 h-3.5" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-accent rounded-full border border-brand-sidebar animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                 </Button>
              </div>
              <div className="flex items-center gap-3 bg-slate-900 border border-brand-border rounded-full pl-1 pr-3 py-1 cursor-pointer hover:border-brand-accent/30 transition-all shadow-inner" onClick={() => alert('Profil Utilisateur: ORA_OPERATOR_0421')}>
                 <div className="w-6 h-6 bg-brand-accent/20 rounded-full flex items-center justify-center text-brand-accent font-black text-[10px] shadow-[inset_0_0_10px_rgba(249,115,22,0.1)]">04</div>
                 <User className="w-3.5 h-3.5 text-slate-400" />
                 <span className="text-[10px] font-black text-slate-300 tracking-tight"> Operator_0421</span>
              </div>
              <Button 
                variant="tertiary" 
                onClick={() => alert('Kernel Settings : Protocol V2.1 ACTIVE.')} 
                className="h-9 w-9 p-0"
              >
                 <Settings className="w-3.5 h-3.5" />
              </Button>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 py-10">
          <AnimatePresence mode="wait">
            {state.currentMainView === 'DASHBOARD' ? (
              <motion.div key="dashboard-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <AnimatePresence mode="wait">
                  {state.currentStep === 'LANDING' && (
                    <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <DashboardHome 
                        onStart={handleStart} 
                        credits={state.credits} 
                        userPlan={state.userPlan}
                        customModules={state.customModules}
                        besoin={state.besoin}
                      />
                    </motion.div>
                  )}
                  {state.currentStep === 'CHAT' && (
                    <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ChatScreen 
                        messages={state.messages} 
                        onSendMessage={sendMessage} 
                        onProceed={handleProceedToNeeds} 
                      />
                    </motion.div>
                  )}
                  {state.currentStep === 'CAPABILITIES' && (
                    <motion.div key="caps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <CapabilitiesScreen 
                        selectedIds={state.selectedCapabilities} 
                        onToggle={toggleCapability} 
                        onFinalize={finalizeArtifacts} 
                        userPlan={state.userPlan}
                        isAdmin={state.isAdmin}
                        userProfile={state.userProfile}
                        isCanonDiscovered={state.isCanonDiscovered}
                        modules={modules}
                        capabilities={capabilities}
                      />
                    </motion.div>
                  )}
                  {state.currentStep === 'RESULTS' && state.artifacts && (
                    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ResultsScreen 
                        artifacts={state.artifacts} 
                        onReset={reset} 
                        selectedIds={state.selectedCapabilities} 
                        isAdmin={state.isAdmin}
                        aletheiaReflection={state.aletheiaReflection}
                        onReflectAletheia={handleReflectAletheia}
                        modules={modules}
                        capabilities={capabilities}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : state.currentMainView === 'REGISTRY' ? (
              <motion.div key="registry-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CapabilitiesScreen 
                  selectedIds={state.selectedCapabilities} 
                  onToggle={toggleCapability} 
                  userPlan={state.userPlan}
                  isAdmin={state.isAdmin}
                  userProfile={state.userProfile}
                  isCanonDiscovered={state.isCanonDiscovered}
                  onFinalize={() => {
                    finalizeArtifacts();
                    setState(prev => ({ ...prev, currentMainView: 'DASHBOARD' }));
                  }} 
                  modules={modules}
                  capabilities={capabilities}
                />
              </motion.div>
            ) : state.currentMainView === 'INSTALL_CENTER' ? (
              <motion.div key="install-center-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <InstallCenterScreen />
              </motion.div>
            ) : state.currentMainView === 'ADMIN' ? (
              <motion.div key="admin-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AdminScreen 
                   isAdmin={state.isAdmin}
                   pendingModules={state.customModules.filter(m => m.status === 'PENDING_REVIEW')}
                   onAdminAuth={async (pw) => {
                     try {
                       const auth = await fetchFromApi('/admin/session', {
                         method: 'POST',
                         body: JSON.stringify({ passcode: pw })
                       });
                       if (auth.ok) {
                         setState(prev => ({ ...prev, isAdmin: true }));
                         alert('KERNEL UNLOCKED: Operator session granted.');
                       }
                     } catch (err) {
                       alert('ACCESS DENIED: Admin passcode absent ou incorrect.');
                     }
                   }}
                   onApproveModule={(id, status) => {
                     setState(prev => ({
                        ...prev,
                        customModules: prev.customModules.map(m => m.id === id ? { ...m, status } : m)
                     }));
                     alert(`MODULE_STABILIZED : Le module est désormais en phase ${status}.`);
                   }}
                   onRejectModule={(id) => {
                     setState(prev => ({
                        ...prev,
                        customModules: prev.customModules.map(m => m.id === id ? { ...m, status: 'FORGE' } : m)
                     }));
                     alert('MODULE_REJECTED : Renvoyé à l\'état de brouillon Forge pour correction.');
                   }}
                />
              </motion.div>
            ) : state.currentMainView === 'SETTINGS' ? (
              <motion.div key="settings-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SettingsScreen 
                  profile={state.userProfile} 
                  credits={state.credits}
                  ownedModuleIds={state.ownedModuleIds}
                  customModules={state.customModules}
                  onUpdateProfile={(p) => {
                    setState(prev => ({ ...prev, userProfile: p }));
                    alert('PROFIL CLIENT MIS À JOUR: Recommandations sémantiques calibrées.');
                  }} 
                  modules={modules}
                  preferences={state.iaOsPreferences}
                  onUpdatePreferences={handleUpdatePreferences}
                  userPlan={state.userPlan}
                />
              </motion.div>
            ) : state.currentMainView === 'ACADEMY' ? (
              <motion.div key="academy-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AcademyScreen 
                  onAccessCreatorLab={() => setState(prev => ({ ...prev, currentMainView: 'CREATOR_HUB' }))} 
                  selectedAcademyModules={state.selectedAcademyModules}
                  onToggleModule={toggleAcademyModule}
                  modules={modules}
                />
              </motion.div>
            ) : state.currentMainView === 'SOLUTIONS' ? (
              <motion.div key="solutions-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SolutionsScreen 
                  currentPlan={state.userPlan}
                  onPlanSelect={(p) => setState(prev => ({ ...prev, userPlan: p }))}
                />
              </motion.div>
            ) : state.currentMainView === 'CREATOR_HUB' ? (
              <motion.div key="creator-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CreatorHubScreen 
                  modules={state.customModules} 
                  seedModules={modules}
                  onAddModule={(m) => {
                    const newMod: CustomModule = {
                      id: Date.now().toString(),
                      name: m.name!,
                      essence: m.essence!,
                      description: m.description || '',
                      status: 'FORGE',
                      date: new Date().toISOString().split('T')[0],
                      rarity: m.rarity,
                      marketValue: m.marketValue,
                      complexityScore: m.complexityScore,
                      demandIndex: m.demandIndex,
                      dependencies: m.dependencies || [],
                      conflicts: m.conflicts || []
                    };
                    setState(prev => ({ ...prev, customModules: [newMod, ...prev.customModules] }));
                  }}
                  onDeleteModule={(id) => {
                    setState(prev => ({ ...prev, customModules: prev.customModules.filter(m => m.id !== id) }));
                  }}
                  onDiscoverModules={() => {
                    setState(prev => ({ ...prev, isCanonDiscovered: true }));
                    alert('PROTOCOLE_GITHUB : Découverte de modules Primordia, H-Nerons, HGOV. Ils sont désormais visibles dans le Registry.');
                  }}
                />
              </motion.div>
            ) : (
              <motion.div key="placeholder-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center h-full text-slate-600 uppercase font-black tracking-widest p-20 text-center border border-brand-border border-dashed m-10 rounded-3xl">
                Module {state.currentMainView} sous protocole de maintenance. <br/> Accès restreint au Kernel ORA_CORE_OS.
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[100] bg-brand-sidebar flex flex-col md:hidden"
          >
            <NavigationContent mobile />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
