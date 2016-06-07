var XLSX = require('xlsx-style');
var fs = require("fs");
function getFirstSheet(workbook) {
    return workbook.Sheets[workbook.SheetNames[0]]
}


function createHeaderStyle() {
    return {
        fill: {
            fgColor: { rgb: "FF996633" },
        },
        font: {
            color: { rgb: "FFFFEECC" },
            bold: "true"
        },
        alignment: {
            vertical: "center",
            horizontal: "center"
        },
        border: {
            top: {
                style: 'thin', color: { rgb: "00000000" }
            },
            left: {
                style: 'thin', color: { rgb: "00000000" }
            },
            bottom: {
                style: 'thin', color: { rgb: "00000000" }
            },
            right: {
                style: 'thin', color: { rgb: "00000000" }
            }
        }
    };
}

function createStyle() {
    return {
        border: {
            top: {
                style: 'thin', color: { rgb: "00000000" }
            },
            left: {
                style: 'thin', color: { rgb: "00000000" }
            },
            bottom: {
                style: 'thin', color: { rgb: "00000000" }
            },
            right: {
                style: 'thin', color: { rgb: "00000000" }
            }
        }
    };
}

function createCol(text, style) {
    return { v: text, s: style };
}

//excelの改行は￥ｒ￥ｎなんだけどどうすっか
var sample = {
    "id": "1",
    "種別": "タスク",
    "内容": "例の件ですが、どうします？\n私は、どちらでもいいですが…",
    "作成者": "農度太郎",
    "作成日": "2016/01/01",
    "回答": "どうにかしましょう。",
    "回答者": "農度次郎",
    "回答日": "2016/01/02",
    "終了": "○",
    "関連No": ""
}

var HEADER_SAMPLE = [
    "id",
    "種別",
    "内容",
    "作成者",
    "作成日",
    "回答",
    "回答者",
    "回答日",
    "終了",
    "関連No"
]

function createHeader(rowNo) {
    var header = HEADER_SAMPLE;
    var obj = {};
    header.forEach(function (element, i) {
        obj[c(i, rowNo)] = createCol(element, createHeaderStyle());
    }, this);
    return obj;
}

function fromSample(data) {
    var out = [];
    HEADER_SAMPLE.forEach(function (item, i) {
        var c = data[item];
        out.push(c);
    })
    return out;
}


function createRow(rowNo, data) {
    var out = {};
    data.forEach(function (item, i) {
        out[c(i, rowNo)] = createCol(item, createStyle());
    })
    return out;
}

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

function c(C, R) {
    return XLSX.utils.encode_cell({ c: C, r: R });
}

function createSheet(dataList) {
    var out = {};
    var header = createHeader(0);
    out = extend(out, header);
    for(var i = 0; i < dataList.length; i++){
        out = extend(out, createRow(i + 1, fromSample(dataList[i])))
    }
    
    //    var range = { s: { c: 0, r: 0 }, e: { c: width, r: 10 } };
    //    out["!ref"] = XLSX.utils.encode_range(range);
    var range = { s: { c: 0, r: 0 }, e: { c: 10, r: dataList.length } };
    out["!ref"] = XLSX.utils.encode_range(range);
    out["!cols"] = [];
    var mini = 40;
    var middle = 80;
    var large = 240;
    var sizes = [
        mini,
        middle,
        large,
        middle,
        middle,
        large,
        middle,
        middle,
        mini,
        mini
    ]

    sizes.forEach(function (element, i) {
        out["!cols"][i] = { wpx: element }
    }, this);
    return out;
}


function createBook(data) {
    return {
        SheetNames: ["Sheet1"],
        Sheets: {
            "Sheet1": createSheet(data)
        }
    }
}

//スタイルの書き方は下記参照
//https://github.com/protobi/js-xlsx

function writeData(outfile, data) {
    var workbook = createBook(data);
    //var defaultCellStyle = { font: { name: "Verdana", sz: 11, color: "FF00FF88"}, fill: {fgColor: {rgb: "FFFFAA00"}}};
    var defaultCellStyle = {};
    var options =
        { defaultCellStyle: defaultCellStyle, bookType: 'xlsx', bookSST: false };

    XLSX.writeFile(workbook, outfile, options);
}

function readData(fileName) {
    var options = {
        cellStyles: true
    }
    var workbook = XLSX.readFile(fileName, options);
    return XLSX.utils.sheet_to_json(getFirstSheet(workbook));
}

//writeData("out.xlsx");
//fs.writeFileSync("out.json", JSON.stringify(data), "utf-8");

module.exports = {
    readData: readData,
    writeData: writeData
}
