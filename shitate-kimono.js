let items = [
    { name: "留袖・色留袖(比翼付き)", domestic: 62700, overseas: 34100 },
    { name: "留袖（訪問着仕立）", domestic: 55000, overseas: 27500 },
    // その他の種類...
    { name: "男袴（馬乗・行燈）", domestic: 46200, overseas: null }
  ];
  
  let preprocessing = [
    { name: "湯のし（三丈もの）", price: 1100 },
    { name: "湯のし（四丈もの）", price: 1320 },
    { name: "手湯のし（絞り）", price: 1650 },
    { name: "仮絵羽", price: 2750 }
  ];
  
  let accessories = [
    { name: "八掛・精華", price: 9900 },
    { name: "八掛・駒", price: 9900 },
    // その他の付属品...
    { name: "台衿（衿芯）", price: 660 }
  ];
  
  window.onload = function () {
    let itemSelect = document.getElementById("item");
    let originSelect = document.getElementById("origin");
    let preprocessingSelect = document.getElementById("preprocessing");
    let accessoriesSelect = document.getElementById("accessories");
    let estimateDiv = document.getElementById("estimate");
  
    // Add options to select
    for (let i = 0; i < items.length; i++) {
      let opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = items[i].name;
      itemSelect.appendChild(opt);
    }
  
    for (let i = 0; i < preprocessing.length; i++) {
      let opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = preprocessing[i].name;
      preprocessingSelect.appendChild(opt);
    }
  
    for (let i = 0; i < accessories.length; i++) {
      let opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = accessories[i].name;
      accessoriesSelect.appendChild(opt);
    }
  
    // Function to calculate and display estimate
    let calculateEstimate = function () {
      let selected_item = items[itemSelect.value];
      let origin = originSelect.value;
      let preproc = preprocessing[preprocessingSelect.value];
      let accessory = accessories[accessoriesSelect.value];
  
      let cost = selected_item[origin];
  
      // Display costs
      if (cost !== null) {
        let estimateHTML = `
          ${selected_item.name} (${origin}): ¥${cost}<br/>
          ${preproc.name}: ¥${preproc.price}<br/>
          ${accessory.name}: ¥${accessory.price}<br/>
          合計: ¥${cost + preproc.price + accessory.price}
        `;
        estimateDiv.innerHTML = estimateHTML;
  
        downloadCSVButton.dataset.csv = `
          "商品名","金額"\n
          "${selected_item.name} (${origin})","¥${cost}"\n
          "${preproc.name}","¥${preproc.price}"\n
          "${accessory.name}","¥${accessory.price}"\n
          "合計","¥${cost + preproc.price + accessory.price}"
        `;
      } else {
        estimateDiv.innerHTML = "選択した商品は選択した地域での仕立てが可能ではありません";
      }
    };
  
    // Register the function to onchange handlers
    itemSelect.onchange = calculateEstimate;
    originSelect.onchange = calculateEstimate;
    preprocessingSelect.onchange = calculateEstimate;
    accessoriesSelect.onchange = calculateEstimate;
  
    let downloadCSVButton = document.getElementById('download-csv');
    downloadCSVButton.onclick = function (e) {
      let csv = this.dataset.csv;
      let blob = new Blob([csv], {type: 'text/csv'});
    
      // Internet Explorer
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, "見積もり.csv");
      } else { // Other Browsers
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "見積もり.csv";
        link.style.display = 'none';
    
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    
      // Stop the original click event
      e.preventDefault();
    };
    let printButton = document.getElementById('print');
    printButton.onclick = function () {
      window.print();
    };
  
    // Calculate initial estimate
    calculateEstimate();
  };