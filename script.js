const navToggle = document.querySelector('.nav-toggle');
const navBar = document.querySelector('.nav-bar');
const navLinks = document.querySelectorAll('.nav-bar a');
const progressBar = document.querySelector('.progress-bar span');
const backToTop = document.querySelector('.back-to-top');
const heroSection = document.querySelector('.hero');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const galleryFilters = document.querySelectorAll('.gallery__filter');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox__image');
const lightboxCaption = document.querySelector('.lightbox__caption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const faqItems = document.querySelectorAll('.faq-item');
const comparisonFrame = document.querySelector('[data-comparison]');
const comparisonRange = document.querySelector('.comparison__range');
const comparisonAfter = document.querySelector('.comparison__image--after');
const comparisonHandle = document.querySelector('.comparison__handle');
const vacancyCounter = document.querySelector('.vacancy-counter');
const proofText = document.querySelector('[data-proof]');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('form-message');
const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const dotsContainer = document.querySelector('.carousel__dots');
const carouselPrev = document.querySelector('[data-carousel-prev]');
const carouselNext = document.querySelector('[data-carousel-next]');
const bookingModal = document.getElementById('bookingModal');
const promoModal = document.getElementById('promoModal');
const modalTriggers = document.querySelectorAll('[data-open-modal]');
const modalClosers = document.querySelectorAll('[data-close-modal]');
const promoModalStorageKey = 'eclipse-promo-modal-dismissed';
let currentGalleryIndex = 0;
let testimonialIndex = 0;
let testimonialTimer;
let vacancyCount = Number(vacancyCounter?.dataset.vacancy || 3);

function resolveModalKey(modalName) {
    if (!modalName) return null;
    const normalized = String(modalName).trim().toLowerCase();
    const aliases = {
        promo: 'promo',
        promomodal: 'promo',
        booking: 'booking',
        bookingmodal: 'booking'
    };
    return aliases[normalized] || null;
}

function toggleMenu() {
    const isOpen = navBar.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
}

function closeMenu() {
    navBar.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
}

function setProgressBar() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    if (backToTop) {
        backToTop.classList.toggle('is-visible', scrollTop > 680);
    }
    if (heroSection) {
        heroSection.style.setProperty('--parallax', `${scrollTop * 0.08}px`);
    }
}

function revealOnScroll() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
}

function animateStats() {
    const statsValues = document.querySelectorAll('.stat-value');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = Number(entry.target.dataset.target || 0);
                const duration = 1200;
                const step = Math.ceil(target / (duration / 16));
                let current = 0;
                const counter = window.setInterval(() => {
                    current += step;
                    if (current >= target) {
                        entry.target.textContent = target;
                        window.clearInterval(counter);
                    } else {
                        entry.target.textContent = current;
                    }
                }, 16);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsValues.forEach((value) => observer.observe(value));
}

function openLightbox(index) {
    const item = galleryItems[index];
    if (!item) return;
    currentGalleryIndex = index;
    const src = item.dataset.src;
    const caption = item.dataset.caption;
    lightboxImage.src = src;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function showLightbox(direction) {
    const nextIndex = (currentGalleryIndex + direction + galleryItems.length) % galleryItems.length;
    openLightbox(nextIndex);
}

function renderDots() {
    if (!dotsContainer || !testimonialCards.length) return;
    dotsContainer.innerHTML = '';
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `carousel__dot${index === testimonialIndex ? ' is-active' : ''}`;
        dot.type = 'button';
        dot.setAttribute('aria-label', `Ir para depoimento ${index + 1}`);
        dot.addEventListener('click', () => showTestimonial(index));
        dotsContainer.appendChild(dot);
    });
}

function showTestimonial(index) {
    testimonialIndex = index;
    testimonialCards.forEach((card, cardIndex) => card.classList.toggle('is-active', cardIndex === testimonialIndex));
    renderDots();
}

function nextTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(testimonialIndex);
}

function startTestimonials() {
    if (!testimonialCards.length) return;
    renderDots();
    showTestimonial(0);
    if (testimonialTimer) clearInterval(testimonialTimer);
    testimonialTimer = window.setInterval(nextTestimonial, 6500);
}

function setComparison(value) {
    if (!comparisonAfter || !comparisonHandle || !comparisonRange) return;
    comparisonAfter.style.clipPath = `inset(0 0 0 ${value}%)`;
    comparisonHandle.style.left = `${value}%`;
    comparisonHandle.setAttribute('aria-valuenow', String(value));
    comparisonRange.value = String(value);
}

function updateVacancyCounter() {
    if (!vacancyCounter) return;
    vacancyCount = Math.max(1, vacancyCount - (Math.random() > 0.6 ? 1 : 0));
    vacancyCounter.textContent = vacancyCount;
    vacancyCounter.dataset.vacancy = String(vacancyCount);
    const proofs = [
        'Uma cliente reservou o último horário da semana hoje.',
        'Novos horários abrem a cada manhã para o fim de semana.',
        'A equipe recebeu duas novas reservas este período.'
    ];
    if (proofText) {
        proofText.textContent = proofs[Math.floor(Math.random() * proofs.length)];
    }
}

function openModal(modalName) {
    const modalKey = resolveModalKey(modalName);
    const targetModal = modalKey === 'promo' ? promoModal : modalKey === 'booking' ? bookingModal : null;

    if (!targetModal) {
        console.warn('[modal] modal não encontrado', modalName);
        return;
    }

    if (modalKey === 'promo') {
        if (sessionStorage.getItem(promoModalStorageKey) === 'true') {
            console.log('[modal] oferta já foi exibida ou fechada nesta sessão');
            return;
        }
        sessionStorage.setItem(promoModalStorageKey, 'true');
    }

    targetModal.classList.add('is-open');
    targetModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    console.log('[modal] aberto', { modalName, modalKey });
}

