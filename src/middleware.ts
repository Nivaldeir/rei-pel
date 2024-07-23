import { decode } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const tokenNext =
    request.cookies.get('__Secure-next-auth.session-token') ??
    request.cookies.get('next-auth.session-token')
  const pathname = request.nextUrl.pathname

  // Decodifica o token
  const decodedToken = await decode({
    token: tokenNext?.value || '',
    secret: process.env.NEXTAUTH_SECRET!,
  })

  // Verifica se o token é válido
  if (
    !decodedToken?.id &&
    !pathname.startsWith('/sign-in') &&
    !pathname.startsWith('/sign-up')
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Permite acesso a páginas de sign-in e sign-up
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return NextResponse.next()
  }

  // Verifica se o usuário é admin
  if (decodedToken?.isAdmin) {
    // Permite acesso às rotas de admin
    return NextResponse.next()
  }

  // Permite acesso a usuários comuns a todas as outras rotas
  if (decodedToken) {
    return NextResponse.next()
  }

  // Redireciona para sign-in como fallback
  return NextResponse.redirect(new URL('/sign-in', request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
