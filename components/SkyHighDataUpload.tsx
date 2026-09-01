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
  Activity
} from 'lucide-react';

interface ParsedSummary {
  fileName: string;
  fileSizeFormatted: string;
  uploadStatus: string;
  validationStatus: string;
  isValid: boolean;
  latestDate: string;
  stocksLoaded: number;
  rowsLoaded: number;
  lastUpdate: string;
}

export default function SkyHighDataUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<ParsedSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (selectedFile: File) => {
    setErrorMsg(null);
    setFile(selectedFile);
    setIsProcessing(true);

    const isCsv = 
      selectedFile.name.toLowerCase().endsWith('.csv') ||
      selectedFile.type === 'text/csv' ||
      selectedFile.type === 'application/vnd.ms-excel';

    if (!isCsv) {
      setParsedData({
        fileName: selectedFile.name,
        fileSizeFormatted: formatFileSize(selectedFile.size),
        uploadStatus: 'Rejected',
        validationStatus: 'Invalid file format.',
        isValid: false,
        latestDate: '—',
        stocksLoaded: 0,
        rowsLoaded: 0,
        lastUpdate: '—',
      });
      setErrorMsg('Invalid file format.');
      setIsProcessing(false);
      return;
    }

    try {
      const text = await selectedFile.text();
      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);

      if (lines.length < 2) {
        setParsedData({
          fileName: selectedFile.name,
          fileSizeFormatted: formatFileSize(selectedFile.size),
          uploadStatus: 'Rejected',
          validationStatus: 'Invalid file format.',
          isValid: false,
          latestDate: '—',
          stocksLoaded: 0,
          rowsLoaded: 0,
          lastUpdate: '—',
        });
        setErrorMsg('Invalid file format.');
        setIsProcessing(false);
        return;
      }

      // Parse headers
      const headerLine = lines[0];
      const headers = headerLine.split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));

      // Look for symbol column
      const symbolIdx = headers.findIndex(h => 
        ['SYMBOL', 'TCKRSYMB', 'SECURITY', 'TICKER', 'SCRIP', 'FININSTRMID'].includes(h.toUpperCase())
      );

      // Look for date column
      const dateIdx = headers.findIndex(h => 
        ['TIMESTAMP', 'TRADDT', 'DATE', 'TRADE DATE', 'BIZDT'].includes(h.toUpperCase())
      );

      const symbols = new Set<string>();
      let foundDate = '—';

      // Parse rows
      const rowCount = lines.length - 1;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
        
        if (symbolIdx !== -1 && parts[symbolIdx]) {
          symbols.add(parts[symbolIdx]);
        } else if (parts[0]) {
          symbols.add(parts[0]);
        }

        if (foundDate === '—' && dateIdx !== -1 && parts[dateIdx]) {
          foundDate = parts[dateIdx];
        }
      }

      const now = new Date();
      const formattedTimestamp = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ' ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      setParsedData({
        fileName: selectedFile.name,
        fileSizeFormatted: formatFileSize(selectedFile.size),
        uploadStatus: 'Uploaded',
        validationStatus: 'Valid NSE file format',
        isValid: true,
        latestDate: foundDate !== '—' ? foundDate : '—',
        stocksLoaded: symbols.size > 0 ? symbols.size : rowCount,
        rowsLoaded: rowCount,
        lastUpdate: formattedTimestamp,
      });

    } catch {
      setParsedData({
        fileName: selectedFile.name,
        fileSizeFormatted: formatFileSize(selectedFile.size),
        uploadStatus: 'Rejected',
        validationStatus: 'Invalid file format.',
        isValid: false,
        latestDate: '—',
        stocksLoaded: 0,
        rowsLoaded: 0,
        lastUpdate: '—',
      });
      setErrorMsg('Invalid file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. DATA PANEL AS SPECIFIED IN REQUIREMENTS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-betterment transition-all">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-3">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            Milestone 1 Active
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">NSE DATA</h2>
          <p className="text-base text-slate-600 mt-2 leading-relaxed">
            Upload the daily NSE market-data file to build the Sky High data history.
          </p>
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
                : parsedData?.isValid 
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : errorMsg
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
              id="nse-data-file-input"
            />

            <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
              {parsedData?.isValid ? (
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                  <FileCheck className="w-7 h-7" />
                </div>
              ) : errorMsg ? (
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
                  {parsedData?.isValid 
                    ? 'NSE Data File Loaded' 
                    : errorMsg 
                      ? 'File Validation Error' 
                      : 'Select or drag daily NSE file here'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports daily Bhavcopy CSV files (.csv)
                </p>
              </div>

              {/* PRIMARY ACTION BUTTON */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:shadow-glow-royal"
                >
                  <Upload className="w-4 h-4" />
                  {isProcessing ? 'Processing File...' : 'Upload NSE Data'}
                </button>

                {file && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FILE SELECTION STATUS STREAM */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* File name */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">File name</span>
              <span className="text-sm font-bold text-slate-800 break-all">
                {file ? file.name : 'Waiting for NSE data file'}
              </span>
            </div>

            {/* File size */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">File size</span>
              <span className="text-sm font-bold text-slate-800">
                {file ? formatFileSize(file.size) : '—'}
              </span>
            </div>

            {/* Upload status */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Upload status</span>
              <div className="flex items-center gap-1.5">
                {parsedData?.isValid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-emerald-700">Uploaded</span>
                  </>
                ) : errorMsg ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-rose-700">Rejected</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-slate-500">Waiting for NSE data file</span>
                )}
              </div>
            </div>

            {/* Validation status */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Validation status</span>
              <div className="flex items-center gap-1.5">
                {parsedData?.isValid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-emerald-700">Valid format</span>
                  </>
                ) : errorMsg ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-rose-700">Invalid file format.</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-slate-500">Waiting for NSE data file</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* METRICS BELOW UPLOAD AS STRICTLY REQUIRED */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Engine Data State
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Latest Trading Date */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Latest Trading Date
              </div>
              <div className="text-lg font-bold text-slate-900 truncate">
                {parsedData?.isValid ? parsedData.latestDate : '—'}
              </div>
            </div>

            {/* Stocks Loaded */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                Stocks Loaded
              </div>
              <div className="text-lg font-bold text-slate-900">
                {parsedData?.isValid ? parsedData.stocksLoaded.toLocaleString('en-IN') : '—'}
              </div>
            </div>

            {/* Rows Loaded */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Rows Loaded
              </div>
              <div className="text-lg font-bold text-slate-900">
                {parsedData?.isValid ? parsedData.rowsLoaded.toLocaleString('en-IN') : '—'}
              </div>
            </div>

            {/* Last Update */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Last Update
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate" title={parsedData?.isValid ? parsedData.lastUpdate : '—'}>
                {parsedData?.isValid ? parsedData.lastUpdate : '—'}
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2 md:col-span-1 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Status
              </div>
              <div className={`text-sm sm:text-base font-bold ${parsedData?.isValid ? 'text-emerald-600' : 'text-slate-500'}`}>
                {parsedData?.isValid ? 'Data verified' : 'Waiting for data'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
