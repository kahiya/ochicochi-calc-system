
// 商品クラス
class Item {
  constructor(name, domestic, overseas) {
    this.name = name;
    this.domestic = domestic;
    this.overseas = overseas;
  }
}

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
// 商品データの初期化
const items = [
  new Item("留袖・色留袖(比翼付き)", 62700, 34100),
  new Item("留袖（訪問着仕立）", 55000, 27500),
  new Item("留袖・色留袖(比翼付き)", 62700, 34100),
  new Item("留袖（訪問着仕立）", 55000, 27500),
  new Item("振袖", 56100, 30800),
  new Item("訪問着", 46200, 27500),
  new Item("付下げ", 41800, 25300),
  new Item("色無地", 36300, 24200),
  new Item("小紋", 36300, 24200),
  new Item("紬・大島", 41800, 24200),
  new Item("長襦袢", 22000, 15400),
  new Item("長襦袢(振)", 23100, 16500),
  new Item("羽織(ロング丈も対応)", 38500, 25300),
  new Item("道行コート(ロング丈も対応)", 38500, 25300),
  new Item("道中着(ロング丈も対応)", 38500, 25300),
  new Item("女性アンサンブル", 66000, 46200),
  new Item("男性アンサンブル", 71500, 49500),
  new Item("男襦袢", 23100, 15400),
  new Item("浴衣", 25000, 18200),
  new Item("男袴（馬乗・行燈）", 46200, 0), // 国外はなし
];
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
    { name: '台衿（衿芯）', price: 660 },
  ];

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

  
  // 選択されたオプションに基づいて見積もりを計算し表示する関数
  function calculateEstimate() {
    const itemSelect = document.getElementById("item");
    const originSelect = document.getElementById("origin");
    const estimateDiv = document.getElementById("estimate");
  
    const selectedItem = items[itemSelect.value];
    const selectedOrigin = originSelect.value;
    const accessoriesTotal = calculateAccessoriesTotal();
  
    // すべての前処理セレクトボックスを処理して、前処理の価格の配列を得ます
    const preprocessingPrices = Array.from(document.querySelectorAll('.select-preprocessing')).map(select => {
      const preprocessingOption = preprocessingOptions[select.value];
      return preprocessingOption ? preprocessingOption.price : 0;
    });
  
    const cost = selectedItem[selectedOrigin] +
                 preprocessingPrices.reduce((a, b) => a + b, 0) + // 前処理の合計
                 accessoriesTotal; // 付属品の合計
  
    estimateDiv.innerHTML = createEstimateHTML(selectedItem, preprocessingPrices, selectedOrigin, accessoriesTotal);
  }
  
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

