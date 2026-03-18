async function test() {
  try {
    console.log('Testing Members...');
    const m = await import('./routes/members.routes.js');
    console.log('Members:', typeof m.default);
    
    console.log('Testing Small Groups...');
    const s = await import('./routes/smallGroups.routes.js');
    console.log('Small Groups:', typeof s.default);
    
    console.log('Testing Ministries...');
    const mi = await import('./routes/ministries.routes.js');
    console.log('Ministries:', typeof mi.default);
    
    console.log('Testing Events...');
    const e = await import('./routes/events.routes.js');
    console.log('Events:', typeof e.default);
    
    console.log('Testing Finance...');
    const f = await import('./routes/finance.routes.js');
    console.log('Finance:', typeof f.default);
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

test();
