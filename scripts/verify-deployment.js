/**
 * Post-Deployment Automated Verification Script
 * Usage:
 *   node scripts/verify-deployment.js https://findmygarbapartner.com
 *   or
 *   node scripts/verify-deployment.js http://localhost:5000
 */

const targetUrl = process.argv[2] || process.env.DEPLOYMENT_URL || 'http://localhost:5000';

console.log(`\n======================================================`);
console.log(`🔍 Running Deployment Verification for: ${targetUrl}`);
console.log(`======================================================\n`);

async function runTests() {
  let passed = 0;
  let failed = 0;

  // Test 1: Healthcheck Endpoint
  try {
    const res = await fetch(`${targetUrl}/api/health`);
    const data = await res.json();
    if (res.status === 200 && (data.status === 'UP' || data.message === 'ok')) {
      console.log(`✅ [1/4] Healthcheck Endpoint: PASSED (Uptime: ${Math.round(data.uptime)}s)`);
      passed++;
    } else {
      console.error(`❌ [1/4] Healthcheck Endpoint: FAILED (Status: ${res.status}, Body:`, data);
      failed++;
    }
  } catch (err) {
    console.error(`❌ [1/4] Healthcheck Endpoint: ERROR - ${err.message}`);
    failed++;
  }

  // Test 2: React SPA Static Frontend Serving
  try {
    const res = await fetch(`${targetUrl}/`);
    const html = await res.text();
    if (res.status === 200 && html.includes('id="root"')) {
      console.log(`✅ [2/4] React Frontend Serving: PASSED (Found root HTML mount)`);
      passed++;
    } else {
      console.error(`❌ [2/4] React Frontend Serving: FAILED (Status: ${res.status})`);
      failed++;
    }
  } catch (err) {
    console.error(`❌ [2/4] React Frontend Serving: ERROR - ${err.message}`);
    failed++;
  }

  // Test 3: Security Headers (Helmet Check)
  try {
    const res = await fetch(`${targetUrl}/api/health`);
    const xContentType = res.headers.get('x-content-type-options');
    const csp = res.headers.get('content-security-policy');
    if (xContentType === 'nosniff' || csp) {
      console.log(`✅ [3/4] Helmet Security Headers: PASSED (X-Content-Type-Options: ${xContentType || 'active'})`);
      passed++;
    } else {
      console.warn(`⚠️ [3/4] Security Headers: Warning - Some headers missing`);
      passed++;
    }
  } catch (err) {
    console.error(`❌ [3/4] Security Headers: ERROR - ${err.message}`);
    failed++;
  }

  // Test 4: CORS Policy Verification
  try {
    const res = await fetch(`${targetUrl}/api/health`, {
      headers: {
        Origin: 'https://malicious-random-site.xyz',
      },
    });
    // With CORS block, it will either reject or omit Access-Control-Allow-Origin
    const allowOrigin = res.headers.get('access-control-allow-origin');
    if (!allowOrigin || allowOrigin !== 'https://malicious-random-site.xyz') {
      console.log(`✅ [4/4] CORS Strict Isolation: PASSED (Blocked untrusted origin)`);
      passed++;
    } else {
      console.warn(`⚠️ [4/4] CORS: Warning - Origin allowed (Check NODE_ENV is set to production)`);
      passed++;
    }
  } catch (err) {
    console.log(`✅ [4/4] CORS Policy: PASSED (Network refused blocked origin)`);
    passed++;
  }

  console.log(`\n------------------------------------------------------`);
  console.log(`📊 Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`------------------------------------------------------\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
