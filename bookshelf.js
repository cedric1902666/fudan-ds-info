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

// 渲染所有书籍卡片
function renderBooks(books) {
  const container = document.getElementById('bookshelf');
  if (!books || books.length === 0) {
    container.innerHTML = '<p>暂无书籍数据。</p>';
    return;
  }
  container.innerHTML = books.map(book => `
    <div class="book-card" style="border:1px solid #eee;padding:16px;margin:16px 0;border-radius:8px;box-shadow:0 2px 8px #eee;max-width:400px;">
      <h3>${book['书名']||''}</h3>
      <p><b>作者：</b>${book['Authors/Editors']||''}</p>
      <p><b>出版社：</b>${book['Publisher']||''}</p>
      <p><b>版本：</b>${book['Edition']||''}</p>
      <p><b>课程类型：</b>${book['课程类型']||''}</p>
      <p><b>备注：</b>${book['备注信息']||''}</p>
      <a href="https://noteforms.com/forms/zfr0mm?书籍=${encodeURIComponent(book['书名']||'')}" target="_blank" style="display:inline-block;margin-top:8px;padding:8px 16px;background:#ff9800;color:#fff;border-radius:4px;text-decoration:none;font-weight:bold;">我要索书</a>
    </div>
  `).join('');
}

// 主流程
window.addEventListener('DOMContentLoaded', () => {
  fetch('库存.csv')
    .then(res => res.text())
    .then(csv => {
      const books = parseCSV(csv);
      renderBooks(books);
    });
}); 