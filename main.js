// microCMS設定
const API_KEY = 'qoWFh4bzPcrGHuIVPX3q5ZrkPKOH6quTWMLc';
const SERVICE_ID = 'wangius';
const API_ENDPOINT = `https://${SERVICE_ID}.microcms.io/api/v1`;

// ページ読み込み時にデータ取得
window.addEventListener('DOMContentLoaded', async () => {
    await loadHomeContent();
    await loadSiteConfig();
});

// Homeコンテンツを取得
async function loadHomeContent() {
    try {
        const response = await fetch(`${API_ENDPOINT}/contents?filters=menu_id[equals]home`, {
            headers: {
                'X-MICROCMS-API-KEY': API_KEY
            }
        });
        const data = await response.json();
        
        if (data.contents && data.contents.length > 0) {
            displayContent(data.contents[0]);
        }
    } catch (error) {
        console.error('コンテンツ取得エラー:', error);
    }
}

// サイト設定を取得
async function loadSiteConfig() {
    try {
        const response = await fetch(`${API_ENDPOINT}/site-config`, {
            headers: {
                'X-MICROCMS-API-KEY': API_KEY
            }
        });
        const data = await response.json();
        
        if (data.background_image) {
            document.body.style.backgroundImage = `url(${data.background_image.url})`;
        }
    } catch (error) {
        console.error('サイト設定取得エラー:', error);
    }
}

// コンテンツを表示
function displayContent(content) {
    // 英語
    const heroEn = document.querySelector('.lang-en h1');
    if (heroEn) heroEn.textContent = content.title_en;
    
    const subEn = document.querySelector('.lang-en p');
    if (subEn) subEn.innerHTML = content.content_en;
    
    // 中国語
    const heroZh = document.querySelector('.lang-zh h1');
    if (heroZh) heroZh.textContent = content.title_zh;
    
    const subZh = document.querySelector('.lang-zh p');
    if (subZh) subZh.innerHTML = content.content_zh;
    
    // 日本語
    const heroJa = document.querySelector('.lang-ja h1');
    if (heroJa) heroJa.textContent = content.title_ja;
    
    const subJa = document.querySelector('.lang-ja p');
    if (subJa) subJa.innerHTML = content.content_ja;
}

// 言語切り替え関数
function switchLanguage(lang) {
    currentLang = lang;
    updateLanguageDisplay();
    
    document.querySelectorAll('.language-switcher button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
}

// ハンバーガーメニュー切り替え
function toggleMenu() {
    const menuList = document.getElementById('menuList');
    menuList.classList.toggle('active');
}

// メニュー項目クリック時にメニューを閉じる
document.querySelectorAll('.main-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const menuList = document.getElementById('menuList');
        menuList.classList.remove('active');
    });
});

// ページ遷移
let currentPage = 'home';
let currentLang = 'en';

// メニューリンククリック時
document.querySelectorAll('.main-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const menuId = link.getAttribute('data-menu');
        navigateToPage(menuId);
        
        // アクティブ状態更新
        document.querySelectorAll('.main-menu a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        
        // ハンバーガーメニューを閉じる
        const menuList = document.getElementById('menuList');
        menuList.classList.remove('active');
    });
});

// ページ遷移関数
async function navigateToPage(pageId) {
    // 全ページを非表示
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    // 指定ページを表示
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.style.display = 'block';
        currentPage = pageId;
        
        // Homeページ以外はコンテンツを読み込む
        if (pageId !== 'home') {
            await loadPageContent(pageId);
        }
    }
}

// ページコンテンツを読み込む
async function loadPageContent(menuId) {
    const contentElement = document.getElementById(`${menuId}-content`);
    
    if (!contentElement) return;
    
    // Loading表示
    contentElement.innerHTML = '<p style="text-align:center; color: rgba(0, 0, 0, 0.6);">Loading...</p>';
    
    try {
        const response = await fetch(`${API_ENDPOINT}/contents?filters=menu_id[equals]${menuId}`, {
            headers: {
                'X-MICROCMS-API-KEY': API_KEY
            }
        });
        const data = await response.json();
        
        if (data.contents && data.contents.length > 0) {
            displayPageContent(data.contents, contentElement, menuId);
        } else {
            contentElement.innerHTML = 
                '<p style="text-align:center; color: rgba(0, 0, 0, 0.6);">コンテンツはまだ登録されていません。</p>';
        }
    } catch (error) {
        console.error('コンテンツ取得エラー:', error);
        contentElement.innerHTML = 
            '<p style="text-align:center; color: rgba(0, 0, 0, 0.6);">エラーが発生しました。</p>';
    }
}

