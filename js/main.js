const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeMenu = () => {
  navMenu?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Abrir menu");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menu" : "Abrir menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("is-active", isCurrent);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

const validators = {
  nombre: (field) => field.value.trim().length >= 3 || "Escriba su nombre completo.",
  email: (field) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value) || "Escriba un correo valido.",
  telefono: (field) => field.value.replace(/\D/g, "").length >= 7 || "Escriba un telefono valido.",
  area: (field) => field.value.trim().length > 0 || "Seleccione un area de consulta.",
  mensaje: (field) => field.value.trim().length >= 10 || "Cuente brevemente su caso.",
  autorizacion: (field) => field.checked || "Debe autorizar el tratamiento de datos.",
};

const showError = (field, message) => {
  const error = form?.querySelector(`[data-error-for="${field.name}"]`);
  if (error) error.textContent = typeof message === "string" ? message : "";
  field.setAttribute("aria-invalid", typeof message === "string" ? "true" : "false");
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = [...form.querySelectorAll("input, select, textarea")];
  let isValid = true;

  fields.forEach((field) => {
    const result = validators[field.name]?.(field) ?? true;
    showError(field, result);

    if (result !== true) {
      isValid = false;
    }
  });

  if (!isValid) {
    formStatus.textContent = "Revise los campos marcados antes de enviar.";
    return;
  }

  formStatus.textContent = "Consulta registrada visualmente. Reemplace esta accion por el envio real cuando conecte un backend o servicio de formularios.";
  form.reset();
  fields.forEach((field) => showError(field, true));
});
