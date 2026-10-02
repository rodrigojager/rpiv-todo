# rpiv-todo — cópia de Rodrigo

Versão **2.12.0-rodrigo.1**, baseada em [@juicesharp/rpiv-todo 2.12.0](https://github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-todo).

[Alterações detalhadas](LOCAL-CHANGES.md) · [Changelog](CHANGELOG.md) · [Origem verificável](UPSTREAM.json) · [Licença MIT original](LICENSE)

Esta cópia preserva o autor original e mantém um commit inicial com os arquivos do pacote npm baixado. Não publica nada sob o nome do autor no npm.

O painel de tarefas do rpiv-todo mantém os recursos originais e passa a recuperar listas da extensão oficial anterior. A migração ocorre em memória, preservando IDs e conclusão; arquivos de sessão não são reescritos.

## Instalação

Depois de terminar o trabalho na sessão atual, escolha uma única fonte do plugin e instale:

```powershell
pi install https://github.com/rodrigojager/rpiv-todo@v2.12.0-rodrigo.1
```

Desative `official-todo.ts` e a fonte local anterior para não duplicar `todo` e `/todos`. A localização opcional usa `npm:@juicesharp/rpiv-i18n@2.12.0`, sem alterações no código desse pacote.

[Perfil de configuração da instalação](https://github.com/rodrigojager/pi-home-kit/tree/main/profiles/2026-10-02-ui).

## Validação

Testes de desenvolvimento usam Node 26.

```powershell
npm install
npm test
```

A versão instalada foi validada também pelo loader do Pi 1.0.0 e pelo executável real em RPC isolado, sem chamadas ao modelo.
