document.addEventListener('DOMContentLoaded', function() {
    const productElement = document.getElementById('product');
    if (productElement) {
        productElement.addEventListener('change', calculateCost);
        calculateCost(); // 初期設定で見積もりを表示
    } else {
        console.error('product element is not found!');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // 付属品の追加ボタンのイベントリスナー
    // document.getElementById('add-accessory').addEventListener('click', addAccessoryOption);

    // 商品選択肢の変更を検知して見積もりを計算
    document.getElementById('product').addEventListener('change', calculateCost);

    // 初期設定で見積もりを表示
    calculateCost();
});

const prices = {
    '丸洗い': 3850,
    '帯の丸洗い': 2970,
    '汗取り（全体）': 4125,
    '汗取り（部分）': 1650,
    '汗取り（特殊なもの）': 4125,
    'さらさらドライ': 4950,
};


function calculateCost() {
    const productElement = document.getElementById('product');
    const product = productElement.value;
    const productCost = prices[product] || 0;
    // const accessoriesCost = getAccessoriesCost();
    const totalPrice = productCost;

    const detailsElement = document.getElementById('details');
    const costElement = document.getElementById('totalCost');

    // 商品選択に基づく内訳表示
    detailsElement.innerHTML = `<p>商品: ${product} ¥${productCost.toLocaleString()}</p>`;

    // // 付属品の価格表示
    // const accessorySelects = document.querySelectorAll('.select-accessory');
    // accessorySelects.forEach(select => {
    //     if(select.value){
    //         detailsElement.innerHTML += `<p>付属品: ${select.value} - ¥${accessoriesPrices[select.value].toLocaleString()}</p>`;
    //     }
    // });

    // 合計の表示
    costElement.textContent = `合計: ¥${totalPrice.toLocaleString()}`;
}

