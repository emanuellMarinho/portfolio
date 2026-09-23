# Portfólio — Desenvolvedor Full Stack

Portfólio estático em HTML, CSS e JavaScript, sem build ou backend.

## Executar

```sh
python3 -m http.server 8080 --directory public
```

Acesse `http://localhost:8080`.

## Estrutura do site

- Home: cargo, área de atuação e tecnologias em composição centralizada.
- Sobre: história com TI e experiência profissional.
- Contato: formulário simples por e-mail.
- Rodapé: LinkedIn e WhatsApp.

## Interface

O site inclui tema claro e escuro com preferência salva no navegador, transição circular na troca de tema, animações de entrada e interações sutis. A preferência do sistema por movimento reduzido é respeitada.

## Formulário

O formulário valida nome, e-mail e mensagem e abre o aplicativo de e-mail do visitante com os dados preenchidos. Não há armazenamento de informações nem envio por servidor.

## Arquivos principais

- `public/index.html`: conteúdo e estrutura.
- `public/css/variaveis.css`: cores e medidas.
- `public/css/global.css`: tipografia e estilos básicos.
- `public/css/componentes.css`: layout das três seções.
- `public/css/responsivo.css`: ajustes para telas menores.
- `public/js/principal.js`: tema, revelação das seções, seção ativa e formulário de contato.

O `CNAME` e o redirecionamento da raiz foram preservados. Nenhum deploy foi realizado.
