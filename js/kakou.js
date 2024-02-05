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

/* calculateCost と他の関数は変更なし */

// updateServices と calculateCost 関数は以前のセクションに加えて、以下のように calculateCost 関数を拡張します。

function calculateCost() {
    const product = document.getElementById('product').value;
    const location = document.getElementById('location').value;
    const service = document.getElementById('service').value;
    const cost = prices[product][location][service];
    const detailsElement = document.getElementById('details');
    const CostElement = document.getElementById('totalCost');

    // 内訳をクリア
    detailsElement.innerHTML = '';

    // 新しい内訳を追加
    const productDetail = document.createElement('p');
    productDetail.textContent = `商品: ${product}`;
    detailsElement.appendChild(productDetail);

    const locationDetail = document.createElement('p');
    locationDetail.textContent = `加工地: ${location}`;
    detailsElement.appendChild(locationDetail);

    const serviceDetail = document.createElement('p');
    serviceDetail.textContent = `加工内容: ${service} - ¥${cost.toLocaleString()}`;
    detailsElement.appendChild(serviceDetail);

    // 合計コストを表示
    CostElement.textContent = `合計: ¥${cost.toLocaleString()}`;
}

// 初期加工内容の更新
updateServices();

// 初期加工内容の更新
updateServices();