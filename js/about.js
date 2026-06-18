/* ============================================================
    about.js — About 페이지 전용 인터랙션
    각 기능은 독립된 init* 함수로 분리되어 있습니다.
============================================================ */

// ─── 상수 ────────────────────────────────────────────────────
const COUNTER = {
    DURATION: 1000,
    INTERVAL: 60,
};

const OBSERVER_THRESHOLD = {
    NEWS:  0.10,
    STAT:  0.50,
    VALUE: 0.15,
};

const SECTION_LABELS = {
    company_intro: '소개🖐🏻',
    company_board: '소식📢',
    client:        '파트너🫱🏻‍🫲🏻',
};

const LENIS_OPTIONS = {
    lerp: 0.12,
    smoothWheel: true,
};

const SCROLLBAR_THUMB_MIN_HEIGHT = 24; // px

// ─── 뉴스 스크롤 애니메이션 ───────────────────────────────────
function initNewsScrollAnimation() {
    observeOnce('.news_wrap ul li', 'visible', OBSERVER_THRESHOLD.NEWS);
}

// ─── 숫자 카운터 애니메이션 ───────────────────────────────────
function animateCounter(el) {
    const numEl = el.querySelector('.num');

    if (numEl) {
        // .num span이 있으면 그 안의 숫자만 업데이트 (나머지 HTML 보존)
        const finalNum = parseInt(numEl.textContent.trim(), 10);
        if (isNaN(finalNum)) return;
        let elapsed = 0;

        const timer = setInterval(() => {
            elapsed += COUNTER.INTERVAL;
            const progress = Math.min(elapsed / COUNTER.DURATION, 1);

            if (progress >= 1) { clearInterval(timer); numEl.textContent = finalNum; return; }

            numEl.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * finalNum);
        }, COUNTER.INTERVAL);
    } else {
        // .num span 없으면 prefix/suffix 보존하며 업데이트
        const fullText = el.textContent.trim();
        const match = fullText.match(/^(.*?)(\d+)(.*)$/);
        if (!match) return;

        const prefix   = match[1];
        const finalNum = parseInt(match[2], 10);
        const suffix   = match[3];
        let elapsed    = 0;

        const timer = setInterval(() => {
            elapsed += COUNTER.INTERVAL;
            const progress = Math.min(elapsed / COUNTER.DURATION, 1);

            if (progress >= 1) { clearInterval(timer); el.textContent = prefix + finalNum + suffix; return; }

            el.textContent = prefix + Math.floor((1 - Math.pow(1 - progress, 3)) * finalNum) + suffix;
        }, COUNTER.INTERVAL);
    }
}

function shouldAnimateStat(raw) {
    // 연도(4자리, 2000년대 이후)는 카운터 제외
    if (/^\d{4}$/.test(raw.trim()) && parseInt(raw, 10) >= 2600) return false;
    return /\d/.test(raw);
}

function initStatCounter() {
    const statNums = document.querySelectorAll('.stat_num');
    if (!statNums.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: OBSERVER_THRESHOLD.STAT });

    statNums.forEach(el => {
        const raw = (el.querySelector('.num') ?? el).textContent.trim();
        if (shouldAnimateStat(raw)) observer.observe(el);
    });
}

// ─── Value 아이템 애니메이션 ──────────────────────────────────
function initValueItemAnimation() {
    const items = document.querySelectorAll('.intro_value_item');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            items.forEach((item, i) => {
                setTimeout(() => item.classList.add('visible'), i * 150);
            });
            observer.disconnect();
        });
    }, { threshold: OBSERVER_THRESHOLD.VALUE });

    observer.observe(items[0]);
}

// ─── 섹션 레이블 ─────────────────────────────────────────────
function initSectionLabel() {
    initStickyLabel(
        document.querySelector('.about_label'),
        document.querySelector('.about_label .label_text'),
        SECTION_LABELS,
        'company_intro'
    );
}

