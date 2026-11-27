# Maycon Vieira Services — Site Institucional

Site institucional da **Maycon Vieira Services / MV Services**, com foco em apresentar a empresa, suas especialidades, soluções empresariais e canais de contacto.

## Produção

- **URL atual:** https://mv-services-phi.vercel.app/
- **Repositório:** https://github.com/marcondesjm/maycon
- **Branch de produção:** `main`
- **Hospedagem:** Vercel
- **Projeto Vercel:** `mv-services`

> A URL da Vercel é temporária. Quando o domínio oficial for comprado, devem ser atualizados canonical URLs, Open Graph, dados estruturados, sitemap e demais referências absolutas.

---

## Estrutura principal

```
/
├── index.html
├── styles.css
├── premium.css
├── script.js
├── fonts.css
├── especialidades.css
├── especialidades.js
├── robots.txt
├── sitemap.xml
├── assets/
├── meat-services/
│   └── index.html
├── conservacao/
│   └── index.html
├── obras/
│   └── index.html
├── staff/
│   └── index.html
├── solucoes/
│   └── index.html
├── politica-de-privacidade/
│   └── index.html
└── politica-de-cookies/
    └── index.html
```

---

## Páginas

### Home
`/`

Apresenta:
- MV Services;
- quatro especialidades;
- carrossel principal;
- animações premium;
- empresa;
- direção e valores;
- fundador;
- formulário de briefing;
- links legais no rodapé.

### Meat Services
`/meat-services/`

Profissionais e serviços ligados à indústria alimentar e setor das carnes.

### Conservação
`/conservacao/`

Limpeza, higienização e conservação de ambientes industriais, comerciais e empresariais.

### Obras
`/obras/`

Construção civil, reabilitação, remodelação, manutenção e equipas de apoio.

### Staff
`/staff/`

Restauração, hotelaria, catering, eventos e apoio operacional.

### Soluções Empresariais
`/solucoes/`

Prestação de serviços especializados, reforço de equipas e soluções operacionais.

### Política de Privacidade
`/politica-de-privacidade/`

Explica o tratamento de dados pessoais e o comportamento atual do formulário.

### Política de Cookies
`/politica-de-cookies/`

Explica o uso atual de cookies e deixa a base pronta para futuras integrações de Analytics, Pixel ou ferramentas semelhantes.

---

## Identidade visual

O site segue uma direção visual premium, com:
- fundos escuros e tons neutros;
- verde profundo;
- champagne/dourado;
- tipografia editorial;
- grandes áreas de respiro;
- animações sutis;
- cores específicas por especialidade.

### Cores de especialidades

- **Meat Service:** vermelho
- **Conservação:** azul
- **Obras:** amarelo
- **Staff:** dourado/ocre

---

## Funcionalidades implementadas

### Home

- carrossel automático;
- anterior/próximo;
- pausa/retomar;
- contador;
- destaque textual conforme o slide;
- cards de especialidades inteiros clicáveis;
- faixa de acesso às especialidades;
- faixa editorial dupla animada;
- animação de entrada por scroll;
- efeitos sutis em hover;
- parallax discreto;
- menu responsivo;
- animações mobile;
- formulário de pedido com opção de descarregar o resumo.

### Páginas internas

- mesma linguagem visual da home;
- carrossel automático;
- anterior/próximo;
- pausa/retomar;
- contador;
- animações consistentes;
- menu sanduíche no mobile;
- listas expansíveis de profissões;
- navegação entre especialidades;
- responsividade;
- acessibilidade básica.

---

## Formulário de briefing

O formulário envia nome, empresa, e-mail, especialidade e descrição do pedido para `POST /api/enviar-contato.php`. A função valida os campos e encaminha o pedido por e-mail via Resend. Se o envio estiver indisponível, o visitante pode descarregar o resumo em formato `.txt`.

Para ativar o envio, adicione estas variáveis de ambiente no projeto da Vercel e faça um novo deploy.

- `RESEND_API_KEY` — chave de envio do Resend.
- `CONTACT_FROM_EMAIL` — endereço remetente num domínio verificado no Resend.
- `CONTACT_TO_EMAIL` — endereço da MV Services para receber os pedidos.

O e-mail introduzido no formulário é usado como endereço de resposta. Para testar a rota localmente, execute `php -S localhost:4183` na raiz do projeto com PHP 8.1 ou superior e a extensão cURL.

---

## SEO

O projeto já possui base de SEO técnico:

- titles específicos;
- meta descriptions;
- canonical URLs;
- Open Graph;
- Twitter Cards;
- Schema.org;
- Organization;
- Service;
- BreadcrumbList;
- robots.txt;
- sitemap.xml.

### Sitemap atual

https://mv-services-phi.vercel.app/sitemap.xml

### Quando o domínio oficial for comprado

Substituir:

```
https://mv-services-phi.vercel.app
```

