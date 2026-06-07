AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("show", window.scrollY > 400);
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("imageModal");
    const preview = document.getElementById("modalImage");
    const galleryImages = document.querySelectorAll(".rec-img");
    const closeTrigger = document.querySelector(".close-modal");

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    };

    galleryImages.forEach(image => {
        image.addEventListener("click", () => {
            preview.src = image.src;
            preview.alt = image.alt;

            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    closeTrigger?.addEventListener("click", closeModal);

    modal?.addEventListener("click", event => {
        if (event.target !== modal) return;
        closeModal();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    const dots = document.querySelectorAll(".carousel-indicators button");
    const carousel = document.querySelector(".portfolio-carousel");

    if (!track || !carousel) return;

    const slides = Array.from(track.children);
    const totalSlides = slides.length;

    slides.forEach(slide => {
        track.appendChild(slide.cloneNode(true));
    });

    let current = 0;
    let autoplay;

    const refreshDots = () => {
        dots.forEach(dot => dot.classList.remove("active"));

        const active = current % totalSlides;
        dots[active]?.classList.add("active");
    };

    const goToSlide = index => {
        track.style.transition = "transform 0.7s ease";
        track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
    };

    const nextSlide = () => {
        current++;

        goToSlide(current);
        refreshDots();

        if (current < totalSlides) return;

        setTimeout(() => {
            track.style.transition = "none";
            track.style.transform = "translate3d(0,0,0)";
            current = 0;

            refreshDots();
        }, 700);
    };

    const startAutoplay = () => {
        autoplay = setInterval(nextSlide, 2500);
    };

    const stopAutoplay = () => {
        clearInterval(autoplay);
    };

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            stopAutoplay();

            current = index;
            goToSlide(current);
            refreshDots();

            startAutoplay();
        });
    });

    refreshDots();
    startAutoplay();
});

window.openHofModal = function(src, alt) {
    const modal = document.getElementById("imageModal");
    const preview = document.getElementById("modalImage");
    if (modal && preview) {
        preview.src = src;
        preview.alt = alt;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        if (typeof Sound !== 'undefined' && Sound.playSuccess) {
            Sound.playSuccess();
        }
    }
};