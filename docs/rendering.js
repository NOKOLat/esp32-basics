document.addEventListener('DOMContentLoaded', (event) => {
    if (!window.location.search) {
    window.location.replace("?chapter=01_info");//もしURLパラメータが存在していない場合にはじめのページにリダイレクトする処理
    }
    let params = new URLSearchParams(document.location.search);
    let source = params.get("chapter");
    console.log(`try to get chapters/${source}/index.md`);
    var exportMarkdown = document.getElementById("exportMarkDown");

    // 相対パスで画像を読み込めるようにレンダラーの設定を変更する処理
    const renderer = new marked.Renderer();
    renderer.image = function({ href, title, text }) {
        if (href && !href.startsWith('http') && !href.startsWith('/')) {
            href = `chapters/${source}/${href}`;
        }
        return `<img src="${href}" alt="${text}">`;
    };
    renderer.code = function({ text, lang }) {
        const language = lang || 'cpp';
        // 前後の空白をtrim()で除去しつつ改行も揃える、HTMLエスケープも行う
        const code = text
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .trim()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        return `<pre class="language-${language}"><code class="language-${language}">${code}</code></pre>`;
    };
    // codeタグにprism.jsを適用するためのクラスを自動で割り振る処理
    let xhr2 = new XMLHttpRequest();
    xhr2.open("GET", `chapters/${source}/index.md`, true);
    xhr2.onreadystatechange = function(){
        if(xhr2.readyState === 4 && xhr2.status === 200){
            let data = xhr2.responseText;
            // rendererを渡す
            exportMarkdown.innerHTML = marked.parse(data, { renderer });
            Prism.highlightAll();

            document.querySelectorAll('pre[class*=":hide"]').forEach((pre, i) => {
                const id = `code-toggle-${i}`;

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = id;

                const label = document.createElement('label');
                label.htmlFor = id;
                label.textContent = '▶ コードを見る';

                input.addEventListener('change', () => {
                label.textContent = input.checked ? '▼ コードを閉じる' : '▶ コードを見る';
                });

                pre.parentNode.insertBefore(input, pre);
                pre.parentNode.insertBefore(label, pre);
            });
        }
    }
    xhr2.send();
});

