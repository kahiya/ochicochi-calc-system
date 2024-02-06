//---------------------------------------------------
//CSVダウンロード
//---------------------------------------------------
document.getElementById('download-csv').addEventListener('click', function() {
  const data = [];
  // ヘッダー行を追加
  data.push(['名前', 'フリガナ', '電話番号', 'メールアドレス', '郵便番号', '住所'].join(','));

  // フォームデータを取得
  const name = document.getElementById('name').value;
  const furigana = document.getElementById('furigana').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const postalCode = document.getElementById('postal-code').value;
  const address = document.getElementById('address').value;

  // ユーザーデータをCSV形式で追加
  data.push([name, furigana, phone, email, postalCode, address].join(','));

  // dataをCSV文字列に変換
  const csvContent = "data:text/csv;charset=utf-8," + data.join('\n');

  // ダウンロードリンクを作成
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', '見積り情報.csv');
  document.body.appendChild(link);
  link.click(); // ダウンロードを実行
  document.body.removeChild(link); // ダウンロード後にリンクを削除
});