// ページコンテンツを表示
function displayPageContent(contents, container, menuId) {
    // 最初のコンテンツを取得
    const content = contents[0];
    
    // TW_sectionsがあるかチェック
    if (content && content.TW_sections && content.TW_sections.length > 0) {
        // アコーディオン形式で表示
        displayAccordionContent(content.TW_sections, container);
    } else {
        // 従来の表示方法（TW_sectionsがない場合）
        let htmlEn = '';
        let htmlZh = '';
        let htmlJa = '';
        
        contents.forEach(content => {
            htmlEn += `<div class="content-block">${content.content_en || ''}</div>`;
            htmlZh += `<div class="content-block">${content.content_zh || ''}</div>`;
            htmlJa += `<div class="content-block">${content.content_ja || ''}</div>`;
        });
        
        container.innerHTML = `
            <div class="lang-en">${htmlEn}</div>
            <div class="lang-zh" style="display:none;">${htmlZh}</div>
            <div class="lang-ja" style="display:none;">${htmlJa}</div>
        `;
    }
    
    // タイトルも更新（最初のコンテンツのタイトルを使用）
    if (contents.length > 0 && contents[0].title_en) {
        const headerEn = document.querySelector(`#page-${menuId} .page-header h2.lang-en`);
        const headerZh = document.querySelector(`#page-${menuId} .page-header h2.lang-zh`);
        const headerJa = document.querySelector(`#page-${menuId} .page-header h2.lang-ja`);
        
        if (headerEn && contents[0].title_en) headerEn.textContent = contents[0].title_en;
        if (headerZh && contents[0].title_zh) headerZh.textContent = contents[0].title_zh;
        if (headerJa && contents[0].title_ja) headerJa.textContent = contents[0].title_ja;
    }
    
    // 現在の言語に合わせて表示
    updateLanguageDisplay();
}

// アコーディオン形式でコンテンツを表示
function displayAccordionContent(sections, container) {
    // display_orderでソート
    const sortedSections = sections.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    
    let htmlEn = '<div class="content-accordion">';
    let htmlZh = '<div class="content-accordion">';
    let htmlJa = '<div class="content-accordion">';
    
    sortedSections.forEach((section, index) => {
        const isOpen = section.is_open ? 'open' : '';
        const arrowClass = section.is_open ? 'open' : '';
        
        htmlEn += `
            <div class="accordion-section">
                <h3 class="accordion-title" onclick="toggleAccordion(this)">
                    <span class="accordion-arrow ${arrowClass}">▶</span>
                    ${section.section_title_en || ''}
                </h3>
                <div class="accordion-content ${isOpen}">
                    ${section.section_content_en || ''}
                </div>
            </div>
        `;
        
        htmlZh += `
            <div class="accordion-section">
                <h3 class="accordion-title" onclick="toggleAccordion(this)">
                    <span class="accordion-arrow ${arrowClass}">▶</span>
                    ${section.section_title_zh || ''}
                </h3>
                <div class="accordion-content ${isOpen}">
                    ${section.section_content_zh || ''}
                </div>
            </div>
        `;
        
        htmlJa += `
            <div class="accordion-section">
                <h3 class="accordion-title" onclick="toggleAccordion(this)">
                    <span class="accordion-arrow ${arrowClass}">▶</span>
                    ${section.section_title_ja || ''}
                </h3>
                <div class="accordion-content ${isOpen}">
                    ${section.section_content_ja || ''}
                </div>
            </div>
        `;
    });
    
    htmlEn += '</div>';
    htmlZh += '</div>';
    htmlJa += '</div>';
    
    container.innerHTML = `
        <div class="lang-en">${htmlEn}</div>
        <div class="lang-zh" style="display:none;">${htmlZh}</div>
        <div class="lang-ja" style="display:none;">${htmlJa}</div>
    `;
}

// アコーディオンの開閉
function toggleAccordion(element) {
    const arrow = element.querySelector('.accordion-arrow');
    const content = element.nextElementSibling;
    
    arrow.classList.toggle('open');
    content.classList.toggle('open');
}

// 言語表示を更新
function updateLanguageDisplay() {
    document.querySelectorAll('.lang-en, .lang-zh, .lang-ja').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll(`.lang-${currentLang}`).forEach(el => {
        el.style.display = 'block';
    });
}

// お問い合わせフォーム送信処理
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const resultDiv = document.getElementById('formResult');
        const submitBtn = contactForm.querySelector('.submit-btn');
        const submitBtnSpans = submitBtn.querySelectorAll('span');
        
        // 送信中の表示
        submitBtn.disabled = true;
        submitBtnSpans.forEach(span => span.style.display = 'none');
        submitBtn.textContent = 'Sending...';
        resultDiv.style.display = 'none';
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                // 成功
                resultDiv.className = 'form-result success';
                if (currentLang === 'en') {
                    resultDiv.textContent = 'Thank you! Your message has been sent successfully.';
                } else if (currentLang === 'zh') {
                    resultDiv.textContent = '谢谢！您的留言已成功发送。';
                } else {
                    resultDiv.textContent = 'ありがとうございます!メッセージが正常に送信されました。';
                }
                resultDiv.style.display = 'block';
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // エラー
            resultDiv.className = 'form-result error';
            if (currentLang === 'en') {
                resultDiv.textContent = 'Sorry, there was an error sending your message. Please try again.';
            } else if (currentLang === 'zh') {
                resultDiv.textContent = '抱歉，发送留言时出错。请重试。';
            } else {
                resultDiv.textContent = '申し訳ございません。メッセージの送信中にエラーが発生しました。もう一度お試しください。';
            }
            resultDiv.style.display = 'block';
        } finally {
            // ボタンを元に戻す
            submitBtn.disabled = false;
            submitBtn.textContent = '';
            submitBtnSpans.forEach(span => {
                span.style.display = '';
            });
        }
    });
}