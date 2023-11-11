const PDFParser = require('pdf2json');
const path = require('path');
const fs = require('fs-extra');

const pdfParser = new PDFParser(this, 1);
pdfParser.loadPDF('./words.pdf');
pdfParser.on('pdfParser_dataError', errData => reject(new Error(errData.parserError)));
pdfParser.on('pdfParser_dataReady', () => {
  const rawData = pdfParser.getRawTextContent();
  const json = getData(rawData);
  const p = './data.json';
  fs.ensureFileSync(p);
  fs.writeFile(p, JSON.stringify({ data: json }, null, 4), e => {
    if (e) throw e;
  });
});

function getData(rawText) {
  let i = -1;
  const data = rawText
    .split(/----------------.+----------------/g)
    .filter((p, idx) => idx >= 14)
    .reduce((acc, cur) => {
      const c = cur.trim();
      if (/^(PART\s\d+)/.test(c)) {
        i++;
        const cList = c.split(/\r\n/);
        acc.push({
          idx: cList[0],
          engCat: cList[1],
          cat: cList[2],
          des: cList[3],
          list: [],
        });
      } else {
        const cList = c.split(/\r\n/);
        const nameBoundaryIndexs = [];
        for (let i = cList.length - 1; i > 0; i--) {
          if (nameBoundaryIndexs.length === 2) break;
          if (/\d+/.test(cList[i])) {
            nameBoundaryIndexs.unshift(i);
          }
        }
        let wordsMainInfo = cList.slice(nameBoundaryIndexs[0], nameBoundaryIndexs[1] + 1);
        const wordsOtherInfo = cList.slice(0, nameBoundaryIndexs[0]);
        const explainIdx = wordsOtherInfo.findIndex(t => '词汇释义' === t.trim());
        const egIdx = wordsOtherInfo.findIndex(t => '运用示例' === t.trim());

        // pdf2json bug ?
        wordsMainInfo = wordsMainInfo.filter(n => !['BRAND STRATEGY', '品牌策略'].includes(n));

        const word = wordsMainInfo.filter((w, idx) => idx !== 0 && idx !== wordsMainInfo.length - 1).join('');
        const explain = wordsOtherInfo.slice(explainIdx + 1, egIdx).join('');
        const examp = wordsOtherInfo
          .slice(egIdx + 1)
          .join('')
          .split(/①|②/)
          .filter(t => !!t);
        if (word && explain) {
          acc[i].list.push({
            word,
            explain,
            examp,
          });
        }
      }
      return acc;
    }, []);

  return data;
}
