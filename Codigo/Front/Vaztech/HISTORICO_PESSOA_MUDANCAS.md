# Documentação de Mudanças - Histórico de Pessoa

## Resumo
Implementação da funcionalidade de histórico para pessoas (clientes e fornecedores), permitindo visualizar todas as operações e serviços relacionados a uma pessoa específica, com pesquisa integrada.

## Arquivos Modificados

### 1. `src/app/services/pessoa.service.ts`
**Mudanças:**
- Adicionado tipo `HistoricoPessoaItem` para estruturar os dados do histórico
- Adicionado método `buscarHistoricoPessoa(idPessoa: number)` que:
  - Busca todas as operações (vendas e compras) do sistema
  - Busca todos os serviços do sistema
  - Filtra operações e serviços relacionados à pessoa específica
  - Ordena cronologicamente (mais recentes primeiro)
  - Retorna um array unificado de histórico

**Observação:** O método faz chamadas aos endpoints existentes de operações e serviços. Não foram necessárias mudanças no backend.

### 2. `src/app/pages/hub/pessoas-tabs/pessoas-tabs.ts`
**Mudanças:**
- Importados tipos `Operacao`, `Servico` e `HistoricoPessoaItem`
- Importado `CurrencyPipe` para formatação de valores monetários
- Adicionado `MessageModule` aos imports do componente
- Adicionadas propriedades:
  - `modalHistoricoAberto`: controla visibilidade do modal de histórico
  - `pessoaHistorico`: pessoa cujo histórico está sendo exibido
  - `historicoCompleto`: lista completa do histórico
  - `historicoFiltrado`: lista filtrada pela pesquisa
  - `searchHistorico`: termo de busca
  - `carregandoHistorico`: estado de carregamento

- Adicionados métodos:
  - `abrirModalHistorico(pessoa)`: abre o modal e carrega o histórico
  - `fecharModalHistorico()`: fecha o modal e limpa os dados
  - `buscarHistoricoPessoa(idPessoa)`: busca histórico usando o serviço
  - `filtrarHistorico()`: filtra histórico por ID, número de série, aparelho ou modelo
  - `getTipoOperacaoLabel(tipo)`: retorna label legível do tipo de operação
  - `getTipoServicoLabel(tipo)`: retorna label legível do tipo de serviço
  - `getOperacao(item)`: função auxiliar para type casting de operação
  - `getServico(item)`: função auxiliar para type casting de serviço

### 3. `src/app/pages/hub/pessoas-tabs/pessoas-tabs.html`
**Mudanças:**
- Adicionado botão "Ver histórico" no footer dos cards de pessoa
- Adicionado modal de histórico completo com:
  - Cabeçalho dinâmico mostrando nome da pessoa
  - Barra de pesquisa para filtrar histórico
  - Indicador de carregamento
  - Lista de histórico em scroll panel (altura máxima 500px)
  - Cards diferenciados para operações e serviços:
    - **Operações**: mostram tipo (venda/compra), produto, valor, funcionário, data/hora
    - **Serviços**: mostram tipo (externo/interno), produto, valor, status, datas
  - Mensagens informativas:
    - "Nenhum resultado encontrado" (quando pesquisa não retorna resultados)
    - "Nenhum histórico encontrado" (quando pessoa não tem histórico)

### 4. `src/environments/environment.ts` (CRIADO)
**Mudanças:**
- Arquivo criado com configuração de ambiente
- Define `apiURL: 'http://localhost:8080'`

### 5. `src/environments/environment.development.ts` (CRIADO)
**Mudanças:**
- Arquivo criado com configuração de ambiente de desenvolvimento
- Define `apiURL: 'http://localhost:8080'`

## Funcionalidades Implementadas

### 1. Visualização de Histórico
- Botão "Ver histórico" em cada card de pessoa
- Modal responsivo (70rem de largura) com lista scrollável
- Histórico organizado em ordem cronológica decrescente (mais recente primeiro)
- Diferenciação visual entre operações e serviços

### 2. Pesquisa no Histórico
- Campo de busca no topo do modal
- Filtro em tempo real (sem necessidade de botão)
- Busca por:
  - ID da operação/serviço
  - Número de série do produto
  - Nome do aparelho
  - Modelo do produto
- Mensagem clara quando não há resultados

### 3. Exibição de Detalhes

#### Para Operações:
- ID da operação
- Data e hora da transação
- Tipo (Venda, Compra ou Troca) com badge colorido
- Informações do produto (nº série, aparelho, modelo)
- Nome do funcionário responsável
- Valor (verde para vendas, vermelho para compras)
- Observações (quando disponíveis)

#### Para Serviços:
- ID do serviço
- Data de início
- Tipo (Externo ou Interno)
- Status do serviço (Em andamento, Finalizado, etc.)
- Informações do produto (nº série, aparelho, modelo)
- Data de término (quando disponível)
- Valor
- Observações (quando disponíveis)

## Estados do Sistema

### Estados do Modal
1. **Carregando**: Spinner animado enquanto busca dados
2. **Histórico Disponível**: Lista de cards com operações/serviços
3. **Pesquisa Sem Resultados**: Mensagem informativa com ícone de busca
4. **Histórico Vazio**: Mensagem informativa quando pessoa não tem histórico

## Considerações Técnicas

### Performance
- Histórico carregado sob demanda (apenas quando modal é aberto)
- Filtro realizado no frontend para resposta instantânea
- Scroll panel limita altura para melhor experiência em listas grandes

### Compatibilidade
- Usa endpoints existentes do backend (sem necessidade de alterações no back)
- Compatível com estrutura atual de operações e serviços
- Componentes PrimeNG consistentes com o resto da aplicação

### Boas Práticas Aplicadas
- Separação de responsabilidades (serviço, componente, template)
- Type safety com TypeScript
- Funções auxiliares para evitar casts inline no template
- Feedback visual claro para todos os estados
- Tratamento de erros com mensagens Toast
- Limpeza de dados ao fechar modal

## Teste da Funcionalidade

Para testar:
1. Navegar para a página de Pessoas
2. Localizar qualquer card de pessoa
3. Clicar no botão "Ver histórico"
4. Verificar que o modal abre com o histórico
5. Testar a pesquisa digitando termos relacionados
6. Verificar diferentes cenários:
   - Pessoa com operações e serviços
   - Pessoa apenas com operações
   - Pessoa apenas com serviços
   - Pessoa sem histórico
   - Pesquisa que não retorna resultados

## Impacto no Sistema
- **Nenhuma mudança no backend necessária**
- Sem impacto em outras funcionalidades
- Adiciona apenas funcionalidade nova sem alterar comportamento existente
- Arquivos de ambiente criados apenas para corrigir configuração de build
