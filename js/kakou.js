document.addEventListener("DOMContentLoaded", function () {
    const kimonoType = document.getElementById('kimonoType');
    const accessoriesType = document.getElementById('accessoriesType');
    const customPriceInput = document.getElementById('customPrice');
    const detailsElement = document.getElementById('details');
    const totalPriceElement = document.getElementById('totalValue');
    const modificationsContainer = document.getElementById('modificationsContainer');
    const accessoryContainer = document.getElementById('accessory-container');

    let totalPrice = 0;
    let selectedModifications = [];
    let selectedAccessories = [];
    let customPrice = 0;

    const prices = {
        kimono: { '裄直し': 8250, '袖丈直し': 8250, '身巾直し': 16500, '身丈直し': 16500, '胴裏交換': 13200, '八掛交換': 13200 },
        juban: { '裄直し': 6600, '袖丈直し': 6600, '身巾直し': 13200, '身丈直し': 13200 },
        tomesode: { '裄直し': 9900, '身巾直し': 19800, '身丈直し': 19800, '胴裏交換': 16500 },
        accessories: { 'fan': 1200, 'obi': 2400, 'obiage': 3600 },
        custom: { 'その他加工賃': 0 }
    };

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


const items = {
    // ここにアイテムの情報を追加してください
    'item1': { 'domestic': 10000, 'overseas': 12000 },
    'item2': { 'domestic': 15000, 'overseas': 18000 },
    // ...
};

const preprocessingOptions = {
    // ここに前処理オプションの情報を追加してください
    'preprocessing1': { 'name': 'Preprocessing 1', 'price': 5000 },
    'preprocessing2': { 'name': 'Preprocessing 2', 'price': 8000 },
    // ...
};

function updateTotalPrice() {
    totalPrice = selectedModifications.reduce((acc, item) => acc + prices[item.type][item.name], 0)
        + selectedAccessories.reduce((acc, item) => acc + prices.accessories[item.type], 0)
        + customPrice;
    totalPriceElement.innerText = `¥${totalPrice.toLocaleString()}`;
}

function populateSelectWithOptions(selectElement, options) {
    options.forEach((option, index) => {
        const optionElement = document.createElement('option');
        optionElement.value = index;
        optionElement.textContent = option.name;
        selectElement.appendChild(optionElement);
    });
}

kimonoType.addEventListener('change', function () {
    const type = kimonoType.value;
    modificationsContainer.innerHTML = ''; // コンテナを空にする
    if (type) {
        const selectElement = document.createElement('select');
        selectElement.innerHTML = '<option value="">加工を選択してください</option>';
        Object.keys(prices[type]).forEach((mod) => {
            selectElement.innerHTML += `<option value="${mod}">${mod}</option>`;
        });
        modificationsContainer.appendChild(selectElement);
        selectElement.addEventListener('change', function () {
            if (selectElement.value) {
                const modName = selectElement.value;
                selectedModifications.push({ type: type, name: modName });
                updateTotalPrice();
                updateDetails();
            }
        });
    }
});

accessoriesType.addEventListener('change', function () {
    // 既存の付属品選択をクリアする
    selectedAccessories = [];
    const type = accessoriesType.value;
    const text = accessoriesType.options[accessoriesType.selectedIndex].text;
    if (type) {
        selectedAccessories.push({ type: type, text: text });
        updateTotalPrice();
        updateDetails();
    }
});

customPriceInput.addEventListener('input', function () {
    const value = parseFloat(customPriceInput.value);
    if (!isNaN(value)) {
        customPrice = value;
    } else {
        customPrice = 0;
    }
    updateTotalPrice();
    updateDetails();
});

function updateDetails() {
    detailsElement.innerHTML = '';

    selectedModifications.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ¥${prices[item.type][item.name].toLocaleString()}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = '削除';
        removeButton.onclick = function () {
            selectedModifications.splice(index, 1);
            updateTotalPrice();
            updateDetails();
        };
        li.appendChild(removeButton);
        detailsElement.appendChild(li);
    });

    selectedAccessories.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.text} - ¥${prices.accessories[item.type].toLocaleString()}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = '削除';
        removeButton.onclick = function () {
            selectedAccessories.splice(index, 1);
            updateTotalPrice();
            updateDetails();
        };
        li.appendChild(removeButton);
        detailsElement.appendChild(li);
    });

    if (customPrice > 0) {
        const li = document.createElement('li');
        li.textContent = `その他加工賃 - ¥${customPrice.toLocaleString()}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = '削除';
        removeButton.onclick = function () {
            customPrice = 0;
            customPriceInput.value = '';
            updateTotalPrice();
            updateDetails();
        };
        li.appendChild(removeButton);
        detailsElement.appendChild(li);
    }
}


function calculateAccessoriesTotal() {
    const accessorySelects = document.querySelectorAll('.select-accessory');
    return Array.from(accessorySelects).reduce((total, select) => {
        const accessory = accessories[select.value];
        return total + (accessory ? accessory.price : 0);
    }, 0);
}
function createEstimateHTML(item, preprocessingPrices, origin, accessoriesTotal) {
    const originJapanese = {
        'domestic': '国内',
        'overseas': '国外'
    };

    const preprocessingCostString = preprocessingPrices.map(pp => `前処理: ¥${pp}`).join(' + ');

    return `
    <div class="item-name">${item.name} (${originJapanese[origin]}): ¥${item[origin]}</div>
    <div class="preprocessing-cost">${preprocessingCostString}</div>
    <div class="accessories-total">付属品合計: ¥${accessoriesTotal}</div>
    <div class="total">合計: ¥${item[origin] + preprocessingPrices.reduce((a, b) => a + b, 0) + accessoriesTotal}〜</div>
`;
}

function addAccessoryOption() {
    const selectWrap = document.createElement('div');
    selectWrap.classList.add('add-select-wrap');

    const newSelect = document.createElement('select');
    newSelect.classList.add('select-accessory');
    populateSelectWithOptions(newSelect, accessories);

    const removeButton = document.createElement('button');
    removeButton.textContent = '削除';
    removeButton.type = 'button';
    removeButton.classList.add('btn-delete');
    removeButton.addEventListener('click', function () {
        accessoryContainer.removeChild(selectWrap);
        calculateEstimate();
    });

    newSelect.addEventListener('change', calculateEstimate);

    selectWrap.appendChild(newSelect);
    selectWrap.appendChild(removeButton);
    accessoryContainer.appendChild(selectWrap);


    calculateEstimate();
}

function calculateEstimate() {
    const itemSelect = document.getElementById("item");
    const originSelect = document.getElementById("origin");
    const estimateDiv = document.getElementById("estimate");
    const selectedItem = items[itemSelect.value];
    const selectedOrigin = originSelect.value;
    const accessoriesTotal = calculateAccessoriesTotal();

    const preprocessingPrices = Array.from(document.querySelectorAll('.select-preprocessing')).map(select => {
        const preprocessingOption = preprocessingOptions[select.value];
        return preprocessingOption ? preprocessingOption.price : 0;
    });

    const cost = selectedItem[selectedOrigin] +
        preprocessingPrices.reduce((a, b) => a + b, 0) +
        accessoriesTotal;

    estimateDiv.innerHTML = createEstimateHTML(selectedItem, preprocessingPrices, selectedOrigin, accessoriesTotal);

    // 合計金額を更新
    totalPrice = cost;
    totalPriceElement.innerText = `¥${totalPrice.toLocaleString()}`;
}

// 選択された付属品の金額を計算して返す関数
function calculateAccessoriesTotal() {
    const accessorySelects = document.querySelectorAll('.select-accessory');
    return Array.from(accessorySelects).reduce((total, select) => {
        const accessory = accessories[select.value];
        return total + (accessory ? accessory.price : 0);
    }, 0);
}
document.getElementById('add-accessory').addEventListener('click', addAccessoryOption);
document.getElementById("item").addEventListener('change', calculateEstimate);
document.getElementById("origin").addEventListener('change', calculateEstimate);

calculateEstimate();
});


