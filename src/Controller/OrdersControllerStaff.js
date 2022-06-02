const{ response } = require('express');
const pool = require('../Database/database');
var moment = require('moment-timezone');
var fs = require("fs");


const getAllOrders = async (req, res = response, next) => {
    try {
        const row = await pool.query(`CALL SP_GET_ALL_ORDERS();`);
        const orders = row[0];

        if(orders.length == 0){
            return res.status(200).json({
                resp : true,
                msj : 'No order',
                orders: []
            });
        }

        for (i = 0; i < orders.length; i++) {
            var a = moment.tz(orders[i].datee, "Asia/Ho_Chi_Minh");
            console.log(a.format('DD/MM/yyyy HH:mm:ss'));
    
            orders[i].datee = a.format('DD/MM/yyyy HH:mm:ss');
        }
        return res.status(200).json({
            resp : true,
            msj : 'Success',
            orders: orders
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            orders: []
        });
    }
};

const getDataStatistic1 = async (req, res = response, next) => {
    var starTime = req.query.starTime;
    var endTime = req.query.endTime;
    try {
        const row = await pool.query(`CALL SP_GET_STATISTIC_1(?, ?);`,[starTime, endTime]);
        const statistic = row[0];
        console.log(statistic);

        if(statistic.length == 0){
            return res.status(200).json({
                resp : true,
                msj : 'No data',
                revenue: []
            });
        }
        return res.status(200).json({
            resp : true,
            msj : 'Success',
            revenue: statistic
        });
    } catch (error) {
        return res.json({
            resp : false,
            msj : error,
            revenue: []
        });
    }
};

const exportInvoice = async (req, res = response, next) => {
      console.log("Chuan bi ghi du lieu vao file hien tai");

      const row = await pool.query(`CALL SP_EXPORT_INVOICE(?);`,[req.params.orderId]);
      const invoiceData = row[0];
      console.log(invoiceData);
    //   const productName = invoiceData.nameProduct;
    //   const quantity = invoiceData.quantity;
    //   const price = invoiceData.price;
    //   const amount_1 = quantity*price;
      const date = new Date(Date.now());
      var amount = 0;

    var data = '\t\t\t\tHOA DON BAN HANG\n'
    +'\t\t\t\tMa hoa don: '+ req.params.orderId+'\n'
    +'Ten cua hang:\n'
    +'Dia chi: abc-xyz\n\n\n'
    +'Ten khach hang: '+invoiceData[0].firstName+' '+invoiceData[0].lastName +'\n'
    +'Dia chi: '+invoiceData[0].address+'\n'
    +'So dien thoai: '+invoiceData[0].phone+'\n'
    +'┍━━┑━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┑━━━┑━━━━━━━━━━━━━━━━━━┑━━━━━━━━━━━━━━━━━━━┑\n'
    +'│st|ten san pham                                        │sl │price             |amount             |\n'


    for(i=0; i<invoiceData.length; i++){
        var productName = invoiceData[i].nameProduct;
        var quantity = invoiceData[i].quantity+"";
        var price = invoiceData[i].price+"";
        var amount_1 = (invoiceData[i].quantity*invoiceData[i].price)+"";
        amount = amount+(invoiceData[i].quantity*invoiceData[i].price);
    if(productName.length < 52){
        const length = 52 - productName.length;
        for(j=0; j< length; j++){
            productName = productName + " ";
        }
    }
    if(quantity.length < 3){
        const length = 3 - quantity.length;
        for(j=0; j< length; j++){
            quantity= quantity + " ";
        }
    }
    if(price.length < 18){
        const length = 18 - price.length;
        for(j=0; j< length; j++){
            price= price + " ";
        }
    }
    if(amount_1.length < 19){
        const length = 19 - amount_1.length;
        for(j=0; j< length; j++){
            amount_1= amount_1 + " ";
        }
    }
        
     data = data + '│'+(i+1)+' |'+productName+'│'+quantity+'│'+price+'|'+amount_1+'|\n'
    }
    data = data + '┗━━┙━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┙━━━┙━━━━━━━━━━━━━━━━━━┙━━━━━━━━━━━━━━━━━━━┙\n'
             + '\n Tong gia: '+amount
             + '\n \t\t\t\t\t\t\t Ngay '+("0" + date.getDate()).slice(-2)+' thang '+("0" + (date.getMonth() + 1)).slice(-2)+' nam '+date.getFullYear()+' \n'
             + '\t Khach Hang \t\t\t\t Nguoi viet hoa don'     

    fs.writeFile('src/Download/input.txt', data,  function(err) {
        if (err) {
           return console.error(err);
        }
    console.log("Ghi du lieu vao file thanh cong!");
    console.log("Doc du lieu vua duoc ghi");
  });
}

module.exports = {
    getAllOrders,
    getDataStatistic1,
    exportInvoice
}