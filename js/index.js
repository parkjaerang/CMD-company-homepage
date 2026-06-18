document.addEventListener('DOMContentLoaded', () => {
    /* =============================
        SECTION LABEL
    ==============================*/
    initStickyLabel(
        document.querySelector('.index_label'),
        document.querySelector('.index_label .label_text'),
        { introduce: '서비스💼', client: '파트너🫱🏻‍🫲🏻', address: '오시는 길🚘' },
        'introduce'
    );

    observeOnce('#introduce .intro_item', 'visible', 0.15);
    observeOnce('#introduce .intro_line', 'extra', 0.2);

    /* =============================
        ROLLING BANNER
    ==============================*/
    const track = document.querySelector('.banner_track');
    const dotsContainer = document.querySelector('.banner_dots');
    if (track && dotsContainer) {
        const slides = Array.from(track.querySelectorAll('.banner_slide'));
        const total = slides.length;
        let current = 0;
        let autoTimer;
        let transitioning = false;

        slides.forEach(slide => track.appendChild(slide.cloneNode(true)));

        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        function updateDots(index) {
            dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        }

        function slideWidth() {
            return track.parentElement.offsetWidth;
        }

        function setSlideWidths() {
            const w = slideWidth();
            track.querySelectorAll('.banner_slide').forEach(s => s.style.width = w + 'px');
        }

        setSlideWidths();

        function goTo(index) {
            if (transitioning) return;
            transitioning = true;
            current = index;
            track.style.transition = '';
            track.style.transform = `translateX(-${current * slideWidth()}px)`;
            updateDots(current % total);
        }

        track.addEventListener('transitionend', (e) => {
            if (e.propertyName !== 'transform') return;
            if (current >= total) {
                track.style.transition = 'none';
                current = current % total;
                track.style.transform = `translateX(-${current * slideWidth()}px)`;
                void track.offsetWidth;
                track.style.transition = '';
            }
            transitioning = false;
        });

        window.addEventListener('resize', () => {
            setSlideWidths();
            track.style.transition = 'none';
            track.style.transform = `translateX(-${current * slideWidth()}px)`;
        });

        const INTERVAL = 3500;
        const TRANSITION_MS = 700;

        function startAuto() {
            clearInterval(autoTimer);
            autoTimer = setTimeout(function tick() {
                goTo(current + 1);
                autoTimer = setTimeout(tick, INTERVAL + TRANSITION_MS);
            }, INTERVAL);
        }

        const bannerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAuto();
                    bannerObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });

        bannerObserver.observe(track.parentElement);
    }

});