/* =================================================================
    common.js — 공통 컴포넌트 & 인터랙션
    헤더·푸터·모달 등 반복 HTML을 이 파일 한 곳에서 관리합니다.
================================================================= */

// ─── Contact API 엔드포인트 ────────────────────────────────────
// Node.js 서버 주소 (배포 후 실제 주소로 변경)
const CONTACT_API_URL = '/contact.php';

// ─── 스크롤 복원 방지 (DOMContentLoaded 이전에 실행) ──────────
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ─── 사이트 정보 (footer, header) ─────────────────────────
const SITE = {
    email: 'chinamd@naver.com',
    tel: '000-123-4567',
    address: '서울 마포구 월드컵북로4길 81',
    addressSub: '(동교동, WAWA109사옥) 1층',
    company: '(주)씨엠디컴퍼니',
    ceo: '김소리',
    bizNum: '304-81-35206',
    copyright: 'ⓒ 2026 주식회사 씨엠디컴퍼니',
    naverMapUrl: 'https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%20%EA%B0%95%EB%82%A8%EA%B5%AC%20%EB%85%BC%ED%98%84%EB%A1%9C79%EA%B8%B8%2072/address/3zjXVF,2AJ5Jk,%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EA%B0%95%EB%82%A8%EA%B5%AC%20%EB%85%BC%ED%98%84%EB%A1%9C79%EA%B8%B8%2072?c=16.67,0,0,0,dh&isCorrectAnswer=true',
};

const NAV_LINKS = [
    { href: './about.html', label: 'ABOUT' },
    { href: './business.html', label: 'BUSINESS' },
    { href: './works.html', label: 'WORKS' },
    { href: './ebook.html', label: 'EBOOK' },
];

// ─── HTML 템플릿 ─────────────────────────────────────────────
function tplHeader() {
    const items = NAV_LINKS
        .map(({ href, label }) => `<li><a href="${href}">${label}</a></li>`)
        .join('');
    return `
        <div class="header_i">
            <h1 class="header_left">
                <a href="https://cmdcompany.co.kr"><div class="logo">CMD <span style="display : none";>씨엠디 컴퍼니</span></div></a>
            </h1>
            <nav class="header_right">
                <ul class="header_nav">${items}</ul>
            </nav>
            <nav class="ham_menu">
                <div class="ham_bar"><i class="fa-solid fa-bars"></i></div>
            </nav>
        </div>`;
}

function tplHamNav() {
    return NAV_LINKS
        .map(({ href, label }) => `<li><a href="${href}">${label}</a></li>`)
        .join('');
}

