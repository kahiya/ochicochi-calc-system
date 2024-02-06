const prices = {
    '着物': {
        '国内': {
            '裄直し': 18700,
            '袖丈直し': 12100,
            '身巾直し': 26400,
            '身丈直し（内揚げ）': 26400,
            '身丈直し（裾）': 14300,
            '胴裏交換': 28600,
            '八掛交換': 26400,
            'バチ衿→広衿': 13200,
            '広衿→バチ衿': 13200
        },
        '海外': {
            '裄直し': 12100,
            '袖丈直し': 9900,
            '身巾直し': 15400,
            '身丈直し（内揚げ）': 13200,
            '身丈直し（裾）': 12100,
            '胴裏交換': 15400,
            '八掛交換': 13200
        }
    },
    '襦袢': {
        '国内': {
            '裄直し': 16500,
            '袖丈直し': 9900,
            '身巾直し': 16500,
            '身丈直し（内揚げ）': 16500,
            '身丈直し（裾）': 9900
        },
        '海外': {
            '裄直し': 9900,
            '袖丈直し': 9900,
            '身巾直し': 12100,
            '身丈直し（内揚げ）': 12100,
            '身丈直し（裾）': 9900
        }
    }
};

// 前処理の料金
const preprocessingPrices = {
    'なし': 0,
    '湯のし': 1000,
    '筋消し': 3000
};


// 付属品の料金
const accessoriesPrices = {
    '八掛（精華）': 9900,
    '八掛（駒）': 9900,
    '胴裏（正絹）': 9900,
    '振袖胴裏': 14300,
    '片裏': 12100,
    '背伏（正絹）': 770,
    '背伏（ポリ）': 660,
    '衣紋抜き': 990,
    '居敷当（着物）': 2750,
    '居敷当（襦袢）': 2420,
    '衿裏（正絹）': 2200,
    '絽衿裏（正絹）': 2750,
    '衿裏（ポリ）': 550,
    '絽衿裏（ポリ）': 1100,
    '台衿（衿芯）': 660
};





document.getElementById('product').addEventListener('change', function() {
    updateServices();
    calculateCost(); // 加工内容が更新されるたびに自動的に見積もりを表示
});
document.getElementById('location').addEventListener('change', function() {
    updateServices();
    calculateCost(); // 加工内容が更新されるたびに自動的に見積もりを表示
});
document.getElementById('service').addEventListener('change', calculateCost); // 加工内容が変更されたときに見積もりを自動的に表示

// updateServices の最後にも calculateCost を呼び出して、サービスの選択肢が変更されたときにも自動的に合計を更新
function updateServices() {
    const product = document.getElementById('product').value;
    const location = document.getElementById('location').value;
    const serviceSelect = document.getElementById('service');
    serviceSelect.innerHTML = '';

    const services = prices[product][location];
    Object.keys(services).forEach(service => {
        const option = document.createElement('option');
        option.value = service;
        option.textContent = service;
        serviceSelect.appendChild(option);
    });
    calculateCost(); // 加工内容の選択肢が更新されるたびに見積もりを自動的に更新
}

// 以前定義されたイベントリスナーに加え、前処理が変わった場合も処理を実行
document.getElementById('preprocessing').addEventListener('change', calculateCost);
// calculateCost 関数を更新して、前処理のコストも含める


document.getElementById('addPreprocessing').addEventListener('click', function() {
    const preprocessingContainer = document.getElementById('preprocessingContainer');
    
    // 新しい前処理選択肢用のラッパーを作成（選択肢と削除ボタンをグループ化）
    const preprocessingWrapper = document.createElement('div');
    
    const newSelect = document.createElement('select');
    newSelect.innerHTML = `
        <option value="なし">なし</option>
        <option value="湯のし">湯のし</option>
        <option value="筋消し">筋消し</option>
    `;
    newSelect.name = 'preprocessing[]';
    newSelect.addEventListener('change', calculateCost);
    
    // 削除ボタンを作成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.type = 'button';
    
    // 削除ボタンのクリックイベント
    deleteButton.addEventListener('click', function() {
        preprocessingWrapper.remove(); // この選択肢を削除
        calculateCost(); // コスト再計算
    });
    
    // ラッパーに選択肢と削除ボタンを追加
    preprocessingWrapper.appendChild(newSelect);
    preprocessingWrapper.appendChild(deleteButton);
    
    // コンテナにラッパーを追加
    preprocessingContainer.appendChild(preprocessingWrapper);
});


