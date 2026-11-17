# Roadmap de integração — Calistenia + BJJ

## 0.1 — Protótipo PWA, sem contas (entregue)
- Catálogo original, plano conforme perfil, registro de séries, diário BJJ, timer, progresso, backup.
- Motor sem bibliotecas externas e dados somente no dispositivo.

## 0.2 — Base de treinamento integrada
- Revisar as vulnerabilidades do Calistenia App upstream e verificar se foram corrigidas nas versões a reutilizar.
- Migrar o catálogo/gerador para `packages/core` do monorepo e o fluxo visual para `apps/web`.
- Adaptador de persistência `LocalStorageRepository` → `IndexedDbRepository` e sincronização opcional.
- Manter arquivos MIT e créditos dos projetos de origem quando trechos forem de fato reutilizados.
- Testes e importação idempotente para evitar registros duplicados.

## 0.3 — Preparação física BJJ avançada
- Carga semanal considerando rolas, duração, RPE e energia relatada (sem oferecer diagnóstico).
- Critérios claros de evolução por habilidade (progressão de pegada, barra, flexão, core, quadril).
- Personalização por agenda de tatame e equipamentos.
- Revisão técnica dos treinos por profissionais qualificados.

## 0.4 — Biblioteca audiovisual
- Produzir vídeos próprios ou integrar materiais com licenças autorizadas.
- Áudio instruído e acessibilidade; download opcional das demonstrações.

## 1.0 — Publicação e manutenção
- CI com testes, auditoria de segurança e dependências, testes em Android e iPhone.
- Privacidade e backup reforçados, restauração entre dispositivos e política de dados.
- Publicação em hospedagem HTTPS (GitHub Pages para versão estática, ou ambiente auditado para sincronização).
