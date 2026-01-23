import { NextResponse } from 'next/server';

export function middleware(request) {
  // Ambil tiket (cookie) dari browser user
  const token = request.cookies.get('token');

  // Cek apakah user mau ke halaman Login?
  const isLoginPage = request.nextUrl.pathname === '/login';

  // ATURAN 1: Kalau belum punya tiket & bukan di halaman login -> TENDANG KE LOGIN
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ATURAN 2: Kalau sudah punya tiket & coba buka halaman login -> LEMPAR KE DASHBOARD
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Kalau aman, silakan lewat
  return NextResponse.next();
}

// Tentukan halaman mana saja yang dijaga Satpam
export const config = {
  matcher: [
    '/',              // Halaman Dashboard
    '/alat/:path*'    // Semua Halaman Detail Alat
  ],
};