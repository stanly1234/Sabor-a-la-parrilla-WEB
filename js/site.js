document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }
});


// Carrusel principal: solo existe en el inicio, dentro de "El verdadero sabor de la parrilla".
const heroCarrusel = document.getElementById("heroCarrusel");
if (heroCarrusel) {
  const slides = Array.from(heroCarrusel.querySelectorAll(".hero-slide"));
  const dots = Array.from(heroCarrusel.querySelectorAll(".hero-dot"));
  const prev = heroCarrusel.querySelector(".hero-prev");
  const next = heroCarrusel.querySelector(".hero-next");
  let current = 0;
  let timer;

  function mostrarSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-current", i === current ? "true" : "false");
    });
  }

  function reiniciarTimer() {
    clearInterval(timer);
    timer = setInterval(() => mostrarSlide(current + 1), 4500);
  }

  prev.addEventListener("click", () => {
    mostrarSlide(current - 1);
    reiniciarTimer();
  });

  next.addEventListener("click", () => {
    mostrarSlide(current + 1);
    reiniciarTimer();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      mostrarSlide(Number(dot.dataset.slide));
      reiniciarTimer();
    });
  });

  mostrarSlide(0);
  reiniciarTimer();
}
