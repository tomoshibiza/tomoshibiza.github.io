/* =========================================
   ページ全体のHTMLデータが読み込まれたら、中身のプログラムを実行する
========================================= */
document.addEventListener("DOMContentLoaded", () => {

  // --- ★追加：ハンバーガーメニューの処理 ---
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  // ハンバーガーボタンがクリックされた時の処理
  hamburger.addEventListener("click", () => {
    // ボタンとメニューの両方に「active」という目印をつけたり外したりする
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

// ページ内のリンク（NEWSやロゴなど）がクリックされた時の処理
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      // ① デフォルトの挙動（URLに #news などを追加して履歴に残す）をストップ！
      e.preventDefault();

      // ② クリックしたリンクの飛び先（hrefの中身）を取得
      const targetId = link.getAttribute("href");

      // ③ 飛び先へ滑らかにスクロールする
      if (targetId === "#") {
        // ロゴ（href="#"）をクリックした場合は、ページの一番上へ
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // メニュー（href="#news"など）をクリックした場合は、その場所へ
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }

      // ④ スマホのメニューが開いていた場合は閉じる
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  /*
  // --- 1. ローディング画面のフェードアウト処理 ---
  // （以下、既存のコードが続きます...）
  const loading = document.getElementById("loading"); // 全画面を覆う黒い背景を取得
  const wrapper = document.querySelector(".loading-wrapper"); // くるくるアイコンと文字の塊を取得

  // アクセスしてから「3秒（3000ミリ秒）後」に以下の処理を開始する
  setTimeout(() => {
    wrapper.classList.add("fade-out"); // アイコンと文字を透明にするクラスを追加
    loading.classList.add("fade-out"); // 黒い背景全体を透明にするクラスを追加

    // フェードアウトのCSSアニメーション（0.8秒）が終わった頃に、完全に要素を非表示にする
    // （透明になっただけで残っていると、裏側にあるボタンがクリックできなくなってしまうため）
    setTimeout(() => {
      loading.style.display = "none";
    }, 800);
  }, 3000);
  */
 // --- 1. ローディング画面のフェードアウト処理 ---
  const loading = document.getElementById("loading");
  const wrapper = document.querySelector(".loading-wrapper");

  // ★「3秒待つ」のではなく「ページの読み込みが完了した瞬間（load）」に実行する
  window.addEventListener("load", () => {
    wrapper.classList.add("fade-out");
    loading.classList.add("fade-out");

    setTimeout(() => {
      loading.style.display = "none";
    }, 800);
  });


  // --- 2. モーダル（詳細ポップアップ）を開く処理 ---
  // HTMLから、モーダルの各パーツ（画像を入れる場所、タイトルを入れる場所など）を取得しておく
  const modal = document.getElementById("modal");
  const mainImg = document.getElementById("modal-main-img");
  const thumbs = document.getElementById("modal-thumbs");
  const title = document.getElementById("modal-title");
  const desc = document.getElementById("modal-desc");
  const closeBtn = document.querySelector(".close-btn");

  const imgModal = document.getElementById("img-modal");
  const imgModalContent = document.getElementById("img-modal-content");

  // 作品一覧（過去公演やメンバー等）の「全てのアイテム」に対して、クリックされた時の動きを設定する
  document.querySelectorAll(".work-item").forEach(item => {
    item.addEventListener("click", (e) => {
      
      // もしクリックした場所が「aタグ（メンバー紹介のXやインスタのアイコンリンク）」だった場合、
      // モーダルは開かずに、そのまま本来のリンク先（Xなど）へ移動させる
      if (e.target.closest('a')) return;
      
      // アイテムをクリックした時にページの一番上に飛んでしまう（標準機能）のを防ぐ
      e.preventDefault(); 

      // HTMLの「data-images」に書かれた画像ファイル名を「,」で分割し、画像のリスト（配列）を作る
      const images = item.dataset.images.split(",");
      
      // ポップアップの左側の「大きなメイン画像」に、リストの1番目の画像をセットする
      mainImg.src = images[0];
      
      // 以前開いた時のサムネイル画像が残らないように、一旦リセット（空に）する
      thumbs.innerHTML = "";

      // 取得した画像リストを使って、サムネイル画像（小さい画像）を1枚ずつ順番に作成していく
      images.forEach((src, index) => {
        if (!src) return; // もしファイル名が空っぽだったらスキップする

        const img = document.createElement("img"); // <img>タグを新しく作る
        img.src = src; // 画像のURLをセットする

        // もし「1枚目の画像（index 0）」だったら、最初から選択中（active）の枠線をつける
        if (index === 0) {
          img.classList.add("active");
        }

        // = サムネイル画像がクリックされた時の動き =
        img.addEventListener("click", (e) => {
          e.stopPropagation(); // サムネイルをクリックした時に、後ろのモーダル自体をクリックしたと誤判定されないように防ぐ

          // メインの大きな画像を、今クリックされたサムネイルと同じ画像に切り替える
          mainImg.src = src;

          // 一度すべてのサムネイルから選択中（active）の枠線を外す
          document.querySelectorAll(".modal-thumbs img").forEach(i => i.classList.remove("active"));
          // 今クリックされたものだけに、枠線を付け直す
          img.classList.add("active");
        });

        // 完成したサムネイル画像を、画面（モーダルの中）に追加する
        thumbs.appendChild(img);
      });

      // HTMLの「data-title」と「data-desc」に書かれたテキストデータを取得して、モーダルの中にセットする
      title.innerHTML = item.dataset.title;
      desc.innerHTML = item.dataset.desc;

      // 準備が整ったので、モーダルを表示する（activeクラスをつける）
      modal.classList.add("active");

      // モーダルが開いている間、裏にあるホームページ本体がスクロールされてしまわないようにロックをかける
      document.body.style.overflow = "hidden";
    });
  });


  // --- 3. モーダルを閉じる処理 ---
  // ① 「×」ボタンがクリックされた時
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active"); // モーダルを隠す
    document.body.style.overflow = ""; // ホームページ本体のスクロールロックを解除する
  });

  // ② モーダルの背景（黒い半透明の部分）がクリックされた時
  modal.addEventListener("click", (e) => {
    // もしクリックしたのが「中身の白い箱」ではなく「黒い背景」だった場合のみ閉じる
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = ""; // スクロールロックを解除
    }
  });


  // --- 4. 画像の「さらに拡大」モーダル処理 ---
  // モーダル内の「メイン画像」がクリックされたら、ポスターを全画面で見るための別のモーダルを開く
  mainImg.addEventListener("click", () => {
    imgModalContent.src = mainImg.src; // 拡大モーダルに画像URLを渡す
    imgModal.classList.add("active"); // 拡大モーダルを表示する
  });

  // 拡大モーダルのどこか（画像や背景）をクリックしたら、拡大モーダルを閉じる
  imgModal.addEventListener("click", () => {
    imgModal.classList.remove("active");
  });
// --- PROFILE スライドショーの処理 ---
  const slides = document.querySelectorAll(".profile-slideshow .slide");
  
  // スライド画像が存在する場合のみ実行
  if (slides.length > 0) {
    let currentSlide = 0; // 現在表示している画像の番号（最初は0番目＝1枚目）

    // setIntervalを使って、指定した時間ごとに中の処理を繰り返す
    setInterval(() => {
      // 1. 現在表示している画像から「active」クラスを外して透明にする
      slides[currentSlide].classList.remove("active");

      // 2. 次の画像の番号を計算する
      // （最後の画像まできたら 0 に戻るように「% slides.length」で割り算の余りを使う）
      currentSlide = (currentSlide + 1) % slides.length;

      // 3. 次の画像に「active」クラスを付けて表示する
      slides[currentSlide].classList.add("active");
      
    }, 4000); // 4000ミリ秒 ＝ 4秒ごとに切り替わる（好みの長さに変更可能）
  }
});

document.addEventListener("DOMContentLoaded", () => {

  const imgModal = document.getElementById("img-modal");
  const imgModalContent = document.getElementById("img-modal-content");

const mapImage = document.getElementById("map-image");

if (mapImage) {
  mapImage.addEventListener("click", () => {
    imgModalContent.src = mapImage.src;
    imgModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
		}
		
		const imgCloseBtn = document.querySelector(".img-close-btn");

imgCloseBtn.addEventListener("click", () => {
  imgModal.classList.remove("active");
  document.body.style.overflow = "";
		});
		
		imgModal.addEventListener("click", (e) => {
  if (e.target === imgModal) {
    imgModal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

});
