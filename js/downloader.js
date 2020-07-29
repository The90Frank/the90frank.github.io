function htmltopdf() {
    var element = document.body;
    html2pdf().from(element).save();
}