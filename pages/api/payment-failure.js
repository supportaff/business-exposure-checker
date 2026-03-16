export default async function handler(req, res) {
  return res.redirect(302, '/payment-failed');
}
