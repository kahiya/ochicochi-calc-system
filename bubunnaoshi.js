document.addEventListener("DOMContentLoaded", function() {
  const kimonoType = document.getElementById('kimonoType');
  const modificationsContainer = document.getElementById('modificationsContainer');
  const totalPriceElement = document.getElementById('totalValue');
  const detailsElement = document.getElementById('details');
  const selectedKimonoTypeElement = document.getElementById('selectedKimonoType');
  const customPriceInput = document.getElementById('customPrice');

  const prices = {
    kimono: { '裄直し': 8250, '袖丈直し': 8250, '身巾直し': 16500, '身丈直し': 16500, '胴裏交換': 13200, '八掛交換': 13200 },
    juban: { '裄直し': 6600, '袖丈直し': 6600, '身巾直し': 13200, '身丈直し': 13200 },
    tomesode: { '裄直し': 9900, '身巾直し': 19800, '身丈直し': 19800, '胴裏交換': 16500 }
  };

  let totalPrice = 0;
  let selectedModifications = [];

  function updateTotalPrice() {
    totalPriceElement.innerText = `¥${totalPrice.toLocaleString()}`;
  }

  function updateDetails() {
    detailsElement.innerHTML = selectedModifications.map(mod => `<li>${mod}</li>`).join('');
  }

  function updateSelectedKimonoType() {
    let selectedText = kimonoType.options[kimonoType.selectedIndex].text;
    selectedKimonoTypeElement.textContent = '着物の種類: ' + (selectedText ? selectedText : '選択されていません');
  }

  kimonoType.addEventListener('change', function() {
    modificationsContainer.innerHTML = ''; // Reset modifications
    detailsElement.innerHTML = ''; // Reset details
    totalPrice = 0;
    selectedModifications = [];
    updateTotalPrice();
    updateSelectedKimonoType();
    addModificationSelect(kimonoType.value);
  });

  function addModificationSelect(kimonoType) {
    if (!kimonoType) return;

    let modificationSelect = document.createElement('select');
    modificationSelect.innerHTML = '<option value="">加工を選択してください</option>';
    for (let modification in prices[kimonoType]) {
      modificationSelect.innerHTML += `<option value="${modification}">${modification} - ¥${prices[kimonoType][modification].toLocaleString()}</option>`;
    }

    modificationSelect.addEventListener('change', function() {
      if (modificationSelect.value) {
        totalPrice += prices[kimonoType][modificationSelect.value];
        selectedModifications.push(`${modificationSelect.value} - ¥${prices[kimonoType][modificationSelect.value].toLocaleString()}`);
        updateDetails();
        updateTotalPrice();
        addModificationSelect(kimonoType); // Add another select for more modifications
      }
    });

    modificationsContainer.appendChild(modificationSelect);
  }

  customPriceInput.addEventListener('input', function() {
    const customPrice = parseFloat(customPriceInput.value);
    if (!isNaN(customPrice)) {
        const openPriceText = `その他加工賃 - ¥${customPrice.toLocaleString()}`;
        if (!selectedModifications.includes(openPriceText)) {
            // 以前のその他加工賃を削除
            const openPriceIndex = selectedModifications.findIndex(mod => mod.startsWith('その他加工賃 - ¥'));
            if (openPriceIndex !== -1) {
                totalPrice -= parseFloat(selectedModifications[openPriceIndex].replace('その他加工賃 - ¥', '').replace(/,/g, ''));
                selectedModifications.splice(openPriceIndex, 1);
            }

            totalPrice += customPrice;
            selectedModifications.push(openPriceText);
            updateDetails();
            updateTotalPrice();
        }
    }
});

  // CSVダウンロード機能
  document.getElementById('downloadCSV').addEventListener('click', function() {
    const customerName = document.getElementById('customerName').value;
    const customerKana = document.getElementById('customerKana').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += '名前,フリガナ,電話番号,住所,合計価格\n';
    csvContent += `"${customerName}","${customerKana}","${customerPhone}","${customerAddress}","${totalPrice.toLocaleString()}"\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customer_info.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  });

  // 印刷機能
  document.getElementById('printPage').addEventListener('click', function() {
    window.print();
  });
});
