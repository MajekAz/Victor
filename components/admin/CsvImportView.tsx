import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRight,
  ShieldAlert,
  Copy
} from 'lucide-react';
import { Job, CsvImportSummary } from '../../types.ts';
import { JobService } from '../../services/jobService.ts';

interface CsvImportViewProps {
  onImportCompleted: () => void;
}

export const CsvImportView: React.FC<CsvImportViewProps> = ({ onImportCompleted }) => {
  const [csvText, setCsvText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [summary, setSummary] = useState<CsvImportSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMessage('');
    setSuccessMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      processCsvContent(text);
    };
    reader.readAsText(file);
  };

  // Process & Validate
  const processCsvContent = (content: string) => {
    if (!content.trim()) {
      setErrorMessage('Please provide valid CSV content.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    try {
      const parsed = JobService.parseAndValidateCsv(content);
      setSummary(parsed);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse CSV format.');
      setSummary(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const templateContent = JobService.generateCsvTemplate();
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'promarch_jobs_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Confirm Import of Valid Records
  const handleConfirmImport = async () => {
    if (!summary || summary.validRows === 0) return;

    setIsImporting(true);
    try {
      const validRecords = summary.records
        .filter(r => r.isValid)
        .map(r => r.data as Job);

      const res = await JobService.importCsvJobs(validRecords);
      setSuccessMessage(`Successfully imported ${res.importedCount} vacancies into the system.`);
      setSummary(null);
      setCsvText('');
      setFileName('');
      setTimeout(() => {
        onImportCompleted();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete import.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setCsvText('');
    setFileName('');
    setSummary(null);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="space-y-8" id="admin-csv-import">
      {/* Header & Download Template */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Import Vacancies from CSV
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Batch-upload multiple job postings with automatic validation and duplicate detection.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Download CSV Template</span>
        </button>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Step 1: Upload or Paste */}
      {!summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Upload Box */}
          <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-slate-200 hover:border-blue-500 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer relative min-h-[280px]">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload size={28} />
            </div>
            <h4 className="text-base font-black text-slate-900 mb-1">
              Select or Drop CSV File
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mb-3">
              Upload standard .csv files with header row matching Promarch schema.
            </p>
            {fileName && (
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {fileName}
              </span>
            )}
          </div>

          {/* Direct Paste Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-base font-black text-slate-900 mb-1">
                Or Paste Raw CSV Data
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Paste comma-separated text with column headers directly into this editor.
              </p>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="title,company,location,salaryText,jobType,workArrangement,category,applicationUrl&#10;&quot;Support Worker&quot;,&quot;Apex Care&quot;,&quot;London&quot;,&quot;£14/hr&quot;,&quot;Full-time&quot;,&quot;On-site&quot;,&quot;Care Sector&quot;,&quot;https://...&quot;"
                rows={6}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <button
              type="button"
              disabled={!csvText.trim() || isProcessing}
              onClick={() => processCsvContent(csvText)}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isProcessing ? 'Validating CSV...' : 'Validate & Preview Import'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Pre-Import Preview & Confirmation */}
      {summary && (
        <div className="space-y-6">
          {/* Summary Metric Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Rows</span>
              <span className="text-2xl font-black text-slate-900">{summary.totalRows}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">Ready to Import</span>
              <span className="text-2xl font-black text-emerald-600">{summary.validRows}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block">Invalid Rows</span>
              <span className="text-2xl font-black text-red-600">{summary.invalidRows}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">Duplicates Detected</span>
              <span className="text-2xl font-black text-amber-600">{summary.duplicateCount}</span>
            </div>
          </div>

          {/* Preview Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Record Preview & Validation Status
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                Showing {summary.records.length} records parsed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Row</th>
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4">Validation Status</th>
                    <th className="py-3 px-4">Duplicate Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {summary.records.map((rec) => (
                    <tr key={rec.rawRowIndex} className={rec.isValid ? 'hover:bg-slate-50/50' : 'bg-red-50/30'}>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">#{rec.rawRowIndex}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {rec.data.title || <span className="text-red-500 italic">Missing Title</span>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{rec.data.company}</td>
                      <td className="py-3.5 px-4 text-slate-600">{rec.data.location}</td>
                      <td className="py-3.5 px-4 text-slate-600">{rec.data.category}</td>
                      <td className="py-3.5 px-4">
                        {rec.isValid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                            <CheckCircle2 size={11} /> Valid
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-md text-[10px]">
                              <AlertCircle size={11} /> Error
                            </span>
                            <p className="text-[10px] text-red-600">{rec.errors.join(', ')}</p>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {rec.duplicateWarning ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md text-[10px]">
                              <AlertTriangle size={11} /> Potential Duplicate
                            </span>
                            <p className="text-[10px] text-amber-700">
                              Matches: "{rec.duplicateWarning.existingJob.title}" ({rec.duplicateWarning.reasons.join(', ')})
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Unique</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-black uppercase tracking-wider transition-colors"
              >
                <RotateCcw size={13} />
                <span>Cancel & Start Over</span>
              </button>

              <button
                type="button"
                disabled={summary.validRows === 0 || isImporting}
                onClick={handleConfirmImport}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 shadow-md"
              >
                <CheckCircle2 size={15} />
                <span>{isImporting ? 'Importing Vacancies...' : `Confirm & Import (${summary.validRows} Records)`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
