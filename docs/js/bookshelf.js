// 解析CSV为对象数组
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (values[i]||'').trim());
    return obj;
  });
}

//课程标签
function getTagColor(type) {
  const colorMap = {
    '专业基础课': '#e0f2fe',
    '大类基础课': '#fef9c3',
    '专业进阶课': '#fce7f3',
    '外语': '#e0e7ff',
    '思政': '#f1f5f9',
    '计算机公共课': '#dcfce7',
    '备考': '#fef2f2',
    '默认': '#f3f4f6'
  };
  const textColorMap = {
    '专业基础课': '#0369a1',
    '大类基础课': '#b45309',
    '专业进阶课': '#be185d',
    '外语': '#3730a3',
    '思政': '#334155',
    '计算机公共课': '#166534',
    '备考': '#b91c1c',
    '默认': '#374151'
  };
  return {
    bg: colorMap[type] || colorMap['默认'],
    color: textColorMap[type] || textColorMap['默认']
  };
}

// 渲染首页卡片
function renderBooks(books) {
  const container = document.getElementById('bookshelf');
  if (!books || books.length === 0) {
    container.innerHTML = '<p>暂无书籍数据。</p>';
    return;
  }
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '40px';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'stretch';
  container.style.background = '#f6f6f6';
  container.style.padding = '40px 0';
  container.style.maxWidth = '100vw';
  container.style.margin = '0';
  container.style.paddingLeft = '0';
  container.style.paddingRight = '0';

  container.innerHTML = books.map(book => {
    const imgSrc = book['图片'] ? `../images/${book['图片']}` : 'https://via.placeholder.com/340x340?text=No+Image';
    const tagColor = getTagColor(book['课程类型']);
    return `
      <div class="book-card" style="
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 4px 16px 0 rgba(60,60,60,0.10);
        padding: 0;
        margin: 0;
        width: 340px;
        min-width: 240px;
        max-width: 100%;
        flex: 1 1 340px;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.2s, transform 0.2s;
        font-family: 'HarmonyOS Sans', 'Inter', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif';
      " onclick="showDetailModal(${encodeURIComponent(book['bookid'])})"
      onmouseover="this.style.boxShadow='0 12px 32px 0 rgba(60,60,60,0.16)';this.style.transform='translateY(-3px)';"
      onmouseout="this.style.boxShadow='0 4px 16px 0 rgba(60,60,60,0.10)';this.style.transform='none';"
      >
        <img src="${imgSrc}" alt="${book['书名']||''}" style="width: 100%; height: 340px; object-fit: contain; background: #f3f4f6;">
        <div style="padding: 22px 18px 18px 18px; width: 100%; text-align: center; font-family: 'HarmonyOS Sans', 'Inter', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif';">
          <div style="font-size: 1.18rem; font-family: 'HarmonyOS Sans', 'Inter', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif'; font-weight: 700; color: #222; margin-bottom: 14px; letter-spacing:0.5px;line-height:1.3;">
            ${book['书名']||''}
          </div>
          <div style="font-size:1em;color:#888;margin-bottom:12px;font-family: 'HarmonyOS Sans', 'Inter', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif';">
            ${book['Authors/Editors']||''}
          </div>
          <span style="
            display:inline-block;
            border-radius: 8px;
            padding: 4px 16px;
            font-size: 1em;
            font-weight: 500;
            background: ${tagColor.bg};
            color: ${tagColor.color};
            margin-bottom: 4px;
            font-family: 'HarmonyOS Sans', 'Inter', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif';
            ">${book['课程类型']||'未分类'}</span>
        </div>
      </div>
    `;
  }).join('');
}

