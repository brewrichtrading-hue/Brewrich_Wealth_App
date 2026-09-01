'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  FileCheck, 
  Calendar, 
  Database, 
  Layers, 
  Clock, 
  Activity, 
  AlertTriangle,
  Cloud,
  RotateCw,
  Server
} from 'lucide-react';
import { parseAndValidateNseCsv } from '@/lib/skyhigh/normalizer';
import { saveDailyDatasetToCloud, verifyCloudDataset } from '@/lib/skyhigh/storage';
import { ValidationReport, ProcessingStage, CloudVerificationResult } from '@/lib/skyhigh/types';

interface SkyHighDataUploadProps {
  onImportComplete?: () => void;
}

export default function SkyHighDataUpload({ onImportComplete }: SkyHighDataUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [cloudVerification, setCloudVerification] = useState<CloudVerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  // Real calculated metrics for the NSE Data card
  const [metrics, setMetrics] = useState<{
    latestTradingDate: string;
    stocksLoaded: number | null;
    rowsLoaded: number | null;
    lastUpdate: string;
    status: string;
    isCloudVerified: boolean;
  }>({
    latestTradingDate: '—',
    stocksLoaded: null,
    rowsLoaded: null,
    lastUpdate: '—',
    status: 'Waiting for data',
    isCloudVerified: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processRealFile = async (selectedFile: File) => {
    setErrorMessage(null);
    setValidationReport(null);
    setCloudVerification(null);
    setBatchProgress(null);
    setFile(selectedFile);

    // 1. Stage: Uploading
    setStage('uploading');

    const isCsv = 
      selectedFile.name.toLowerCase().endsWith('.csv') ||
      selectedFile.type === 'text/csv' ||
      selectedFile.type === 'application/vnd.ms-excel';

    if (!isCsv) {
      setStage('failed');
      setErrorMessage('Invalid file format. Please upload an authentic NSE daily CSV (.csv) file.');
      setValidationReport({
        status: 'Failed',
        tradingDate: '—',
        totalRows: 0,
        validRows: 0,
        rejectedRows: 0,
        duplicateRows: 0,
        missingColumns: ['Unsupported file type (non-CSV)'],
        rejectionReasons: ['File format is not recognized as a valid CSV table.'],
      });
      return;
    }

    try {
      // 2. Stage: Reading file
      setStage('reading');
      const text = await selectedFile.text();

      if (!text || text.trim().length === 0) {
        setStage('failed');
        setErrorMessage('Uploaded file is empty.');
        setValidationReport({
          status: 'Failed',
          tradingDate: '—',
          totalRows: 0,
          validRows: 0,
          rejectedRows: 0,
          duplicateRows: 0,
          missingColumns: ['Empty file'],
          rejectionReasons: ['The selected CSV contains 0 bytes of content.'],
        });
        return;
      }

      // 3. Stage: Validating
      setStage('validating');
      await new Promise(r => setTimeout(r, 50));

      // 4. Stage: Normalizing
      setStage('normalizing');
      const parseResult = parseAndValidateNseCsv(text);
      setValidationReport(parseResult.report);

      if (parseResult.report.status === 'Failed' || parseResult.records.length === 0) {
        setStage('failed');
        setErrorMessage(
          parseResult.report.missingColumns && parseResult.report.missingColumns.length > 0
            ? `DATA VALIDATION FAILED: Missing required market-data columns (${parseResult.report.missingColumns.join(', ')}).`
            : 'DATA VALIDATION FAILED: No valid equity market rows could be constructed.'
        );
        return;
      }

      // 5. Stage: Persisting to Cloud (Chunked Supabase Upsert)
      setStage('persisting');
      setBatchProgress({ current: 0, total: parseResult.records.length });

      const savedDay = await saveDailyDatasetToCloud(
        parseResult.records, 
        selectedFile.name,
        (current, total) => {
          setBatchProgress({ current, total });
        }
      );

      // 6. Stage: Verifying Cloud Persistence
      setStage('verifying');
      const verification = await verifyCloudDataset(savedDay.date, parseResult.records.length);
      setCloudVerification(verification);

      if (!verification.verified) {
        setStage('failed');
        setErrorMessage(`CLOUD PERSISTENCE FAILED: ${verification.error || 'Verification record count did not match.'}`);
        return;
      }

      // 7. Stage: Complete
      setStage('complete');

      const now = new Date();
      const formattedTimestamp = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ', ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Update real engine state
      setMetrics({
        latestTradingDate: savedDay.formattedDate,
        stocksLoaded: savedDay.stockCount,
        rowsLoaded: savedDay.rowCount,
        lastUpdate: formattedTimestamp,
        status: 'Data verified & stored',
        isCloudVerified: true,
      });

      if (onImportComplete) {
        onImportComplete();
      }

    } catch (err: any) {
      setStage('failed');
      setErrorMessage(`CLOUD PERSISTENCE FAILED: ${err?.message || 'An unexpected error occurred.'}`);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processRealFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processRealFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setStage('idle');
    setValidationReport(null);
    setCloudVerification(null);
    setErrorMessage(null);
    setBatchProgress(null);
    setMetrics({
      latestTradingDate: '—',
      stocksLoaded: null,
      rowsLoaded: null,
      lastUpdate: '—',
      status: 'Waiting for data',
      isCloudVerified: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const stagesList: { key: ProcessingStage; label: string }[] = [
    { key: 'uploading', label: 'Uploading' },
    { key: 'reading', label: 'Reading file' },
    { key: 'validating', label: 'Validating' },
    { key: 'normalizing', label: 'Normalizing' },
    { key: 'persisting', label: 'Cloud Persistence' },
    { key: 'verifying', label: 'Cloud Verify' },
    { key: 'complete', label: 'Complete' },
  ];

  const getStageIndex = (s: ProcessingStage) => {
    switch (s) {
      case 'uploading': return 0;
      case 'reading': return 1;
      case 'validating': return 2;
      case 'normalizing': return 3;
      case 'persisting': return 4;
      case 'verifying': return 5;
      case 'complete': return 6;
      default: return -1;
    }
  };

  const currentStageIdx = getStageIndex(stage);

  return (
    <div className="w-full space-y-8">
      
      {/* 1. DATA PANEL */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-betterment transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-3">
              <Server className="w-3.5 h-3.5 text-blue-600" />
              Milestone 3 Supabase Cloud Ingestion
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">NSE DATA</h2>
            <p className="text-base text-slate-600 mt-2 leading-relaxed">
              Upload the daily NSE market-data file to build the Sky High persistent cloud history.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Supabase Connected
            </span>
          </div>
        </div>

        {/* UPLOAD INTERFACE */}
        <div className="mt-8">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 transition-all text-center ${
              isDragging 
                ? 'border-blue-500 bg-blue-50/60' 
                : stage === 'complete' 
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : stage === 'failed'
                    ? 'border-rose-300 bg-rose-50/30'
                    : 'border-slate-200 hover:border-blue-400 bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv,application/vnd.ms-excel"
              onChange={handleFileChange}
              className="hidden"
              id="nse-cloud-file-input"
            />

            <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
              {stage === 'complete' ? (
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                  <FileCheck className="w-7 h-7" />
                </div>
              ) : stage === 'failed' ? (
                <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                  <AlertCircle className="w-7 h-7" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-blue-100/70 flex items-center justify-center text-blue-600 shadow-sm">
                  <Upload className="w-7 h-7" />
                </div>
              )}

              <div>
                <p className="font-semibold text-slate-800 text-base">
                  {stage === 'complete' 
                    ? 'NSE Data Cloud Persisted & Verified' 
                    : stage === 'failed' 
                      ? 'Upload or Cloud Verification Error' 
                      : 'Select or drag daily NSE file here'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Accepts daily Bhavcopy CSV, UDiFF, and equity reports (.csv)
                </p>
              </div>

              {/* PRIMARY ACTION BUTTON */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={stage !== 'idle' && stage !== 'complete' && stage !== 'failed'}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:shadow-glow-royal"
                >
                  {stage === 'failed' ? <RotateCw className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                  {stage !== 'idle' && stage !== 'complete' && stage !== 'failed' 
                    ? 'Processing & Persisting...' 
                    : stage === 'failed'
                      ? 'Retry Upload'
                      : 'Upload NSE Data'}
                </button>

                {file && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PROCESSING STATUS PROGRESS PIPELINE */}
        {stage !== 'idle' && (
          <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Pipeline Execution
                </span>
                {batchProgress && stage === 'persisting' && (
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {batchProgress.current.toLocaleString('en-IN')} / {batchProgress.total.toLocaleString('en-IN')} records
                  </span>
                )}
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                stage === 'complete'
                  ? 'bg-emerald-100 text-emerald-800'
                  : stage === 'failed'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-blue-100 text-blue-800 animate-pulse'
              }`}>
                {stage === 'complete' ? 'Completed & Cloud Verified' : stage === 'failed' ? 'Failed' : 'In Progress'}
              </span>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {stagesList.map((item, idx) => {
                const isPassed = currentStageIdx >= idx;
                const isCurrent = currentStageIdx === idx;
                const isErrorStage = stage === 'failed' && isCurrent;

                return (
                  <div 
                    key={item.key} 
                    className={`p-2.5 rounded-xl text-center text-xs font-semibold flex flex-col items-center justify-center border transition-all ${
                      isErrorStage
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : isPassed
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : isCurrent
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {isPassed && stage !== 'failed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : isErrorStage ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[10px] opacity-75">{idx + 1}.</span>
                      )}
                    </div>
                    <span className="text-[11px] leading-tight">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2-TIER VALIDATION & PERSISTENCE REPORT */}
        <div className="mt-8 space-y-4">
          
          {/* TIER 1: DATA VALIDATION REPORT */}
          {validationReport && (
            <div>
              {validationReport.status === 'Valid' ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-bold text-slate-900 text-base">DATA VALIDATED</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                      Status: Valid
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block">Trading date</span>
                      <span className="text-sm sm:text-base font-bold text-slate-900">{validationReport.tradingDate}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block">Rows</span>
                      <span className="text-sm sm:text-base font-bold text-slate-900">{validationReport.totalRows.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block">Valid</span>
                      <span className="text-sm sm:text-base font-bold text-emerald-700">{validationReport.validRows.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block">Rejected</span>
                      <span className={`text-sm sm:text-base font-bold ${validationReport.rejectedRows > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
                        {validationReport.rejectedRows.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-xs font-semibold text-slate-500 block">Duplicates</span>
                      <span className={`text-sm sm:text-base font-bold ${validationReport.duplicateRows > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
                        {validationReport.duplicateRows.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {validationReport.rejectionReasons && validationReport.rejectionReasons.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-amber-800 flex items-start gap-1.5">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                      <div>
                        <span className="font-semibold">Notice:</span> Some rows were filtered during normalization ({validationReport.rejectionReasons.join('; ')}).
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                      <h4 className="font-bold text-rose-900 text-base">DATA VALIDATION FAILED</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
                      Status: Failed
                    </span>
                  </div>

                  <div className="pt-3 text-xs sm:text-sm text-rose-800 space-y-2">
                    <p className="font-semibold">
                      The uploaded file does not contain enough market-data fields to safely construct the required OHLCV dataset.
                    </p>
                    
                    {validationReport.missingColumns && validationReport.missingColumns.length > 0 && (
                      <div className="p-3 bg-white rounded-xl border border-rose-200/80">
                        <span className="font-bold text-rose-950 block mb-1">Missing required columns:</span>
                        <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-rose-900">
                          {validationReport.missingColumns.map((col, idx) => (
                            <li key={idx}>{col}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TIER 2: CLOUD PERSISTENCE & VERIFICATION REPORT */}
          {cloudVerification && (
            <div>
              {cloudVerification.verified ? (
                <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-bold text-emerald-950 text-base">DATA PERSISTED & CLOUD VERIFIED</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
                      Cloud Verified ✓
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs text-emerald-900">
                    <div>
                      <span className="font-semibold text-emerald-700 block">Cloud Records Confirmed:</span>
                      <span className="text-base font-bold text-emerald-950">{cloudVerification.cloudCount.toLocaleString('en-IN')} rows</span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-700 block">Sample Retrievability Test:</span>
                      <span className="text-base font-bold text-emerald-950">{cloudVerification.sampleRetrieved} records retrieved</span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-700 block">Verification Timestamp:</span>
                      <span className="text-base font-bold text-emerald-950">{cloudVerification.timestamp}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                      <h4 className="font-bold text-rose-950 text-base">CLOUD PERSISTENCE FAILED</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
                      Cloud Error
                    </span>
                  </div>
                  <p className="pt-3 text-xs text-rose-800">
                    {cloudVerification.error || errorMessage || 'Records could not be confirmed in Supabase.'}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* METRICS BELOW UPLOAD */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Dataset Status
            </h4>
            <span className="text-xs text-slate-400 font-medium">Real-time calculations</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Latest Trading Date */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Latest Trading Date
              </div>
              <div className="text-lg font-bold text-slate-900 truncate">
                {metrics.latestTradingDate}
              </div>
            </div>

            {/* Stocks Loaded */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                Stocks Loaded
              </div>
              <div className="text-lg font-bold text-slate-900">
                {metrics.stocksLoaded !== null ? metrics.stocksLoaded.toLocaleString('en-IN') : '—'}
              </div>
            </div>

            {/* Rows Loaded */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Rows Loaded
              </div>
              <div className="text-lg font-bold text-slate-900">
                {metrics.rowsLoaded !== null ? metrics.rowsLoaded.toLocaleString('en-IN') : '—'}
              </div>
            </div>

            {/* Last Update */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Last Update
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate" title={metrics.lastUpdate}>
                {metrics.lastUpdate}
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2 md:col-span-1 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Status
              </div>
              <div className={`text-sm sm:text-base font-bold flex items-center gap-1 ${
                metrics.stocksLoaded !== null ? 'text-emerald-600' : 'text-slate-500'
              }`}>
                {metrics.status}
                {metrics.isCloudVerified && <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
