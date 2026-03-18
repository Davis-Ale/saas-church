async function test() {
  try {
    console.log('Testing Members...');
    const m = await import('./routes/members.routes');
    console.log('Members:', typeof m.default);
    
    console.log('Testing Small Groups...');
    const s = await import('./routes/smallGroups.routes');
    console.log('Small Groups:', typeof s.default);
    
    console.log('Testing Ministries...');
    const mi = await import('./routes/ministries.routes');
    console.log('Ministries:', typeof mi.default);
    
    console.log('Testing Events...');
    const e = await import('./routes/events.routes');
    console.log('Events:', typeof e.default);
    
    console.log('Testing Finance...');
    const f = await import('./routes/finance.routes');
    console.log('Finance:', typeof f.default);
  } catch (err: any) {
    console.error('ERROR:', err.message);
  }
}

test();
