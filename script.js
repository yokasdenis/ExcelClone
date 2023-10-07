//creating grid
let rows = 100;
let cols = 26;

let addressColContainer = document.querySelector(".address-col-container");
let addressRowContainer = document.querySelector(".address-row-cont");
let cellsCont = document.querySelector(".cells-container");
let addressBar = document.querySelector(".address-bar");

for (let i = 0; i < rows; i++) {
    let addressCol = document.createElement("div");
    addressCol.innerText = i + 1;
    addressCol.setAttribute("class", "address-col");
    addressColContainer.appendChild(addressCol);
}

for (let i = 0; i < cols; i++) {
    let addressRow = document.createElement("div");
    addressRow.innerText = String.fromCharCode(65 + i);
    addressRow.setAttribute("class", "address-row");
    addressRowContainer.appendChild(addressRow);
}

for (let i = 0; i < rows; i++) {
    let rowDiv = document.createElement("div");
    rowDiv.setAttribute("class", "row-cont");
    for (let j = 0; j < cols; j++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("spellcheck", "false");
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);

        rowDiv.appendChild(cell);
        addListenterForAddressBarDisplay(cell, i, j);
    }
    cellsCont.appendChild(rowDiv);
}
let addressic;
function addListenterForAddressBarDisplay(cell, i, j) {
    cell.addEventListener("click", (e) => {
        let rowId = i + 1;
        let colId = String.fromCharCode(65 + j);
        addressBar.value = `${colId}${rowId}`
    });
}


//handling sheets
let activeSheetColor = "#ced6e0";
let sheetsFolderContainer = document.querySelector(".sheets-folder-container");
let addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);

    sheet.innerHTML = `
        <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>
    `;

    sheetsFolderContainer.appendChild(sheet);
    sheet.scrollIntoView();
    // DataBase
    createSheetDB();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
});

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        if (e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("You need to have atleast one sheet!!");
            return;
        }

        let message = confirm("Your sheet will be removed permanently, Are you sure ?");
        if (message === false) return;
        let sheetIdx = Number(sheet.getAttribute("id"));

        collectedSheetDB.splice(sheetIdx, 1);

        handleSheetUIRemoval(sheet);
        sheetDB = collectedSheetDB[0];
        handleSheetProperties();
    });

}

function handleSheetUIRemoval(sheet) {
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i + 1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }

    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
}

function handleSheetProperties() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    });
}

function createSheetDB() {
    let sheetDB = [];
    for (let i = 0; i < rows; i++) {
        let sheetRow = [];
        for (let j = 0; j < cols; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGColor: "#000000",
                value: "",
                formula: "",
                children: [],
            };
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);
}



//handling individual cell properties
// Storage 
let collectedSheetDB = [];
let sheetDB = [];

{
    let addSheetBtn = document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
}

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".fontSizeSelector");
let fontFamily = document.querySelector(".fontFamilySelector");
let fontColor = document.querySelector(".font-color-prop");
let BGColor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignElement");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "gray";
let inactiveColorProp = "lightgray";

bold.addEventListener('click', (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.bold = !cellProp.bold;
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
});

italic.addEventListener('click', (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.italic = !cellProp.italic;
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
});

underline.addEventListener('click', (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.underline = !cellProp.underline;
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
});

fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontSize = fontSize.value;
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
});

fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontFamily = fontFamily.value;
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
});

fontColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontColor = fontColor.value;
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
});

BGColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.BGColor = BGColor.value;
    cell.style.backgroundColor = cellProp.BGColor;
    BGColor.value = cellProp.BGColor;
});


alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue;
        cell.style.textAlign = cellProp.alignment;
        switch (alignValue) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
    });
});

let allCells = document.querySelectorAll(".cell");

for (let i = 0; i < allCells.length; i++) {
    addListenterToAttachCellProperties(allCells[i]);
}

function addListenterToAttachCellProperties(cell) {
    cell.addEventListener("click", (e) => {

        let address = addressBar.value;
        let [rid, cid] = decodeRIDCIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];

        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGColor === "#000000" ? "transparent" : cellProp.BGColor;
        cell.style.textAlign = cellProp.alignment;

        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        fontColor.value = cellProp.fontColor;
        BGColor.value = cellProp.BGColor;

        switch (cellProp.alignment) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }

        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;

    });
}

function getCellAndCellProp(address) {
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
    let rid = Number(address.slice(1)) - 1;
    let cid = Number(address.charCodeAt(0)) - 65;
    return [rid, cid];
}

const clearButton = document.getElementById("clear-cell");
clearButton.addEventListener("click", clearCell);
function clearCell() {
    let cellAddress = addressBar.value;
    let [rid, cid] = decodeRIDCIDFromAddress(cellAddress);
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];

    cell.innerText = "";
    cellProp.value = "";

    cell.style.fontWeight = "normal";
    cell.style.fontStyle = "normal";
    cell.style.textDecoration = "none";
    cell.style.fontSize = "14px";
    cell.style.fontFamily = "monospace";
    cell.style.color = "#000000";
    cell.style.backgroundColor = "transparent";
    cell.style.textAlign = "left";

    cellProp.bold = false;
    cellProp.italic = false;
    cellProp.underline = false;
    cellProp.fontSize = "14";
    cellProp.fontFamily = "monospace";
    cellProp.BGColor = "#000000";
    cellProp.alignment = "left";
    cellProp.fontColor = "#000000";
    cellProp.value = "";
    cellProp.formula = "";
    cellProp.children = [];
    formulaBar.value = "";
}

//cut, copy and paste features
let ctrlKey = false;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
});
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
});

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

let rangeStorage = [];

