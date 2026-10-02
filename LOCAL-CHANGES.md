# Cópia independente de Rodrigo — rpiv-todo

Base: pacote npm **@juicesharp/rpiv-todo 2.12.0**, de
[juicesharp/rpiv-mono](https://github.com/juicesharp/rpiv-mono/tree/main/packages/rpiv-todo).
O primeiro commit preserva os arquivos do pacote original; o commit seguinte contém
as adaptações. Esta é uma cópia independente do pacote, não um fork GitHub do monorepo.
Autor e licença MIT originais foram mantidos.

## 2.12.0-rodrigo.1 — 2026-10-02

- `state/replay.ts`: aceita snapshots da extensão oficial anterior (`todos`, `text`,
  `done`) e converte em memória para `tasks`, `subject` e `status`.
- Preserva IDs, conclusão e próximo ID; corrige um contador antigo menor que o
  maior ID. Não reescreve os arquivos de sessão.
- Usa o último snapshot válido, incluindo listas vazias e históricos mistos.
  Registros antigos malformados são ignorados.
- `package.json`: versão própria, `private: true`, links desta cópia e testes
  reproduzíveis. O nome original do pacote e a ferramenta `todo` permanecem.
- Testes: migração sem mutação, replay misto, novo item após migração,
  validação de ciclos de dependências e isolamento entre sessões.

O painel, reducer, schemas e regras de transição do upstream permanecem iguais.
Um item concluído continua sem poder voltar a `in_progress`.

Instalação, após terminar a sessão atual:

```powershell
pi install https://github.com/rodrigojager/rpiv-todo@v2.12.0-rodrigo.1
pi install npm:@juicesharp/rpiv-i18n@2.12.0
```

Desative a extensão anterior `official-todo.ts` e qualquer outra fonte do `todo`.
A configuração compartilhada da sidebar e do Herdr está no
[perfil do Pi Home Kit](https://github.com/rodrigojager/pi-home-kit/tree/main/profiles/2026-10-02-ui).
