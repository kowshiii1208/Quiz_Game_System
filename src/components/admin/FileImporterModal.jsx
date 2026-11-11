import React, { useState } from 'react';
import { Upload, FileText, Download, Check, AlertCircle, X, Loader2, Sparkles, FileSpreadsheet, Code } from 'lucide-react';
import mammoth from 'mammoth';

export const FileImporterModal = ({ isOpen, onClose, onImportQuestions, existingQuestionsCount }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [parseError, setParseError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('CPP'); // Default fallback target language

  if (!isOpen) return null;

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setParseError('');
    setParsedQuestions([]);

    const ext = file.name.split('.').pop().toLowerCase();
    setFileType(ext);

    // Auto Parse file contents
    parseFile(file, ext);
  };

  const parseFile = async (file, ext) => {
    setIsLoading(true);
    setParseError('');

    try {
      if (ext === 'json') {
        const text = await file.text();
        const json = JSON.parse(text);
        if (!Array.isArray(json)) {
          throw new Error("JSON file must contain an array of question objects.");
        }
        const formatted = json.map((q, idx) => ({
          text: q.text || q.question || '',
          options: q.options || [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
          correctOptionIndex: q.correctOptionIndex !== undefined ? Number(q.correctOptionIndex) : (q.correctIndex || 0),
          difficulty: (q.difficulty || 'EASY').toUpperCase(),
          language: (q.language || selectedLanguage).toUpperCase(),
          topic: q.topic || 'Imported Subject',
          explanation: q.explanation || 'Imported question.'
        }));
        validateAndSet(formatted);
      } else if (ext === 'csv') {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) throw new Error("CSV file must have headers and at least 1 question row.");

        // CSV parser supporting commas inside quoted cells
        const parseCsvLine = (row) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let j = 0; j < row.length; j++) {
            const ch = row[j];
            if (ch === '"') {
              inQuotes = !inQuotes;
            } else if (ch === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += ch;
            }
          }
          result.push(current.trim());
          return result;
        };

        const formatted = [];
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCsvLine(lines[i]);
          if (cols.length >= 6) {
            const rawLang = (cols[7] || selectedLanguage).toUpperCase();
            formatted.push({
              text: cols[0],
              options: [cols[1], cols[2], cols[3], cols[4]],
              correctOptionIndex: Math.min(3, Math.max(0, Number(cols[5]) || 0)),
              difficulty: ['EASY', 'MEDIUM', 'HARD'].includes((cols[6] || '').toUpperCase()) ? cols[6].toUpperCase() : 'EASY',
              language: ['C', 'CPP', 'JAVA', 'PYTHON'].includes(rawLang) ? rawLang : selectedLanguage,
              topic: cols[8] || 'Imported Topic',
              explanation: cols[9] || ''
            });
          }
        }
        validateAndSet(formatted);
      } else if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const rawText = result.value;
        const parsed = parseTextFormat(rawText);
        validateAndSet(parsed);
      } else if (ext === 'txt' || ext === 'pdf') {
        // Plain text or PDF text extractor
        const text = await file.text();
        const parsed = parseTextFormat(text);
        validateAndSet(parsed);
      } else {
        throw new Error("Unsupported file format. Please upload .json, .csv, .txt, .docx, or .pdf");
      }
    } catch (err) {
      console.error("File Parse Error:", err);
      setParseError(err.message || "Failed to parse file. Please check format.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generic Text Parser for TXT / DOCX / PDF
  const parseTextFormat = (text) => {
    // Looks for patterns like:
    // Q: What is encapsulation?
    // A: Binding data and functions
    // B: Hiding code
    // C: Inheriting features
    // D: Polymorphism
    // Answer: A (or 0)
    // Language: JAVA
    // Difficulty: EASY
    const questions = [];
    const blocks = text.split(/(?:Q:|Question\s*\d+:)/i).filter(b => b.trim().length > 0);

    blocks.forEach((block) => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 5) return;

      const qText = lines[0];
      const options = [];
      let correctIdx = 0;
      let diff = 'EASY';
      let lang = selectedLanguage;
      let topic = 'Imported Topic';
      let explanation = '';

      lines.forEach(line => {
        if (/^[A-D][:\.\)]/i.test(line)) {
          options.push(line.replace(/^[A-D][:\.\)]\s*/i, ''));
        } else if (/^Answer[:\s]/i.test(line)) {
          const val = line.replace(/^Answer[:\s]*/i, '').trim().toUpperCase();
          if (val === 'A' || val === '0') correctIdx = 0;
          else if (val === 'B' || val === '1') correctIdx = 1;
          else if (val === 'C' || val === '2') correctIdx = 2;
          else if (val === 'D' || val === '3') correctIdx = 3;
        } else if (/^Language[:\s]/i.test(line)) {
          lang = line.replace(/^Language[:\s]*/i, '').trim().toUpperCase();
        } else if (/^Difficulty[:\s]/i.test(line)) {
          diff = line.replace(/^Difficulty[:\s]*/i, '').trim().toUpperCase();
        } else if (/^Topic[:\s]/i.test(line)) {
          topic = line.replace(/^Topic[:\s]*/i, '').trim();
        } else if (/^Explanation[:\s]/i.test(line)) {
          explanation = line.replace(/^Explanation[:\s]*/i, '').trim();
        }
      });

      if (qText && options.length >= 4) {
        questions.push({
          text: qText,
          options: options.slice(0, 4),
          correctOptionIndex: correctIdx,
          difficulty: ['EASY', 'MEDIUM', 'HARD'].includes(diff) ? diff : 'EASY',
          language: ['C', 'CPP', 'JAVA', 'PYTHON'].includes(lang) ? lang : selectedLanguage,
          topic,
          explanation
        });
      }
    });

    if (questions.length === 0) {
      throw new Error("Could not detect questions in file. Ensure questions follow format: Q: ..., A: ..., B: ..., C: ..., D: ..., Answer: A");
    }

    return questions;
  };

  const validateAndSet = (list) => {
    const valid = list.filter(q => q.text && Array.isArray(q.options) && q.options.length >= 4);
    if (valid.length === 0) {
      setParseError("No valid 4-option MCQ questions found in file.");
    } else {
      setParsedQuestions(valid);
    }
  };
  const handleConfirmImport = () => {
    if (parsedQuestions.length === 0) return;
    onImportQuestions(parsedQuestions);
    setSelectedFile(null);
    setParsedQuestions([]);
    setParseError('');
    onClose();
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setParsedQuestions([]);
    setParseError('');
    onClose();
  };

  // Download Sample Files helper
  const downloadSampleJSON = () => {
    const sample = [
      {
        text: "What is the primary feature of Object-Oriented Programming in Java?",
        options: ["Encapsulation", "Pointers", "Manual Memory Management", "Preprocessors"],
        correctOptionIndex: 0,
        difficulty: "EASY",
        language: "JAVA",
        topic: "Java OOP",
        explanation: "Encapsulation binds data and code together."
      },
      {
        text: "Which keyword defines a function in Python?",
        options: ["func", "def", "function", "define"],
        correctOptionIndex: 1,
        difficulty: "EASY",
        language: "PYTHON",
        topic: "Python Basics",
        explanation: "def keyword defines functions in Python."
      }
    ];
    downloadBlob(JSON.stringify(sample, null, 2), "sample_quiz_questions.json", "application/json");
  };

  const downloadSampleCSV = () => {
    const headers = "Text,OptionA,OptionB,OptionC,OptionD,CorrectIndex,Difficulty,Language,Topic,Explanation\n";
    const row1 = `"What is virtual function in C++?","Base method for dynamic binding","Static method","Friend method","Inline method",0,"MEDIUM","CPP","Polymorphism","Virtual methods enable runtime polymorphism."\n`;
    const row2 = `"Which method acts as constructor in Python?","__create__","__init__","__main__","constructor",1,"EASY","PYTHON","Constructors","__init__ is Python's instance initializer."\n`;
    downloadBlob(headers + row1 + row2, "sample_quiz_questions.csv", "text/csv");
  };

  const downloadSampleTXT = () => {
    const txt = `Q: What is the root class of Java class hierarchy?
A: System
B: Object
C: Class
D: Base
Answer: B
Language: JAVA
Difficulty: EASY
Topic: Java Core
Explanation: java.lang.Object is the top-level parent class.

Q: Which keyword inherits a class in C++?
A: extends
B: implements
C: : public
D: super
Answer: C
Language: CPP
Difficulty: EASY
Topic: Inheritance
Explanation: C++ uses colon specifiers for inheritance.
`;
    downloadBlob(txt, "sample_quiz_questions.txt", "text/plain");
  };

  const downloadBlob = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-2xl w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 relative my-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Bulk Question File Importer</h2>
              <p className="text-xs text-slate-400">Upload PDF, Word (.docx), TXT, JSON, or CSV question banks</p>
            </div>
          </div>

          <button onClick={handleCloseModal} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample Templates Section */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-amber-400" />
              Download Sample Formatted Templates
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={downloadSampleJSON}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center space-x-1.5 border border-slate-700"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sample JSON</span>
            </button>
            <button
              onClick={downloadSampleCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center space-x-1.5 border border-slate-700"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>Sample CSV</span>
            </button>
            <button
              onClick={downloadSampleTXT}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center space-x-1.5 border border-slate-700"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sample TXT</span>
            </button>
          </div>
        </div>

        {/* Target Fallback Language Selection */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 uppercase">Default Target Language for Imported Questions</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
          >
            <option value="C">C Programming (C)</option>
            <option value="CPP">C++ (CPP)</option>
            <option value="JAVA">Java</option>
            <option value="PYTHON">Python</option>
          </select>
        </div>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/80 rounded-2xl p-8 text-center bg-slate-950/50 transition-all cursor-pointer relative">
          <input
            type="file"
            accept=".json,.csv,.txt,.docx,.pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <Upload className="w-10 h-10 text-indigo-400 mx-auto mb-2 animate-bounce" />
          <p className="text-sm font-bold text-white">Click or drag & drop question file here</p>
          <p className="text-xs text-slate-400 mt-1">Supports .pdf, .docx, .txt, .json, .csv files</p>

          {selectedFile && (
            <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>{selectedFile.name}</span>
            </div>
          )}
        </div>

        {/* Parsing state loader */}
        {isLoading && (
          <div className="flex items-center justify-center space-x-2 text-indigo-400 text-xs py-2 font-bold">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Parsing file questions...</span>
          </div>
        )}

        {/* Error Notification */}
        {parseError && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{parseError}</span>
          </div>
        )}

        {/* Parsed Preview */}
        {parsedQuestions.length > 0 && !isLoading && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center">
                <Check className="w-4 h-4 mr-1" />
                Parsed {parsedQuestions.length} Questions Successfully!
              </span>
              <span className="text-slate-400">Total bank will become: {existingQuestionsCount + parsedQuestions.length}</span>
            </div>

            {/* Snippet Preview list */}
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {parsedQuestions.map((q, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-300">
                    <span>Q{idx + 1}. {q.text}</span>
                    <span className="text-indigo-400">[{q.language}]</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Correct Option: <strong className="text-emerald-400">[{String.fromCharCode(65 + q.correctOptionIndex)}] {q.options[q.correctOptionIndex]}</strong>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirmImport}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Import {parsedQuestions.length} Questions</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};