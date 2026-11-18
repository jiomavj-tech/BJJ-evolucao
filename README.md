# Calistenia + BJJ — v0.3 (PWA)

Aplicativo gratuito e educativo de calistenia, musculação e preparação física para jiu-jitsu, funcionando no celular Android via GitHub Pages. Código deste aplicativo sob licença MIT.

## O que há na v0.3

- **Gamificação:** XP por séries concluídas com registro, sessão física, diário BJJ, progressão manual de habilidade e meta semanal; níveis e 7 medalhas. Não há bônus por executar exercícios mais depressa, nem perda de pontos por dias de descanso.
- **Sessão guiada:** relógio com iniciar, pausar, retomar; descanso opcional de 60 segundos; checklist de séries e percepção de esforço.
- **Lembretes:** escolha dias, horário, duração, rotina opcional de pausa para água. Alertas dentro da PWA aberta; link para evento no Google Agenda; arquivo ICS com repetição nos dias escolhidos e alarme de 15 minutos.
- **Demonstrações visuais:** imagens em posições sequenciais para 16 exercícios mapeados no catálogo, originadas do [RepDB](https://repdb.co), sob licença do plano gratuito que permite uso em aplicativos com crédito. Os recursos visuais são carregados da origem, não redistribuídos como conjunto de dados. 3 diagramas esquemáticos próprios para movimentos de BJJ e guias simplificados já existentes; itens não demonstrados são explicitamente marcados.
- **Evolução v0.2 preservada:** seis trilhas de progressão, alerta de volume semanal de BJJ, planos por perfil, diário, estatísticas, backup JSON e exportação CSV.

## Instruções para atualizar a versão instalada

1. **Crie um backup JSON em Ajustes** antes de enviar arquivos novos.
2. Envie os arquivos do ZIP de atualização para a **raiz** do repositório `jiomavj-tech/BJJ-evolucao`, preservando a pasta `assets` e sem enviar o ZIP fechado.
3. Confirme o commit e verifique o resultado do GitHub Pages.
4. Abra `https://jiomavj-tech.github.io/BJJ-evolucao/` com internet e feche/abra a PWA pelo ícone na tela inicial. Se a versão antiga continuar no cache, abra novamente com internet.
5. No aplicativo, acesse **Início → Ver conquistas**; vá em **Configurar lembretes** para dias e horário. Para receber notificações com a PWA fechada, gere eventos no Google Agenda e verifique as notificações do calendário do Android.
6. Em **Exercícios**, abra um exercício ilustrado para visualizar as posições. As imagens são de referência: são indispensáveis leitura dos cuidados e revisão por treinador em movimentos desconhecidos.

**Importante:** a chave local de armazenamento `calistenia_bjj_v1` não mudou. O histórico existente deve permanecer na mesma origem/navegador, salvo exclusão dos dados do navegador. Um backup sempre é recomendado antes de atualizar.

## Limites técnicos

- **Sem push em segundo plano.** A PWA sozinha, estando encerrada, não pode garantir notificações horárias; a opção de Google Agenda usa alertas gerenciados pelo próprio calendário. Push nativo exigiria assinatura, serviço backend, consentimento e configuração adicionais.
- **Sem sincronização remota.** Registros ficam no dispositivo, não no GitHub; backups JSON não estão criptografados.
- **Imagens da biblioteca têm conexão necessária na primeira visualização** e podem ficar indisponíveis se o provedor bloquear o recurso; quando visitadas com conexão, o service worker tenta armazená-las em cache offline.
- **Não copie nem redistribua o catálogo de imagens.** A licença do RepDB autoriza exibição em aplicativos com atribuição visível, não hospedagem de um dataset ou uso em geração de IA. Crédito mostrado: *Exercise data by RepDB (repdb.co)*.
- **Nem todos os exercícios têm fotos.** Os drills de BJJ precisam de demonstrações verificadas; os atuais esquemas não são substitutos de instrução presencial.
- Treinos e alertas de carga são educativos, não prescrição clínica. Dor, tontura e fadiga incomum justificam interromper o treino.
- Código desta versão desenvolvido independentemente; não houve fusão direta dos repositórios externos do GitHub.

## Testes

```bash
node --test tests/*.test.mjs
node --check app.mjs
node --check sw.js
python3 -m http.server 8080
```

Para testar a PWA localmente, abra `http://localhost:8080/`. A instalação exige HTTPS ou localhost, e não funciona abrindo `file://`.

## Arquivos principais

- `app.mjs` interface, sessões, lembretes e registro;
- `core.mjs` biblioteca e seleção de exercícios;
- `evolution.mjs` trilhas e volume BJJ;
- `gamification.mjs` XP, medalhas, calendário ICS;
- `visuals.mjs` associação visual e diagramas;
- `styles.css`, `index.html`, `manifest.webmanifest`, `sw.js`, ícones em `assets/`;
- `tests/` verificações automatizadas.

## Contato com fontes e licenças

- [RepDB — conjunto de exercícios e licença do material](https://github.com/RepDB/exercise-dataset)
- [MDN — Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Google Agenda](https://calendar.google.com/)

O aplicativo é uma implementação independente inspirada em funcionalidades de projetos como Calistenia App, Ballast e aplicativos de registro BJJ. Nenhum código-fonte de terceiros foi incorporado à v0.3.
