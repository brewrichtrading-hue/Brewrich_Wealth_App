/**
 * BREWRICH SKY HIGH - DEFINEDGE MASTER FILE SERVICE (PHASE 4)
 * 
 * Manages Definedge Securities NSE Cash Master File:
 * - Downloads public master zip: https://app.definedgesecurities.com/public/nsecash.zip
 * - Parses and indexes 9,800+ NSE Cash instruments in memory (zero external dependencies).
 * - Maps SYMBOL -> NSE token -> trading symbol / metadata.
 * - Caches in memory to ensure sub-millisecond lookups.
 */

import https from 'https';
import zlib from 'zlib';

export interface DefinedgeSecurity {
  segment: string;       // e.g. 'NSE'
  token: string;         // e.g. '2885'
  symbol: string;        // e.g. 'RELIANCE'
  tradingsym: string;    // e.g. 'RELIANCE-EQ'
  series: string;        // e.g. 'EQ', 'BE', 'SM'
  company: string;       // e.g. 'RELIANCE INDUSTRIES LTD'
}

interface MasterCache {
  loadedAt: number;
  bySymbol: Map<string, DefinedgeSecurity>;
  byToken: Map<string, DefinedgeSecurity>;
  allSecurities: DefinedgeSecurity[];
}

let masterCache: MasterCache | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Pure Node.js ZIP decompressor using Central Directory parsing and standard zlib.
 */
function extractZipFromCentralDir(buffer: Buffer): string {
  // 1. Locate End of Central Directory Record (EOCD signature: 0x06054b50)
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error('Invalid ZIP: End of Central Directory record not found.');
  }

  const cdOffset = buffer.readUInt32LE(eocdOffset + 16);
  const totalEntries = buffer.readUInt16LE(eocdOffset + 10);

  let offset = cdOffset;
  for (let i = 0; i < totalEntries; i++) {
    const sig = buffer.readUInt32LE(offset);
    if (sig !== 0x02014b50) break; // Central directory header

    const compMethod = buffer.readUInt16LE(offset + 10);
    const compSize = buffer.readUInt32LE(offset + 20);
    const nameLen = buffer.readUInt16LE(offset + 28);
    const extraLen = buffer.readUInt16LE(offset + 30);
    const commentLen = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);

    // Read local file header to find exact compressed payload start
    const localNameLen = buffer.readUInt16LE(localOffset + 26);
    const localExtraLen = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLen + localExtraLen;
    const compData = buffer.subarray(dataStart, dataStart + compSize);

    if (compMethod === 8) {
      // Deflate
      const decompressed = zlib.inflateRawSync(compData);
      return decompressed.toString('utf8');
    } else if (compMethod === 0) {
      // Stored (no compression)
      return compData.toString('utf8');
    }

    offset += 46 + nameLen + extraLen + commentLen;
  }

  throw new Error('Failed to decompress CSV file from Definedge master ZIP.');
}

/**
 * Downloads the latest NSE Cash Master File zip from Definedge.
 */
function downloadMasterZip(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const url = 'https://app.definedgesecurities.com/public/nsecash.zip';
    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Definedge master file download failed with HTTP ${res.statusCode}`));
      }

      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', (err) => reject(err));
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Definedge master file download timed out (15s).'));
    });
  });
}

/**
 * Retrieves and caches the Definedge NSE Cash Master File.
 */
export async function getDefinedgeMaster(forceRefresh = false): Promise<MasterCache> {
  const now = Date.now();
  if (!forceRefresh && masterCache && (now - masterCache.loadedAt < CACHE_TTL_MS)) {
    return masterCache;
  }

  const zipBuffer = await downloadMasterZip();
  const csvContent = extractZipFromCentralDir(zipBuffer);

  const bySymbol = new Map<string, DefinedgeSecurity>();
  const byToken = new Map<string, DefinedgeSecurity>();
  const allSecurities: DefinedgeSecurity[] = [];

  const lines = csvContent.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(',');
    if (parts.length >= 5) {
      const segment = parts[0]?.trim() || 'NSE';
      const token = parts[1]?.trim();
      const symbol = parts[2]?.trim().toUpperCase();
      const tradingsym = parts[3]?.trim();
      const series = parts[4]?.trim().toUpperCase();
      const company = (parts[14] || '').replace(/\r$/, '').trim();

      if (!symbol || !token) continue;

      const record: DefinedgeSecurity = {
        segment,
        token,
        symbol,
        tradingsym,
        series,
        company,
      };

      // Prioritize EQ series if multiple records exist with same symbol
      if (!bySymbol.has(symbol) || series === 'EQ') {
        bySymbol.set(symbol, record);
      }
      byToken.set(token, record);
      allSecurities.push(record);
    }
  }

  masterCache = {
    loadedAt: now,
    bySymbol,
    byToken,
    allSecurities,
  };

  return masterCache;
}

/**
 * Looks up a security by its NSE trading symbol (e.g. 'RELIANCE').
 */
export async function lookupDefinedgeSymbol(symbol: string): Promise<DefinedgeSecurity | null> {
  const master = await getDefinedgeMaster();
  const clean = symbol.trim().toUpperCase();
  return master.bySymbol.get(clean) || null;
}

/**
 * Looks up a security by its Definedge NSE token (e.g. '2885').
 */
export async function lookupDefinedgeToken(token: string): Promise<DefinedgeSecurity | null> {
  const master = await getDefinedgeMaster();
  const clean = token.trim();
  return master.byToken.get(clean) || null;
}

/**
 * Fast search over Definedge securities by symbol or company name.
 */
export async function searchDefinedgeSecurities(query: string, limit = 15): Promise<DefinedgeSecurity[]> {
  const master = await getDefinedgeMaster();
  const q = query.trim().toUpperCase();
  if (!q) return master.allSecurities.slice(0, limit);

  const results: DefinedgeSecurity[] = [];
  for (const sec of master.allSecurities) {
    if (sec.symbol.includes(q) || sec.company.toUpperCase().includes(q)) {
      results.push(sec);
      if (results.length >= limit) break;
    }
  }
  return results;
}
