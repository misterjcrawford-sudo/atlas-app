// "Lock app": clear the access cookie and return to the front door.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Set-Cookie', 'atlas_access=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
  res.redirect(302, '/activate.html?locked=1');
}
