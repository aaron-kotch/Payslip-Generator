const fs = require('fs');
const PDFGenerator = require('pdfkit')
const homeDir = require('os').homedir()
const path = require('path')

class PaySlipGenerator {

    constructor(staff, filepath, month, location) {
        this.staff = staff
        this.filepath = filepath
        this.month = month
        this.location = location
    }

    generateHeader(doc) {

        doc
        .font('fonts/DejaVuSans-CondensedBold.ttf')
        .fontSize(10)
        .text("Company Name", 29, 19.2)
        .text(":  SOCC OFFSHORE SDN BHD", 130.6, 19.2)
        .text("Name", 29, 32.9)
        .text(`:  ${(this.staff.name)}`, 130.6, 32.9)
        .text("NRIC No.", 29, 47)
        .text(`:  ${this.staff['ic-no']}`, 130.6, 47)
        .text("Month", 361.4, 47.8)
        .text(`: ${this.staff.period}`, 413, 47.8)
    }

    generateTable(doc) {

        doc
        .moveTo(26.9, 73.2)
        .lineWidth(1.1)
        .lineTo(595 - 26.9, 73.2)
        .stroke()

        doc
        .text('POSITION', 26.9, 96.6, {
            align: 'center',
            baseline: 'middle',
            width: 117.1
        })
        .text(`:  ${(this.staff.position)}`, 146, 96.6, {
            align: 'left',
            baseline: 'middle',
            width: 191
        })

        //

        doc
        .text('EPF No', 345.6, 84.9, {
            align: 'left',
            baseline: 'middle',
            width: 54.4
        })
        .text(`: ${(this.staff['epf-no'])}`, 400, 84.9, {
            align: 'left',
            baseline: 'middle',
            width: 168.1
        })

        //23.4

        doc
        .text('SOCSO No', 345.6, 108.3, {
            align: 'left',
            baseline: 'middle',
            width: 54.4
        })
        .text(`: ${this.staff['ic-no']}`, 400, 108.3, {
            align: 'left',
            baseline: 'middle',
            width: 168.1
        })

        doc
        .moveTo(26.9, 120)
        .lineWidth(1.1)
        .lineTo(595 - 26.9, 120)
        .stroke()

        doc
        .text('EARNING', 26.9, 135.5, {
            align: 'center',
            baseline: 'middle',
            width: 117.1
        })
        .text('DAY', 144, 127.75, {
            align: 'center',
            baseline: 'middle',
            width: 34,
        })
        .text('S/HR', 144, 143.25, {
            align: 'center',
            baseline: 'middle',
            width: 34
        })
        .text('RATE (RM)', 178, 135.5, {
            align: 'center',
            baseline: 'middle',
            width: 81.3
        })
        .text('TOTAL', 259.3, 135.5, {
            align: 'center',
            baseline: 'middle',
            width: 81.3
        })
        .text('DEDUCTION EMPLOYEE', 345.6, 135.5, {
            align: 'left',
            baseline: 'middle',
            width: 135.4
        })
        .text('RM', 476, 135.5, {
            align: 'center',
            baseline: 'middle',
            width: 92.1
        })


        /* 
        ------------------------------------------|
        |         |   | DAY   |           |       |
        | EARNING |---|------ | RATE (RM) | TOTAL |
        |         |   | S/HR  |           |       |
        |-----------------------------------------|
        */

        //vertical line
        doc
        .moveTo(144, 120)
        .lineWidth(1.1)
        .lineTo(144, 151)
        .stroke()

        doc
        .moveTo(178, 120)
        .lineWidth(1.1)
        .lineTo(178, 151)
        .stroke()

        doc
        .moveTo(259.3, 120)
        .lineWidth(1.1)
        .lineTo(259.3, 151)
        .stroke()

        doc
        .moveTo(144, 150.5)
        .lineWidth(0.1)
        .lineTo(144, 229.2)
        .strokeOpacity(0.5)
        .stroke()

        doc
        .moveTo(178, 167)
        .lineWidth(0.1)
        .lineTo(178, 229.2)
        .strokeOpacity(0.5)
        .stroke()

        doc
        .moveTo(259.3, 167)
        .lineWidth(0.1)
        .lineTo(259.3, 229.2)
        .strokeOpacity(0.5)
        .stroke()

        //horizontal line [day/shr]
        doc
        .moveTo(144, 135.5)
        .lineWidth(1.1)
        .lineTo(178, 135.5)
        .strokeOpacity(1)
        .stroke()

        //horizontal line 
        doc
        .moveTo(26.9, 151)
        .lineWidth(1.1)
        .lineTo(595 - 26.9, 151)
        .stroke()

        //vertical line right mid
        doc
        .moveTo(476, 150.5)
        .lineWidth(0.3)
        .lineTo(476, 245.3)
        .stroke()

        // --------ROW 3-----------
        //LEFT
        doc
        .text('TOTAL DAYS WORK', 30, 159, {
            align: 'left',
            baseline: 'middle',
            width: 114
        })
        .text(`${this.staff.period}`, 144, 159, {
            align: 'right',
            baseline: 'middle',
            width: 191
        })

        //RIGHT
        doc
        .text('EPF', 345.6, 159, {
            align: 'left',
            baseline: 'middle',
            width: 135.4
        })
        .text(`RM${this.staff['employee']['epf']}`, 476, 159, {
            align: 'right',
            baseline: 'middle',
            width: 87.1
        })
        

        doc
        .moveTo(26.9, 167)
        .lineWidth(0.3)
        .lineTo(595 - 26.9, 167)
        .stroke()

        // --------ROW 4-----------
        //LEFT
        doc
        .text('BASIC PAY', 30, 175, {
            align: 'left',
            baseline: 'middle',
            width: 114
        })
        .text(`${this.staff['day-count']}`, 144, 175, {
            align: 'center',
            baseline: 'middle',
            width: 34
        })
        .text(`RM${this.staff['basic-rate']}`, 178, 175, {
            align: 'right',
            baseline: 'middle',
            width: 76.3
        })
        .text(`RM${this.staff['basic-pay']}`, 259.3, 175, {
            align: 'right',
            baseline: 'middle',
            width: 76.3
        })

        //RIGHT
        doc
        .text('SOCSO', 345.6, 175, {
            align: 'left',
            baseline: 'middle',
            width: 135.4
        })
        .text(`RM${this.staff['employee']['socso']}`, 476, 175, {
            align: 'right',
            baseline: 'middle',
            width: 87.1
        })

        doc
        .moveTo(26.9, 182.6)
        .lineWidth(0.3)
        .lineTo(595 - 26.9, 182.6)
        .stroke()

        // --------ROW 5-----------
        //LEFT
        doc
        .text('FIXED OT (4HRS/DAY)', 30, 190.6, {
            align: 'left',
            baseline: 'middle',
            width: 114
        })
        .text(`${this.staff['day-count']}`, 144, 190.6, {
            align: 'center',
            baseline: 'middle',
            width: 34
        })
        .text(`RM${this.staff['fixed-ot-rate']}`, 178, 190.6, {
            align: 'right',
            baseline: 'middle',
            width: 76.3
        })
        .text(`RM${this.staff['total-ot-fixed']}`, 259.3, 190.6, {
            align: 'right',
            baseline: 'middle',
            width: 76.3
        })

        //RIGHT
        doc
        .text('INCOME TAX', 345.6, 190.6, {
            align: 'left',
            baseline: 'middle',
            width: 135.4
        })
        .text(`RM${this.staff['pcb']}`, 476, 190.6, {
            align: 'right',
            baseline: 'middle',
            width: 87.1
        })

        doc
        .moveTo(26.9, 198.5)
        .lineWidth(0.3)
        .lineTo(595 - 26.9, 198.5)
        .stroke()


        // --------ROW 6-----------
        //LEFT
        doc
        .text('EXCEED 4HRS OT', 30, 206.5, {
            align: 'left',
            baseline: 'middle',
            width: 114
        })
        .text(`RM${this.staff['total-ot-exceed']}`, 259.3, 206.5, {
            align: 'right',
            baseline: 'middle',
            width: 76.3
        })

        //RIGHT
        doc
        .text('SUMBANGAN BAITULMAL', 345.6, 206.5, {
            align: 'left',
            baseline: 'middle',
            width: 135.4
        })
        .text(`RM${this.staff['baitulmal']}`, 476, 206.5, {
            align: 'right',
            baseline: 'middle',
            width: 87.1
        })

        doc
        .moveTo(26.9, 213.8)
        .lineWidth(0.3)
        .lineTo(595 - 26.9, 213.8)
        .stroke()

        // --------ROW 7-----------
        //LEFT
        doc
        .text('OTHER CLAIM', 30, 221.8, {
            align: 'left',
            baseline: 'middle',
            width: 114
        })
        .text(`RM${this.staff['other-pay']}`, 259.3, 221.8, {
            align: 'right',
            baseline: 'middle',
            width: 76.3
        })

        //RIGHT
        doc
        .text('EIS', 345.6, 221.8, {
            align: 'left',
            baseline: 'middle',
            width: 135.4
        })
        .text(`RM${this.staff['employee']['eis']}`, 476, 221.8, {
            align: 'right',
            baseline: 'middle',
            width: 87.1
        })

        doc
        .moveTo(26.9, 229.4)
        .lineWidth(0.3)
        .lineTo(595 - 26.9, 229.4)
        .stroke()

        // --------ROW 7-----------
        //RIGHT
        doc
        .text('ADVANCE', 345.6, 237.4, {
            align: 'left',
            baseline: 'middle',
            width: 135.4
        })
        .text(`RM${this.staff['advance-deduction']}`, 476, 237.4, {
            align: 'right',
            baseline: 'middle',
            width: 87.1
        })

        doc
        .moveTo(340.8, 245.3)
        .lineWidth(0.3)
        .lineTo(595 - 26.9, 245.3)
        .stroke()

        // --------ROW TOTAL-----------
        //LEFT
        doc
        .text('TOTAL GROSS', 30, 272.3, {
            align: 'left',
            baseline: 'middle',
            width: 114
        })
        .text(`RM${this.staff['gross-pay']}`, 259.3, 272.3, {
            align: 'right',
            baseline: 'middle',
            width: 76.3
        })

        //RIGHT
        doc
        .text('TOTAL DEDUCTION', 345.6, 272.3, {
            align: 'left',
            baseline: 'middle',
            width: 135.4
        })
        .text(`RM${this.staff['total-deduction']}`, 476, 272.3, {
            align: 'right',
            baseline: 'middle',
            width: 87.1
        })

        //HORIZONTAL LINE 
        doc
        .moveTo(26.9, 299.2)
        .lineWidth(1.1)
        .lineTo(595 - 26.9, 299.2)
        .stroke()

        // --------ROW EMPLOYER-----------
        //LEFT
        doc
        .text("EMPLOYER'S CONTRIBUTION", 30, 304.2, {
            align: 'left',
            width: 240,
            underline: true
        })
        .text('EPF', 30, 328.2, {
            align: 'left',
            baseline: 'middle',
            width: 114
        })
        .text('SOCSO', 30, 344.2, {
            align: 'left',
            baseline: 'middle',
            width: 114
        })
        .text('EIS', 30, 360.2, {
            align: 'left',
            baseline: 'middle',
            width: 114
        })

        doc
        .text(`RM${this.staff.employer.epf}`, 178, 328.2, {
            align: 'right',
            baseline: 'middle',
            width: 76.3
        })
        
        .text(`RM${this.staff.employer.socso}`, 178, 344.2, {
            align: 'right',
            baseline: 'middle',
            width: 76.3
        })
        
        .text(`RM${this.staff.employer.eis}`, 178, 360.2, {
            align: 'right',
            baseline: 'middle',
            width: 76.3
        })

        doc
        .moveTo(26.9, 380.2)
        .lineWidth(1.1)
        .lineTo(340.8, 380.2)
        .stroke()

        // col 11

        doc
        .text('TOTAL', 30, 388.8, {
            align: 'left',
            baseline: 'middle',
            width: 114
        })
        .text(`RM${this.staff['employer']['total']}`, 178, 388.8, {
            align: 'right',
            baseline: 'middle',
            width: 76.3
        })

        doc
        .moveTo(168.2, 380.2)
        .lineWidth(1.1)
        .lineTo(168.2, 396.2)
        .stroke()

        doc
        .text('NETT INCOME', 345.6, 328.2, {
            align: 'left',
            baseline: 'middle',
            width: 135.4
        })
        .text(`RM${this.staff['net-pay']}`, 476, 328.2, {
            align: 'right',
            baseline: 'middle',
            width: 87.1
        })

        //HORIZONTAL LINE 
        doc
        .moveTo(26.9, 396.2)
        .lineWidth(1.1)
        .lineTo(595 - 26.9, 396.2)
        .stroke()

        //VERTICAL LINE
        doc
        .moveTo(26.9, 73.2)
        .lineWidth(1.1)
        .lineTo(26.9, 396.2)
        .stroke()

        doc
        .moveTo(340.6, 73.2)
        .lineWidth(1.1)
        .lineTo(340.6, 396.2)
        .stroke()

        doc
        .moveTo(595 - 26.9, 73.2)
        .lineWidth(1.1)
        .lineTo(595 - 26.9, 396.2)
        .stroke()

    }

    generate() {

        let output = new PDFGenerator({
            size: 'A4',
            margin: 0
        })

        const outputPath = `${path.join(this.filepath, this.month, this.location)}`

        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, {recursive: true}, (err) => {
                if (err) {
                    return console.error(err)
                }
                console.log("DIRECTORY CREATED")
            })
        }

        output.pipe(fs.createWriteStream(`${outputPath}/${this.staff['name']} ${this.staff['ic-no']}.pdf`))

        this.generateHeader(output)
        this.generateTable(output)
    
        output.end()

        console.log(`${this.staff.name} Payslip printed.`)
    
    }
    

}

module.exports = PaySlipGenerator