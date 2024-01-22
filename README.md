# Projeto WebBicho

Este projeto foi desenvolvido utilizando a versão **LTS 20.11.0** do Node.js.
Antes de prosseguir,

* Certifique-se de ter o Node instalado na versão acima ou mais recente para melhor compatibilidade.

    * Caso já tenha instalado, você pode verificar com o comando `node -v`

* Siga o passo a passo conforme descrito.

### Configuração para todos os usuários

1. Execute o seguinte comando para instalar globalmente o Yarn (Gerenciador de pacotes):
    ```bash
    npm install yarn -g
    ```

2. Caso não tenha instalado o Angular CLI globalmente, instale-o com o comando
    ```bash
   npm install @angular/cli -g
   ```

### Configuração para usuários do WebStorm:

1. Os perfis `Start Client` e `Start Server` executam o frontend e backend, eles já instala as dependências e executam
   os processos necessários para rodar o projeto diretamente no WebStorm.

## Configuração para usuários do Visual Studio Code (VSCode):

1. **(Opcional)** Instale a extensão ***Live Sass Compiler*** no VSCode para compilar o SCSS automaticamente.

2. Para compilar o SCSS, basta clicar em "Watch Sass" no canto inferior direito.

3. Prossiga para as configurações abaixo

### Configuração para usuários de Outras IDEs:

1. Execute o seguinte comando para instalar globalmente o Yarn:
    ```bash
    npm install yarn -g
    ```

2. Nos diretórios frontend e backend, execute o comando abaixo para instalar as dependências no diretório de cada
   projeto:
    * NÃO execute o comando --cwd frontend ou backend, pois este projeto usa o Yarn V4. Ao instalar desta forma, estará
      usando o v1 Classic, o que pode entrar em conflito com o gerencimaneot de algumas dependências posteriormente.
    ```bash
    yarn install
    ```

3. Para compilar o SCSS no diretório frontend, utilize o seguinte comando:
    * Usuários do VSCode NÃO precisam caso usem a extensão Live Sass Compiler
    ```bash
    sass src:src --source-map
    ```

4. No diretório do backend, inicie-o com o comando:
    ```bash
    yarn debug
    ```

5. No diretório do frontend, inicie-o com o comando:
    ```bash
    yarn start
    ```
