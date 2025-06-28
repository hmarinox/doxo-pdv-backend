## Backend Doxo

Sincronização de produtos com ERP OMIE

Sicronização de vendas com API Online (mesmo backend local)

Variável **OPERATION** em .env definida como "local" ou "remote"

Se **OPERATION** == 'local'

- Agendamentos para sincronização de vendas serão realizados

Se **OPERATION** == 'remote'

- Agendamentos para sincronização de vendas serão ignorados

### Para reconhecimento dos códigos 2D é necessário realizar configuração para substituição do caracter FNC1

    - O caracter FNC1 é um caracter não imprimível utilizado para reconhecimento do final de um campo variável no padrão GS1
     Brasil.

E como a leitura é realizada por um naveagdor WEB esse caracter não é reconhecido, portando se faz necessário realizar configuração no Software 123Scan (software utilizado para os leitores Zebra), para substituir esse caracter durante a leitura, por qualquer um desses listado abaixo:

        1. "_"
        2. "*"
        3. "|"
        4. "}"
        5. "{"
        6. "`"
# doxo-pdv-backend