// 弹窗详情页
function showDetailModal(bookid) {
    const book = (window._allBooks || []).find(b => b['bookid'] == bookid);
    if (!book) return;

    let existingModal = document.getElementById('book-detail-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'book-detail-modal';
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.18)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);

    const imgSrc = book['图片'] ? `../images/${book['图片']}` : 'https://via.placeholder.com/340x340?text=No+Image';

    const modalContentContainer = document.createElement('div');
    modalContentContainer.style.background = '#fff';
    modalContentContainer.style.borderRadius = '24px';
    modalContentContainer.style.maxWidth = '960px';
    modalContentContainer.style.width = '96vw';
    modalContentContainer.style.padding = '0 0 32px 0';
    modalContentContainer.style.boxShadow = '0 12px 48px 0 rgba(60,60,60,0.16)';
    modalContentContainer.style.display = 'flex';
    modalContentContainer.style.flexDirection = 'column';
    modalContentContainer.style.alignItems = 'center';
    modalContentContainer.style.position = 'relative';
    modalContentContainer.style.fontFamily = "'HarmonyOS Sans', 'Inter', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif'";
    
    const closeButton = `<span style="position:absolute;top:18px;right:28px;font-size:2rem;cursor:pointer;color:#888;z-index:2;" onclick="document.getElementById('book-detail-modal').remove()">×</span>`;
    const image = `<img src="${imgSrc}" alt="${book['书名']||''}" style="width: 100%; max-width:420px; height: 340px; object-fit: contain; background: #f3f4f6; border-radius: 24px 24px 0 0;">`;
    
    modalContentContainer.innerHTML = closeButton + image;
    modal.appendChild(modalContentContainer);

    const contentArea = document.createElement('div');
    contentArea.id = 'modal-content-area';
    contentArea.style.padding = '32px 36px 0 36px';
    contentArea.style.width = '100%';
    contentArea.style.textAlign = 'center';
    modalContentContainer.appendChild(contentArea);

    renderDetailView(bookid);
}

// 渲染初始详情
function renderDetailView(bookid) {
    const container = document.getElementById('modal-content-area');
    if (!container) return;
    const book = (window._allBooks || []).find(b => b['bookid'] == bookid);
    if (!book) return;
    const tagColor = getTagColor(book['课程类型']);

    container.innerHTML = `
        <h2 style="font-size: 2rem; font-weight: 900; color: #222; margin-bottom: 18px; font-family: 'HarmonyOS Sans', 'Inter', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif'; text-align: center;">${book['书名']||''}</h2>
        <span style="display:inline-block;border-radius:8px;padding:6px 20px;font-size:1.08em;font-weight:600;background:${tagColor.bg};color:${tagColor.color};margin-bottom:18px;text-align:center;font-family: 'HarmonyOS Sans', 'Inter', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif';">${book['课程类型']||'未分类'}</span>
        <div style="margin: 18px 0 0 0; color:#888; font-size:1.32em; text-align:center; font-family: 'HarmonyOS Sans', 'Inter', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif';">
          <div><b>作者：</b>${book['Authors/Editors']||''}</div>
          <div><b>出版社：</b>${book['Publisher']||''}</div>
          <div><b>版本：</b>${book['Edition']||''}</div>
          <div><b>备注：</b>${book['备注信息']||''}</div>
        </div>
        <button onclick="renderConfirmationView('${bookid}')" 
           style="display:block;margin:45px auto 0 auto;padding:22px 0;background:#4f46e5;color:white;border-radius:15px;text-decoration:none;font-weight:800;font-size:1.22rem;box-shadow:0 4px 14px 0 rgba(79,70,229,0.3);text-align:center;letter-spacing:0.5px;transition:background 0.2s;max-width:380px;border:none;cursor:pointer;font-family:inherit;"
            onmouseover="this.style.background='#4338ca';"
            onmouseout="this.style.background='#4f46e5';">
        我要索书
        </button>
    `;
}

// 渲染确认页和表单 - 改为左右布局
function renderConfirmationView(bookid) {
    const container = document.getElementById('modal-content-area');
    if (!container) return;
    const book = (window._allBooks || []).find(b => b['bookid'] == bookid);
    if (!book) return;

    // 假设表单字段名为 "BOOKID"，根据截图推断
    const formUrl = `https://noteforms.com/forms/zfr0mm?书籍=${encodeURIComponent(book['书名']||'')}&BOOKID=${book['bookid']||''}`;
    
    // 调整弹窗内边距以适应新布局
    container.style.padding = '32px 36px 0 36px';

    container.innerHTML = `
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #222; margin-bottom: 24px; width: 100%; text-align: center;">确认索书信息</h2>
        <div style="display: flex; gap: 36px; align-items: flex-start; width: 100%;">
            <!-- Left Column: Book Info -->
            <div style="flex: 1; min-width: 0;">
                <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; padding: 24px; text-align: left; margin: 0 0 24px 0; line-height: 1.8; font-size: 1em;">
                  <p style="margin:0 0 12px 0;"><b>书名：</b><span style="color: #4f46e5; font-weight: 600;">${book['书名']||''}</span></p>
                  <p style="margin:0 0 12px 0;"><b>BookID：</b>${book['bookid']||''}</p>
                  <p style="margin:0 0 12px 0;"><b>作者：</b>${book['Authors/Editors']||''}</p>
                  <p style="margin:0 0 12px 0;"><b>课程类型：</b>${book['课程类型']||'未分类'}</p>
                  <p style="margin:0;"><b>备注：</b>${book['备注信息']||''}</p>
                </div>
                <div style="background: #fff5f5; color: #c53030; border: 1px solid #f56565; border-radius: 8px; padding: 16px; margin: 0; font-weight: 600; font-size: 0.9em; line-height:1.5;">
                  注意：30天内该类型书籍仅能索取一本。
                </div>
                <button onclick="renderDetailView('${bookid}')" style="background:#f3f4f6;color:#333;border:1px solid #ddd;padding:12px 24px;border-radius:8px;font-size:1em;font-weight:600;cursor:pointer; margin-top: 24px; width: 100%;">返回</button>
            </div>

            <!-- Right Column: Form -->
            <div style="flex: 1.2; min-width: 0;">
                <iframe src="${formUrl}" style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 12px;"></iframe>
            </div>
        </div>
    `;
}

