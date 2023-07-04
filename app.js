var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var routes = require("./routes/index");

// popbill configuration
var popbill = require("./config/popbill.js");

// Router handler
var taxinvoice = require("./routes/taxinvoice");
var statement = require("./routes/statement");
var cashbill = require("./routes/cashbill");
var message = require("./routes/message");
var kakao = require("./routes/kakao");
var fax = require("./routes/fax");
var htTaxinvoice = require("./routes/httaxinvoice");
var htCashbill = require("./routes/htcashbill");
var closedown = require("./routes/closedown");
var bizInfoCheck = require("./routes/bizinfocheck");
var easyfinbank = require("./routes/easyfinbank");
var accountCheck = require("./routes/accountCheck");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes); // Direct ./routes/index.js

//app.use(route URI Schema, route handler)
app.use("/TaxinvoiceService", taxinvoice);
app.use("/StatementService", statement);
app.use("/CashbillService", cashbill);
app.use("/MessageService", message);
app.use("/KakaoService", kakao);
app.use("/FaxService", fax);
app.use("/HTTaxinvoiceService", htTaxinvoice);
app.use("/HTCashbillService", htCashbill);
app.use("/ClosedownService", closedown);
app.use("/BizInfoCheckService", bizInfoCheck);
app.use("/EasyFinBankService", easyfinbank);
app.use("/AccountCheckService", accountCheck);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err,
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {},
    });
});

module.exports = app;
