import { type NextRequest, NextResponse } from 'next/server'

// Routes không cần authentication
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-storage')?.value

    // Parse token từ localStorage (được lưu dưới dạng JSON)
    let isAuthenticated = false
    if (token) {
        try {
            const authData = JSON.parse(token)
            isAuthenticated = !!authData.token
        } catch {
            isAuthenticated = false
        }
    }

    const { pathname } = request.nextUrl

    // Nếu chưa authenticate và truy cập protected routes
    if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Nếu đã authenticate và truy cập public routes
    if (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
