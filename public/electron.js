const path = require('path');
const reader = require('xlsx');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');
const PaySlipGenerator = require("./pdf/Payslip")

function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 820,
        minHeight: 500,
        backgroundColor: '#FCFCFC',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    // if (isDev) {
    //     win.webContents.openDevTools({ mode: 'detach' })
    // }

    win.removeMenu();

    ipcMain.handle('open-file', async () => {

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

    ipcMain.handle('generate-payslip', (event, data) => {

        const payslipGenerator = new PaySlipGenerator(data)
        payslipGenerator.generate()
        console.log("Payslip printed.")

    });


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
    const sheets= file.SheetNames; //get sheet names

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

            for (let i = range.s.r; i < range.e.r; i++) {

                if (ws[`A${i}`] !== undefined && ws[`A${i}`].v == count) {
        
                    data.push({
                        "name": ws[`B${i}`].v,
                        "period": period,
                        "ic-no": " ",
                        "position": "",
                        "epf-no": " ",
                        "position": " ",
                        "basic-rate": parseFloat(ws[`C${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "fixed-ot-rate": parseFloat(ws[`D${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "day-rate": parseFloat(ws[`E${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "day-count": parseInt(ws[`F${i}`].v).toLocaleString(),
                        "basic-pay": parseFloat(ws[`G${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "total-ot-fixed": parseFloat(ws[`H${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "total-ot-exceed": parseFloat(ws[`I${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "other-pay": parseFloat(ws[`J${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "gross-pay": parseFloat(ws[`K${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "pcb": parseFloat(ws[`L${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "cp38": parseFloat(ws[`M${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "employee": {
                            "epf": parseFloat(ws[`N${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                            "socso": parseFloat(ws[`O${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                            "eis": parseFloat(ws[`P${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        },
                        "baitulmal": parseFloat(ws[`Q${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "other-deduction": parseFloat(ws[`R${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "advance-deduction": parseFloat(ws[`S${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "total-deduction": parseFloat(ws[`T${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "net-pay": parseFloat(ws[`U${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "employer": {
                            "epf": parseFloat(ws[`V${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                            "socso": parseFloat(ws[`W${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                            "eis": parseFloat(ws[`X${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                            "total": (parseFloat(ws[`V${i}`].v.toFixed(2)) + parseFloat(ws[`W${i}`].v.toFixed(2)) + parseFloat(ws[`X${i}`].v.toFixed(2))).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
                        },
                        "total-epf": parseFloat(ws[`Y${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "total-socso": parseFloat(ws[`Z${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                        "total-eis": parseFloat(ws[`AA${i}`].v).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                    });

                    count++;
                }
            }

            payrollList.push({"name": name, "month": month, "period": period, "abv": sheet, "data": data})
        }
    })

    console.log(payrollList);
    console.log(payrollList[0]["data"].length);

    return payrollList;
}