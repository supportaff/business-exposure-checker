// PayU posts back to this URL on successful payment
// Here you generate the PDF report and send via email/WhatsApp

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    txnid,
    status,
    amount,
    email,
    firstname,
    udf1: domain,
    udf2: ip,
  } = req.body;

  if (status !== 'success') {
    return res.redirect(302, '/payment-failed');
  }

  // TODO: Trigger PDF generation here
  // 1. Call getShodanHostInfo(ip) again for full data
  // 2. Generate PDF using puppeteer
  // 3. Send PDF to email/WhatsApp

  console.log(`Payment success: txnid=${txnid}, domain=${domain}, email=${email}`);

  return res.redirect(302, `/thank-you?name=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}`);
}
