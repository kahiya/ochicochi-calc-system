//---------------------------------------------------
//印刷
//---------------------------------------------------
document.getElementById('printed-date').textContent = new Date().toLocaleDateString('ja-JP');

document.getElementById('print').addEventListener('click', function() {
    window.print(); // ブラウザの印刷ダイアログを開く
  });