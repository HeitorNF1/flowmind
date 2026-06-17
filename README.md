# FlowMind — Documentação de Arquitetura e Desenvolvimento

> Guia para a squad entender o fluxo do produto e saber onde mexer para cada tipo de alteração.

---

## Visão geral da arquitetura

```
[Usuário]
    ↓ acessa
[Azure Web App — Next.js]        → frontend + autenticação
    ↓ chama
[Azure Functions — Node.js]      → BFF (Backend for Frontend)
    ↓ chama via webhook
[n8n — VM Azure]                 → lógica de negócio, agentes, integrações
    ↓ conecta
[APIs externas / serviços]       → qualquer integração configurada no n8n
```

### Resumo dos recursos Azure

| Recurso | Nome | Função |
|---|---|---|
| Web App | `prod-flowmind` | Hospeda o frontend Next.js |
| Function App | `flowmind-func-app` | BFF serverless (API intermediária) |
| Resource Group | `flowmind` | Agrupa todos os recursos Azure |
| VM | IP `20.119.74.185` | Roda o n8n na porta `5678` |

---

## Estrutura do repositório

```
/flowmind
  /frontend                      → aplicação Next.js
    /app
      /api
        /auth/[...nextauth]/     → rotas de autenticação (NextAuth)
      /login/
        page.tsx                 → página de login com Google
      page.tsx                   → página principal (protegida)
    auth.ts                      → configuração do NextAuth + Google provider
    middleware.ts                → proteção de rotas privadas
    .env.local                   → variáveis de ambiente locais (não sobe pro git)

  /functions                     → Azure Functions (BFF)
    /src
      agent.js                   → function principal que chama o n8n
    host.json                    → configuração do runtime
    local.settings.json          → variáveis de ambiente locais (não sobe pro git)

  /.github
    /workflows
      frontend.yml               → CI/CD do frontend (dispara em /frontend)
      functions.yml              → CI/CD das functions (dispara em /functions)
```

---

## Fluxo de uma requisição completa

```
1. Usuário acessa qualquer rota
2. middleware.ts verifica se há sessão ativa
3. Se não há sessão → redireciona para /login
4. Usuário clica em "Entrar com Google"
5. NextAuth autentica via OAuth Google
6. Sessão criada → usuário redirecionado para /
7. Frontend chama /api/agent (Azure Function)
8. Azure Function valida a requisição
9. Azure Function chama webhook do n8n com x-internal-secret
10. n8n processa o fluxo
11. n8n retorna JSON
12. Azure Function repassa resposta pro frontend
13. Frontend exibe o resultado
```

---

## Variáveis de ambiente

### Frontend (`/frontend/.env.local`)

```env
# n8n
N8N_URL=http://20.119.74.185:5678/
N8N_SECRET=seu_secret_do_webhook

# NextAuth
NEXTAUTH_SECRET=sua_string_gerada
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
```

### Functions (`/functions/local.settings.json`)

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "N8N_URL": "http://20.119.74.185:5678/",
    "N8N_SECRET": "seu_secret_do_webhook"
  }
}
```

> ⚠️ Esses arquivos **nunca sobem pro GitHub** — estão no `.gitignore`.
> As variáveis de produção ficam configuradas diretamente no portal Azure.

---

## Como rodar localmente

### Frontend

```bash
cd frontend
npm install
npm run dev
# acesse http://localhost:3000
```

### Functions

```bash
cd functions
npm install
func start
# endpoint disponível em http://localhost:7071/api/agent
```

> Você precisa do **Azure Functions Core Tools** instalado:
> ```bash
> npm install -g azure-functions-core-tools@4
> ```

---

## Onde mexer para cada tipo de alteração

### Adicionar uma nova página no frontend

1. Cria o arquivo em `/frontend/app/sua-pagina/page.tsx`
2. A rota fica automaticamente disponível em `/sua-pagina`
3. O middleware já protege automaticamente — não precisa fazer nada extra

```tsx
// /frontend/app/sua-pagina/page.tsx
export default function SuaPagina() {
  return <div>Conteúdo da página</div>
}
```

---

### Adicionar uma nova integração com o n8n

Toda nova funcionalidade que envolve lógica de negócio passa por 3 passos:

**1. Criar o workflow no n8n**
- Acessa o n8n em `http://20.119.74.185:5678`
- Cria um novo workflow com nó **Webhook**
- Configura **Authentication → Header Auth** com `x-internal-secret`
- Muda o **Respond** para `Using Respond to Webhook Node`
- Adiciona nó **Respond to Webhook** no final
- **Ativa o workflow** (toggle no canto superior direito)
- Copia a **Production URL** do webhook

