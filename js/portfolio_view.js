document.addEventListener('DOMContentLoaded', () => {
    /* =============================
        HEADER HEIGHT → CSS VAR
    ==============================*/
    function updateHeaderHeight() {
        const header = document.querySelector('header');
        if (!header) return;
        document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    }
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);


    /* =============================
        PAGE INTRO DRAG TO DISMISS
    ==============================*/
    const pageIntro = document.querySelector('.page_intro');
    if (pageIntro) {
        document.body.classList.add('intro_playing');
        const preventScroll = e => e.preventDefault();
        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
        if (window.__lenis) window.__lenis.stop();

        let dragActive = false;
        let dragStartY = 0;
        let currentDragY = 0;
        let dismissed = false;
        const THRESHOLD = window.innerHeight * 0.28;

        function dismissIntro() {
            if (dismissed) return;
            dismissed = true;
            pageIntro.style.transform = '';
            pageIntro.classList.add('is_snapping', 'gone');
            pageIntro.addEventListener('transitionend', () => {
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
                document.body.classList.remove('intro_playing');
                window.removeEventListener('wheel', preventScroll);
                window.removeEventListener('touchmove', preventScroll);
                if (window.__lenis) window.__lenis.start();
                pageIntro.style.display = 'none';
                updateScrollbar();
            }, { once: true });
        }

        function onDragStart(y) {
            if (dismissed) return;
            dragActive = true;
            dragStartY = y;
            currentDragY = 0;
            pageIntro.classList.remove('is_snapping');
            pageIntro.style.cursor = 'grabbing';
        }

        function onDragMove(y) {
            if (!dragActive || dismissed) return;
            const delta = dragStartY - y;
            currentDragY = Math.max(0, delta);
            pageIntro.style.transform = `translateY(${-currentDragY}px)`;
        }

        function onDragEnd() {
            if (!dragActive || dismissed) return;
            dragActive = false;
            pageIntro.style.cursor = '';
            if (currentDragY >= THRESHOLD) {
                dismissIntro();
            } else {
                pageIntro.classList.add('is_snapping');
                pageIntro.style.transform = 'translateY(0)';
                pageIntro.addEventListener('transitionend', () => {
                    pageIntro.classList.remove('is_snapping');
                }, { once: true });
            }
        }

        pageIntro.addEventListener('mousedown', e => { e.preventDefault(); onDragStart(e.clientY); });
        document.addEventListener('mousemove', e => { onDragMove(e.clientY); });
        document.addEventListener('mouseup', () => { onDragEnd(); });

        pageIntro.addEventListener('touchstart', e => { onDragStart(e.touches[0].clientY); }, { passive: true });
        pageIntro.addEventListener('touchmove', e => {
            e.preventDefault();
            onDragMove(e.touches[0].clientY);
        }, { passive: false });
        pageIntro.addEventListener('touchend', () => { onDragEnd(); });
    }

    /* =============================
        CUSTOM SCROLLBAR
    ==============================*/
    const scrollbar = document.createElement('div');
    scrollbar.className = 'custom_scrollbar';
    const thumb = document.createElement('div');
    thumb.className = 'custom_scrollbar_thumb';
    scrollbar.appendChild(thumb);
    document.body.appendChild(scrollbar);

    let hideScrollbarTimer = null;
    let isDraggingThumb = false;
    let dragStartY = 0;
    let dragStartScrollTop = 0;

    function getScrollMetrics() {
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollable = docHeight - winHeight;
        const thumbHeight = Math.max(40, (winHeight / docHeight) * winHeight);
        return { winHeight, scrollable, thumbHeight };
    }

    function updateScrollbar() {
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollable = docHeight - winHeight;
        if (scrollable <= 0) return;
        const thumbHeight = Math.max(40, (winHeight / docHeight) * winHeight);
        const thumbTop = (window.scrollY / scrollable) * (winHeight - thumbHeight);
        thumb.style.height = thumbHeight + 'px';
        thumb.style.top = thumbTop + 'px';

        if (!document.body.classList.contains('intro_playing')) {
            scrollbar.classList.add('visible');
            if (!isDraggingThumb) {
                clearTimeout(hideScrollbarTimer);
                hideScrollbarTimer = setTimeout(() => scrollbar.classList.remove('visible'), 1200);
            }
        }
    }

    thumb.addEventListener('mousedown', e => {
        e.preventDefault();
        isDraggingThumb = true;
        dragStartY = e.clientY;
        dragStartScrollTop = window.scrollY;
        thumb.classList.add('dragging');
        clearTimeout(hideScrollbarTimer);
    });

    document.addEventListener('mousemove', e => {
        if (!isDraggingThumb) return;
        const { winHeight, scrollable, thumbHeight } = getScrollMetrics();
        const trackHeight = winHeight - thumbHeight;
        const delta = e.clientY - dragStartY;
        const next = Math.max(0, Math.min(scrollable, dragStartScrollTop + (delta / trackHeight) * scrollable));
        if (window.__lenis) {
            window.__lenis.scrollTo(next, { immediate: true });
        } else {
            document.documentElement.scrollTop = next;
        }
        const thumbTop = (next / scrollable) * trackHeight;
        thumb.style.top = thumbTop + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (!isDraggingThumb) return;
        isDraggingThumb = false;
        thumb.classList.remove('dragging');
        hideScrollbarTimer = setTimeout(() => scrollbar.classList.remove('visible'), 1200);
    });

    if (pageIntro) {
        pageIntro.addEventListener('animationend', () => {
            updateScrollbar();
        });
    }

    window.addEventListener('scroll', updateScrollbar);
    window.addEventListener('resize', updateScrollbar);

    /* =============================
        IMAGE SLIDER
    ==============================*/
    function initSlider(wrap) {
        const track = wrap.querySelector('.img_track');
        if (!track) return;

        const slides = Array.from(track.querySelectorAll('.img_slide'));
        const total = slides.length;
        let currentIndex = Math.floor(total / 2);
        let offsetX = 0;
        let targetOffset = 0;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartOffset = 0;
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;
        let rafId = null;

        function getSlideWidth() {
            return slides[0].offsetWidth + 24;
        }

        function getCenterOffset(index) {
            const slideW = getSlideWidth();
            const wrapW = wrap.offsetWidth;
            return (wrapW / 2) - (slideW * index) - (slides[0].offsetWidth / 2);
        }

        function updateClasses() {
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'near');
                const dist = Math.abs(i - currentIndex);
                if (dist === 0) slide.classList.add('active');
                else if (dist === 1) slide.classList.add('near');
            });
        }

        function applyTransform(x) {
            track.style.transform = `translateX(${x}px)`;
        }

        function snapToIndex(index) {
            currentIndex = Math.max(0, Math.min(total - 1, index));
            targetOffset = getCenterOffset(currentIndex);
            updateClasses();
            animateTo();
        }

        function animateTo() {
            cancelAnimationFrame(rafId);
            function step() {
                offsetX += (targetOffset - offsetX) * 0.1;
                applyTransform(offsetX);
                if (Math.abs(targetOffset - offsetX) > 0.5) {
                    rafId = requestAnimationFrame(step);
                } else {
                    offsetX = targetOffset;
                    applyTransform(offsetX);
                }
            }
            rafId = requestAnimationFrame(step);
        }

        function onDragStart(x) {
            isDragging = true;
            dragStartX = x;
            dragStartOffset = offsetX;
            lastX = x;
            lastTime = Date.now();
            velocity = 0;
            wrap.classList.add('is_dragging');
            cancelAnimationFrame(rafId);
        }

        function onDragMove(x) {
            if (!isDragging) return;
            const now = Date.now();
            const dt = now - lastTime || 1;
            velocity = (x - lastX) / dt;
            lastX = x;
            lastTime = now;
            offsetX = dragStartOffset + (x - dragStartX);
            applyTransform(offsetX);

            const slideW = getSlideWidth();
            const wrapW = wrap.offsetWidth;
            const centerPx = wrapW / 2 - offsetX;
            const nearestIndex = Math.round((centerPx - slides[0].offsetWidth / 2) / slideW);
            const clamped = Math.max(0, Math.min(total - 1, nearestIndex));
            if (clamped !== currentIndex) {
                currentIndex = clamped;
                updateClasses();
            }
        }

        function onDragEnd() {
            if (!isDragging) return;
            isDragging = false;
            wrap.classList.remove('is_dragging');

            const momentum = velocity * 120;
            const slideW = getSlideWidth();
            const wrapW = wrap.offsetWidth;
            const projectedOffset = offsetX + momentum;
            const centerPx = wrapW / 2 - projectedOffset;
            const nearestIndex = Math.round((centerPx - slides[0].offsetWidth / 2) / slideW);
            snapToIndex(nearestIndex);
        }

        wrap.addEventListener('mousedown', e => { e.preventDefault(); onDragStart(e.clientX); });
        document.addEventListener('mousemove', e => { onDragMove(e.clientX); });
        document.addEventListener('mouseup', () => { onDragEnd(); });

        wrap.addEventListener('touchstart', e => { onDragStart(e.touches[0].clientX); }, { passive: true });
        wrap.addEventListener('touchmove', e => { onDragMove(e.touches[0].clientX); }, { passive: true });
        wrap.addEventListener('touchend', () => { onDragEnd(); });

        offsetX = getCenterOffset(currentIndex);
        targetOffset = offsetX;
        applyTransform(offsetX);
        updateClasses();

        window.addEventListener('resize', () => {
            offsetX = getCenterOffset(currentIndex);
            targetOffset = offsetX;
            applyTransform(offsetX);
        });

        window.addEventListener('load', () => {
            offsetX = getCenterOffset(currentIndex);
            targetOffset = offsetX;
            applyTransform(offsetX);
            updateClasses();
        });
    }

    document.querySelectorAll('.img_slider_wrap').forEach(wrap => initSlider(wrap));

    /* =============================
        PREVIEW TOGGLE (PC / MOBILE)
    ==============================*/
    (function () {
        const win = document.getElementById('previewWindow');
        if (!win) return;

        const pcIndicator = document.querySelector('.pc_indicator');
        const mobileIndicator = document.querySelector('.mobile_indicator');
        const MOBILE_WIDTH = 375;
        let currentMode = 'pc';
        let animating = false;

        const stage = win.closest('.homepage_preview_stage');
        const pcImg = win.querySelector('.pc_img');
        const mobileImg = win.querySelector('.mobile_img');

        let fullWidth = win.offsetWidth;

        function initPcSize() {
            if (!pcImg || !mobileImg) return;

            const mobileDisplayH = mobileImg.naturalHeight * (MOBILE_WIDTH / mobileImg.naturalWidth);

            const pcNaturalRatio = pcImg.naturalWidth / pcImg.naturalHeight;
            const pcDisplayW = Math.round(mobileDisplayH * pcNaturalRatio);

            pcImg.style.height = mobileDisplayH + 'px';
            pcImg.style.width = 'auto';

            fullWidth = pcDisplayW;
            win.style.width = fullWidth + 'px';
        }

        if (pcImg && mobileImg) {
            const loaded = [pcImg, mobileImg].filter(i => i.complete && i.naturalWidth > 0).length;
            if (loaded === 2) {
                initPcSize();
            } else {
                let count = 0;
                [pcImg, mobileImg].forEach(img => {
                    img.addEventListener('load', () => { if (++count === 2) initPcSize(); });
                    if (img.complete) img.dispatchEvent(new Event('load'));
                });
            }
        } else {
            win.style.width = fullWidth + 'px';
        }

        function setIndicator(mode) {
            if (mode === 'mobile') {
                pcIndicator && pcIndicator.classList.remove('active');
                mobileIndicator && mobileIndicator.classList.add('active');
            } else {
                pcIndicator && pcIndicator.classList.add('active');
                mobileIndicator && mobileIndicator.classList.remove('active');
            }
        }

        function onTransitionEnd(cb) {
            win.addEventListener('transitionend', function handler(e) {
                if (e.propertyName !== 'width') return;
                win.removeEventListener('transitionend', handler);
                cb();
            });
        }

        document.querySelectorAll('.preview_toggle_btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const mode = this.dataset.mode;
                if (mode === currentMode || animating) return;

                document.querySelectorAll('.preview_toggle_btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                animating = true;
                currentMode = mode;

                const isMobileBreakpoint = window.innerWidth <= 768;

                if (mode === 'mobile') {
                    setIndicator('mobile');
                    if (isMobileBreakpoint) {
                        win.classList.add('show_mobile');
                        animating = false;
                    } else {
                        win.style.width = MOBILE_WIDTH + 'px';
                        onTransitionEnd(() => {
                            win.classList.add('show_mobile');
                            animating = false;
                        });
                    }
                } else {
                    win.classList.remove('show_mobile');
                    setIndicator('pc');
                    if (isMobileBreakpoint) {
                        animating = false;
                    } else {
                        requestAnimationFrame(() => {
                            win.style.width = fullWidth + 'px';
                            onTransitionEnd(() => { animating = false; });
                        });
                    }
                }
            });
        });

        window.addEventListener('resize', () => {
            if (currentMode === 'pc') {
                const w = win.parentElement.offsetWidth;
                win.style.width = w + 'px';
                if (pcImg) pcImg.style.width = w + 'px';
            }
        });
    })();
});