function closeModal(modalName) {
    const modalKey = resolveModalKey(modalName);
    const targetModal = modalKey === 'promo' ? promoModal : modalKey === 'booking' ? bookingModal : null;

    if (!targetModal) {
        console.warn('[modal] modal não encontrado para fechar', modalName);
        return;
    }

    targetModal.classList.remove('is-open');
    targetModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (modalKey === 'promo') {
        sessionStorage.setItem(promoModalStorageKey, 'true');
    }

    console.log('[modal] fechado', { modalName, modalKey });
}

navToggle?.addEventListener('click', toggleMenu);
navLinks.forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', setProgressBar, { passive: true });
window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
});

revealOnScroll();
animateStats();
setProgressBar();
startTestimonials();
updateVacancyCounter();
window.setInterval(updateVacancyCounter, 12000);

if (comparisonRange && comparisonFrame) {
    comparisonRange.addEventListener('input', (event) => setComparison(event.target.value));
    comparisonFrame.addEventListener('pointerdown', (event) => {
        const rect = comparisonFrame.getBoundingClientRect();
        const position = ((event.clientX - rect.left) / rect.width) * 100;
        setComparison(Math.min(100, Math.max(0, position)));
        comparisonFrame.setPointerCapture(event.pointerId);
    });
    comparisonFrame.addEventListener('pointermove', (event) => {
        if (event.buttons !== 1) return;
        const rect = comparisonFrame.getBoundingClientRect();
        const position = ((event.clientX - rect.left) / rect.width) * 100;
        setComparison(Math.min(100, Math.max(0, position)));
    });
}

galleryFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
        galleryFilters.forEach((button) => button.classList.remove('is-active'));
        filter.classList.add('is-active');
        const selected = filter.dataset.filter;
        galleryItems.forEach((item) => {
            const show = selected === 'all' || item.dataset.category === selected;
            item.style.display = show ? 'inline-block' : 'none';
        });
    });
});

galleryItems.forEach((item, index) => item.addEventListener('click', () => openLightbox(index)));
lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', (event) => { event.stopPropagation(); showLightbox(-1); });
lightboxNext?.addEventListener('click', (event) => { event.stopPropagation(); showLightbox(1); });
lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.classList.contains('lightbox__backdrop')) {
        closeLightbox();
    }
});
document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showLightbox(1);
    if (event.key === 'ArrowLeft') showLightbox(-1);
});

faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    const answer = item.querySelector('.faq-item__answer');
    trigger?.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        faqItems.forEach((faq) => {
            faq.classList.remove('is-open');
            const faqTrigger = faq.querySelector('.faq-item__trigger');
            const faqAnswer = faq.querySelector('.faq-item__answer');
            if (faqTrigger) faqTrigger.setAttribute('aria-expanded', 'false');
            if (faqAnswer) faqAnswer.hidden = true;
        });
        if (!isOpen) {
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
            answer.hidden = false;
        }
    });
});

modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('[modal] trigger clicado', trigger.dataset.openModal);
        openModal(trigger.dataset.openModal);
    });
});
modalClosers.forEach((closer) => {
    closer.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('[modal] botão fechar clicado', closer.dataset.closeModal);
        closeModal(closer.dataset.closeModal);
    });
});

document.querySelectorAll('.modal__backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log('[modal] backdrop clicado', backdrop.dataset.closeModal);
        closeModal(backdrop.dataset.closeModal);
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        console.log('[modal] tecla ESC pressionada');
        closeModal('booking');
        closeModal('promo');
    }
});

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const name = (formData.get('nome') || '').toString().trim();
        const phone = (formData.get('telefone') || '').toString().trim();
        const service = (formData.get('servico') || '').toString().trim();
        const message = (formData.get('mensagem') || '').toString().trim();
        const whatsText = `Olá, sou ${name || 'um cliente'} e gostaria de agendar ${service || 'um serviço'}. Meu WhatsApp é ${phone || 'não informado'}. ${message}`.trim();
        const whatsappUrl = `https://wa.me/5534993331405?text=${encodeURIComponent(whatsText)}`;
        window.open(whatsappUrl, '_blank', 'noopener');
        contactForm.reset();
        if (formMessage) {
            formMessage.classList.add('visible');
        }
    });
}

carouselPrev?.addEventListener('click', () => {
    testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(testimonialIndex);
});
carouselNext?.addEventListener('click', () => {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(testimonialIndex);
});

document.querySelector('.testimonials__viewport')?.addEventListener('touchstart', (event) => {
    const startX = event.touches[0].clientX;
    document.querySelector('.testimonials__viewport').dataset.startX = String(startX);
}, { passive: true });

document.querySelector('.testimonials__viewport')?.addEventListener('touchend', (event) => {
    const container = document.querySelector('.testimonials__viewport');
    if (!container?.dataset.startX) return;
    const endX = event.changedTouches[0].clientX;
    const deltaX = endX - Number(container.dataset.startX);
    if (deltaX < -50) nextTestimonial();
    if (deltaX > 50) {
        testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(testimonialIndex);
    }
    delete container.dataset.startX;
}, { passive: true });

const promoTimer = window.setTimeout(() => {
    if (sessionStorage.getItem(promoModalStorageKey) === 'true') {
        console.log('[modal] oferta bloqueada por sessionStorage');
        return;
    }
    openModal('promo');
}, 7000);
window.addEventListener('beforeunload', () => window.clearTimeout(promoTimer));