// ─── 뉴스 모달 ───────────────────────────────────────────────
function initNewsModal() {
    const newsModal = document.querySelector('.news_modal');
    if (!newsModal) return;

    const header           = document.querySelector('header');
    const newsBodyBox      = newsModal.querySelector('.news_body_box');
    const newsBodyContent  = newsModal.querySelector('.news_body_content');
    const scrollbar        = newsModal.querySelector('.news_body_scrollbar');
    const scrollbarThumb   = newsModal.querySelector('.news_body_scrollbar_thumb');

    // ── Lenis 인스턴스 상태 ──
    const lenis = { instance: null, rafId: null };

    function destroyLenis() {
        if (lenis.instance) { lenis.instance.destroy(); lenis.instance = null; }
        if (lenis.rafId)    { cancelAnimationFrame(lenis.rafId); lenis.rafId = null; }
    }

    function createLenis() {
        destroyLenis();
        lenis.instance = new Lenis({
            wrapper: newsBodyBox,
            content: newsBodyContent,
            ...LENIS_OPTIONS,
        });
        lenis.instance.on('scroll', updateScrollbar);

        function rafLoop(time) {
            lenis.instance.raf(time);
            lenis.rafId = requestAnimationFrame(rafLoop);
        }
        lenis.rafId = requestAnimationFrame(rafLoop);
    }

    // ── 스크롤바 업데이트 ──
    function updateScrollbar() {
        const viewH    = newsBodyBox.clientHeight;
        const contentH = newsBodyContent.scrollHeight;

        if (contentH <= viewH) {
            scrollbar.classList.remove('visible');
            return;
        }

        scrollbar.classList.add('visible');
        const thumbH      = Math.max((viewH / contentH) * viewH, SCROLLBAR_THUMB_MIN_HEIGHT);
        const maxTop      = viewH - thumbH;
        const scrollRatio = lenis.instance ? lenis.instance.scroll / (contentH - viewH) : 0;

        scrollbarThumb.style.height = `${thumbH}px`;
        scrollbarThumb.style.top    = `${scrollRatio * maxTop}px`;
    }

    // ── 스크롤바 썸 드래그 (마우스 + 터치) ──
    const drag = { active: false, startY: 0, startScroll: 0 };

    function getClientY(e) {
        return e.touches ? e.touches[0].clientY : e.clientY;
    }

    function onDragStart(e) {
        if (!lenis.instance) return;
        drag.active      = true;
        drag.startY      = getClientY(e);
        drag.startScroll = lenis.instance.scroll;
        document.body.style.userSelect = 'none';
        e.preventDefault();
    }

    function onDragMove(e) {
        if (!drag.active || !lenis.instance) return;
        const viewH    = newsBodyBox.clientHeight;
        const contentH = newsBodyContent.scrollHeight;
        const thumbH   = Math.max((viewH / contentH) * viewH, SCROLLBAR_THUMB_MIN_HEIGHT);
        const maxTop   = viewH - thumbH;
        const maxScroll = contentH - viewH;
        const delta     = getClientY(e) - drag.startY;
        lenis.instance.scrollTo(drag.startScroll + (delta / maxTop) * maxScroll, { immediate: true });
    }

    function onDragEnd() {
        if (!drag.active) return;
        drag.active = false;
        document.body.style.userSelect = '';
    }

    scrollbarThumb.addEventListener('mousedown',  onDragStart);
    scrollbarThumb.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('mousemove',  onDragMove);
    document.addEventListener('touchmove',  onDragMove, { passive: false });
    document.addEventListener('mouseup',    onDragEnd);
    document.addEventListener('touchend',   onDragEnd);

    // ── 바디 터치 스와이프 ──
    const touch = { startY: 0, startScroll: 0 };

    newsBodyBox.addEventListener('touchstart', (e) => {
        if (drag.active || !lenis.instance) return;
        touch.startY      = e.touches[0].clientY;
        touch.startScroll = lenis.instance.scroll;
    }, { passive: true });

    newsBodyBox.addEventListener('touchmove', (e) => {
        if (drag.active || !lenis.instance) return;
        lenis.instance.scrollTo(touch.startScroll + (touch.startY - e.touches[0].clientY), { immediate: true });
        e.stopPropagation();
    }, { passive: true });

    // ── 모달 열기 / 닫기 ──
    function openModal(li) {
        const img    = li.querySelector('.img_box img');
        const date   = li.querySelector('.img_box .news_date, .img_box p');
        const title  = li.querySelector('.news_title');
        const desc   = li.querySelector('.text_box > p:not(.news_link):not(.news_body)')
                    ?? li.querySelector('.news_body');
        const detail = li.dataset.detail;

        newsModal.querySelector('.img_box img').src                 = img?.src ?? '';
        newsModal.querySelector('.img_box img').alt                 = img?.alt ?? '';
        newsModal.querySelector('.news_modal_date').textContent     = date?.textContent ?? '';
        newsModal.querySelector('.news_title').textContent          = title?.textContent ?? '';
        newsModal.querySelector('.news_body').textContent           = detail ?? desc?.textContent ?? '';

        newsModal.classList.add('active');
        header?.classList.add('hide-header');
        window.__lenis?.stop();

        createLenis();
        requestAnimationFrame(updateScrollbar);
    }

    function closeModal() {
        newsModal.classList.remove('active');
        header?.classList.remove('hide-header');
        window.__lenis?.start();
        destroyLenis();
        scrollbar.classList.remove('visible');
    }

    // ── 이벤트 바인딩 ──
    document.querySelectorAll('.news_wrap ul li .news_link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(link.closest('li'));
        });
    });

    document.querySelector('.news_modal_close')
        ?.addEventListener('click', closeModal);

    newsModal.addEventListener('click', (e) => {
        if (e.target === newsModal) closeModal();
    });
}

// ─── 진입점 ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNewsScrollAnimation();
    initStatCounter();
    initValueItemAnimation();
    initSectionLabel();
    initNewsModal();
});
