/**
 * Admin API Endpoint Test Suite
 * Tests all 14 admin endpoints for proper authentication and functionality
 */

const BASE_URL = 'http://localhost:3000'

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@shopmyneighborhood.com',
  password: 'admin123'
}

let adminToken = null

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logTest(name, passed, details = '') {
  const symbol = passed ? '✓' : '✗'
  const color = passed ? 'green' : 'red'
  log(`${symbol} ${name} ${details}`, color)
}

async function makeRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  if (adminToken && !options.skipAuth) {
    headers['Cookie'] = `admin_token=${adminToken}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  })
  
  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }
  
  return { response, data, status: response.status }
}

async function login() {
  log('\n=== Authentication ===', 'cyan')
  
  const { response, data, status } = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(ADMIN_CREDENTIALS),
    skipAuth: true
  })
  
  if (status === 200 && data?.success) {
    // Extract token from Set-Cookie header
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      const match = setCookie.match(/admin_token=([^;]+)/)
      if (match) {
        adminToken = match[1]
        logTest('Login successful', true, `- Token: ${adminToken.substring(0, 20)}...`)
        return true
      }
    }
  }
  
  logTest('Login failed', false, `- Status: ${status}`)
  return false
}

async function testEndpoint(name, path, method = 'GET', body = null, expectedStatus = 200) {
  try {
    const options = { method }
    if (body) {
      options.body = JSON.stringify(body)
    }
    
    const { data, status } = await makeRequest(path, options)
    
    const passed = status === expectedStatus
    const details = `- Status: ${status}${data ? `, Response: ${JSON.stringify(data).substring(0, 50)}...` : ''}`
    logTest(name, passed, details)
    
    return { passed, status, data }
  } catch (error) {
    logTest(name, false, `- Error: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

async function testUnauthorizedAccess() {
  log('\n=== Unauthorized Access Tests ===', 'cyan')
  
  // Save token and clear it
  const savedToken = adminToken
  adminToken = null
  
  const result = await testEndpoint('GET /api/admin/businesses (no auth)', '/api/admin/businesses', 'GET', null, 401)
  
  // Restore token
  adminToken = savedToken
  
  return result.passed
}

async function testListEndpoints() {
  log('\n=== List Endpoints ===', 'cyan')
  
  const tests = [
    ['GET /api/admin/businesses', '/api/admin/businesses'],
    ['GET /api/admin/vendors', '/api/admin/vendors'],
    ['GET /api/admin/deals', '/api/admin/deals'],
    ['GET /api/admin/vouchers', '/api/admin/vouchers'],
    ['GET /api/admin/cities', '/api/admin/cities'],
    ['GET /api/admin/categories', '/api/admin/categories'],
    ['GET /api/admin/logs', '/api/admin/logs']
  ]
  
  const results = []
  for (const [name, path] of tests) {
    const result = await testEndpoint(name, path)
    results.push(result.passed)
  }
  
  return results.every(r => r)
}

async function testCRUDEndpoints() {
  log('\n=== CRUD Endpoints ===', 'cyan')
  
  // Test creating a city
  const cityResult = await testEndpoint(
    'POST /api/admin/cities',
    '/api/admin/cities',
    'POST',
    { name: 'Test City', state: 'TS', timezone: 'America/New_York' }
  )
  
  // Test creating a category
  const categoryResult = await testEndpoint(
    'POST /api/admin/categories',
    '/api/admin/categories',
    'POST',
    { name: 'Test Category', googleType: 'restaurant' }
  )
  
  // Test getting branding
  const brandingResult = await testEndpoint(
    'GET /api/admin/branding',
    '/api/admin/branding'
  )
  
  // Test updating branding
  const brandingUpdateResult = await testEndpoint(
    'POST /api/admin/branding',
    '/api/admin/branding',
    'POST',
    { site_name: 'Test Site' }
  )
  
  return cityResult.passed && categoryResult.passed && brandingResult.passed && brandingUpdateResult.passed
}

async function testMediaEndpoints() {
  log('\n=== Media Endpoints ===', 'cyan')
  
  const listResult = await testEndpoint('GET /api/admin/media/list', '/api/admin/media/list')
  
  // Note: We can't easily test file upload without FormData, but we can verify auth
  log('  ℹ Media upload requires FormData (skipping functional test)', 'yellow')
  
  return listResult.passed
}

async function testSpecificBusinessEndpoint() {
  log('\n=== Specific Business Endpoint ===', 'cyan')
  
  // First get list of businesses
  const { data: businesses } = await makeRequest('/api/admin/businesses')
  
  if (businesses && businesses.length > 0) {
    const businessId = businesses[0].id
    
    const getResult = await testEndpoint(
      `GET /api/admin/businesses/${businessId}`,
      `/api/admin/businesses/${businessId}`
    )
    
    const updateResult = await testEndpoint(
      `PUT /api/admin/businesses/${businessId}`,
      `/api/admin/businesses/${businessId}`,
      'PUT',
      { name: businesses[0].name }
    )
    
    return getResult.passed && updateResult.passed
  } else {
    log('  ℹ No businesses found to test with', 'yellow')
    return true
  }
}

async function runTests() {
  log('\n╔════════════════════════════════════════════════╗', 'blue')
  log('║   Admin API Endpoint Test Suite               ║', 'blue')
  log('╚════════════════════════════════════════════════╝', 'blue')
  
  const startTime = Date.now()
  const results = []
  
  // Login
  const loginSuccess = await login()
  if (!loginSuccess) {
    log('\n✗ Cannot proceed without authentication', 'red')
    process.exit(1)
  }
  
  // Run all tests
  results.push(await testUnauthorizedAccess())
  results.push(await testListEndpoints())
  results.push(await testCRUDEndpoints())
  results.push(await testMediaEndpoints())
  results.push(await testSpecificBusinessEndpoint())
  
  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  const passed = results.filter(r => r).length
  const total = results.length
  
  log('\n╔════════════════════════════════════════════════╗', 'blue')
  log('║   Test Summary                                 ║', 'blue')
  log('╚════════════════════════════════════════════════╝', 'blue')
  log(`\nPassed: ${passed}/${total}`, passed === total ? 'green' : 'red')
  log(`Duration: ${duration}s`, 'cyan')
  
  if (passed === total) {
    log('\n✓ All tests passed!', 'green')
    process.exit(0)
  } else {
    log(`\n✗ ${total - passed} test(s) failed`, 'red')
    process.exit(1)
  }
}

// Run the tests
runTests().catch(error => {
  log(`\n✗ Fatal error: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
