window.onload = function() {//前後に有効なチャプターがあった場合にナビゲーションリンクを表示する処理
    const currentURL = new URLSearchParams(this.document.location.search);
    const URLparameter = currentURL.get("chapter");
    const pattern = /^(\d{2})_info$/;
    const match = URLparameter.match(pattern);
    const prevTag = document.getElementById("prev");
    const nextTag = document.getElementById("next");

    function checkChapter(tag, chapterURL) {
        let xhr = new XMLHttpRequest();
        xhr.open("HEAD", `chapters/${chapterURL}_info/index.md`);
        xhr.onload = () => {
            if (xhr.status === 200) {
                tag.style.display = "block";
                tag.href = `?chapter=${chapterURL}_info`
            }
        };
        xhr.send();
    }

    if (match) {
        const num = parseInt(match[1]);
        checkChapter(prevTag, String(num - 1).padStart(2, "0"));
        checkChapter(nextTag, String(num + 1).padStart(2, "0"));
    }
};