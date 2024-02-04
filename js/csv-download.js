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
