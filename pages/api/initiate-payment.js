import { generatePayUHash, generateTxnId, PAYU_BASE_URL } from '../../lib/payu';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, domain, ip } = req.body;
  if (!name || !email || !phone || !domain) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const key = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const txnid = generateTxnId();
  const amount = '199.00';
  const productinfo = `Security Report - ${domain}`;
  const firstname = name.split(' ')[0];

  const hash = generatePayUHash({ key, txnid, amount, productinfo, firstname, email, salt });

  const formData = {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    surl: `${appUrl}/api/payment-success`,
    furl: `${appUrl}/api/payment-failure`,
    hash,
    udf1: domain,
    udf2: ip || '',
  };

  return res.status(200).json({ formData, payuUrl: PAYU_BASE_URL });
}
