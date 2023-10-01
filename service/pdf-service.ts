const PDFDocument = require("pdfkit");
function buildPdf(dataCb , endCb) {
  const doc = new PDFDocument();
  doc.on("data" , dataCb)
  doc.on("end" , endCb)
  doc.fontSize(25).text("Some text with an embedded font!", 100, 100);
}

module.exports = {buildPdf}
