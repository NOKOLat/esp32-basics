document.addEventListener('DOMContentLoaded', (event) => {
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
        // 前後の空白をtrim()で除去しつつ改行も揃える
        const code = text.trim();

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
        }
    }
    xhr2.send();
    Prism.highlightAll();
});

