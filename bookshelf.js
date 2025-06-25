// 简单CSV解析函数
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

// 渲染书籍卡片
document.addEventListener('DOMContentLoaded', () => {
  fetch('books.csv')
    .then(res => res.text())
    .then(csv => {
      const books = parseCSV(csv);
      // 只展示"可索书"状态的书（假设有Status字段，若无则全部展示）
      const availableBooks = books.filter(b => !b.Status || b.Status === '可索书');
      const container = document.getElementById('bookshelf');
      if (availableBooks.length === 0) {
        container.innerHTML = '<p>暂无可索取的书籍。</p>';
        return;
      }
      container.innerHTML = availableBooks.map(book => `
        <div class="book-card" style="border:1px solid #eee;padding:16px;margin:16px 0;border-radius:8px;box-shadow:0 2px 8px #eee;">
          <h3>${book['Title']||''}</h3>
          <p><b>作者：</b>${book['Authors/Editors']||''}</p>
          <p><b>出版社：</b>${book['Publisher']||''}</p>
          <p><b>版本：</b>${book['Edition']||''}</p>
          <p><b>备注：</b>${book['Notes']||''}</p>
          <a href="https://noteforms.com/forms/zfr0mm?书籍=${encodeURIComponent(book['Title']||'')}" target="_blank" style="display:inline-block;margin-top:8px;padding:8px 16px;background:#ff9800;color:#fff;border-radius:4px;text-decoration:none;font-weight:bold;">我要索书</a>
        </div>
      `).join('');
    });
}); 