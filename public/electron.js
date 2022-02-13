const path = require('path');
const url = require("url")
const reader = require('xlsx');
const homedir = require('os').homedir();
const fs = require('fs');
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const PaySlipGenerator = require("./pdf/Payslip");

function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 820,
        minHeight: 560,
        backgroundColor: '#FCFCFC',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.removeMenu();

    const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";

    win.loadURL(appURL);

    if (!app.isPackaged) {
        win.webContents.openDevTools({ mode: 'detach' })
    }

    ipcMain.handle('open-file', async() => {

        let data = {}; //payroll file data

        await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{name: 'Microsoft Excel Worksheet', extensions: ['xls', 'xlsx']}]
        }).then(result => {
            if (result.canceled === false) {
                data = {"filepath": result.filePaths[0], "data": readFile(result.filePaths[0])};
            }
        });

        return data;
    });

    ipcMain.handle('generate-payslip', async (event, data) => {

        const payslipGenerator = new PaySlipGenerator(data['data'], data['filepath'], data['month'], data['abv'])
        payslipGenerator.generate()


    });

    ipcMain.handle('open-folder', async() => {

        let dir = ""

        await dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then(result => {
            if (result.canceled == false) {
                dir = result.filePaths[0]
            }
        })

        return dir;
    })

    ipcMain.handle('view-folder', async (event, filepath) => {

        let command = '';

        switch (process.platform) {
            case 'darwin':
                command = 'open';
                break;
            case 'win32':
                command = 'explore';
                break;
            default:
                command = 'explore';
                break;
        }

        shell.openPath(filepath)

        return 0;
    })

    ipcMain.handle('get-home-dir', () => {

        let defaultDir = path.join(homedir, 'Documents', 'Payslip Generator Output');

        console.log(defaultDir)

        // create new if folder does not exist
        if (!fs.existsSync(defaultDir)) {
            fs.mkdir(defaultDir, (err) => {
                if (err) {
                    return console.error(err)
                }
                console.log("DIRECTORY CREATED")
            })
        }  

        return defaultDir;
    })


}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