pelo domínio definitivo em:

- `index.html`;
- páginas internas;
- páginas legais;
- JSON-LD;
- Open Graph;
- canonical;
- `sitemap.xml`;
- `robots.txt`.

Depois:

1. cadastrar o domínio no Vercel;
2. configurar DNS;
3. definir o domínio oficial como principal;
4. cadastrar o site no Google Search Console;
5. enviar o sitemap;
6. solicitar indexação das páginas principais.

---

## Acessibilidade

Foram implementados:

- skip link;
- foco visível;
- áreas clicáveis com tamanho adequado;
- controles acessíveis de carrossel;
- mensagens `aria-live`;
- navegação por teclado;
- respeito a `prefers-reduced-motion`;
- menu mobile acessível;
- labels em formulário;
- semântica básica de navegação e headings.

---

## Responsividade

O site foi ajustado para:

- desktop;
- notebook;
- tablet;
- celular;
- telas pequenas;
- modo paisagem.

Há breakpoints específicos para:
- menu;
- hero;
- cards;
- faixa de especialidades;
- formulários;
- rodapé;
- páginas internas.

---

## Animações

O motion design segue a mesma lógica em toda a experiência:

- reveals suaves;
- parallax discreto;
- hover elegante;
- movimento de elementos em scroll;
- carrosséis automáticos;
- ticker/faias editoriais;
- animações mobile;
- respeito a usuários com redução de movimento ativada.

---

## Segurança do front-end

O site possui bloqueios básicos de interface para:

- botão direito;
- `Ctrl + U`;
- atalhos comuns de DevTools.

### Limitação importante

Não é possível impedir de forma real que alguém técnico acesse HTML, CSS ou JavaScript de um site público.

Nunca devem ser colocados no front-end:
- chaves de API;
- tokens privados;
- senhas;
- credenciais;
- segredos de servidor.

---

## Cookies e privacidade

Atualmente não há implementação identificada de:
- Google Analytics;
- Meta Pixel;
- TikTok Pixel;
- Hotjar;
- ferramentas de remarketing.

Por isso, o site não depende atualmente de banner de consentimento para ferramentas de marketing.

Se alguma dessas ferramentas for instalada:
1. revisar a Política de Cookies;
2. revisar a Política de Privacidade;
3. implementar consentimento quando aplicável;
4. impedir o carregamento de scripts não essenciais antes do consentimento.

---

## Deploy

A branch `main` está ligada ao projeto Vercel.

Fluxo padrão:

```
alteração
→ commit na main
→ GitHub
→ Vercel
→ build/deploy
→ produção
```

### Deploy Hook configurado

O projeto possui um Deploy Hook chamado:

`Publicar MV Services`

Evitar expor a URL completa do hook em documentação pública.

---

## Manutenção

Ao alterar o site:

1. editar os arquivos;
2. testar desktop e mobile;
3. validar links;
4. conferir animações;
5. conferir carrosséis;
6. validar formulário;
7. revisar acessibilidade;
8. revisar SEO se houver mudança de conteúdo;
9. commit na `main`;
10. confirmar deploy no Vercel.

---

## Arquivos principais

### `index.html`
Conteúdo e estrutura da home.

### `styles.css`
Base de estilos.

### `premium.css`
Camada visual premium, animações e refinamentos responsivos.

### `script.js`
Interações da home, carrossel, formulário e motion design.

### `especialidades.css`
Visual e responsividade das páginas internas e páginas legais.

### `especialidades.js`
Carrosséis, menu mobile, animações e interações das páginas internas.

### `robots.txt`
Diretrizes para rastreadores.

### `sitemap.xml`
Mapa das páginas indexáveis.

---

## Estado atual do projeto

O site possui:

- home concluída;
- quatro páginas de especialidades;
- página de soluções;
- políticas legais;
- design premium;
- responsividade;
- animações;
- acessibilidade básica;
- SEO técnico inicial;
- GitHub;
- deploy via Vercel.

### Próximos passos recomendados

- comprar e conectar o domínio oficial;
- atualizar URLs absolutas;
- configurar Google Search Console;
- enviar sitemap;
- definir canais oficiais de contacto nas políticas;
- avaliar Analytics/Pixel apenas quando houver estratégia de medição;
- revisar conteúdo final com a empresa.

---

## Contato do responsável pelo projeto

**Empresa:** MJM Digital

- **Instagram:** [@marcondes.machado.oficial](https://www.instagram.com/marcondes.machado.oficial/)
- **WhatsApp:** [48 9602-9392](https://wa.me/554896029392)
- **E-mail:** [marcondesgestaotrafego@gmail.com](mailto:marcondesgestaotrafego@gmail.com)

## Responsável pelo projeto

**Maycon Vieira Services / MV Services**

Desenvolvimento e manutenção do site versionados neste repositório.

---

© 2026 Maycon Vieira Services
