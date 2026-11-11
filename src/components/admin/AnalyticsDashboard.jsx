import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Clock, 
  Code2, 
  Cpu, 
  Terminal,
  Users,
  Binary
} from 'lucide-react';

export const AnalyticsDashboard = ({ questions = [], leaderboard = [] }) => {
  const totalAttempts = leaderboard.length;
  const passedAttempts = leaderboard.filter(r => !r.cheatingDetected && r.percentage >= 60).length;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
  const cheatingCount = leaderboard.filter(r => r.cheatingDetected).length;

  // Grade Distribution Buckets
  const tier90 = leaderboard.filter(r => !r.cheatingDetected && r.percentage >= 90).length;
  const tier70 = leaderboard.filter(r => !r.cheatingDetected && r.percentage >= 70 && r.percentage < 90).length;
  const tier50 = leaderboard.filter(r => !r.cheatingDetected && r.percentage >= 50 && r.percentage < 70).length;
  const tierFail = leaderboard.filter(r => r.cheatingDetected || r.percentage < 50).length;

  const getBucketPercent = (count) => {
    return totalAttempts > 0 ? Math.round((count / totalAttempts) * 100) : 0;
  };

  // Language Breakdown
  const cAttempts = leaderboard.filter(r => r.student?.language === 'C');
  const cppAttempts = leaderboard.filter(r => (r.student?.language || 'CPP') === 'CPP');
  const javaAttempts = leaderboard.filter(r => r.student?.language === 'JAVA');
  const pythonAttempts = leaderboard.filter(r => r.student?.language === 'PYTHON');

  const getAvgScore = (list) => {
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, r) => acc + (r.percentage || 0), 0);
    return Math.round(sum / list.length);
  };

  // Topic Coverage Map
  const topicMap = {};
  questions.forEach(q => {
    const topic = q.topic || 'General OOP';
    topicMap[topic] = (topicMap[topic] || 0) + 1;
  });

  const topTopics = Object.entries(topicMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="space-y-6">
      
      {/* 4 Key Institutional KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Total Question Bank</span>
            <span className="text-3xl font-black text-white">{questions.length}</span>
            <span className="text-[11px] text-indigo-400 block mt-1">Multi-language MCQs</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Candidates Evaluated</span>
            <span className="text-3xl font-black text-indigo-400">{totalAttempts}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Total attempts recorded</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Institutional Pass Rate</span>
            <span className="text-3xl font-black text-emerald-400">{passRate}%</span>
            <span className="text-[11px] text-emerald-400/80 block mt-1">{passedAttempts} Passed benchmark</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Proctoring Violations</span>
            <span className="text-3xl font-black text-rose-400">{cheatingCount}</span>
            <span className="text-[11px] text-rose-400/80 block mt-1">Flagged for review</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Row 2: Score Distribution Visualizer + Language Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Grade Distribution Bar Graph */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Performance Distribution (Bell Curve Metrics)</span>
            </h4>
            <span className="text-[11px] text-slate-400">N = {totalAttempts} Submissions</span>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { label: '🏆 Honors / Master (≥ 90%)', count: tier90, percent: getBucketPercent(tier90), color: 'bg-emerald-500' },
              { label: '⭐ Advanced Developer (70% - 89%)', count: tier70, percent: getBucketPercent(tier70), color: 'bg-indigo-500' },
              { label: '👍 Competent Pass (50% - 69%)', count: tier50, percent: getBucketPercent(tier50), color: 'bg-amber-500' },
              { label: '⚠️ Needs Revision / Flagged (< 50%)', count: tierFail, percent: getBucketPercent(tierFail), color: 'bg-rose-500' }
            ].map((bar, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{bar.label}</span>
                  <span className="font-mono text-slate-400">{bar.count} students ({bar.percent}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full rounded-full ${bar.color} transition-all duration-700`}
                    style={{ width: `${Math.max(bar.percent, totalAttempts > 0 ? 3 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Track Metrics */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Track Breakdown</span>
          </h4>

          <div className="space-y-3">
            {[
              { name: 'C Programming', icon: Binary, attempts: cAttempts.length, avg: getAvgScore(cAttempts), color: 'text-cyan-400 border-cyan-500/30' },
              { name: 'C++ Architecture', icon: Cpu, attempts: cppAttempts.length, avg: getAvgScore(cppAttempts), color: 'text-blue-400 border-blue-500/30' },
              { name: 'Java Enterprise', icon: Code2, attempts: javaAttempts.length, avg: getAvgScore(javaAttempts), color: 'text-amber-400 border-amber-500/30' },
              { name: 'Python Core', icon: Terminal, attempts: pythonAttempts.length, avg: getAvgScore(pythonAttempts), color: 'text-emerald-400 border-emerald-500/30' }
            ].map(track => {
              const Icon = track.icon;
              return (
                <div key={track.name} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-lg bg-slate-800/80 border ${track.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{track.name}</span>
                      <span className="text-[10px] text-slate-400">{track.attempts} Candidates</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-400 block">{track.avg}%</span>
                    <span className="text-[10px] text-slate-500">Avg Score</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 3: Question Topic Breakdown */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Curriculum Topic Distribution in Question Bank</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {topTopics.map(([topic, count]) => (
            <div key={topic} className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center space-y-1">
              <span className="text-lg font-black text-white block">{count}</span>
              <span className="text-[11px] font-medium text-slate-400 truncate block" title={topic}>{topic}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

