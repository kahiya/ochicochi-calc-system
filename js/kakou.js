document.addEventListener("DOMContentLoaded", function() {
  const kimonoType = document.getElementById('kimonoType');
  const accessoriesType = document.getElementById('accessoriesType');
  const customPriceInput = document.getElementById('customPrice');
  const detailsElement = document.getElementById('details');
  const totalPriceElement = document.getElementById('totalValue');
  const modificationsContainer = document.getElementById('modificationsContainer');

  let totalPrice = 0;
  let selectedModifications = [];
  let selectedAccessories = [];
  let customPrice = 0;

  const prices = {
      kimono: { '裄直し': 8250, '袖丈直し': 8250, '身巾直し': 16500, '身丈直し': 16500, '胴裏交換': 13200, '八掛交換': 13200 },
      juban: { '裄直し': 6600, '袖丈直し': 6600, '身巾直し': 13200, '身丈直し': 13200 },
      tomesode: { '裄直し': 9900, '身巾直し': 19800, '身丈直し': 19800, '胴裏交換': 16500 },
      accessories: { 'fan': 1200, 'obi': 2400, 'obiage': 3600 },
      custom: { 'その他加工賃': 0 } // カスタム価格用のキーを追加
  };

  function updateTotalPrice() {
      totalPrice = selectedModifications.reduce((acc, item) => acc + prices[item.type][item.name], 0)
                     + selectedAccessories.reduce((acc, item) => acc + prices.accessories[item.type], 0)
                     + customPrice; // トータル価格を更新
      totalPriceElement.innerText = `¥${totalPrice.toLocaleString()}`;
  }

  function updateDetails() {
      detailsElement.innerHTML = '';
      
      // 選択した加工オプションをリストに表示
      selectedModifications.forEach((item, index) => {
          const li = document.createElement('li');
          li.textContent = `${item.name} - ¥${prices[item.type][item.name].toLocaleString()}`;
          const removeButton = document.createElement('button');
          removeButton.textContent = '削除';
          removeButton.onclick = function() {
              selectedModifications.splice(index, 1);
              updateTotalPrice();
              updateDetails();
          };
          li.appendChild(removeButton);
          detailsElement.appendChild(li);
      });

      // 選択した付属品をリストに表示
      selectedAccessories.forEach((item, index) => {
          const li = document.createElement('li');
          li.textContent = `${item.text} - ¥${prices.accessories[item.type].toLocaleString()}`;
          const removeButton = document.createElement('button');
          removeButton.textContent = '削除';
          removeButton.onclick = function() {
              selectedAccessories.splice(index, 1);
              updateTotalPrice();
              updateDetails();
          };
          li.appendChild(removeButton);
          detailsElement.appendChild(li);
      });

      // カスタム価格をリストに表示
      if (customPrice > 0) {
          const li = document.createElement('li');
          li.textContent = `その他加工賃 - ¥${customPrice.toLocaleString()}`;
          const removeButton = document.createElement('button');
          removeButton.textContent = '削除';
          removeButton.onclick = function() {
              customPrice = 0;
              customPriceInput.value = '';
              updateTotalPrice();
              updateDetails();
          };
          li.appendChild(removeButton);
          detailsElement.appendChild(li);
      }
  }

  kimonoType.addEventListener('change', function() {
      const type = kimonoType.value;
      modificationsContainer.innerHTML = ''; // コンテナを空にする
      if (type) {
          const selectElement = document.createElement('select');
          selectElement.innerHTML = '<option value="">加工を選択してください</option>';
          Object.keys(prices[type]).forEach((mod) => {
              selectElement.innerHTML += `<option value="${mod}">${mod}</option>`;
          });
          modificationsContainer.appendChild(selectElement);
          selectElement.addEventListener('change', function() {
              if (selectElement.value) {
                  const modName = selectElement.value;
                  selectedModifications.push({ type: type, name: modName });
                  updateTotalPrice();
                  updateDetails();
              }
          });
      }
  });

  accessoriesType.addEventListener('change', function() {
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

  customPriceInput.addEventListener('input', function() {
      const value = parseFloat(customPriceInput.value);
      if (!isNaN(value)) {
          customPrice = value;
      } else {
          customPrice = 0;
      }
      updateTotalPrice();
      updateDetails();
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