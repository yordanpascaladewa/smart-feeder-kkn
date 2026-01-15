// pages/api/login.js
import { setCookie } from 'cookies-next';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // --- ATUR PASSWORD DISINI ---
    // User: admin
    // Pass: ponowareng123
    if (username === 'admin' && password === 'ponowareng123') {
      
      // Kalau bener, kasih tiket (Cookie)
      setCookie('token_masuk', 'true', { req, res, maxAge: 60 * 60 * 24 }); // Tiket berlaku 1 hari
      
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Password Salah!' });
    }
  } else {
    res.status(405).end();
  }
}