//parse xls / xlsx file data
function readFile(filepath) {

    let payrollList = [];

    const file = reader.readFile(filepath); //reads selected file from path
    const sheets = file.SheetNames; //get sheet names

    const crewSheet = file.Sheets["CREW CHANGE"];
    const crewRange = reader.utils.decode_range(crewSheet['!ref']);    

    //loops through each sheet names
    sheets.forEach((sheet) => {

        //set current sheet
        const ws = file.Sheets[sheet];
        const range = reader.utils.decode_range(ws['!ref']);

        let textIndex;

        // extract locoation name
        for (let i = range.s.r; i < range.e.r; i++) {

            if (ws[`A${i}`] !== undefined) {
                textIndex = i;
                break;
            }
        }

        //if current sheet is a salary sheet
        if ((ws[`A${textIndex + 1}`] !== undefined) && ((ws[`A${textIndex + 1}`].v).toString().toLowerCase()).includes("salary statement")) {

            let nameList = [];
            let data = [];

            //get location name
            const nameRaw = (ws[`A${textIndex + 1}`].v).split(" ");

            for (let i = 3; i < nameRaw.length - 5; i++) {
                nameList.push(nameRaw[i]);
            }
            
            const name = nameList.join(' ');

            //get month
            const month = `${nameRaw.at(-2)} ${nameRaw.at(-1)}`;

            //get period
            const periodRaw = (ws[`A${textIndex + 2}`].v).split(" ");
            const period = `${periodRaw[1]} TO ${(periodRaw[3]).split(")")[0]}`;

            let count = 1;
            let crewSheetRangeCount

            //get crew sheet valid range
            for (let i = crewRange.s.r; i < crewRange.e.r; i++) {
                if (crewSheet[`A${i}`] !== undefined && (crewSheet[`A${i}`].v).toString().toLowerCase().includes("prepared")) {
                    crewSheetRangeCount = i;
                }
            }

            for (let i = range.s.r; i < range.e.r; i++) {

                if (ws[`A${i}`] !== undefined && ws[`A${i}`].v == count) {

                    // default values in case of empty cells
                    let name = "UNSPECIFIED"
                    let periodCrew = "UNSPECIFIED"
                    let icNo = "UNSPECIFIED"
                    let position = "UNSPECIFIED"
                    let epfNo = "UNSPECIFIED"
                    let basicRate = "UNSPECIFIED"
                    let fixedOtRate = "UNSPECIFIED"
                    let dayRate = "UNSPECIFIED"
                    let dayCount = "UNSPECIFIED"
                    let basicPay = "UNSPECIFIED"
                    let totalOtFixed = "UNSPECIFIED"
                    let totalOtExceed = "UNSPECIFIED"
                    let otherPay = "UNSPECIFIED"
                    let grossPay = "UNSPECIFIED"
                    let pcb = "UNSPECIFIED"
                    let cp38 = "UNSPECIFIED"
                    let employeeEPF = "UNSPECIFIED"
                    let employeeSOCSO = "UNSPECIFIED"
                    let employeeEIS = "UNSPECIFIED"
                    let baitulmal = "UNSPECIFIED"
                    let otherDeduction = "UNSPECIFIED"
                    let advanceDeduction = "UNSPECIFIED"
                    let totalDeduction = "UNSPECIFIED"
                    let netPay = "UNSPECIFIED"
                    let employerEPF = "UNSPECIFIED"
                    let employerSOCSO = "UNSPECIFIED"
                    let employerEIS = "UNSPECIFIED"
                    let totalEPF = "UNSPECIFIED"
                    let totalSOCSO = "UNSPECIFIED"
                    let totalEIS = "UNSPECIFIED"

                    for (let crewRow = crewRange.s.r; crewRow < crewSheetRangeCount; crewRow++) {

                        if (crewSheet[`B${crewRow}`] !== undefined && ((crewSheet[`B${crewRow}`].v === ws[`B${i}`].v) && (crewSheet[`F${crewRow}`].v == sheet))) {
                            //console.log(ws[`B${i}`].v + ", ROW " + crewSheet[`F${crewRow}`].v);

                            if (crewSheet[`C${crewRow}`] !== undefined) icNo = crewSheet[`C${crewRow}`].v
                            if (crewSheet[`D${crewRow}`] !== undefined) epfNo = crewSheet[`D${crewRow}`].v
                            if (crewSheet[`E${crewRow}`] !== undefined) position = crewSheet[`E${crewRow}`].v

                            break;
                        }
                    }

                    if (ws[`B${i}`] !== undefined) name = ws[`B${i}`].v
                    periodCrew = period
                    if (ws[`C${i}`] !== undefined) basicRate = parseFloat(ws[`C${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`D${i}`] !== undefined) fixedOtRate = parseFloat(ws[`D${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`E${i}`] !== undefined) dayRate = parseFloat(ws[`E${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`F${i}`] !== undefined) dayCount = parseInt(ws[`F${i}`].v).toLocaleString()
                    if (ws[`G${i}`] !== undefined) basicPay = parseFloat(ws[`G${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`H${i}`] !== undefined) totalOtFixed = parseFloat(ws[`H${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`I${i}`] !== undefined) totalOtExceed = parseFloat(ws[`I${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`J${i}`] !== undefined) otherPay = parseFloat(ws[`J${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`K${i}`] !== undefined) grossPay = parseFloat(ws[`K${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`L${i}`] !== undefined) pcb = parseFloat(ws[`L${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`M${i}`] !== undefined) cp38 = parseFloat(ws[`M${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                   
                    if (ws[`N${i}`] !== undefined) employeeEPF = parseFloat(ws[`N${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`O${i}`] !== undefined) employeeSOCSO = parseFloat(ws[`O${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`P${i}`] !== undefined) employeeEIS = parseFloat(ws[`P${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    
                    if (ws[`Q${i}`] !== undefined) baitulmal = parseFloat(ws[`Q${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`R${i}`] !== undefined) otherDeduction = parseFloat(ws[`R${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`S${i}`] !== undefined) advanceDeduction = parseFloat(ws[`S${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`T${i}`] !== undefined) totalDeduction = parseFloat(ws[`T${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`U${i}`] !== undefined) netPay = parseFloat(ws[`U${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})

                    if (ws[`V${i}`] !== undefined) employerEPF =  parseFloat(ws[`V${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`W${i}`] !== undefined) employerSOCSO =  parseFloat(ws[`W${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`X${i}`] !== undefined) employerEIS =  parseFloat(ws[`X${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    employerTotal =  (parseFloat(ws[`V${i}`].v.toFixed(2)) + parseFloat(ws[`W${i}`].v.toFixed(2)) + parseFloat(ws[`X${i}`].v.toFixed(2))).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    
                    if (ws[`Y${i}`] !== undefined) totalEPF = parseFloat(ws[`Y${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`Z${i}`] !== undefined) totalSOCSO = parseFloat(ws[`Z${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    if (ws[`AA${i}`] !== undefined) totalEIS = parseFloat(ws[`AA${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
        
                    data.push({
                        "name": name,
                        "period": periodCrew,
                        "ic-no": icNo,
                        "epf-no": epfNo,
                        "position": position,
                        "basic-rate": basicRate,
                        "fixed-ot-rate": fixedOtRate,
                        "day-rate": dayRate,
                        "day-count": dayCount,
                        "basic-pay": basicPay,
                        "total-ot-fixed": totalOtFixed,
                        "total-ot-exceed": totalOtExceed,
                        "other-pay": otherPay,
                        "gross-pay": grossPay,
                        "pcb": pcb,
                        "cp38": cp38,
                        "employee": {
                            "epf": employeeEPF,
                            "socso": employeeSOCSO,
                            "eis": employeeEIS,
                        },
                        "baitulmal": baitulmal,
                        "other-deduction": otherDeduction,
                        "advance-deduction": advanceDeduction,
                        "total-deduction": totalDeduction,
                        "net-pay": netPay,
                        "employer": {
                            "epf": employerEPF,
                            "socso": employerSOCSO,
                            "eis": employerEIS,
                            "total": employerTotal,
                        },
                        "total-epf": totalEPF,
                        "total-socso": totalSOCSO,
                        "total-eis": totalEIS,
                    });

                    count++;
                }
            }

            payrollList.push({"name": name, "month": month, "period": period, "abv": sheet, "data": data})
        }
    })

    return payrollList;
}

//OLD PACKAGE JSON
// "dev": "concurrently -k \"cross-env BROWSER=none npm start\" \"npm:electron\"",
// "electron": "wait-on tcp:3000 && electron .",