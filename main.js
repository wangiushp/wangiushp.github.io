// microCMS設定
const API_KEY = 'qoWFh4bzPcrGHuIVPX3q5ZrkPKOH6quTWMLc'; // ここに実際のAPIキーを入力
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
    document.querySelectorAll('.hero').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelector('.lang-' + lang).style.display = 'block';
    
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