function tplContactSection() {
    return `
        <h3 class="open_modal">
            CONTACT US.
            <span class="open_modal_sub"><p>문의하기</p> <i class="fa-solid fa-arrow-right"></i></span>
        </h3>
        <div class="contact_modal">
            <div class="modal_inner" data-lenis-prevent>
                <div class="close"><i class="fa-solid fa-square-xmark"></i></div>
                <div class="modal_inner_top">
                    <span class="contact_title">CONTACT</span>
                </div>
                <div class="modal_body">
                    <div class="modal_notice">
                        <p>문의 내용은 최대한 구체적으로 작성해 주실수록,<br class="mo-br"> 더욱 정확한 안내를 받아보실 수 있습니다.</p>
                        <p>죄송하지만, 성의 없는 글 작성은 회신 되지 않을 수 있습니다.</p><br>
                        <p>모든 문의는 이메일로 회신 드리고 있습니다.</p>
                    </div>
                    <div class="input_box">
                        <dl class="check_group">
                            <dt>씨엠디 컴퍼니를 어떻게 알게 되셨나요?</dt>
                            <dd class="check_list">
                                <label><input type="checkbox" name="how_found" value="네이버블로그"><span>네이버블로그</span></label>
                                <label><input type="checkbox" name="how_found" value="펭귄컴퍼니"><span>펭귄컴퍼니</span></label>
                                <label><input type="checkbox" name="how_found" value="지인추천"><span>지인 추천</span></label>
                                <label><input type="checkbox" name="how_found" value="기타"><span>기타</span></label>
                            </dd>
                        </dl>
                        <dl class="check_group">
                            <dt>어떤 도움이 필요하신가요?</dt>
                            <dd class="check_list">
                                <label><input type="checkbox" name="need" value="병원개원컨설팅"><span>병원 개원 컨설팅</span></label>
                                <label><input type="checkbox" name="need" value="병원마케팅"><span>병원 마케팅</span></label>
                                <label><input type="checkbox" name="need" value="홈페이지제작"><span>홈페이지 제작</span></label>
                                <label><input type="checkbox" name="need" value="기타"><span>기타</span></label>
                            </dd>
                        </dl>
                        <dl class="check_group">
                            <dt>마케팅 진행 예산은 어느정도로 생각하고 계신가요? <br class="mo-br">(홈페이지 별도)</dt>
                            <dd class="check_list">
                                <label><input type="checkbox" name="budget" value="300~600만원"><span>300~600만원</span></label>
                                <label><input type="checkbox" name="budget" value="600~900만원"><span>600~900만원</span></label>
                                <label><input type="checkbox" name="budget" value="900~1300만원"><span>900~1300만원</span></label>
                                <label><input type="checkbox" name="budget" value="1300만원이상"><span>1300만원 이상</span></label>
                            </dd>
                        </dl>
                        <dl>
                            <dt>현재 사업의 월 평균 매출은 정도이신가요? <span class="dt_sub"><br class="mo-br">(사업체 상황에 맞는 마케팅 전략을 위해 필요합니다)</span></dt>
                            <dd><input type="text" name="revenue" placeholder="월 평균 매출을 입력해주세요"></dd>
                        </dl>
                        <dl>
                            <dt>고객님 사업장의 장점을 2~3 문장으로 남겨주세요</dt>
                            <dd><textarea name="advantage" rows="5" placeholder="사업장 장점을 입력해주세요"></textarea></dd>
                        </dl>
                        <dl>
                            <dt>현재 겪고계신 문제나 고민사항을 남겨주세요</dt>
                            <dd><textarea name="problem" rows="5" placeholder="문제나 고민사항을 입력해주세요"></textarea></dd>
                        </dl>
                        <dl>
                            <dt>회사명 / 직책 / 이름</dt>
                            <dd><input type="text" name="name" placeholder="회사명 / 직책 / 이름을 입력해주세요" autocomplete="name"></dd>
                        </dl>
                        <dl>
                            <dt>지역</dt>
                            <dd><input type="text" name="region" placeholder="지역을 입력해주세요"></dd>
                        </dl>
                        <dl>
              
                        <dt>연락처</dt>
                            <dd><input type="tel" name="phone" placeholder="연락처를 입력해주세요" autocomplete="tel"></dd>
                        </dl>
                        <dl>
                            <dt>이메일 주소</dt>
                            <dd><input type="email" name="email" placeholder="이메일 주소를 입력해주세요" autocomplete="email"></dd>
                        </dl>
                        <div class="submit_row">
                            <button class="submit_btn js-send" type="button">
                                Send<i class="fa-solid fa-arrow-right-long"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

function tplFooter() {
    return `
        <div class="footer_inner">
            <div class="footer_brand">
                <a href="https://cmdcompany.co.kr" class="footer_brand_logo">CMD<span style="display : none";>씨엠디 컴퍼니</span></a>
            </div>
            <div class="footer_grid">
                <div class="footer_grid_col">
                    <span class="footer_grid_title">COMPANY</span>
                    <p>${SITE.company}</p>
                    <p>대표이사 : ${SITE.ceo}</p>
                    <p>사업자등록번호 : ${SITE.bizNum}</p>
                    <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
                </div>
                <div class="footer_grid_col">
                    <span class="footer_grid_title">ADDRESS</span>
                    <span class="address">${SITE.address}<br>${SITE.addressSub}</span>
                </div>
                <div class="footer_grid_col">
                    <span class="footer_grid_title">POLICY</span>
                    <p><a href="./privacy.html">개인정보처리방침</a></p>
                    <p><a href="./terms.html">이용약관</a></p>
                </div>
            </div>
            <div class="footer_bottom">
                <p>${SITE.copyright}</p>
            </div>
        </div>`;
}

function tplTopBtn() {
    return `
        <div class="top_btn short"><i class="fa-solid fa-caret-up"></i></div>
        <div class="top_btn long"><i class="fa-solid fa-up-long"></i></div>`;
}

// ─── 공통 컴포넌트 주입 ───────────────────────────────────────
// data-custom 속성이 있는 요소는 주입을 건너뜁니다 (portfolio_view 등)
function injectComponents() {
    const header = document.querySelector('header');
    const hamClose = document.querySelector('.ham_close');
    const hamNav = document.querySelector('.ham_nav');
    const contactUs = document.querySelector('#contact_us');
    const footer = document.querySelector('footer');
    const topBtnWrap = document.querySelector('.top_btn_wrap');

    if (header && !header.hasAttribute('data-custom')) header.innerHTML = tplHeader();
    if (hamClose) hamClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    if (hamNav) hamNav.innerHTML = tplHamNav();
    if (contactUs) contactUs.innerHTML = tplContactSection();
    if (footer) footer.innerHTML = tplFooter();
    if (topBtnWrap) topBtnWrap.innerHTML = tplTopBtn();

    // 고정 문의 버튼
    if (!document.getElementById('fixed_contact_btn')) {
        const btn = document.createElement('button');
        btn.id = 'fixed_contact_btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', '문의하기');
        btn.innerHTML = `<span class="fixed_contact_label">CONTACT</span>`;
        document.body.appendChild(btn);
        btn.addEventListener('click', () => {
            const trigger = document.querySelector('.open_modal_sub');
            trigger?.click();
        });
    }
}

// ─── Lenis 초기화 ─────────────────────────────────────────────
function initLenis() {
    const lenis = window.innerWidth > 768 ? new Lenis({ autoRaf: true }) : null;
    if (lenis) window.__lenis = lenis;
    return lenis;
}

// ─── About 히어로 타이틀 애니메이션 (.about_title) ─────────────
function initAboutTitleAnimation() {
    const lines = document.querySelectorAll('.about_title .line');
    const section = document.querySelector('#about');
    if (!lines.length || !section) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            lines.forEach((line, i) => {
                setTimeout(() => line.classList.add('in'), 150 + i * 200);
            });
            observer.disconnect();
        });
    }, { threshold: 0.3 });

    observer.observe(section);
}

// ─── Top 버튼 ─────────────────────────────────────────────────
function initTopBtn(topBtnWrap, footer, aboutSection) {
    if (!topBtnWrap) return {};

    function updateVisibility() {
        if (window.scrollY < 100) {
            topBtnWrap.classList.add('hidden');
        } else if (!aboutSection) {
            topBtnWrap.classList.remove('hidden');
        }
    }

    // footer IntersectionObserver로 bottom 조정 (스크롤마다 호출 X → 모바일 툴바 변화로 인한 점프 방지)
    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                    topBtnWrap.style.bottom = '30px';
            });
        }, { threshold: 0 });
        footerObserver.observe(footer);
    }

    if (aboutSection) {
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                topBtnWrap.classList.toggle('hidden', entry.isIntersecting);
            });
        }, { threshold: 0.1 }).observe(aboutSection);
    }

    topBtnWrap.addEventListener('click', () => {
        if (window.__lenis) {
            window.__lenis.scrollTo(0, { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // 모바일: 스크롤 완료 후 hover 상태 리셋
        setTimeout(() => {
            topBtnWrap.style.pointerEvents = 'none';
            requestAnimationFrame(() => { topBtnWrap.style.pointerEvents = ''; });
        }, 1700);
    });

    updateVisibility();

    return { updateVisibility };
}

// ─── 헤더 스크롤 숨김 ─────────────────────────────────────────
function initHeaderScroll(header) {
    if (!header) return () => { };
    let lastScrollY = window.scrollY;

    return function () {
        const y = window.scrollY;
        const isMobile = window.innerWidth <= 768;
        header.classList.toggle('hide_header', !isMobile && y > lastScrollY && y > 100);
        lastScrollY = y;
    };
}

// ─── 헤더·TopBtn 다크 배경 테마 (비활성화) ────────────────────
function initTheme(header, topBtnWrap, darkSections) {
    return () => { };
}

// ─── 현재 페이지 네비 활성화 ──────────────────────────────────
function initNavActive() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.header_nav li a').forEach(link => {
        if (link.getAttribute('href').split('/').pop() === page) {
            link.parentElement.classList.add('active');
        }
    });
}

// ─── 햄버거 메뉴 ─────────────────────────────────────────────
function initHamburger(lenis) {
    const hamBar = document.querySelector('.ham_bar');
    const hamClose = document.querySelector('.ham_close');
    const hamNav = document.querySelector('.ham_nav');
    if (!hamBar || !hamNav) return null;

    const open = () => {
        hamNav.classList.add('open');
        hamClose?.classList.add('open');
        document.body.style.overflow = 'hidden';
        lenis?.stop();
    };

    const close = () => {
        hamNav.classList.add('ham_closing');
        hamNav.classList.remove('open');
        hamClose?.classList.remove('open');
        document.body.style.overflow = '';
        lenis?.start();
        setTimeout(() => hamNav.classList.remove('ham_closing'), 450);
    };

    hamBar.addEventListener('click', open);
    hamClose?.addEventListener('click', close);
    hamNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

    return close;
}

// ─── Contact 모달 ─────────────────────────────────────────────
function initContactModal(lenis) {
    const trigger = document.querySelector('.open_modal_sub');
    const contactModal = document.querySelector('.contact_modal');
    if (!trigger || !contactModal) return null;

    const closeBtn = contactModal.querySelector('.close');
    const modalLines = contactModal.querySelectorAll('.modal_info .line');
    const inputs = contactModal.querySelectorAll('input, textarea');

    const resetInputs = () => inputs.forEach(el => {
        if (el.type === 'checkbox') el.checked = false;
        else el.value = '';
    });

    const open = () => {
        contactModal.classList.add('show');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        lenis?.stop();
        modalLines.forEach(line => { void line.offsetWidth; line.classList.add('active'); });
    };

    const close = () => {
        contactModal.classList.remove('show');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        lenis?.start();
        resetInputs();
        modalLines.forEach(line => line.classList.remove('active'));
    };

    trigger.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    contactModal.addEventListener('click', e => {
        if (!e.target.closest('.modal_inner')) close();
    });

    // ─── Send 버튼 ────────────────────────────────────────────
    const sendBtn = contactModal.querySelector('.js-send');
    if (sendBtn) {
        sendBtn.addEventListener('click', e => {
            e.stopPropagation();
            // 폼 데이터 수집
            const get = name => {
                const el = contactModal.querySelector(`[name="${name}"]`);
                return el ? el.value.trim() : '';
            };
            const getChecked = name =>
                [...contactModal.querySelectorAll(`[name="${name}"]:checked`)]
                    .map(el => el.value).join(', ') || '선택 없음';

            const params = {
                to_email:   'jaelang7440@naver.com',
                how_found:  getChecked('how_found'),
                need:       getChecked('need'),
                budget:     getChecked('budget'),
                revenue:    get('revenue')    || '미입력',
                advantage:  get('advantage')  || '미입력',
                problem:    get('problem')    || '미입력',
                name:       get('name')       || '미입력',
                region:     get('region')     || '미입력',
                phone:      get('phone')      || '미입력',
                reply_to:   get('email')      || '미입력',
            };

            // 필수 입력 확인
            if (!get('name') || !get('phone') || !get('email')) {
                showMsg('이름/연락처/이메일 주소는 필수 입력 항목입니다.', 'error');
                return;
            }

            // 전송 중 상태
            sendBtn.disabled = true;
            sendBtn.textContent = '전송 중…';

            fetch(CONTACT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            })
                .then(res => res.text())
                .then(text => {
                    let data;
                    try { data = JSON.parse(text); }
                    catch (e) {
                        console.error('PHP raw response:', text);
                        showMsg('서버 오류: ' + text.replace(/<[^>]*>/g, '').substring(0, 200), 'error');
                        return;
                    }
                    if (data.ok) {
                        resetInputs();
                        close();
                        showCompletePopup();
                    } else {
                        showMsg('전송 실패: ' + (data.message || '알 수 없는 오류'), 'error');
                    }
                })
                .catch(err => {
                    console.error('Contact API error', err);
                    showMsg('네트워크 오류: ' + err.message, 'error');
                })
                .finally(() => {
                    sendBtn.disabled = false;
                    sendBtn.innerHTML = 'Send<i class="fa-solid fa-arrow-right-long"></i>';
                });
        });
    }

    function showCompletePopup() {
        let popup = document.getElementById('contact_complete_popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'contact_complete_popup';
            popup.innerHTML = `
                <div class="complete_popup_overlay"></div>
                <div class="complete_popup_box">
                    <div class="complete_popup_icon">✓</div>
                    <p class="complete_popup_title">접수 완료</p>
                    <p class="complete_popup_desc">문의가 정상적으로 접수되었습니다.<br>이메일로 빠르게 회신 드리겠습니다.</p>
                    <button class="complete_popup_close" type="button">확인</button>
                </div>`;
            document.body.appendChild(popup);
            popup.querySelector('.complete_popup_overlay').addEventListener('click', closePopup);
            popup.querySelector('.complete_popup_close').addEventListener('click', closePopup);
        }
        popup.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        const popup = document.getElementById('contact_complete_popup');
        if (popup) popup.classList.remove('show');
        document.body.style.overflow = '';
    }

    function showMsg(text, type) {
        const modalInner = contactModal.querySelector('.modal_inner');
        let toast = contactModal.querySelector('.contact_toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'contact_toast';
            modalInner.prepend(toast);
        }
        clearTimeout(toast._timer);
        toast.textContent = text;
        toast.className = 'contact_toast contact_toast--' + type + ' contact_toast--show';
        toast._timer = setTimeout(() => {
            toast.classList.remove('contact_toast--show');
        }, 3500);
    }

    return close;
}

// ─── 공통 ────────────────────────────────────────────

// 요소가 화면에 들어오면 클래스를 추가하고 관찰 해제 (일회성 트리거)
function observeOnce(selector, className, threshold = 0.15) {
    const items = typeof selector === 'string'
        ? document.querySelectorAll(selector)
        : selector;
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add(className);
            observer.unobserve(entry.target);
        });
    }, { threshold });

    items.forEach(el => observer.observe(el));
}

// 스크롤 위치에 따라 스티키 레이블 텍스트 업데이트
function initStickyLabel(labelEl, labelTextEl, sectionMap, initialId, hideOnIds = []) {
    if (!labelEl || !labelTextEl) return;

    const sections = Object.keys(sectionMap)
        .map(id => document.getElementById(id))
        .filter(Boolean);

    const hideSections = hideOnIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    let currentSection = null;
    let fadeTimer = null;

    function setLabelText(text, immediate = false) {
        if (immediate) {
            labelTextEl.textContent = text;
            labelTextEl.classList.add('visible');
            return;
        }
        clearTimeout(fadeTimer);
        labelTextEl.classList.remove('visible');
        fadeTimer = setTimeout(() => {
            labelTextEl.textContent = text;
            labelTextEl.classList.add('visible');
        }, 200);
    }

    function onScroll() {
        const labelRect = labelEl.getBoundingClientRect();
        const labelBottom = labelRect.bottom;

        // hideOnIds에 해당하는 섹션과 겹치면 레이블 숨김, 해당 섹션의 mobile_section_label 표시
        hideSections.forEach(el => {
            const r = el.getBoundingClientRect();
            const shouldHide = r.top < labelRect.bottom && r.bottom > labelRect.top;
            labelEl.style.opacity = shouldHide ? '0' : '';
            labelEl.style.pointerEvents = shouldHide ? 'none' : '';
            const mobileLabel = el.previousElementSibling?.classList.contains('mobile_section_label')
                ? el.previousElementSibling
                : el.querySelector('.mobile_section_label');
            if (mobileLabel) mobileLabel.style.display = shouldHide ? 'block' : '';
        });

        let active = null;
        for (const el of sections) {
            if (el.getBoundingClientRect().top <= labelBottom) active = el.id;
        }
        if (active && sectionMap[active] && active !== currentSection) {
            currentSection = active;
            setLabelText(sectionMap[active]);
        }
    }

    if (initialId && sectionMap[initialId]) {
        currentSection = initialId;
        setLabelText(sectionMap[initialId], true);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    if (window.__lenis) {
        window.__lenis.on('scroll', onScroll);
    }
    onScroll();
}

// ─── Escape 키 ────────────────────────────────────────────────
function initEscapeKey(closeContact, closeHam) {
    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        closeContact?.();
        closeHam?.();
    });
}

// ─── 진입점 ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    injectComponents();

    const lenis = initLenis();
    const header = document.querySelector('header');
    const topBtnWrap = document.querySelector('.top_btn_wrap');
    const footer = document.querySelector('footer');
    const aboutSection = document.querySelector('#about');
    const darkSections = document.querySelectorAll('[data-header-theme="dark"]');

    initAboutTitleAnimation();
    initNavActive();

    const topBtnFns = initTopBtn(topBtnWrap, footer, aboutSection);
    const onScroll = initHeaderScroll(header);
    const onTheme = initTheme(header, topBtnWrap, darkSections);
    const closeHam = initHamburger(lenis);
    const closeContact = initContactModal(lenis);

    initEscapeKey(closeContact, closeHam);

    // 고정 문의 버튼 배경 반전
    const fixedContactBtn = document.getElementById('fixed_contact_btn');

    // 모바일: #contact_us / footer 구간에서 버튼 숨김
    if (fixedContactBtn) {
        const hideTargets = [
            document.querySelector('#contact_us'),
            document.querySelector('footer'),
        ].filter(Boolean);

        if (hideTargets.length) {
            const hideObserver = new IntersectionObserver(() => {
                const isMobile = window.matchMedia('(max-width: 768px)').matches;
                const shouldHide = isMobile && hideTargets.some(t => {
                    const r = t.getBoundingClientRect();
                    return r.top < window.innerHeight && r.bottom > 0;
                });
                fixedContactBtn.style.opacity = shouldHide ? '0' : '';
                fixedContactBtn.style.pointerEvents = shouldHide ? 'none' : '';
            }, { threshold: 0 });
            hideTargets.forEach(t => hideObserver.observe(t));
        }
    }

    function updateContactBtnTheme() {
        if (!darkSections.length) return;
        if (fixedContactBtn) {
            const { top, bottom } = fixedContactBtn.getBoundingClientRect();
            const mid = (top + bottom) / 2;
            const onDark = [...darkSections].some(s => {
                const r = s.getBoundingClientRect();
                return r.top < mid && r.bottom > mid;
            });
            fixedContactBtn.classList.toggle('on-dark', onDark);
        }
        if (topBtnWrap) {
            const { top, bottom } = topBtnWrap.getBoundingClientRect();
            const mid = (top + bottom) / 2;
            const onDark = [...darkSections].some(s => {
                const r = s.getBoundingClientRect();
                return r.top < mid && r.bottom > mid;
            });
            topBtnWrap.classList.toggle('on-dark', onDark);
        }
    }

    // 단일 스크롤 핸들러
    window.addEventListener('scroll', () => {
        onScroll();
        onTheme();
        topBtnFns.updateVisibility?.();
        updateContactBtnTheme();
    }, { passive: true });
    updateContactBtnTheme();
});
