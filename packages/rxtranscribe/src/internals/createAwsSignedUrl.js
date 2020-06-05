import crypto from 'crypto';
import querystring from 'qs';

function toTime(time) {
  return new Date(time).toISOString().replace(/[:\-]|\.\d{3}/g, '');
}

function toDate(time) {
  return toTime(time).substring(0, 8);
}

function hash(string, encoding) {
  return crypto.createHash('sha256')
    .update(string, 'utf8')
    .digest(encoding);
}

function hmac(key, string, encoding) {
  return crypto.createHmac('sha256', key)
    .update(string, 'utf8')
    .digest(encoding);
}

function createCredentialScope(time, region, service) {
  return [toDate(time), region, service, 'aws4_request'].join('/');
}

function createCanonicalQueryString(params) {
  return Object.keys(params).sort().map(key => (
    `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  )).join('&');
}

function createCanonicalHeaders(headers) {
  return Object.keys(headers).sort().map(name => (
    `${name.toLowerCase().trim()}:${headers[name].toString().trim()}\n`
  )).join('');
}

function createSignedHeaders(headers) {
  return Object.keys(headers).sort().map(name => (
    name.toLowerCase().trim()
  )).join(';');
}

function createStringToSign(time, region, service, request) {
  return [
    'AWS4-HMAC-SHA256',
    toTime(time),
    createCredentialScope(time, region, service),
    hash(request, 'hex')
  ].join('\n');
}

function createSignature(secret, time, region, service, stringToSign) {
  let h1 = hmac(`AWS4${secret}`, toDate(time)); // date-key
  let h2 = hmac(h1, region); // region-key
  let h3 = hmac(h2, service); // service-key
  let h4 = hmac(h3, 'aws4_request'); // signing-key
  return hmac(h4, stringToSign, 'hex');
}

function createCanonicalRequest(method, pathname, query, headers, payload) {
  return [
    method.toUpperCase(),
    pathname,
    createCanonicalQueryString(query),
    createCanonicalHeaders(headers),
    createSignedHeaders(headers),
    payload
  ].join('\n');
}

function createAwsSignedUrl(
  method,
  host,
  path,
  service,
  payload,
  options = {}
) {
  const optionsCopy = {...options};
  optionsCopy.headers = options.headers || {};
  optionsCopy.timestamp = options.timestamp || Date.now();
  optionsCopy.headers = options.headers || {};

  // host is required
  optionsCopy.headers.Host = host;

  let query = optionsCopy.query ? querystring.parse(optionsCopy.query) : {};
  const credentialScope = createCredentialScope(
    optionsCopy.timestamp,
    optionsCopy.region,
    service
  );
  query['X-Amz-Algorithm'] = 'AWS4-HMAC-SHA256';
  query['X-Amz-Credential'] = `${optionsCopy.key}/${credentialScope}`;
  query['X-Amz-Date'] = toTime(optionsCopy.timestamp);
  query['X-Amz-Expires'] = optionsCopy.expires;
  query['X-Amz-SignedHeaders'] = createSignedHeaders(optionsCopy.headers);
  if (optionsCopy.sessionToken) query['X-Amz-Security-Token'] = optionsCopy.sessionToken;
  const canonicalRequest = createCanonicalRequest(
    method,
    path,
    query,
    optionsCopy.headers,
    payload
  );
  const stringToSign = createStringToSign(
    optionsCopy.timestamp,
    optionsCopy.region,
    service,
    canonicalRequest
  );
  const signature = createSignature(
    optionsCopy.secret,
    optionsCopy.timestamp,
    optionsCopy.region,
    service,
    stringToSign
  );
  query['X-Amz-Signature'] = signature;
  return `${optionsCopy.protocol}://${host}${path}?${querystring.stringify(query)}`;
}

// Create pre-signed endpoint for the websocket to connect and authenticate with
// AWS Transcribe
const getAwsSignedUrl = function getAwsSignedUrl({
  region,
  accessKeyId,
  secretAccessKey,
  languageCode = 'en-US',
  sampleRate = 16000,
  _createAwsSignedUrl = createAwsSignedUrl,
  isMedical = false, // use AWS Transcibe Medical
  specialty = 'PRIMARYCARE', // for AWS Transcibe Medical
  type = 'CONVERSATION' // for AWS Transcribe Medical
}) {
  const endpoint = `transcribestreaming.${region}.amazonaws.com:8443`;
  const path = (
    isMedical
    ? '/medical-stream-transcription-websocket'
    : '/stream-transcription-websocket'
  );
  let query = `language-code=${languageCode}&media-encoding=pcm&sample-rate=${sampleRate}`;
  if (isMedical) query += `&specialty=${specialty}&type=${type}`;
  const options = {
    region,
    query,
    key: accessKeyId,
    secret: secretAccessKey,
    protocol: 'wss',
    expires: 15,
  };
  // get a preauthenticated URL that we can use to establish our WebSocket
  return _createAwsSignedUrl(
    'GET',
    endpoint,
    path,
    'transcribe',
    crypto.createHash('sha256').update('', 'utf8').digest('hex'),
    options
  );
};

export default getAwsSignedUrl;
