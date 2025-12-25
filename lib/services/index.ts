// Service exports
export { parseEmailAddress, extractDomain, parseEmlContent, parseRawHeaders, extractSenderFromHeaders } from './email-parser';
export { checkSPF, getSPFStatusDescription } from './spf-checker';
export { checkDKIM, extractDKIMSelector, getDKIMStatusDescription } from './dkim-checker';
export { checkDMARC, parseDMARCRecord, getDMARCStatusDescription } from './dmarc-checker';
export { runDNSChecks, checkLookalikeDomain, findSimilarDomain } from './dns-service';
export { calculateRiskScore, generateExplanation, buildAnalysisResult } from './risk-scorer';
