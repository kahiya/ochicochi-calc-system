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


document.getElementById('add-preprocessing').addEventListener('click', function() {
    const preprocessingContainer = document.getElementById('preprocessing-container');
    const preprocessingWrapper = document.createElement('div');
    preprocessingWrapper.classList.add("add-select-wrap");

    const newSelect = document.createElement('select');
    newSelect.classList.add("select-preprocessing");

    newSelect.innerHTML = `
        <option value="なし">なし</option>
        <option value="湯のし">湯のし</option>
        <option value="筋消し">筋消し</option>
    `;
    newSelect.name = 'preprocessing[]';
    newSelect.addEventListener('change', calculateCost);

    preprocessingWrapper.appendChild(newSelect);

    // 削除ボタンを作成し、クラスを追加
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.type = 'button';
    deleteButton.classList.add("btn-delete"); // クラスの追加

    deleteButton.addEventListener('click', function() {
        preprocessingWrapper.remove();
        calculateCost();
    });

    preprocessingWrapper.appendChild(deleteButton);
    preprocessingContainer.appendChild(preprocessingWrapper);
});


document.getElementById('add-accessory').addEventListener('click', function() {
    const accessoryContainer = document.getElementById('accessory-container');
    const accessoryWrapper = document.createElement('div');
    accessoryWrapper.classList.add("add-select-wrap");

    const newSelect = document.createElement('select');
    newSelect.classList.add("select-accessory");

    Object.keys(accessoriesPrices).forEach(accessory => {
        const option = document.createElement('option');
        option.value = accessory;
        option.textContent = accessory;
        newSelect.appendChild(option);
    });
    newSelect.name = 'accessories[]';
    newSelect.addEventListener('change', calculateCost);

    accessoryWrapper.appendChild(newSelect);

    // 削除ボタンを作成し、クラスを追加
    const deleteButton = document.createElement('button');

    // アイコン要素（img）の作成
    const iconDelete = document.createElement('img');
    // アイコン画像のパスを設定
    iconDelete.src = 'images/SVG/icon-delete.svg';
    // アイコンにクラスを追加（スタイリング用）
    iconDelete.classList.add("icon-delete");

    // ボタンにアイコン要素（img）とテキスト「削除」を追加
    deleteButton.appendChild(iconDelete);
    deleteButton.appendChild(document.createTextNode(' 削除')); // アイコンの隣にテキストを追加
    deleteButton.type = 'button';
    deleteButton.classList.add("btn-delete"); // クラスの追加

    deleteButton.addEventListener('click', function() {
        accessoryWrapper.remove();
        calculateCost();
    });

    accessoryWrapper.appendChild(deleteButton);
    accessoryContainer.appendChild(accessoryWrapper);
});

function calculateCost() {
    const product = document.getElementById('product').value;
    const location = document.getElementById('location').value;
    const service = document.getElementById('service').value;
    const preprocessing = document.getElementById('preprocessing').value;
    const detailsElement = document.getElementById('details');
    const costElement = document.getElementById('totalCost');

    // 前処理のコストを取得
    let preprocessCost = preprocessingPrices[preprocessing] || 0;

    // 加工内容の価格を取得
    let serviceCost = prices[product][location][service] || 0;

    // 付属品のコストを取得
    const accessorySelectors = document.querySelectorAll('[name="accessories[]"]');
    let accessoriesCost = Array.from(accessorySelectors).reduce((total, selector) => {
        return total + (accessoriesPrices[selector.value] || 0);
    }, 0);

    // その他加工賃の取得
    const otherFeeElement = document.getElementById('other-fee');
    const otherFee = otherFeeElement ? parseInt(otherFeeElement.value) || 0 : 0;

    // 合計コストを計算
    const totalPrice = serviceCost + preprocessCost + accessoriesCost + otherFee;

    // 前処理の内訳情報を更新
    let preprocessingDetails = '';
    if (preprocessing !== 'なし') {
        preprocessingDetails += `<p>前処理: ${preprocessing}: ¥${preprocessingPrices[preprocessing].toLocaleString()}</p>`;
    }

    // 付属品の内訳情報を更新
    let accessoriesDetails = '';
    accessorySelectors.forEach(selector => {
        accessoriesDetails += `<p>付属品: ${selector.value}: ¥${accessoriesPrices[selector.value].toLocaleString()}</p>`;
    });

    // 内訳と合計コストの表示を更新
    detailsElement.innerHTML = `<p>商品: ${product}</p>
                                <p>加工地: ${location}</p>
                                <p>加工内容: ${service}: ¥${serviceCost.toLocaleString()}</p>
                                ${preprocessingDetails}
                                ${accessoriesDetails}`;

    // その他加工賃があれば表示する
    if (otherFee > 0) {
        detailsElement.innerHTML += `<p>その他加工賃: ¥${otherFee.toLocaleString()}</p>`;
    }

    // 合計コストを表示
    costElement.textContent = `合計: ¥${totalPrice.toLocaleString()}〜`;
}

// その他加工賃の入力変更時にも計算を更新
document.getElementById('other-fee').addEventListener('input', calculateCost);

// 最初にページが読み込まれたときの実行
updateServices();
calculateCost(); // 初期状態での計算も行います