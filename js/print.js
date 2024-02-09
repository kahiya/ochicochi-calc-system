//---------------------------------------------------
//印刷
//---------------------------------------------------
document.getElementById('print').addEventListener('click', function() {
    // 現在の日付を設定
    let today = new Date();
    let dateString = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();

    document.getElementById('printDate').innerText = dateString;
    document.getElementById('printDate').classList.remove('non-printable'); // 必要に応じて

    window.print();
});