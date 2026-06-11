import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

// import appCss from '#/styles.css?url'
import AppCss from "#/App.css?url"
import Indexcss from "#/index.css?url"
import { Layout } from '@/lib/layout'

const title = 'PAVE'
const description = 'Plataforma de Avaliação e Verificação Educacional'
const url = 'hhtps://google.com'

const ogImgUrl =
  'https://og.sznm.dev/api/generate?heading=PAVE&text=Plataforma+de+Avaliação+e+Verificação+Educacional&template=color'

// const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },

      {
        title,
      },

      {
        name: 'description',
        content: description,
      },

      {
        name: 'application-name',
        content: title,
      },

      {
        name: 'theme-color',
        content: '#ffffff',
      },

      {
        name: 'og:type',
        content: 'website',
      },

      {
        name: 'og:url',
        content: url,
      },

      {
        name: 'og:title',
        content: title,
      },

      {
        name: 'og:description',
        content: description,
      },

      {
        name: 'og:image',
        content: ogImgUrl,
      },

      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },

      {
        name: 'twitter:url',
        content: url,
      },

      {
        name: 'twitter:title',
        content: title,
      },

      {
        name: 'twitter:description',
        content: description,
      },

      {
        name: 'twitter:image',
        content: ogImgUrl,
      },
    ],

    links: [
      {
        rel: 'stylesheet',
        href: AppCss
      },

      {
        rel: 'stylesheet',
        href: Indexcss
      },

      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body className="font-sans antialiased">
        <Layout>
          {children}
        </Layout>

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />

        <Scripts />
      </body>
    </html>
  )
}