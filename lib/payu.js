import crypto from 'crypto';

const isTest = process.env.PAYU_ENV === 'test';

export const PAYU_BASE_URL = isTest
  ? 'https://test.payu.in/_payment'
  : 'https://secure.payu.in/_payment';

export function generatePayUHash({ key, txnid, amount, productinfo, firstname, email, salt }) {
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

export function generateTxnId() {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}