document.getElementById('addAccessory').addEventListener('click', function() {
    const accessoryContainer = document.getElementById('accessoriesContainer');
    
    const accessoryWrapper = document.createElement('div');
    
    const newSelect = document.createElement('select');
    Object.keys(accessoriesPrices).forEach(accessory => {
        const option = document.createElement('option');
        option.value = accessory;
        option.textContent = accessory;
        newSelect.appendChild(option);
    });
    newSelect.name = 'accessories[]';
    newSelect.addEventListener('change', calculateCost);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.type = 'button';
    deleteButton.addEventListener('click', function() {
        accessoryWrapper.remove();
        calculateCost(); // コスト再計算
    });
    
    accessoryWrapper.appendChild(newSelect);
    accessoryWrapper.appendChild(deleteButton);
    
    accessoryContainer.appendChild(accessoryWrapper);
});


// calculateCost 関数を更新して、前処理のコストも含める
function calculateCost() {
    const product = document.getElementById('product').value;
    const location = document.getElementById('location').value;
    const service = document.getElementById('service').value;
    const preprocessing = document.getElementById('preprocessing').value;
    
// 前処理のコストを取得（数値として）
// ここで修正: 最初の前処理選択肢も含めるようにセレクタを変更
const preprocessingElements = document.querySelectorAll('#preprocessing, [name="preprocessing[]"]');
let preprocessCost = Array.from(preprocessingElements).reduce((total, elem) => {
    return total + (preprocessingPrices[elem.value] || 0);
}, 0);

    // 加工内容の価格を取得（数値として）
    let serviceCost = prices[product] && prices[product][location] && prices[product][location][service];
    if (typeof serviceCost === 'string') {
        serviceCost = parseInt(serviceCost.replace("¥", "").replace(/,/g, ""), 10);
    }

    // 付属品のコストを取得
    const accessoriesElements = document.querySelectorAll('[name="accessories[]"]');
    let accessoriesCost = Array.from(accessoriesElements).reduce((total, elem) => {
        return total + (accessoriesPrices[elem.value] || 0);
    }, 0);

    // 総コストの計算
    const totalCost = serviceCost + preprocessCost + accessoriesCost;

  // 付属品の内訳情報を更新
  let accessoriesDetails = '';
  accessoriesElements.forEach(elem => {
      accessoriesDetails += `<p>付属品: ${elem.value}: ¥${accessoriesPrices[elem.value].toLocaleString()}</p>`
  });


    // 内訳と合計コストの表示処理
    const detailsElement = document.getElementById('details');
    const costElement = document.getElementById('totalCost');

 // 前処理の内訳情報を更新（すべての選択された前処理を列挙）
    let preprocessingDetails = '';
    preprocessingElements.forEach(elem => {
        if (elem.value !== 'なし') {
            preprocessingDetails += `<p>前処理: ${elem.value}: ¥${preprocessingPrices[elem.value].toLocaleString()}</p>`
        }
    });
    
    // 内訳と合計コストの表示処理を更新
    detailsElement.innerHTML = `<p>商品: ${product}</p>
    <p>加工地: ${location}</p>
    <p>加工内容: ${service}: ¥${serviceCost.toLocaleString()}</p>`
    + preprocessingDetails + accessoriesDetails;

    costElement.textContent = `合計: ¥${totalCost.toLocaleString()}`;
}


// 最初にページが読み込まれたときの実行
updateServices();
calculateCost(); // 初期状態での計算も行います