
const buttons = document.querySelectorAll("[data-category-filter]");
const cards = document.querySelectorAll("[data-category]");

let selectedCategory = "Todas";
const activeAnimations = new Map();

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.getAttribute("data-category-filter");

    buttons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn === button));
    });

    let visibleIndex = 0;

    cards.forEach((card) => {
      const productCategory = card.getAttribute("data-category");

      const shouldShow =
        selectedCategory === "Todas" ||
        productCategory === selectedCategory;

      // Cancelar animación anterior.
      activeAnimations.get(card)?.cancel();
      activeAnimations.delete(card);

      if (shouldShow) {
        card.hidden = false;

        if (prefersReducedMotion) return;

        const animation = card.animate(
          [
            {
              opacity: 0,
              transform: "translateY(15px) scale(0.97)"
            },
            {
              opacity: 1,
              transform: "translateY(0) scale(1)"
            }
          ],
          {
            duration: 350,
            delay: visibleIndex * 65,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)"
          }
        );

        activeAnimations.set(card, animation);

        animation.onfinish = () => {
          activeAnimations.delete(card);
          animation.cancel();
        };

        visibleIndex++;

      } else {
        if (prefersReducedMotion) {
          card.hidden = true;
          return;
        }

        const animation = card.animate(
          [
            {
              opacity: 1,
              transform: "translateY(0) scale(1)"
            },
            {
              opacity: 0,
              transform: "translateY(8px) scale(0.97)"
            }
          ],
          {
            duration: 180,
            easing: "ease-in"
          }
        );

        activeAnimations.set(card, animation);

        animation.onfinish = () => {
          if (activeAnimations.get(card) !== animation) return;

          card.hidden = true;
          activeAnimations.delete(card);
          animation.cancel();
        };
      }
    });
  });
});