// 渲染tag筛选区
function renderTagFilter(allBooks, onFilter) {
  // 收集所有tag
  const tags = Array.from(new Set(allBooks.map(b => b['课程类型'] || '未分类')));
  tags.sort();
  tags.unshift('全部');
  let filterBar = document.getElementById('tag-filter-bar');
  if (!filterBar) {
    filterBar = document.createElement('div');
    filterBar.id = 'tag-filter-bar';
    filterBar.style.display = 'flex';
    filterBar.style.flexWrap = 'wrap';
    filterBar.style.gap = '18px';
    filterBar.style.justifyContent = 'center';
    filterBar.style.alignItems = 'center';
    filterBar.style.margin = '0 0 24px 0';
    filterBar.style.padding = '0';
    filterBar.style.fontFamily = "'HarmonyOS Sans', 'Inter', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif'";
    filterBar.style.background = 'transparent';
    filterBar.style.zIndex = '2';
    const bookshelf = document.getElementById('bookshelf');
    bookshelf.parentNode.insertBefore(filterBar, bookshelf);
  }
  filterBar.innerHTML = tags.map(tag => {
    const tagColor = tag === '全部' ? {bg:'#e0e7ef', color:'#222'} : getTagColor(tag);
    return `<button class="tag-filter-btn" data-tag="${tag}" style="
      border:none;
      outline:none;
      background:${tagColor.bg};
      color:${tagColor.color};
      border-radius: 8px;
      padding: 7px 22px;
      font-size: 1.08em;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 1px 4px 0 rgba(60,60,60,0.06);
      transition: background 0.18s, color 0.18s;
      margin-bottom: 2px;
      font-family: inherit;
    ">${tag}</button>`;
  }).join('');
  // 事件绑定
  Array.from(filterBar.querySelectorAll('.tag-filter-btn')).forEach(btn => {
    btn.onclick = function() {
      Array.from(filterBar.querySelectorAll('.tag-filter-btn')).forEach(b=>b.style.outline='none');
      this.style.outline = '2.5px solid #6366f1';
      onFilter(this.dataset.tag);
    };
  });
  // 默认高亮"全部"
  filterBar.querySelector('.tag-filter-btn[data-tag="全部"]').style.outline = '2.5px solid #6366f1';
}

// 弹出成功提示框
function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#28a745';
    toast.style.color = 'white';
    toast.style.padding = '16px 32px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '10001';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.fontFamily = "'HarmonyOS Sans', 'Inter', 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif'";
    toast.style.fontSize = '1.1em';
    toast.innerText = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// 主流程
window.addEventListener('DOMContentLoaded', () => {
  fetch('../库存.csv')
    .then(res => res.text())
    .then(csv => {
      const books = parseCSV(csv);
      window._allBooks = books;
      renderTagFilter(books, (tag) => {
        if(tag === '全部') renderBooks(books);
        else renderBooks(books.filter(b => (b['课程类型']||'未分类') === tag));
      });
      renderBooks(books);
    });

    // 监听来自iframe的消息
    window.addEventListener('message', function(event) {
        if (event.data === 'form-submitted-successfully') {
            const modal = document.getElementById('book-detail-modal');
            if (modal) {
                modal.remove();
            }
            showSuccessToast('申请成功，待管理员审核后会联系您！');
        }
    });
}); 