#!/usr/bin/env node
var XLSX = require("xlsx");
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
var Expense = require("../models/expense");
var Company = require("../models/company");
// connect to Mongo when the app initializes
mongoose.connect("mongodb://localhost/local");

function parseToJSON(fileName) {
  var lines = [];

  var workbook = XLSX.readFile("FinanceSheet.xlsx");
  var sheetName = "FinanceSheet2016";
  var worksheet = workbook.Sheets[sheetName];

  // VALUES
  var startRow = 3;
  var stopRow = 591;
  var dateCol = "B";
  var detailsCol = "C";
  var companyCol = "D";
  var monOutCol = "E";
  var monInCol = "F";
  var vatInCol = "G";
  var vatOutCol = "H";
  var vatTotalCol = "I";
  var totalCol = "J";

  /* Get the value */
  for (var i = startRow; i <= stopRow; i++) {
    var date = makeDate(worksheet[dateCol + i].w);
    var details = worksheet[detailsCol + i].w;
    var company = worksheet[companyCol + i].w;
    var monOut = processNum(worksheet[monOutCol + i]);
    var monIn = processNum(worksheet[monInCol + i]);
    var vatIn = processNum(worksheet[vatInCol + i]);
    var vatOut = processNum(worksheet[vatOutCol + i]);
    var vatTotal = processNum(worksheet[vatTotalCol + i]);
    var total = roundNumber(worksheet[totalCol + i].v);

    var line = {
      date: date,
      details: details,
      company: company,
      monOut: monOut,
      monIn: monIn,
      vatIn: vatIn,
      vatOut: vatOut,
      vatTotal: vatTotal,
      total: total
    };

    lines.push(line);
  }
  return lines;
}

function processNum(cell) {
  if (typeof cell === "undefined") {
    return 0;
  }
  return roundNumber(cell.w);
}

function roundNumber(value) {
  return Math.round(value * 100) / 100;
}

function makeDate(value) {
  var dateParts = value.split("/");
  return new Date(
    parseInt("20" + dateParts[2], 10),
    parseInt(dateParts[1], 10) - 1,
    parseInt(dateParts[0], 10)
  );
}
function sortTransactions(json) {
  var sortedTXs = {};
  var expenses = [];
  var invoices = [];

  for (var line of json) {
    if (line.monOut !== 0) {
      expenses.push(line);
    } else {
      invoices.push(line);
    }
  }

  sortedTXs.expenses = expenses;
  sortedTXs.invoices = invoices;

  return sortedTXs;
}

function findOrCreateCompany(line) {
  var companyName = line.company;
  Company.findOne({ name: companyName }, function(err, doc) {
    if (doc === null) {
      new Company({ name: companyName }).save(function(err, doc) {
        saveExpenseAgainstCompany(doc._id, line);
      });
    } else {
      saveExpenseAgainstCompany(doc._id, line);
    }
  });
}

function saveExpenseAgainstCompany(companyID, line) {
  var expense = new Expense({
    company: companyID,
    items: [{ desc: line.details, total: line.monOut }]
  });

  expense.save(function(err, doc) {
    if (err == null) {
      console.log("Expense Saved!");
    } else {
      console.log("Expense Error in Saving:", err);
    }
  });
}

function putExpinDB(expenses) {
  for (var line of expenses) {
    findOrCreateCompany(line);
  }
}

var json = parseToJSON();
var sortedTX = sortTransactions(json);
putExpinDB(sortedTX.expenses);