function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
        if (!ctrlKey) return;

        if (rangeStorage.length >= 2) {
            defaultSelectedCellsUI();
            rangeStorage = [];
        }

        // UI
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);

    });
}

function defaultSelectedCellsUI() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid #dfe4ea";
    }
}

let copyData = [];

copyBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2) return;
    copyData = [];
    let strow = rangeStorage[0][0];
    let stcol = rangeStorage[0][1];
    let endrow = rangeStorage[1][0];
    let endcol = rangeStorage[1][1];
    for (let i = strow; i <= endrow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++) {
            let cellProp = JSON.parse(JSON.stringify(sheetDB[i][j]));
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    defaultSelectedCellsUI();
});

cutBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2) return;
    copyData = [];
    let strow = rangeStorage[0][0];
    let stcol = rangeStorage[0][1];
    let endrow = rangeStorage[1][0];
    let endcol = rangeStorage[1][1];
    for (let i = strow; i <= endrow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++) {
            let cellPropCopy = JSON.parse(JSON.stringify(sheetDB[i][j]));
            let cellProp = sheetDB[i][j];

            copyRow.push(cellPropCopy);
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = "14";
            cellProp.fontFamily = "monospace";
            cellProp.BGColor = "#000000";
            cellProp.alignment = "left";
            cellProp.fontColor = "#000000";

            cell.click();

        }
        copyData.push(copyRow);
    }
    defaultSelectedCellsUI();
});

pasteBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2) return;

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    let address = addressBar.value;
    let [stRow, stCol] = decodeRIDCIDFromAddress(address);

    for (let i = stRow, r = 0; i <= stRow + rowDiff; i++, r++) {
        for (let j = stCol, c = 0; j <= stCol + colDiff; j++, c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if (!cell) continue;

            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.BGColor = data.BGColor;
            cellProp.alignment = data.alignment;
            cellProp.fontColor = data.fontColor;

            cell.click();
        }
    }
});


//formula
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;
            if (enteredData == cellProp.value) return;
            cellProp.value = enteredData;

            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        });
    }
}

let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {

        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        if (inputFormula !== cellProp.formula) {
            removeChildFromParent(cellProp.formula);
        }

        let evaluatedValue = evaluateFormula(inputFormula);

        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);

        updateChildrenCells(address);
    }
});

function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;
    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }
    }
}

function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
    let [cell, cellProp] = getCellAndCellProp(address);

    cell.innerText = evaluatedValue;
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}

//download
let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");

downloadBtn.addEventListener("click", (e) => {
    let jsonData = JSON.stringify([sheetDB]);
    let file = new Blob([jsonData], { type: "application/json" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
});

openBtn.addEventListener("click", (e) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let fr = new FileReader();
        let files = input.files;
        let fileObj = files[0];

        fr.readAsText(fileObj);
        fr.addEventListener("load", (e) => {
            let readSheetData = JSON.parse(fr.result);

            addSheetBtn.click();
            sheetDB = readSheetData[0];
            collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
            handleSheetProperties();
        });
    });
});

//data manipulation
let gridCont = document.querySelector(".grid-container")
const tbody = document.getElementById("tbody");


function clearBody() {
    tbody.innerHTML = "";
}
function addTable() {
    clearBody();
    for (let i = 0; i < sheetDB.length; i++) {
        for (let j = 0; j < 26; j++) {
            let dataRow = sheetDB[i];
            let dataItem = dataRow[j];
            if (dataItem.value.length > 1) {
                addData(dataItem);
            }
        }
    }
}

function addData(dataItem) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${dataItem.value}</td>
                <td>${dataItem.bold}</td>
                <td>${dataItem.italic}
                <td>${dataItem.fontFamily}</td>
                <td>${dataItem.fontSize}</td>`
    tbody.appendChild(tr);
}

let filteredData = [];
function searchData() {
    clearBody();
    const searchTerm = document.getElementById("search").value.toLowerCase();

    for (let i = 0; i < sheetDB.length; i++) {
        let dataRow = sheetDB[i];
        const filteredRow = dataRow.filter((event) =>
            event.value.toLowerCase().includes(searchTerm)
        );
        filteredData.push(...filteredRow);
    }

    addSearch(filteredData);
    searchTerm.value = ""
    filteredData = [];
}
function addSearch(arrayData) {
    clearBody();
    for (let i = 0; i < arrayData.length; i++) {
        let dataItem = arrayData[i];
        addData(dataItem)
    }
}


function sortValueAZ() {
    const allData = sheetDB.flat();
    allData.sort((a, b) => a.value.localeCompare(b.value));
    clearBody();
    for (let i = 0; i < allData.length; i++) {
        let dataItem = allData[i];
        if (dataItem.value.length > 1) {
            addData(dataItem);
        }
    }
}

function sortValueZA() {
    const allData = sheetDB.flat();
    allData.sort((a, b) => b.value.localeCompare(a.value));
    clearBody();
    for (let i = 0; i < allData.length; i++) {
        let dataItem = allData[i];
        if (dataItem.value.length > 1) {
            addData(dataItem);
        }
    }
}


function filterBold() {
    clearBody()
    let allData = sheetDB.flat();
    allData = allData.filter((element) => element.bold);
    for (let i = 0; i < allData.length; i++) {
        let dataItem = allData[i];
        if (dataItem.value.length > 1) {
            addData(dataItem);
        }
    }
}


function filterItalic() {
    clearBody()
    let allData = sheetDB.flat();
    allData = allData.filter((element) => element.italic);
    for (let i = 0; i < allData.length; i++) {
        let dataItem = allData[i];
        if (dataItem.value.length > 1) {
            addData(dataItem);
        }
    }
}