#!/usr/bin/env node
var XLSX = require('xlsx')
var mongoose = require('mongoose')



var workbook = XLSX.readFile('FinanceSheet.xlsx', {cellDates:true, cellHTML:false})

var sheet_name_list = workbook.SheetNames;
//sheet_name_list.forEach(function(y) { /* iterate through sheets */
    var sheetName = 'FinanceSheet2016'
  var worksheet = workbook.Sheets[sheetName];
  console.log(worksheet)
  for (z in worksheet) {
    /* all keys that do not begin with "!" correspond to cell addresses */
    if(z[0] === '!') continue;
    //console.log(sheetName + "!" + z + "=" + JSON.stringify(worksheet[z].v));
  }

var worksheet = workbook.Sheets[sheetName];
var address_of_cell = 'B3';

/* Find desired cell */
var desired_cell = worksheet[address_of_cell];

/* Get the value */
for(var i=3; i<592; i++){
    var desired_cell = worksheet['B'+i]
    var desired_value = desired_cell.w
    console.log(new Date(desired_value))
}

//});