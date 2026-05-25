## 📌 Atividades

### 🎨 1. Atividades de Frontend

| ID   | Atividade                                     | Descrição                                                         | Responsável |
|------|-----------------------------------------------|-------------------------------------------------------------------|-------------|
| FE01 | Tela de login                                 | Criar formulário de login de usuários                             | Yasmin      |
| FE02 | Validação de login                            | Validar campos antes do envio e enviar os dados pro backend       | Felipe      |
| FE03 | Tela de cadastro                              | Criar formulário de cadastro de usuários                          | Felipe      |
| FE04 | Validação da cadastro                         | Validar campos antes do envio e enviar os dados pro backend       | Felipe      |
| FE05 | Tela de dashboard                             | Inclui fazer interface e suas funcionalidades (Aluno)             | Yasmin      |
| FE06 | Tela de projetos                              | Inclui fazer interface e suas funcionalidades (Aluno)             | Yasmin      |
| FE07 | Tela de detalhes do projeto                   | Inclui fazer interface e suas funcionalidades (Aluno)             | Yasmin      |
| FE08 | Tela de minhas oportunidades                  | Inclui fazer interface e suas funcionalidades (Aluno)             | Ravena      |
| FE09 | Tela de formulário de candidatura             | Criar formulário (Aluno)                                          | Raissa      |
| FE10 | Validar formulário de candidatura             | Validar campos e enviar os dados para backend (Aluno)             | Raissa      |
| FE11 | Tela de perfil do aluno                       | Inclui fazer interface e fomulário para edição dos campos (Aluno) | Felipe      |
| FE12 | Validar formulário de perfil do aluno         | Validar campos e enviar os dados para backend (Aluno)             | Felipe      |
| FE13 | Tela de notificação                           | Inclui fazer interface de aluno e suas funcionalidades (Aluno)    | Raissa      |
| FE14 | Tela de dashboard                             | Inclui fazer interface inicial e suas funcionalidades (Professor) | Raissa      |
| FE15 | Tela de visualização de projetos do professor | Inclui interface e funcionalidades (Professor)                    | Ravel       |
| FE16 | Tela de visão geral dos projetos              | Inclui fazer interface e funcionalidades (Professor)              | Ravel       |
| FE17 | Tela de kanban dos candidatos                 | Inclui fazer interface e funcionalidades (Professor)              | Ravena      |
| FE18 | Tela de criação de projetos                   | Inclui fazer interface e formulário (Professor)                   | Ravena      |
| FE19 | Validar fomulário de criação de projetos      | Validar campos e enviar os dados para backend (Professor)         | Ravel       |
| FE20 | Tela de edição de projetos                    | Inclui fazer interface e funcionalidade de edição (Professor)     | Ravena      |
| FE21 | Validar formulário de edição de projetos      | Validar campos e enviar os dados para backend (Professor)         | Ravel       |
| FE22 | Tela de perfil                                | Inclui interface e funcionalidades (Professor)                    | Ravel       |

# Getting Started

To run this application:

```bash
npm install
npm run dev
```


# Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Uninstall the packages: `npm install @tailwindcss/vite tailwindcss -D`

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
npm run lint
npm run format
npm run check
```


# Events Example - Haute Pâtisserie 2026

A beautiful pastry conference website built with TanStack Start and Netlify, featuring:

- **Speakers & Sessions**: Managed with content-collections for easy markdown-based content
- **Conference Schedule**: Day-by-day timeline of all sessions
- **AI Assistant (Remy)**: An AI-powered chat assistant to help attendees navigate the conference
- **Elegant Dark Theme**: Custom typography with Playfair Display and copper/gold accents

## Features

### Content Management
- Speaker profiles with bios, awards, and specialty information
- Session details with topics, duration, and speaker attribution
- All content in markdown files using content-collections

### AI-Powered Assistance
- Chat with "Remy" the culinary assistant
- Search for speakers and sessions by topic
- Get recommendations based on interests
- Supports multiple AI providers (Anthropic, OpenAI, Gemini, Ollama)

### Routes
- `/` - Home page with featured speakers and sessions
- `/schedule` - Conference schedule with day-by-day timeline
- `/speakers` - All speakers grid
- `/speakers/:slug` - Individual speaker detail page
- `/talks` - All sessions grid
- `/talks/:slug` - Individual session detail page

## Getting Started

```bash
# Create a new project with this example
npx netlify-cta my-conference --example events

# Navigate to the project
cd my-conference

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## AI Configuration

To use the AI assistant, set one of the following environment variables:

```bash
# Anthropic (Claude)
ANTHROPIC_API_KEY=your-key-here

# OpenAI
OPENAI_API_KEY=your-key-here

# Google Gemini
GEMINI_API_KEY=your-key-here

# Ollama (local, no API key needed)
# Just ensure Ollama is running locally
```

The assistant will automatically use the first available provider.

## Customization

### Adding Speakers
Create a new markdown file in `content/speakers/`:

```markdown
---
name: "Chef Name"
title: "Executive Pastry Chef"
specialty: "French Pastry"
restaurant: "Restaurant Name"
location: "City, Country"
headshot: "speakers/chef-name.jpg"
awards:
  - "Award 1"
  - "Award 2"
---

Bio content here...
```

### Adding Sessions
Create a new markdown file in `content/talks/`:

```markdown
---
title: "Session Title"
speaker: "Chef Name"
duration: "90 minutes"
image: "talks/session-image.jpg"
topics:
  - "Topic 1"
  - "Topic 2"
---

Session description here...
```

## Theme

The example uses a custom dark theme with:
- **Font**: Playfair Display (display) and Cormorant Garamond (body)
- **Colors**: Copper and gold accents on a dark charcoal background
- **Effects**: Elegant card hover animations, grain texture overlay



## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    getServerTime().then(setTime)
  }, [])
  
  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
