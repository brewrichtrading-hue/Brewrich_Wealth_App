import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cplgtebmbplroctuqmyz.supabase.co',
  'sb_publishable_JLGeAR1sUYTVLIjVFicmoA_AHeP6hG4'
);

async function inspect() {
  console.log('====================================================');
  console.log('LIVE SUPABASE HISTORICAL DATA INSPECTION (RELIANCE)');
  console.log('====================================================\n');

  // 1. Query all RELIANCE records
  const { data: records, count, error } = await supabase
    .from('skyhigh_market_data')
    .select('trading_date, open, high, low, close, volume, source_file', { count: 'exact' })
    .eq('symbol', 'RELIANCE')
    .order('trading_date', { ascending: true });

  if (error) {
    console.error('❌ Supabase Query Error:', error.message);
    return;
  }

  console.log(`Total RELIANCE records in Supabase: ${count}`);

  if (records && records.length > 0) {
    console.log(`Earliest Date: ${records[0].trading_date}`);
    console.log(`Latest Date:   ${records[records.length - 1].trading_date}`);

    // Year breakdown
    const yearCounts = {};
    const sourceCounts = {};
    records.forEach(r => {
      const year = r.trading_date.slice(0, 4);
      yearCounts[year] = (yearCounts[year] || 0) + 1;
      sourceCounts[r.source_file] = (sourceCounts[r.source_file] || 0) + 1;
    });

    console.log('\nRecords by Year:');
    Object.keys(yearCounts).sort().forEach(y => {
      console.log(`  - ${y}: ${yearCounts[y]} sessions`);
    });

    console.log('\nRecords by Source:');
    Object.keys(sourceCounts).forEach(s => {
      console.log(`  - "${s}": ${sourceCounts[s]} records`);
    });

    console.log('\nFirst 3 Records:');
    records.slice(0, 3).forEach(r => {
      console.log(`  ${r.trading_date} | O: ₹${r.open} | H: ₹${r.high} | L: ₹${r.low} | C: ₹${r.close} | Vol: ${r.volume.toLocaleString('en-IN')} | Source: ${r.source_file}`);
    });

    console.log('\nLatest 3 Records:');
    records.slice(-3).forEach(r => {
      console.log(`  ${r.trading_date} | O: ₹${r.open} | H: ₹${r.high} | L: ₹${r.low} | C: ₹${r.close} | Vol: ${r.volume.toLocaleString('en-IN')} | Source: ${r.source_file}`);
    });
  }

  // 2. Query skyhigh_trading_days
  const { data: days, count: daysCount } = await supabase
    .from('skyhigh_trading_days')
    .select('trading_date, formatted_date, source_file', { count: 'exact' })
    .order('trading_date', { ascending: true });

  console.log(`\nTotal Trading Days in skyhigh_trading_days: ${daysCount}`);
  if (days && days.length > 0) {
    console.log(`Trading Days Range: ${days[0].trading_date} → ${days[days.length - 1].trading_date}`);
  }
  console.log('\n====================================================\n');
}

inspect();
