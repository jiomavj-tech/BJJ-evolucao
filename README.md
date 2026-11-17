# Calistenia + BJJ — PWA 0.1

Aplicativo educativo em português para registrar e organizar preparação física voltada ao jiu-jitsu brasileiro.

## Recursos disponíveis

- Perfil: faixa, jogo de guarda/passagem/quedas, objetivo, nível físico e equipamento disponível.
- Planos de 2 ou 3 sessões a partir de exercícios com identificadores únicos, instruções e cuidados.
- Estado de energia de 1 a 5: notas 1 ou 2 substituem o programa por recuperação opcional.
- Catálogo pesquisável de força, musculação, pegada, mobilidade, drills individuais e condicionamento.
- Checklist para séries realizadas e registro de duração, percepção de esforço e anotações.
- Diário de BJJ com data, duração, quantidade de rolas, intensidade e tema.
- Cronômetro de rounds e descansos com alerta sonoro (dependente de permissões/navegador).
- Evolução semanal e mensal, exportação de dados em JSON e CSV, importação de backup.
- Funciona sem conta e sem servidor depois do primeiro carregamento no contexto HTTPS.

## Como testar localmente

Requer apenas Python 3 ou outro servidor HTTP estático. Não depende de npm e não envia dados para internet.

```bash
cd calistenia-bjj-v0.1
python3 -m http.server 8080
```

Abra `http://localhost:8080/` em um navegador. **Não abra como `file://`**: navegadores restringem módulos JavaScript, service workers e instalação PWA nesse modo.

### Instalar no Android

1. Publique a pasta em uma hospedagem HTTPS como GitHub Pages.
2. Abra a URL no Chrome Android.
3. No menu ⋮, escolha **Instalar app** ou **Adicionar à tela inicial**.
4. Abra uma vez com internet para preencher o cache do app; faça o teste em modo avião.

### Hospedagem no GitHub Pages

O projeto é inteiramente estático: a pasta pode ser o conteúdo da raiz de um repositório. No GitHub, ative **Settings > Pages > Deploy from a branch > main / (root)**. Se estiver em subpasta, publique o conteúdo dela como raiz. Todos os caminhos de arquivos são relativos e funcionam em uma rota `usuario.github.io/nome-do-repo/`.

Não há backend: dados no `localStorage` só pertencem àquele navegador e origem. Para trocar de aparelho ou reinstalar, exporte e importe um **backup JSON**. Apagar os dados do navegador pode eliminá-los. Por serem informações pessoais e de treino, mantenha o arquivo de backup privado.

## Integração futura com o Calistenia App

Esta versão é **independente**, não é um fork integrado de `guillermoscript/calistenia-app`. O núcleo de catálogo e plano está em `core.mjs` para facilitar sua migração para `packages/core`, o app web para `apps/web`, e o diário para um adapter de armazenamento que futuramente use IndexedDB e/ou backend auditado.

O projeto de referência é MIT: <https://github.com/guillermoscript/calistenia-app>. O repositório registrou alertas de segurança (incluindo risco crítico de exposição de dados no PocketBase e XSS) em julho de 2026. **Não usar backend ou migrações do upstream sem revisar correções e controles de acesso.**

Esta versão **não copia código, imagens, animações nem vídeos** desses repositórios; os exercícios e interface foram escritos independentemente, inspirados nos requisitos funcionais. Se houver fusão posterior, preservar avisos de licença dos trechos efetivamente reutilizados.

## Testes

```bash
node --test tests/core.test.mjs
node --check app.mjs
```

## Limitações e segurança

- Planos são sugestões educativas **não individualizadas**, não garantem melhora técnica no BJJ e não substituem profissional de educação física.
- Energia 1–2 reduz automaticamente a sugestão; não determina clinicamente se o usuário está apto.
- Sem cadastro remoto, sincronização, vídeos, sensores, feedback por IA ou sistema de academia nesta versão.
- Sem integração com o upstream, nem publicação automática feita pelo projeto.
- Armazenamento local é vulnerável a limpeza de cache/dados; use backup. Sem criptografia de backup.
- Cronômetro depende da execução do navegador para alarmes e pode ter alertas silenciados em segundo plano.
- Para dor forte, sintomas neurológicos, tontura, desconforto torácico, fadiga intensa incomum ou falta de ar, interromper atividade e buscar orientação profissional apropriada.

## Estrutura

```text
index.html              Interface inicial e navegação
styles.css              Estilo responsivo e dark mode
core.mjs                Catálogo, regras de seleção e validações
app.mjs                 Interações, formulários, histórico, timer e backup
manifest.webmanifest    PWA instalável
sw.js                   Cache offline dos arquivos estáticos
assets/icon-*.png       Ícones PNG
 tests/core.test.mjs    Testes unitários
```

## Licença

MIT — código desta implementação original. Veja `LICENSE`.
