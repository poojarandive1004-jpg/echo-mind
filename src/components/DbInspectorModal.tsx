import React, { useState, useEffect } from 'react';
import { X, Database, RefreshCw, Key, Shield, Layers, Code, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const DbInspectorModal: React.FC = () => {
  const { isDbInspectorOpen, setIsDbInspectorOpen, refreshData, setNotification } = useApp();
  const [dbData, setDbData] = useState<any>(null);
  const [activeTable, setActiveTable] = useState<string>('users');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isDbInspectorOpen) {
      loadInspection();
    }
  }, [isDbInspectorOpen]);

  const loadInspection = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDbInspection();
      setDbData(data);
    } catch (err) {
      console.error('Failed to load database inspection data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset database to initial BCA project state with demo records?')) {
      setIsLoading(true);
      await api.resetDemoDb();
      await refreshData();
      await loadInspection();
      setNotification({ message: 'Database reset to initial demo state successfully.', type: 'info' });
      setIsLoading(false);
    }
  };

  if (!isDbInspectorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-rose-50/50 dark:bg-stone-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 rounded-2xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 font-heading">
                  BCA Project Database & Architecture Inspector
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                  Viva Demonstration
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Inspect relational tables, primary/foreign key mappings (userId isolation), and system schemas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadInspection}
              disabled={isLoading}
              className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
              title="Refresh DB tables"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsDbInspectorOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Project Architecture Overview Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-3 bg-stone-50/60 dark:bg-stone-800/20 border-b border-stone-100 dark:border-stone-800 text-xs">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Architecture</span>
            <span className="font-semibold text-stone-700 dark:text-stone-200">Full-Stack MVC + GenAI</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Relational Engine</span>
            <span className="font-semibold text-stone-700 dark:text-stone-200">JSON Relational Engine (PK/FK)</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">NLP AI Model</span>
            <span className="font-semibold text-stone-700 dark:text-stone-200">Google Gemini 3.8 Flash</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Privacy Layer</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Strict Per-User Scoping
            </span>
          </div>
        </div>

        {/* Table Selector Tabs */}
        {dbData && (
          <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-stone-100 dark:border-stone-800 overflow-x-auto">
            {Object.keys(dbData.tables).map((tKey) => {
              const table = dbData.tables[tKey];
              const isSelected = activeTable === tKey;
              return (
                <button
                  key={tKey}
                  onClick={() => setActiveTable(tKey)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                    isSelected
                      ? 'bg-pink-100 dark:bg-pink-950/70 text-pink-800 dark:text-pink-200 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="capitalize">{tKey}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-mono">
                    {table.rowCount}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Table Details & Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {dbData && dbData.tables[activeTable] ? (
            <>
              {/* Schema Definition Card */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-100 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
                    <Key className="w-3.5 h-3.5 text-pink-500" />
                    <span>Schema Definition for Table: <code className="text-pink-600 dark:text-pink-400 font-mono">{activeTable}</code></span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {dbData.tables[activeTable].rowCount} total rows
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dbData.tables[activeTable].schema.map((col: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              {/* Records JSON Viewer */}
              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                <div className="px-4 py-2 bg-stone-100 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 font-mono">
                  <span>Live Record Entities ({activeTable})</span>
                  <span>JSON Payload View</span>
                </div>
                <pre className="p-4 text-xs font-mono text-stone-800 dark:text-stone-200 bg-stone-50/50 dark:bg-stone-950 overflow-x-auto max-h-80 selection:bg-pink-300">
                  {JSON.stringify(dbData.tables[activeTable].records, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-stone-400 text-sm">
              Loading database tables...
            </div>
          )}
        </div>

        {/* Footer with Reset Button */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900 text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Multi-User Isolated Database Integrity Active</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-stone-200 dark:border-stone-700"
            >
              Reset to Demo Seed State
            </button>
            <button
              onClick={() => setIsDbInspectorOpen(false)}
              className="px-4 py-1.5 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-medium text-xs hover:opacity-90 transition-opacity"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
