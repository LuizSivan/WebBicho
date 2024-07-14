# Projeto WebBicho

Este projeto foi desenvolvido utilizando a versão **LTS 20.11.0** do Node.js.
Antes de prosseguir,

## Links de ferramentas e utilitários

* [Node.js](https://nodejs.org/en/download) *
* [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) *
* [Everything](https://www.voidtools.com/downloads/)
* [Postman](https://www.postman.com/downloads/)

## Configurações de IDE

* Certifique-se de ter o Node instalado na versão acima ou mais recente para melhor compatibilidade.
    * Caso já tenha instalado, você pode verificar com o comando `node -v`
* Siga o passo a passo conforme descrito.

### Para todos os usuários

1. Caso não tenha instalado o Yarn (Gerenciador de pacotes), instale-o globalmente com o comando:
    ```bash
    npm install yarn -g
    ```

2. Caso não tenha instalado o Angular CLI globalmente, instale-o globalmente com o comando
    ```bash
   npm install @angular/cli -g
   ```

### Para usuários do WebStorm:

1. Os perfis `Start Client` e `Start Server` instalam as dependências e executam
   os processos necessários para rodar o projeto e então iniciam os servidores.

### Para usuários do Visual Studio Code (VSCode):

1. **(Opcional)** Instale a extensão ***Live Sass Compiler*** no VSCode para compilar o SCSS automaticamente.

2. Para compilar o SCSS, basta clicar em "Watch Sass" no canto inferior direito.

3. Prossiga para as configurações abaixo

### Para usuários de outras IDEs:

1. Nos diretórios client e backend, execute o comando abaixo para instalar as dependências no diretório de cada
   projeto:
    ```bash
    yarn install
    ```

2. Para compilar o SCSS no diretório client, utilize o seguinte comando:
    * Usuários do VSCode NÃO precisam caso usem a extensão Live Sass Compiler
    ```bash
    sass src:src --source-map
    ```

3. No diretório do backend, inicie-o com o comando:
    ```bash
    yarn run debug
    ```

4. No diretório do client, inicie-o com o comando:
    ```bash
    yarn run start
    ```

## Configurações de funcionamento

### Variáveis de ambiente

1. Crie um .env na pasta raiz do backend com estas variáveis.
   ```env
   # Server
   HOST=
   PORT=
   
   # Database
   DB_HOST=
   DB_PORT=
   DB_USER=
   DB_PASSWORD=
   DB_DEFAULT=
   
   # Email
   SMTP=
   EMAIL=
   PASSWORD=
   
   # Secret
   JWT_SECRET=
   ```
