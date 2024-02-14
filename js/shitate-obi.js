document.addEventListener('DOMContentLoaded', function() {
    // 付属品の追加ボタンのイベントリスナー
    document.getElementById('add-accessory').addEventListener('click', addAccessoryOption);

    // 商品選択肢の変更を検知して見積もりを計算
    document.getElementById('product').addEventListener('change', calculateCost);

    // 初期設定で見積もりを表示
    calculateCost();
});

function calculateCost() {
    const productElement = document.getElementById('product');
    const product = productElement.value;
    const productCost = prices[product] || 0;
    const accessoriesCost = getAccessoriesCost();
    const totalPrice = productCost + accessoriesCost;

    const detailsElement = document.getElementById('details');
    const costElement = document.getElementById('totalCost');

    // 商品選択に基づく内訳表示
    detailsElement.innerHTML = `<p>商品: ${product} ¥${productCost.toLocaleString()}</p>`;

    // 付属品の価格表示
    const accessorySelects = document.querySelectorAll('.select-accessory');
    accessorySelects.forEach(select => {
        if(select.value){
            detailsElement.innerHTML += `<p>付属品: ${select.value} - ¥${accessoriesPrices[select.value].toLocaleString()}</p>`;
        }
    });

    // 合計の表示
    costElement.textContent = `合計: ¥${totalPrice.toLocaleString()}`;
}


function getAccessoriesCost() {
    const accessorySelects = document.querySelectorAll('.select-accessory');
    return Array.from(accessorySelects).reduce((total, select) => {
        return total + (accessoriesPrices[select.value] || 0);
    }, 0);
}

function addAccessoryOption() {
    const accessoryContainer = document.getElementById('accessory-container');
    const accessoryWrapper = document.createElement('div');
    accessoryWrapper.className = 'add-select-wrap';

    const newSelect = document.createElement('select');
    newSelect.className = 'select-accessory';

    // 追加された付属品のデフォルトオプション
    const defaultOption = document.createElement('option');
    defaultOption.textContent = '選択してください';
    defaultOption.value = '';
    newSelect.appendChild(defaultOption);

    // 付属品オプションを追加
    for (const option in accessoriesPrices) {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        newSelect.appendChild(opt);
    }

    // 削除ボタン作成
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn-delete';

    // 削除ボタンにIMG要素を追加
    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'images/SVG/icon-delete.svg'; // アイコンのパスを指定
    deleteIcon.className = 'icon-delete'; // 必要に応じてCSSクラスを指定
    deleteIcon.alt = '削除';

    // 削除ボタンにテキスト "削除" を追加（画像の後）
    deleteButton.appendChild(deleteIcon);
    deleteButton.appendChild(document.createTextNode(" 削除"));

    deleteButton.addEventListener('click', function() {
        accessoryWrapper.remove();
        calculateCost(); // 再計算
    });

    newSelect.addEventListener('change', calculateCost);
    accessoryWrapper.appendChild(newSelect);
    accessoryWrapper.appendChild(deleteButton);
    accessoryContainer.appendChild(accessoryWrapper);
}


// 商品の価格データ
const prices = {
    '袋帯 本仕立て（芯別）': 2970,
    '袋帯 芯取り替え（芯別）': 4785,
    '九寸名古屋帯 本仕立て（芯別）': 4125,
    '九寸名古屋帯 平仕立': 8415,
    '九寸名古屋帯 芯取り替え（芯別）': 6765,
    '八寸名古屋帯 松葉仕立て': 2475,
    '八寸名古屋帯 総かがり': 3300,
    '半幅帯 角帯': 5610,
    '作り帯（切らないタイプ）': 6270,
    '作り帯（切るタイプ）': 5775,
    'シワ・折りくせたたみ直し': 1650,
};

// 前処理の価格データ
const preprocessingPrices = {
    'なし': 0,
    '湯のし': 1000,
    '筋消し': 3000,
    // 他の前処理を追加する
};

// 付属品の価格データ
const accessoriesPrices = {
    '帯芯・綿（薄手タイプ）': 990,
    '帯芯・綿（厚手タイプ）': 1320,
};


console.log('shitate-obi.js loaded');