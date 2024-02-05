
// 商品クラス
class Item {
  constructor(name, modifications) {
    this.name = name;
    this.modifications = modifications; // 加工の種類と価格
  }
}

class Modification {
  constructor(name, domestic, overseas) {
    this.name = name;
    this.domestic = domestic; // 国内価格
    this.overseas = overseas; // 海外価格
  }
}

// 商品と加工内容の初期化
const items = [
  new Item("着物", [
    new Modification("裄直し", 18700, 12100),
    new Modification("袖丈直し", 12100, 9900),
    // 他の着物の加工オプション...
  ]),
  new Item("襦袢", [
    new Modification("裄直し", 16500, 9900),
    new Modification("袖丈直し", 9900, 9900),
    // 他の襦袢の加工オプション...
  ])
];

// 前処理クラス
class Preprocessing {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

// 付属品クラス
class Accessory {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

// 前処理データの初期化
const preprocessingOptions = [
  new Preprocessing("湯のし（三丈もの）", 1100),
  new Preprocessing("湯のし（四丈もの）", 1320),
];

// 付属品データ
const accessories = [
    { name: '八掛（精華）', price: 9900 },
    { name: '八掛（駒）', price: 9900 },
    { name: '胴裏（正絹）', price: 9900 },
    { name: '振袖胴裏', price: 14300 },
    { name: '片裏', price: 12100 },
    { name: '背伏（正絹）', price: 770 },
    { name: '背伏（ポリ）', price: 660 },
    { name: '衣紋抜き', price: 990 },
    { name: '居敷当（着物）', price: 2750 },
    { name: '居敷当（襦袢）', price: 2420 },
    { name: '衿裏（正絹）', price: 2200 },
    { name: '絽衿裏（正絹）', price: 2750 },
    { name: '衿裏（ポリ）', price: 550 },
    { name: '絽衿裏（ポリ）', price: 1100 },
    { name: '台衿（衿芯）', price: 660 }
  ];


// 商品の選択内容が更新された際に加工内容選択肢を更新する
function updateModifications() {
  const selectedItemIndex = document.getElementById("item").value;
  const selectedItem = items[selectedItemIndex];
  const modificationsSelect = document.getElementById("modification");
  
  // 既存の選択肢をクリア
  modificationsSelect.innerHTML = '';
  
  selectedItem.modifications.forEach((mod, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = mod.name;
    modificationsSelect.appendChild(option);
  });
}


// 各種選択肢をセットアップする関数
function populateSelectWithOptions(selectElement, options) {
  selectElement.innerHTML = '';
  options.forEach((option, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = option.name;
    selectElement.appendChild(opt);
  });
}


// 付属品の合計コストを計算する関数
function calculateAccessoriesTotal() {
  const accessoriesSelects = document.querySelectorAll('.select-accessory');
  return Array.from(accessoriesSelects).reduce((total, select) => {
    const accessory = accessories[select.value];
    return total + (accessory ? accessory.price : 0);
  }, 0);
}

// 見積もり結果をHTMLとして作成する関数
function createEstimateHTML(item, preprocessingPrices, origin, accessoriesTotal) {
  // origin を日本語で表示するためにマップします。
  const originJapanese = {
    'domestic': '国内',
    'overseas': '国外'
  };

  // preprocessingPrices は前処理の価格の合計値です
  const preprocessingCostString = preprocessingPrices.map(pp => `前処理: ¥${pp}`).join(' + ');

  // 各行にクラスを追加
  return `
    <div class="item-name">${item.name} (${originJapanese[origin]}): ¥${item[origin]}</div>
    <div class="preprocessing-cost">${preprocessingCostString}</div>
    <div class="accessories-total">付属品合計: ¥${accessoriesTotal}</div>
    <div class="total">合計: ¥${item[origin] + preprocessingPrices.reduce((a, b) => a + b, 0) + accessoriesTotal}〜</div>
  `;
}

// 前処理の合計金額を計算
function calculatePreprocessingTotal() {
  const preprocessingSelects = document.querySelectorAll('.select-preprocessing');
  return Array.from(preprocessingSelects).reduce((total, select) => {
    const selectedOption = preprocessingOptions.find(opt => opt.id === select.value);
    return total + (selectedOption ? selectedOption.price : 0);
  }, 0);
}

// 付属品の合計金額を計算
function calculateAccessoriesTotal() {
  const accessoriesSelects = document.querySelectorAll('.select-accessory');
  return Array.from(accessoriesSelects).reduce((total, select) => {
    const selectedOption = accessories.find(opt => opt.id === select.value);
    return total + (selectedOption ? selectedOption.price : 0);
  }, 0);
}

  
 
// 見積もりを計算し表示する
function calculateEstimate() {
  const itemIndex = document.getElementById("item").value;
  const selectedItem = items[itemIndex];
  const origin = document.getElementById("origin").value;
  const modIndex = document.getElementById("modification").value;
  const selectedModification = selectedItem.modifications[modIndex];
  
  // 加工オプションの価格を取得
  const price = selectedModification[origin]; // 国内または海外価格を選択
  
  // 前処理の合計価格を計算
  const preprocessingTotal = calculatePreprocessingTotal();
  
  // 付属品の合計価格を計算
  const accessoriesTotal = calculateAccessoriesTotal();
  
  // 最終的な見積もり（加工オプションの価格 + 前処理合計 + 付属品合計）
  const finalEstimate = price + preprocessingTotal + accessoriesTotal;
  
  // 見積もり結果を表示
  document.getElementById("estimate").innerHTML = `
    選択された加工: ${selectedItem.name} - ${selectedModification.name}, 価格: ¥${price}<br>
    前処理合計: ¥${preprocessingTotal}<br>
    付属品合計: ¥${accessoriesTotal}<br>
    <strong>総合計: ¥${finalEstimate}</strong>
  `;
}

// 前処理の合計金額を計算する関数
function calculatePreprocessingTotal() {
  const preprocessingSelects = document.querySelectorAll('.select-preprocessing');
  return Array.from(preprocessingSelects).reduce((total, select) => {
    const preprocessingOption = preprocessingOptions.find(opt => opt.id === select.value);
    return total + (preprocessingOption ? preprocessingOption.price : 0);
  }, 0);
}

// 付属品の合計金額を計算する関数
function calculateAccessoriesTotal() {
  const accessoriesSelects = document.querySelectorAll('.select-accessory');
  return Array.from(accessoriesSelects).reduce((total, select) => {
    const accessory = accessories.find(opt => opt.id === select.value);
    return total + (accessory ? accessory.price : 0);
  }, 0);
}
// 商品選択セレクトボックス用の初期化
function populateItemsSelect() {
  const itemsSelect = document.getElementById("item");
  items.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = item.name;
    itemsSelect.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateItemsSelect();
  updateModifications(); // 初期の商品に基づいた加工オプションを表示
  calculateEstimate(); // 初期見積もり
  
  // イベントリスナー
  document.getElementById("item").addEventListener('change', () => {
    updateModifications();
    calculateEstimate();
  });
  document.getElementById("origin").addEventListener('change', calculateEstimate);
  document.getElementById("modification").addEventListener('change', calculateEstimate);
});


  
// 前処理セレクトボックスを追加する関数
function addPreprocessingOption() {
  const preprocessingContainer = document.getElementById('preprocessing-container');

  // 新しい div 要素を作成してクラスを追加
  const selectWrap = document.createElement('div');
  selectWrap.classList.add('add-select-wrap');

  // 新しい select 要素を作成してクラスを追加
  const newSelect = document.createElement('select');
  newSelect.classList.add('select-preprocessing');
  populateSelectWithOptions(newSelect, preprocessingOptions);

  // 削除ボタンを追加する要素
  const removeButton = document.createElement('button');
  removeButton.textContent = '削除';
  removeButton.type = 'button';
  removeButton.classList.add('btn-delete');
  removeButton.addEventListener('click', function() {
    preprocessingContainer.removeChild(selectWrap);
    calculateEstimate();
  });

  // change イベントと削除ボタンのイベントリスナーを追加
  newSelect.addEventListener('change', calculateEstimate);

  // select を select-wrap に追加
  selectWrap.appendChild(newSelect);
  // 削除ボタンを select-wrap に追加
  selectWrap.appendChild(removeButton);

  // select-wrap を preprocessing-container に追加
  preprocessingContainer.appendChild(selectWrap);
}


/// 付属品のセレクトボックスを追加する関数
function addAccessoryOption() {
  const accessoryContainer = document.getElementById('accessory-container');
  
  // 新しく追加するselect要素を生成
  const accessorySelect = document.createElement('select');
  accessorySelect.classList.add('select-accessory');

  // 新しく追加する<div>要素を生成
  const addSelectWrap = document.createElement('div');
  addSelectWrap.classList.add('add-select-wrap');
  addSelectWrap.appendChild(accessorySelect);

  // 削除ボタンを生成
  const removeButton = document.createElement('button');
  removeButton.textContent = '削除';
  removeButton.type = 'button';
  removeButton.classList.add('btn-delete');
  removeButton.addEventListener('click', function() {
      addSelectWrap.remove();
      calculateEstimate();
  });

  // イベントリスナーを追加
  accessorySelect.addEventListener('change', calculateEstimate);
  
  // セレクトボックスのオプションを設定
  populateSelectWithOptions(accessorySelect, accessories);
  
  // 生成した要素を追加
  addSelectWrap.appendChild(removeButton);
  accessoryContainer.appendChild(addSelectWrap);
}

// ページ読み込み時に実行する関数群
document.addEventListener('DOMContentLoaded', function() {
  populateSelectWithOptions(document.getElementById("item"), items);
  // addPreprocessingOption の最初の呼び出しで初期の前処理セレクトボックスを追加
  addPreprocessingOption();
  addAccessoryOption();

  document.getElementById('add-preprocessing').addEventListener('click', addPreprocessingOption);
  document.getElementById('add-accessory').addEventListener('click', addAccessoryOption);
  document.getElementById("item").addEventListener('change', calculateEstimate);
  document.getElementById("origin").addEventListener('change', calculateEstimate);
  document.getElementById("preprocessing").addEventListener('change', calculateEstimate);

  calculateEstimate();
});

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

//---------------------------------------------------
//印刷
//---------------------------------------------------
document.getElementById('printed-date').textContent = new Date().toLocaleDateString('ja-JP');

document.getElementById('print').addEventListener('click', function() {
    window.print(); // ブラウザの印刷ダイアログを開く
  });