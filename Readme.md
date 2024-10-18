## Backend Doxo

Sincronização de produtos com ERP OMIE

Sicronização de vendas com API Online (mesmo backend local)

Variável **OPERATION** em .env definida como "local" ou "remote"

Se **OPERATION** == 'local'

- Agendamentos para sincronização de vendas serão realizados

Se **OPERATION** == 'remote'

- Agendamentos para sincronização de vendas serão ignorados
