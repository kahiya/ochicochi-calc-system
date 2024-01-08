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
    // その他の商品データ...
  ];
  
  // 前処理データの初期化
  const preprocessingOptions = [
    new Preprocessing("湯のし（三丈もの）", 1100),
    new Preprocessing("湯のし（四丈もの）", 1320),
    // その他の前処理データ...
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
  

// 各種選択肢をセットアップする関数
function populateSelectWithOptions(selectElement, options, textProperty = 'name') {
    selectElement.innerHTML = '';
    options.forEach((option, index) => {
      const opt = document.createElement("option");
      opt.value = index;
      opt.textContent = option[textProperty];
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
  function createEstimateHTML(item, preprocessing, origin, accessoriesTotal) {
    return `
      ${item.name} (${origin}): ¥${item[origin]}<br>
      ${preprocessing.name}: ¥${preprocessing.price}<br>
      付属品合計: ¥${accessoriesTotal}<br>
      合計: ¥${item[origin] + preprocessing.price + accessoriesTotal}
    `;
  }
  
  // 選択されたオプションに基づいて見積もりを計算し表示する関数
  function calculateEstimate() {
    const itemSelect = document.getElementById("item");
    const originSelect = document.getElementById("origin");
    const preprocessingSelect = document.getElementById("preprocessing");
    const estimateDiv = document.getElementById("estimate");
  
    const selectedItem = items[itemSelect.value];
    const selectedPreprocessing = preprocessingOptions[preprocessingSelect.value];
    const selectedOrigin = originSelect.value;
    const accessoriesTotal = calculateAccessoriesTotal();
  
    let cost = selectedItem[selectedOrigin];
    if (cost != null) {
      cost += selectedPreprocessing.price + accessoriesTotal;
    }
  
    estimateDiv.innerHTML = cost != null ? createEstimateHTML(selectedItem, selectedPreprocessing, selectedOrigin, accessoriesTotal) : "選択した商品は選択した地域での仕立てが可能ではありません";
  }
  
// 付属品のセレクトボックスを追加する関数
function addAccessoryOption() {
    const accessoryContainer = document.getElementById('accessory-container');
    const accessorySelect = document.createElement('select');
    accessorySelect.classList.add('select-accessory');
    accessoryContainer.appendChild(accessorySelect);
  
    const removeButton = document.createElement('button');
    removeButton.textContent = '削除';
    removeButton.type = 'button';
    removeButton.addEventListener('click', function() {
      accessorySelect.remove();
      removeButton.remove();
      calculateEstimate();
    });
  
    accessorySelect.addEventListener('change', calculateEstimate);
    populateSelectWithOptions(accessorySelect, accessories);
    
    accessoryContainer.appendChild(removeButton);
  }
  
  // ページ読み込み時の初期設定関数
  window.onload = function() {
    // 商品と前処理オプションのセットアップ
    populateSelectWithOptions(document.getElementById("item"), items);
    populateSelectWithOptions(document.getElementById("preprocessing"), preprocessingOptions);
  
    // 初回の付属品セレクトボックスのセットアップ
    addAccessoryOption();
  
    // 「付属品を追加」ボタンのイベントリスナー設定
    document.getElementById('add-accessory').addEventListener('click', addAccessoryOption);
  
    // 商品と前処理のセレクトボックスのイベントリスナー設定
    document.getElementById("item").addEventListener('change', calculateEstimate);
    document.getElementById("origin").addEventListener('change', calculateEstimate);
    document.getElementById("preprocessing").addEventListener('change', calculateEstimate);
  
    // 初期見積もり計算
    calculateEstimate();
  };