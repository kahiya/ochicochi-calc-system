document.addEventListener("DOMContentLoaded", function() {
  const kimonoType = document.getElementById('kimonoType');
  const modificationsContainer = document.getElementById('modificationsContainer');
  const accessoriesType = document.getElementById('accessoriesType');
  const totalPriceElement = document.getElementById('totalValue');
  const detailsElement = document.getElementById('details');
  const customPriceInput = document.getElementById('customPrice');

  let totalPrice = 0;
  let selectedModifications = [];
  let selectedAccessories = [];

  const prices = {
      kimono: { '裄直し': 8250, '袖丈直し': 8250, '身巾直し': 16500, '身丈直し': 16500, '胴裏交換': 13200, '八掛交換': 13200 },
      juban: { '裄直し': 6600, '袖丈直し': 6600, '身巾直し': 13200, '身丈直し': 13200 },
      tomesode: { '裄直し': 9900, '身巾直し': 19800, '身丈直し': 19800, '胴裏交換': 16500 },
      accessories: { 'fan': 1200, 'obi': 2400, 'obiage': 3600 }
  };

  function updateTotalPrice() {
      totalPriceElement.innerText = `¥${totalPrice.toLocaleString()}`;
  }

  function updateDetails() {
      detailsElement.innerHTML = selectedModifications.concat(selectedAccessories).map(mod => `<li>${mod}</li>`).join('');
  }

  function addModificationSelect(kimonoType) {
    if (!kimonoType) return;

    let modificationSelect = document.createElement('select');
    modificationSelect.innerHTML = '<option value="">加工を選択してください</option>';
    for (let modification in prices[kimonoType]) {
        modificationSelect.innerHTML += `<option value="${modification}">${modification} - ¥${prices[kimonoType][modification].toLocaleString()}</option>`;
    }

    modificationSelect.addEventListener('change', function() {
        const selectedModification = modificationSelect.value;

        // 価格の追加
        if (selectedModification) {
            const modificationName = modificationSelect.options[modificationSelect.selectedIndex].text;
            const price = prices[kimonoType][selectedModification];

            totalPrice += price;
            selectedModifications.push(`${modificationName}`);
            updateDetails();
            updateTotalPrice();
            addModificationSelect(kimonoType); // 追加されたselect要素に対してもイベントリスナーを設定
        }
    });

    modificationsContainer.appendChild(modificationSelect);
  }

  kimonoType.addEventListener('change', () => {
    modificationsContainer.innerHTML = ''; // 以前の加工選択肢をリセット
    totalPrice = 0; // 価格をリセット
    selectedModifications = [];
    selectedAccessories = []; // 付属品選択肢のリセット
    updateTotalPrice();
    updateDetails();
    addModificationSelect(kimonoType.value);
  });

  accessoriesType.addEventListener('change', function() {
    const selectedOption = accessoriesType.options[accessoriesType.selectedIndex];
    const price = parseFloat(selectedOption.dataset.price);

    if (!isNaN(price)) {
        const selectedAccessoriesText = `${selectedOption.text} - ¥${price.toLocaleString()}`;

        // 以前の付属品を削除
        const accessoriesIndex = selectedAccessories.findIndex(acc => acc.startsWith(selectedOption.text.split(" ")[0]));
        if (accessoriesIndex !== -1) {
            totalPrice -= parseFloat(selectedAccessories[accessoriesIndex].replace(/[^0-9]/g, ''));
            selectedAccessories.splice(accessoriesIndex, 1);
        }

        totalPrice += price;
        selectedAccessories.push(selectedAccessoriesText);
        updateDetails();
        updateTotalPrice();
    } else {
        // 選択が「選択してください」にリセットされたら付属品の金額をトータルから引く
        if(selectedOption.value === "") {
            selectedAccessories.forEach(acc => {
                const accPrice = parseFloat(acc.replace(/[^0-9]/g, ''));
                totalPrice -= accPrice;
            });
            selectedAccessories = [];
            updateDetails();
            updateTotalPrice();
        }
    }
  });

  customPriceInput.addEventListener('input', function() {
      // カスタム価格の処理
      const customPrice = parseFloat(customPriceInput.value);
      // 以前のカスタム価格を削除
      const customPriceIndex = selectedModifications.findIndex(mod => mod.startsWith('オープン価格'));
      if (customPriceIndex !== -1) {
          totalPrice -= parseFloat(selectedModifications[customPriceIndex].replace(/[^0-9]/g, ''));
          selectedModifications.splice(customPriceIndex, 1);
      }

      // 新しいカスタム価格を追加
      if (!isNaN(customPrice)) {
          const customPriceText = `オープン価格 - ¥${customPrice.toLocaleString()}`;
          totalPrice += customPrice;
          selectedModifications.push(customPriceText);
      }
      
      updateDetails();
      updateTotalPrice();
  });

  // CSVダウンロード機能
  document.getElementById('downloadCSV').addEventListener('click', function() {
      const customerName = document.getElementById('customerName').value;
      const customerKana = document.getElementById('customerKana').value;
      const customerPhone = document.getElementById('customerPhone').value;
      const customerMail = document.getElementById('customerMail').value;
      const customerPostalcode = document.getElementById('customerPostalcode').value;
      const customerAddress = document.getElementById('customerAddress').value;

      // CSVデータの作成
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += '名前,フリガナ,電話番号,メールアドレス,郵便番号,住所,合計価格\n';
      csvContent += `"${customerName}","${customerKana}","${customerPhone}","${customerMail}","${customerPostalcode}","${customerAddress}","¥${totalPrice.toLocaleString()}"\n`;

      // ダウンロード
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