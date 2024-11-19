import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req })
  const isAuth = !!token
  const isAuthPage = req.nextUrl.pathname.startsWith('/admin/login')
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    return null
  }

  if (!isAuth && isAdminPage) {
    let callbackUrl = req.nextUrl.pathname
    if (req.nextUrl.search) {
      callbackUrl += req.nextUrl.search
    }
    
    return NextResponse.redirect(
      new URL(`/admin/login`, req.url)
    )
  }

  return null
}

export const config = {
  matcher: ['/admin/:path*']
}