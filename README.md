# Sistema de Controle de Gastos Residencial

Uma aplicação Full-Stack desenvolvida para o gerenciamento de finanças residenciais, permitindo o registro de pessoas, controle de receitas e despesas, e a visualização de saldos individuais e gerais da residência em tempo real.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias modernas e seguindo boas práticas de mercado:

**Back-end:**

- **.NET (C#):** API RESTful estruturada com Controllers.
- **Entity Framework Core:** ORM utilizado para manipulação e persistência dos dados.
- **SQLite:** Banco de dados relacional leve para garantir a persistência dos dados após o fechamento da aplicação, sem necessidade de instalações complexas.
- **LINQ:** Utilizado para processamento, cálculos de saldo e formatação eficiente dos retornos JSON.

**Front-end:**

- **React 19:** Biblioteca principal para construção da interface.
- **TypeScript:** Tipagem estática rigorosa para garantir previsibilidade e evitar erros em tempo de execução.
- **Tailwind CSS:** Estilização utilitária para uma interface responsiva, limpa e moderna.
- **Vite:** Bundler para otimização do ambiente de desenvolvimento e sua integração reforçada com o ambiente React.
- **React Toastify:** Feedback visual instantâneo para as ações do usuário.

## ⚙️ Funcionalidades e Regras de Negócio Implementadas

A aplicação atende aos requisitos essenciais de um controle de despesas:

1.  **Dashboard Resumo:** Visualização do total de receitas, despesas e saldo líquido da residência.
2.  **Gestão de Pessoas:**
    - Cadastro de novas pessoas (Nome e Idade).
    - Validação de nomes duplicados (Retorno 400 Bad Request).
    - Listagem completa exibindo os totais e saldos individuais.
    - Exclusão de pessoas com deleção que apaga automaticamente as transações vinculadas à pessoa.
3.  **Gestão de Transações:**
    - Lançamento de receitas e despesas diretamente no perfil de cada morador.
    - **Regra de Negócio (Back e Front):** Menores de 18 anos são impedidos de registrar receitas, sendo limitados apenas a registrar despesas.
    - Histórico geral com filtragem local rápida por descrição ou nome do morador.

## 🧠 Arquitetura e Decisões Técnicas

- **Single Page Application (SPA):** A interface foi construída em uma única tela contendo tabelas modulares e modais flutuantes. Isso elimina a necessidade de rotas complexas, melhorando a UX com atualizações instantâneas via elevação de estado (`counter`).
- **Rotas desnecessárias:** Rotas de API desnecessárias (como buscas de transação por ID único ou edições) foram omitidas para manter o código enxuto, focado nos requisitos solicitados e facilitando a leitura.
- **useActionState:** Utilização dos novos hooks do React para o gerenciamento eficiente e nativo das submissões de formulário assíncronas em comunicação direta com a API.

## 🛠️ Como executar o projeto localmente

### 1. Clonando o repositório

```bash
git clone https://github.com/GuScobernatti/controle-gastos-residenciais.git
cd controle-gastos-residenciais
```

### 2. Rodando o Back-end (API)

Navegue até a pasta do projeto .NET:

```bash
cd Expenses_Control/Expenses_Control
```

Restaure os pacotes e execute a aplicação:

```bash
dotnet build
dotnet run
```

A API estará rodando (geralmente em https://localhost:7125 ou porta similar). O banco de dados SQLite (controle_gastos.db) será utilizado automaticamente.

Para acessar o código fonte:
```bash
cd Expenses_Control
start Expenses_Control.slnx
```
Se quiser executar o projeto por aí, basta apenas clicar no f5.

### 3. Rodando o Front-end (React + TypeScript)

Para garantir que o ambiente Front-end rode de forma isolada, abra a pasta diretamente no VS Code:

```bash
cd projetoControleGastos
code .
```

Instale as dependências e inicie o servidor Vite:

```bash
npm install
npm run dev
```

Acesse o link local gerado pelo Vite (ex: http://localhost:5173) no seu navegador.
Desenvolvido por Gustavo Luiz S. de Almeida.