**2. Criar uma nova Azure Function**

Cria `/functions/src/sua-funcionalidade.js`:

```js
const { app } = require('@azure/functions');

app.http('sua-funcionalidade', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const body = await request.json();

            const response = await fetch(process.env.N8N_URL + 'webhook/seu-path-aqui', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-secret': process.env.N8N_SECRET
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            return { jsonBody: data };

        } catch (error) {
            context.log('Erro:', error);
            return {
                status: 500,
                jsonBody: { error: 'Erro interno' }
            };
        }
    }
});
```

**3. Chamar a Function no frontend**

```tsx
// em qualquer componente ou page do Next.js
const response = await fetch('https://flowmind-func-app.azurewebsites.net/api/sua-funcionalidade', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ dado: 'valor' })
});

const data = await response.json();
```

---

### Alterar a autenticação

O arquivo central é `/frontend/auth.ts`.

- **Adicionar outro provider** (ex: GitHub): importa e adiciona na lista de `providers`
- **Adicionar dados extras na sessão** (ex: role do usuário): usa o callback `session`
- **Redirecionar para outra página após login**: muda o `redirectTo` no `signIn()`

```ts
// exemplo: adicionar GitHub como provider
import GitHub from "next-auth/providers/github"

providers: [
  Google({ ... }),
  GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  })
]
```

---

### Alterar quais rotas são protegidas

Edita o `matcher` em `/frontend/middleware.ts`:

```ts
export const config = {
  matcher: [
    // protege tudo exceto login, api e arquivos estáticos
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
}
```

Para deixar uma rota pública (ex: `/sobre`), adiciona ela nas exceções:

```ts
"/((?!api|_next/static|_next/image|favicon.ico|login|sobre).*)"
```

---

## CI/CD — Como funciona o deploy automático

O deploy é automático via GitHub Actions ao fazer push na branch `main`.

| O que mudou | Workflow disparado | Onde deploya |
|---|---|---|
| Qualquer arquivo em `/frontend` | `frontend.yml` | Azure Web App `prod-flowmind` |
| Qualquer arquivo em `/functions` | `functions.yml` | Function App `flowmind-func-app` |
| Apenas `.github/workflows` | Nenhum | — |

### Fluxo de trabalho da squad

```
1. Cria branch a partir da main:  git checkout -b feature/nome-da-feature
2. Desenvolve e testa localmente
3. Abre Pull Request para main
4. Time faz code review
5. Merge na main → deploy automático
```

> ⚠️ **Nunca commitar direto na main.** Sempre via Pull Request.

---

## Segurança — pontos importantes

| Camada | Proteção |
|---|---|
| Frontend | NextAuth + middleware bloqueiam rotas sem sessão |
| Azure Functions | Recebem chamadas do frontend autenticado |
| n8n webhooks | Validam header `x-internal-secret` em todo request |
| Variáveis sensíveis | Nunca no git — ficam no Azure e no `.env.local` local |

### Como o n8n valida o secret

Todo webhook do n8n deve ter **Authentication → Header Auth** configurado:
- **Name:** `x-internal-secret`
- **Value:** mesmo valor da variável `N8N_SECRET` no Azure

Se uma requisição chegar sem esse header ou com valor errado, o n8n rejeita automaticamente.

---

## Contatos e acessos

| Recurso | Como acessar |
|---|---|
| Portal Azure | [portal.azure.com](https://portal.azure.com) |
| n8n | `http://20.119.74.185:5678` |
| Google Cloud Console | [console.cloud.google.com](https://console.cloud.google.com) — projeto `flowmind` |
| Repositório | GitHub — organização/flowmind |

---

*Documentação criada em junho de 2026. Atualizar conforme o produto evoluir.*
