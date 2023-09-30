const excelToJson = require('convert-excel-to-json');
const fs = require('fs')
const Site= require('./models/user')
module.exports =async function importExcelData2MongoDB(req,res){
    // -> Read Excel File to Json Data
    console.log(req.file)
    let filePath = __dirname + '/uploads/' + req.file.filename
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets:[{
            // Excel Sheet Name
            name: 'Sheet1',
  
            // Header Row -> be skipped and will not be present at our result object.
            header:{
               rows: 1
            },
             
            // Mapping columns to keys
            columnToKey: {
                A: 'url'
            }
        }]
    });
  
    // -> Log Excel Data to Console
    console.log(excelData);
    //await Site.insertMany(excelData.Sheet1)
    res.send(excelData.Sheet1)
/* 
    userModel.insertMany(jsonObj,(err,data)=>{  
            if(err){  
                console.log(err);  
            }else{  
                res.redirect('/');  
            }  
     }); 
           */   
    fs.unlinkSync(filePath);
}