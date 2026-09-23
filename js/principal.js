document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll('.navegacao a[href^="#"]');
  const secoes = document.querySelectorAll("main section[id]");
  const formulario = document.querySelector("#formulario-contato");
  const botaoTema = document.querySelector("#alternar-tema");
  const metaTema = document.querySelector('meta[name="theme-color"]');
  const cabecalho = document.querySelector(".cabecalho");
  const hero = document.querySelector(".hero");
  const reduzMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const dispositivoAndroid =
    document.documentElement.classList.contains("android");

  function atualizarCabecalho() {
    cabecalho.classList.toggle("rolagem", window.scrollY > 12);
  }

  let quadroRolagemPendente = false;

  function aoRolar() {
    if (quadroRolagemPendente) return;

    quadroRolagemPendente = true;
    window.requestAnimationFrame(function () {
      atualizarCabecalho();
      quadroRolagemPendente = false;
    });
  }

  atualizarCabecalho();
  window.addEventListener("scroll", aoRolar, { passive: true });

  if (!reduzMovimento && window.matchMedia("(pointer: fine)").matches) {
    let quadroPendente = false;
    hero.addEventListener("pointermove", function (evento) {
      if (quadroPendente) return;
      quadroPendente = true;
      window.requestAnimationFrame(function () {
        const caixa = hero.getBoundingClientRect();
        const proporcaoX = (evento.clientX - caixa.left) / caixa.width - 0.5;
        const proporcaoY = (evento.clientY - caixa.top) / caixa.height - 0.5;
        hero.style.setProperty("--movimento-x", `${proporcaoX * 18}px`);
        hero.style.setProperty("--movimento-y", `${proporcaoY * 14}px`);
        quadroPendente = false;
      });
    });
    hero.addEventListener("pointerleave", function () {
      hero.style.setProperty("--movimento-x", "0px");
      hero.style.setProperty("--movimento-y", "0px");
    });
  }

  function temaEscuroAtivo() {
    return document.documentElement.dataset.tema === "escuro";
  }

  function atualizarControleTema() {
    const escuro = temaEscuroAtivo();
    botaoTema.setAttribute("aria-pressed", String(escuro));
    botaoTema.setAttribute(
      "aria-label",
      escuro ? "Ativar modo claro" : "Ativar modo escuro",
    );
    metaTema.setAttribute("content", escuro ? "#0b1219" : "#f6f3ec");
  }

  function aplicarTema(escuro) {
    if (escuro) {
      document.documentElement.dataset.tema = "escuro";
    } else {
      delete document.documentElement.dataset.tema;
    }
    try {
      localStorage.setItem("tema", escuro ? "escuro" : "claro");
    } catch (erro) {
      /* A preferência permanece ativa durante a visita. */
    }
    atualizarControleTema();
  }

  atualizarControleTema();

  botaoTema.addEventListener("click", function () {
    const proximoEscuro = !temaEscuroAtivo();
    const caixa = botaoTema.getBoundingClientRect();
    const x = caixa.left + caixa.width / 2;
    const y = caixa.top + caixa.height / 2;
    const raio = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    botaoTema.classList.remove("tema-clicado");
    void botaoTema.offsetWidth;
    botaoTema.classList.add("tema-clicado");

    if (!document.startViewTransition || reduzMovimento || dispositivoAndroid) {
      aplicarTema(proximoEscuro);
      return;
    }

    const transicao = document.startViewTransition(function () {
      aplicarTema(proximoEscuro);
    });
    transicao.ready.then(function () {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${raio}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  });

  const elementosRevelar = document.querySelectorAll(".revelar");
  if (reduzMovimento || !("IntersectionObserver" in window)) {
    elementosRevelar.forEach(function (elemento) {
      elemento.classList.add("visivel");
    });
  } else {
    const observadorRevelar = new IntersectionObserver(
      function (entradas, observador) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        });
      },
      { threshold: 0.14 },
    );
    elementosRevelar.forEach(function (elemento) {
      observadorRevelar.observe(elemento);
    });
  }

  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          links.forEach(function (link) {
            link.removeAttribute("aria-current");
          });
          const linkAtual = document.querySelector(
            `.navegacao a[href="#${entrada.target.id}"]`,
          );
          if (linkAtual) linkAtual.setAttribute("aria-current", "location");
        });
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );
    secoes.forEach(function (secao) {
      observador.observe(secao);
    });
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;
    const dados = new FormData(formulario);
    const nome = dados.get("nome");
    const email = dados.get("email");
    const mensagem = dados.get("mensagem");
    const assunto = encodeURIComponent(`Contato pelo portfólio — ${nome}`);
    const corpo = encodeURIComponent(
      `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`,
    );
    window.location.href = `mailto:emanuellmarinho.dev@gmail.com?subject=${assunto}&body=${corpo}`;
  });
});
