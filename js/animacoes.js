if (
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  "IntersectionObserver" in window
) {
  const observadorAnimacoes = new IntersectionObserver(
    function (entradas, observador) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("entrada-suave");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(".cabecalho-secao, .projeto")
    .forEach(function (elemento) {
      observadorAnimacoes.observe(elemento);
    });
}
