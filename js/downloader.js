function htmltopdf() {
    var pdf = new jsPDF('p', 'pt', 'letter');
    var source = document.body;
    pdf.fromHTML(
        source,
        function() {
            pdf.save('Test.pdf');
        }
    );
}