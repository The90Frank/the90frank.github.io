function htmltopdf() {
    var element = document.getElementById("fakebody");
    html2pdf().from(element).save();
}