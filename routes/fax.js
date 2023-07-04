var express = require("express");
var router = express.Router();
var popbill = require("popbill");
var https = require("https");

/**
 * 팩스 API 모듈 초기화
 */
var faxService = popbill.FaxService();

/**
 * Fax API Index 목록
 */
router.get("/", function (req, res, next) {
    res.render("Fax/index", {});
});

/**
 * 팩스 발신번호 등록여부를 확인합니다.
 * - 발신번호 상태가 "승인"인 경우에만 리턴값 "Response"의 변수 "code"가 1로 반환됩니다.
 * - https://developers.popbill.com/reference/fax/node/api/sendnum#CheckSenderNumber
 */
router.get("/CheckSenderNumber", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 확인할 발신번호
    var senderNumber = "";

    faxService.checkSenderNumber(
        CorpNum,
        senderNumber,
        function (result) {
            res.render("response", {
                path: req.path,
                code: result.code,
                message: result.message,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 발신번호를 등록하고 내역을 확인하는 팩스 발신번호 관리 페이지 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/sendnum#GetSenderNumberMgtURL
 */
router.get("/GetSenderNumberMgtURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getSenderNumberMgtURL(
        CorpNum,
        UserID,
        function (url) {
            res.render("result", {
                path: req.path,
                result: url,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 팝빌에 등록한 연동회원의 팩스 발신번호 목록을 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/sendnum#GetSenderNumberList
 */
router.get("/GetSenderNumberList", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    faxService.getSenderNumberList(
        CorpNum,
        function (result) {
            res.render("Fax/SenderNumberList", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 팩스 1건을 전송합니다. (최대 전송파일 개수: 20개)
 * - https://developers.popbill.com/reference/fax/node/api/send#SendFAX
 */
router.get("/SendFAX", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 발신번호
    // - 팝빌에 등록되지 않은 번호를 입력하는 경우 "원발신번호"로 팩스 전송됨
    var senderNum = "";

    // 발신자명
    var senderName = "발신자명";

    // 광고팩스 전송여부 , true / false 중 택 1
    // └ true = 광고 , false = 일반
    // └ 미입력 시 기본값 false 처리
    var adsYN = false;

    // 수신팩스번호
    var receiveNum = "01012341234";

    // 수신자명
    var receiveName = "수신자명";

    // 파일경로 배열, 전송개수 촤대 20개
    var filePaths = ["test.jpg"];

    // 팩스제목
    var title = "팩스전송";

    // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
    var reserveDT = "";

    // 전송요청번호
    // 팝빌이 접수 단위를 식별할 수 있도록 파트너가 부여하는 식별번호.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    faxService.sendFax(
        CorpNum,
        senderNum,
        receiveNum,
        receiveName,
        filePaths,
        reserveDT,
        senderName,
        adsYN,
        title,
        requestNum,
        function (receiptNum) {
            res.render("result", {
                path: req.path,
                result: receiptNum,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 동일한 팩스파일을 다수의 수신자에게 전송하기 위해 팝빌에 접수합니다. (최대 전송파일 개수 : 20개) (최대 1,000건)
 * - https://developers.popbill.com/reference/fax/node/api/send#SendFAXSame
 */
router.get("/SendFAX_multi", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 발신번호
    // - 팝빌에 등록되지 않은 번호를 입력하는 경우 "원발신번호"로 팩스 전송됨
    var senderNum = "";

    // 발신자명
    var senderName = "발신자명";

    // 파일경로 배열, 전송개수 촤대 20개
    var filePaths = ["test.jpg", "test.jpg"];

    // 수신자정보 배열, 최대 1000건
    var Receivers = [
        {
            receiveName: "수신자명1", // 수신자명
            receiveNum: "", // 수신팩스번호
            interOPRefKey: "20220629-FAX001", // 파트너 지정키, 수신자 구별용 메모
        },
        {
            receiveName: "수신자명2",
            receiveNum: "",
            interOPRefKey: "20220629-FAX002", // 파트너 지정키, 수신자 구별용 메모
        },
    ];

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = "";

    // 광고팩스 전송여부 , true / false 중 택 1
    // └ true = 광고 , false = 일반
    // └ 미입력 시 기본값 false 처리
    var adsYN = false;

    // 팩스제목
    var title = "팩스대량전송";

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    faxService.sendFax(
        CorpNum,
        senderNum,
        Receivers,
        "",
        filePaths,
        reserveDT,
        senderName,
        adsYN,
        title,
        requestNum,
        function (receiptNum) {
            res.render("result", {
                path: req.path,
                result: receiptNum,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 전송할 파일의 바이너리 데이터를 팩스 1건 전송합니다. (최대 전송파일 개수: 20개)
 * - https://developers.popbill.com/reference/fax/node/api/send#SendFaxBinary
 */
router.get("/SendFAXBinary", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 발신번호
    // - 팝빌에 등록되지 않은 번호를 입력하는 경우 "원발신번호"로 팩스 전송됨
    var senderNum = "";

    // 발신자명
    var senderName = "발신자명";

    // 광고팩스 전송여부 , true / false 중 택 1
    // └ true = 광고 , false = 일반
    // └ 미입력 시 기본값 false 처리
    var adsYN = false;

    // 수신팩스번호
    var receiveNum = "01012341234";

    // 수신자명
    var receiveName = "수신자명";

    // 팩스제목
    var title = "팩스전송";

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = "";

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    var targeturl = "";

    https
        .get(targeturl, function (response) {
            var data = [];
            response
                .on("data", function (chunk) {
                    data.push(chunk);
                })
                .on("end", function () {
                    if (response.statusCode === 200) {
                        var binary = Buffer.concat(data);

                        // Binary 파일정보 배열, 전송개수 촤대 20개
                        var BinaryFiles = [];
                        BinaryFiles.push({
                            // 파일명
                            fileName: "20210801_01.jpg",
                            // 파일데이터
                            fileData: binary,
                        });

                        BinaryFiles.push({
                            fileName: "20210801_01.jpg",
                            fileData: binary,
                        });

                        faxService.sendFaxBinary(
                            CorpNum,
                            senderNum,
                            receiveNum,
                            receiveName,
                            BinaryFiles,
                            reserveDT,
                            senderName,
                            adsYN,
                            title,
                            requestNum,
                            function (receiptNum) {
                                res.render("result", {
                                    path: req.path,
                                    result: receiptNum,
                                });
                            },
                            function (Error) {
                                res.render("response", {
                                    path: req.path,
                                    code: Error.code,
                                    message: Error.message,
                                });
                            },
                        );
                    } else {
                        res.render("response", {
                            path: req.path,
                            code: -99999999,
                            message: response.statusCode,
                        });
                    }
                });
        })
        .on("error", function (err) {
            res.render("response", {
                path: req.path,
                code: -99999999,
                message: err.message,
            });
        });
});

/**
 * 팝빌에서 반환받은 접수번호를 통해 팩스 1건을 재전송합니다.
 * - 발신/수신 정보 미입력시 기존과 동일한 정보로 팩스가 전송되고, 접수일 기준 최대 60일이 경과되지 않는 건만 재전송이 가능합니다.
 * - 팩스 재전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - 변환실패 사유로 전송실패한 팩스 접수건은 재전송이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/send#ResendFAX
 */
router.get("/ResendFAX", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팩스 접수번호
    var receiptNum = "021032511132400001";

    // 발신번호, 공백처리시 기존전송정보로 재전송
    var senderNum = "";

    // 발신자명, 공백처리시 기존전송정보로 재전송
    var senderName = "발신자명";

    // 수신번호, 공백처리시 기존전송정보로 재전송
    var receiveNum = "01012341234";

    // 수신자명, 공백처리시 기존전송정보로 재전송
    var receiveName = "";

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = "";

    // 팩스제목
    var title = "팩스재전송";

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.resendFax(
        CorpNum,
        receiptNum,
        senderNum,
        senderName,
        receiveNum,
        receiveName,
        reserveDT,
        UserID,
        title,
        requestNum,
        function (receiptNum) {
            res.render("result", {
                path: req.path,
                result: receiptNum,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 동일한 팩스파일을 다수의 수신자에게 전송하기 위해 팝빌에 접수합니다. (최대 전송파일 개수: 20개) (최대 1,000건)
 * - 발신/수신 정보 미입력시 기존과 동일한 정보로 팩스가 전송되고, 접수일 기준 최대 60일이 경과되지 않는 건만 재전송이 가능합니다.
 * - 팩스 재전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - 변환실패 사유로 전송실패한 팩스 접수건은 재전송이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/send#ResendFAXSame
 */
router.get("/ResendFAX_multi", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팩스 접수번호
    var receiptNum = "022070116355600001";

    // 발신번호, 공백처리시 기존전송정보로 재전송
    var senderNum = "";

    // 발신자명, 공백처리시 기존전송정보로 재전송
    var senderName = "";

    //수신자정보 배열, 최대 1000건
    var Receivers = [
        {
            receiveName: "수신자명1", // 수신자명
            receiveNum: "", // 수신팩스번호
            interOPRefKey: "20220629-FAX003", // 파트너 지정키, 수신자 구별용 메모
        },
        {
            receiveName: "수신자명2",
            receiveNum: "",
            interOPRefKey: "20220629-FAX004", // 파트너 지정키, 수신자 구별용 메모
        },
    ];

    // 수신자정보를 기존전송정보와 동일하게 재전송하는 경우 아래코드 적용
    //var Receivers = null;

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = "";

    // 팩스제목
    var title = "팩스재전송 대량 전송";

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var reqeustNum = "";

    faxService.resendFax(
        CorpNum,
        receiptNum,
        senderNum,
        senderName,
        Receivers,
        "",
        reserveDT,
        title,
        reqeustNum,
        function (receiptNum) {
            res.render("result", {
                path: req.path,
                result: receiptNum,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 파트너가 할당한 전송요청 번호를 통해 팩스 1건을 재전송합니다.
 * - 발신/수신 정보 미입력시 기존과 동일한 정보로 팩스가 전송되고, 접수일 기준 최대 60일이 경과되지 않는 건만 재전송이 가능합니다.
 * - 팩스 재전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - 변환실패 사유로 전송실패한 팩스 접수건은 재전송이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/send#ResendFAXRN
 */
router.get("/ResendFAXRN", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 원본 팩스 전송시 할당한 전송요청번호(requestNum)
    var orgRequestNum = "";

    // 발신번호, 공백처리시 기존전송정보로 재전송
    var senderNum = "";

    // 발신자명, 공백처리시 기존전송정보로 재전송
    var senderName = "";

    // 수신번호, 공백처리시 기존전송정보로 재전송
    var receiveNum = "01012341234";

    // 수신자명, 공백처리시 기존전송정보로 재전송
    var receiveName = "";

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = "";

    // 팩스제목
    var title = "팩스재전송 (요청번호할당)";

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var reqeustNum = "";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.resendFaxRN(
        CorpNum,
        orgRequestNum,
        senderNum,
        senderName,
        receiveNum,
        receiveName,
        reserveDT,
        UserID,
        title,
        reqeustNum,
        function (receiptNum) {
            res.render("result", {
                path: req.path,
                result: receiptNum,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 파트너가 할당한 전송요청 번호를 통해 다수건의 팩스를 재전송합니다. (최대 전송파일 개수: 20개) (최대 1,000건)
 * - 발신/수신 정보 미입력시 기존과 동일한 정보로 팩스가 전송되고, 접수일 기준 최대 60일이 경과되지 않는 건만 재전송이 가능합니다.
 * - 팩스 재전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - 변환실패 사유로 전송실패한 팩스 접수건은 재전송이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/send#ResendFAXRNSame
 */
router.get("/ResendFAXRN_multi", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 원본 팩스 전송시 할당한 전송요청번호(requestNum)
    var orgRequestNum = "";

    // 발신번호, 공백처리시 기존전송정보로 재전송
    var senderNum = "";

    // 발신자명, 공백처리시 기존전송정보로 재전송
    var senderName = "";

    //수신자정보 배열, 최대 1000건
    var Receivers = [
        {
            receiveName: "수신자명1", // 수신자명
            receiveNum: "", // 수신팩스번호
            interOPRefKey: "20220629-FAX005", // 파트너 지정키, 수신자 구별용 메모
        },
        {
            receiveName: "수신자명2",
            receiveNum: "",
            interOPRefKey: "20220629-FAX006", // 파트너 지정키, 수신자 구별용 메모
        },
    ];
    // 수신자정보를 기존전송정보와 동일하게 재전송하는 경우 아래코드 적용
    //var Receivers = null;

    // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = "";

    // 팩스제목
    var title = "팩스재전송 대량 전송 (요청번호할당)";

    // 팩스 접수번호
    var reqeustNum = "";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.resendFaxRN(
        CorpNum,
        orgRequestNum,
        senderNum,
        senderName,
        Receivers,
        "",
        reserveDT,
        UserID,
        title,
        reqeustNum,
        function (receiptNum) {
            res.render("result", {
                path: req.path,
                result: receiptNum,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 팝빌에서 반환받은 접수번호를 통해 예약접수된 팩스 전송을 취소합니다. (예약시간 10분 전까지 가능)
 * - https://developers.popbill.com/reference/fax/node/api/send#CancelReserve
 */
router.get("/CancelReserve", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팩스전송 접수번호
    var receiptNum = "018092811330600001";

    faxService.cancelReserve(
        CorpNum,
        receiptNum,
        function (result) {
            res.render("response", {
                path: req.path,
                code: result.code,
                message: result.message,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 파트너가 할당한 전송요청 번호를 통해 예약접수된 팩스 전송을 취소합니다. (예약시간 10분 전까지 가능)
 * - https://developers.popbill.com/reference/fax/node/api/send#CancelReserveRN
 */
router.get("/CancelReserveRN", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팩스전송 요청번호
    var requestNum = "20221221123456";

    faxService.cancelReserveRN(
        CorpNum,
        requestNum,
        function (result) {
            res.render("response", {
                path: req.path,
                code: result.code,
                message: result.message,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 팝빌에서 반환 받은 접수번호를 통해 팩스 전송상태 및 결과를 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/info#GetFaxResult
 */
router.get("/GetFaxResult", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팩스전송 접수번호
    var receiptNum = "022070116363600001";

    faxService.getFaxResult(
        CorpNum,
        receiptNum,
        function (result) {
            res.render("Fax/FaxResult", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 파트너가 할당한 전송요청 번호를 통해 팩스 전송상태 및 결과를 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/info#GetFaxResultRN
 */
router.get("/GetFaxResultRN", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팩스전송 요청번호
    var requestNum = "20221221123456";

    faxService.getFaxResultRN(
        CorpNum,
        requestNum,
        function (result) {
            res.render("Fax/FaxResult", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 검색조건에 해당하는 팩스 전송내역 목록을 조회합니다. (조회기간 단위 : 최대 2개월)
 * - 팩스 접수일시로부터 2개월 이내 접수건만 조회할 수 있습니다.
 * - https://developers.popbill.com/reference/fax/node/api/info#Search
 */
router.get("/Search", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 시작일자, 날짜형식(yyyyMMdd)
    var SDate = "20220601";

    // 종료일자, 날짜형식(yyyyMMdd)
    var EDate = "20220629";

    // 전송상태 배열 ("1" , "2" , "3" , "4" 중 선택, 다중 선택 가능)
    // └ 1 = 대기 , 2 = 성공 , 3 = 실패 , 4 = 취소
    // - 미입력 시 전체조회
    var State = [1, 2, 3, 4];

    // 예약여부 (false , true 중 택 1)
    // └ false = 전체조회, true = 예약전송건 조회
    // - 미입력시 기본값 false 처리
    var ReserveYN = false;

    // 개인조회 여부 (false , true 중 택 1)
    // false = 접수한 팩스 전체 조회 (관리자권한)
    // true = 해당 담당자 계정으로 접수한 팩스만 조회 (개인권한)
    // 미입력시 기본값 false 처리
    var SenderOnly = false;

    // 정렬방향, D-내림차순, A-오름차순
    var Order = "D";

    // 페이지 번호
    var Page = 1;

    // 페이지당 검색개수, 최대 1000건
    var PerPage = 10;

    // 조회하고자 하는 발신자명 또는 수신자명
    // - 미입력시 전체조회
    var QString = "";

    faxService.search(
        CorpNum,
        SDate,
        EDate,
        State,
        ReserveYN,
        SenderOnly,
        Order,
        Page,
        PerPage,
        QString,
        function (result) {
            res.render("Fax/Search", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 팝빌 사이트와 동일한 팩스 전송내역 확인 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/info#GetSentListURL
 */
router.get("/GetSentListURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getSentListURL(
        CorpNum,
        UserID,
        function (url) {
            res.render("result", {
                path: req.path,
                result: url,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 팩스 미리보기 팝업 URL을 반환하며, 팩스전송을 위한 TIF 포맷 변환 완료 후 호출 할 수 있습니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/info#GetPreviewURL
 */
router.get("/GetPreviewURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팩스 접수번호
    var receiptNum = "018091015373100001";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getPreviewURL(
        CorpNum,
        receiptNum,
        UserID,
        function (url) {
            res.render("result", {
                path: req.path,
                result: url,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원의 잔여포인트를 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetBalance
 */
router.get("/GetBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    faxService.getBalance(
        CorpNum,
        function (remainPoint) {
            res.render("result", {
                path: req.path,
                result: remainPoint,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetChargeURL
 */
router.get("/GetChargeURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getChargeURL(
        CorpNum,
        UserID,
        function (url) {
            res.render("result", {
                path: req.path,
                result: url,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원 포인트 결제내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetPaymentURL
 */
router.get("/GetPaymentURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getPaymentURL(
        CorpNum,
        UserID,
        function (url) {
            res.render("result", {
                path: req.path,
                result: url,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원 포인트 사용내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetUseHistoryURL
 */
router.get("/GetUseHistoryURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getUseHistoryURL(
        CorpNum,
        UserID,
        function (url) {
            res.render("result", {
                path: req.path,
                result: url,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 파트너의 잔여포인트를 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetPartnerBalance
 */
router.get("/GetPartnerBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    faxService.getPartnerBalance(
        CorpNum,
        function (remainPoint) {
            res.render("result", {
                path: req.path,
                result: remainPoint,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 파트너 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetPartnerURL
 */
router.get("/GetPartnerURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // CHRG(포인트충전)
    var TOGO = "CHRG";

    faxService.getPartnerURL(
        CorpNum,
        TOGO,
        function (url) {
            res.render("result", {
                path: req.path,
                result: url,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 팩스 전송시 과금되는 포인트 단가를 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetUnitCost
 */
router.get("/GetUnitCost", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 수신번호 유형, 일반 / 지능 중 택 1
    var receiveNumType = "지능";

    faxService.getUnitCost(
        CorpNum,
        receiveNumType,
        function (unitCost) {
            res.render("result", {
                path: req.path,
                result: unitCost,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 팝빌 팩스 API 서비스 과금정보를 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetChargeInfo
 */
router.get("/GetChargeInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 수신번호 유형, 일반 / 지능 중 택 1
    var receiveNumType = "지능";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getChargeInfo(
        CorpNum,
        receiveNumType,
        UserID,
        function (result) {
            res.render("Base/getChargeInfo", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 사업자번호를 조회하여 연동회원 가입여부를 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/member#CheckIsMember
 */
router.get("/CheckIsMember", function (req, res, next) {
    // 조회할 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    faxService.checkIsMember(
        CorpNum,
        function (result) {
            res.render("response", {
                path: req.path,
                code: result.code,
                message: result.message,
            });
        },
        function (Error) {
            res.render("response", {
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 사용하고자 하는 아이디의 중복여부를 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/member#CheckID
 */
router.get("/CheckID", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var testID = "testkorea";

    faxService.checkID(
        testID,
        function (result) {
            res.render("response", {
                path: req.path,
                code: result.code,
                message: result.message,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 사용자를 연동회원으로 가입처리합니다.
 * - https://developers.popbill.com/reference/fax/node/api/member#JoinMember
 */
router.get("/JoinMember", function (req, res, next) {
    // 회원정보
    var joinInfo = {
        // 회원 아이디 (6자 이상 50자 미만)
        ID: "userid",

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: "asdf8536!@#",

        // 링크아이디
        LinkID: faxService._config.LinkID,

        // 사업자번호, "-" 제외 10자리
        CorpNum: "1234567890",

        // 대표자명 (최대 100자)
        CEOName: "대표자성명",

        // 상호 (최대 200자)
        CorpName: "테스트상호",

        // 주소 (최대 300자)
        Addr: "주소",

        // 업태 (최대 100자)
        BizType: "업태",

        // 종목 (최대 100자)
        BizClass: "업종",

        // 담당자 성명 (최대 100자)
        ContactName: "담당자 성명",

        // 담당자 이메일 (최대 20자)
        ContactEmail: "",

        // 담당자 연락처 (최대 20자)
        ContactTEL: "",
    };

    faxService.joinMember(
        joinInfo,
        function (result) {
            res.render("response", {
                path: req.path,
                code: result.code,
                message: result.message,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/member#GetAccessURL
 */
router.get("/GetAccessURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getAccessURL(
        CorpNum,
        UserID,
        function (url) {
            res.render("result", {
                path: req.path,
                result: url,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원의 회사정보를 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/member#GetCorpInfo
 */
router.get("/GetCorpInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    faxService.getCorpInfo(
        CorpNum,
        function (result) {
            res.render("Base/getCorpInfo", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원의 회사정보를 수정합니다
 * - https://developers.popbill.com/reference/fax/node/api/member#UpdateCorpInfo
 */
router.get("/UpdateCorpInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 회사정보
    var corpInfo = {
        // 대표자명 (최대 100자)
        ceoname: "대표자성명_nodejs",

        // 상호 (최대 200자)
        corpName: "업체명_nodejs",

        // 주소 (최대 300자)
        addr: "서구 천변좌로_nodejs",

        // 업태 (최대 100자)
        bizType: "업태_nodejs",

        // 종목 (최대 100자)
        bizClass: "종목_nodejs",
    };

    faxService.updateCorpInfo(
        CorpNum,
        corpInfo,
        function (result) {
            res.render("response", {
                path: req.path,
                code: result.code,
                message: result.message,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원 사업자번호에 담당자(팝빌 로그인 계정)를 추가합니다.
 * - https://developers.popbill.com/reference/fax/node/api/member#RegistContact
 */
router.get("/RegistContact", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 담당자 정보
    var contactInfo = {
        // 아이디 (6자 이상 50자 미만)
        id: "testkorea03033",

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: "asdf8536!@#",

        // 담당자명 (최대 100자)
        personName: "담당자명0309",

        // 연락처 (최대 20자)
        tel: "010-1234-1234",

        // 이메일 (최대 100자)
        email: "test@email.com",

        // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
        searchRole: 3,
    };

    faxService.registContact(
        CorpNum,
        contactInfo,
        function (result) {
            res.render("response", {
                path: req.path,
                code: result.code,
                message: result.message,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보을 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/member#GetContactInfo
 */
router.get("/GetContactInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 확인할 담당자 아이디
    var contactID = "checkContactID";

    faxService.getContactInfo(
        CorpNum,
        contactID,
        function (result) {
            res.render("Base/getContactInfo", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 목록을 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/member#ListContact
 */
router.get("/ListContact", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    faxService.listContact(
        CorpNum,
        function (result) {
            res.render("Base/listContact", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보를 수정합니다.
 * - https://developers.popbill.com/reference/fax/node/api/member#UpdateContact
 */
router.get("/UpdateContact", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    // 담당자 정보 항목
    var contactInfo = {
        // 담당자 아이디
        id: UserID,

        // 담당자명 (최대 100자)
        personName: "담당자명0309",

        // 연락처 (최대 20자)
        tel: "010-1234-1234",

        // 이메일 (최대 100자)
        email: "test@email.com",

        // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
        searchRole: 3,
    };

    faxService.updateContact(
        CorpNum,
        UserID,
        contactInfo,
        function (result) {
            res.render("response", {
                path: req.path,
                code: result.code,
                message: result.message,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원 포인트 충전을 위해 무통장입금을 신청합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#PaymentRequest
 */
router.get("/PaymentRequest", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 입금신청 객체 정보
    var PaymentForm = {
        // 담당자명
        settlerName: "테스트_담당자",

        // 담당자 이메일
        settlerEmail: "damdang@email.com",

        // 담당자 휴대폰
        notifyHP: "01011112222",

        // 입금자명
        paymentName: "입금자_테스트",

        // 결제금액
        settleCost: "1000",
    };

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.paymentRequest(
        CorpNum,
        PaymentForm,
        UserID,
        function (result) {
            res.render("Base/paymentResponse", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원 포인트 무통장 입금신청내역 1건을 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetSettleResult
 */
router.get("/GetSettleResult", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 정산코드 - PaymentRequest 호출시 반환되는 값
    var SettleCode = "202305120000000035";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getSettleResult(
        CorpNum,
        SettleCode,
        UserID,
        function (result) {
            res.render("Base/paymentHistory", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원의 포인트 결제내역을 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetPaymentHistory
 */
router.get("/GetPaymentHistory", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 조회 기간의 시작일자 (형식 : yyyyMMdd)
    var SDate = "20230101";

    // 조회 기간의 종료일자 (형식 : yyyyMMdd)
    var EDate = "20230107";

    // 목록 페이지번호 (기본값 1)
    var Page = 1;

    // 페이지당 표시할 목록 개수 (기본값 500, 최대 1,000)
    var PerPage = 500;

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getPaymentHistory(
        CorpNum,
        SDate,
        EDate,
        Page,
        PerPage,
        UserID,
        function (result) {
            res.render("Base/paymentHistoryResult", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원의 포인트 사용내역을 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetUseHistory
 */
router.get("/GetUseHistory", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 조회 기간의 시작일자 (형식 : yyyyMMdd)
    var SDate = "20230501";

    // 조회 기간의 종료일자 (형식 : yyyyMMdd)
    var EDate = "20230530";

    // 목록 페이지번호 (기본값 1)
    var Page = 1;

    // 페이지당 표시할 목록 개수(기본값 500, 최대 1,000)
    var PerPage = 500;

    // 거래일자를 기준으로 하는 목록 정렬 방향 : "D" / "A" 중 택 1
    var Order = "D";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getUseHistory(
        CorpNum,
        SDate,
        EDate,
        Page,
        PerPage,
        Order,
        UserID,
        function (result) {
            res.render("Base/useHistoryResult", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원 포인트를 환불 신청합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#Refund
 */
router.get("/Refund", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 환불신청 객체정보
    var RefundForm = {
        // 담당자명
        ContactName: "환불_담당자",

        // 담당자 연락처
        TEL: "010-1234-1234",

        // 환불 신청 포인트
        RequestPoint: "100",

        // 은행명
        AccountBank: "국민",

        // 계좌번호
        AccountNum: "123123123-123",

        // 예금주명
        AccountName: "환불_예금주",

        // 환불 사유
        Reason: "환불사유",
    };

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.refund(
        CorpNum,
        RefundForm,
        UserID,
        function (result) {
            res.render("Base/refundResponse", {
                path: req.path,
                code: result.code,
                message: result.message,
                refundCode: result.refundCode,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 연동회원의 포인트 환불신청내역을 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetRefundHistory
 */
router.get("/GetRefundHistory", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 목록 페이지번호
    var Page = 1;

    // 페이지당 검색개수
    var PerPage = 500;

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getRefundHistory(
        CorpNum,
        Page,
        PerPage,
        UserID,
        function (result) {
            res.render("Base/RefundHistoryResult", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 가입된 연동회원의 탈퇴를 요청합니다.
 * - 회원탈퇴 신청과 동시에 팝빌의 모든 서비스 이용이 불가하며, 관리자를 포함한 모든 담당자 계정도 일괄탈퇴 됩니다.
 * - 회원탈퇴로 삭제된 데이터는 복원이 불가능합니다.
 * - 관리자 계정만 회원탈퇴가 가능합니다.
 * - https://developers.popbill.com/reference/fax/node/api/member#QuitMember
 */
router.get("/QuitMember", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 탈퇴 사유
    var QuitReason = "탈퇴 사유";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.quitMember(
        CorpNum,
        QuitReason,
        UserID,
        function (result) {
            res.render("response", {
                path: req.path,
                code: result.code,
                message: result.message,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 환불 가능한 포인트를 확인합니다. (보너스 포인트는 환불가능포인트에서 제외됩니다.)
 * - https://developers.popbill.com/reference/fax/node/api/point#GetRefundableBalance
 */
router.get("/GetRefundableBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getRefundableBalance(
        CorpNum,
        UserID,
        function (result) {
            res.render("Base/getRefundableBalance", {
                path: req.path,
                refundableBalance: result.refundableBalance,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

/**
 * 포인트 환불에 대한 상세정보 1건을 확인합니다.
 * - https://developers.popbill.com/reference/fax/node/api/point#GetRefundInfo
 */
router.get("/GetRefundInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 환불 코드
    var RefundCode = "023040000017";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    faxService.getRefundInfo(
        CorpNum,
        RefundCode,
        UserID,
        function (result) {
            res.render("Base/getRefundInfo", {
                path: req.path,
                result: result,
            });
        },
        function (Error) {
            res.render("response", {
                path: req.path,
                code: Error.code,
                message: Error.message,
            });
        },
    );
});

module.exports = router;
