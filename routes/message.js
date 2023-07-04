var express = require("express");
var router = express.Router();
var popbill = require("popbill");

/**
 * 문자 API 모듈 초기화
 */
var messageService = popbill.MessageService();

/**
 * Message API Index 목록
 */
router.get("/", function (req, res, next) {
    res.render("Message/index", {});
});

/**
 * 문자 발신번호 등록여부를 확인합니다.
 * - 발신번호 상태가 "승인"인 경우에만 리턴값 "Response"의 변수 "code"가 1로 반환됩니다.
 * - https://developers.popbill.com/reference/sms/node/api/sendnum#CheckSenderNumber
 */
router.get("/CheckSenderNumber", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 확인할 발신번호
    var senderNumber = "";

    messageService.checkSenderNumber(
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
 * 발신번호를 등록하고 내역을 확인하는 문자 발신번호 관리 페이지 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/sms/node/api/sendnum#GetSenderNumberMgtURL
 */
router.get("/GetSenderNumberMgtURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    messageService.getSenderNumberMgtURL(
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
 * 팝빌에 등록한 연동회원의 문자 발신번호 목록을 확인합니다.
 * - https://developers.popbill.com/reference/sms/node/api/sendnum#GetSenderNumberList
 */
router.get("/GetSenderNumberList", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    messageService.getSenderNumberList(
        CorpNum,
        function (result) {
            res.render("Message/SenderNumberList", {
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
 * 최대 90byte의 단문(SMS) 메시지 1건 전송을 팝빌에 접수합니다.
 * - https://developers.popbill.com/reference/sms/node/api/send#SendSMSOne
 */
router.get("/SendSMS", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 발신번호
    var sendNum = "";

    // 발신자명
    var sendName = "발신자명";

    // 수신번호
    var receiveNum = "01012341234";

    // 수신자명
    var receiveName = "수신자명";

    // 메시지 내용, 90Byte 초과시 길이가 조정되어 전송
    var contents = "SMS 단건전송 메시지 테스트";

    // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
    var reserveDT = "";

    // 광고성 메시지 여부 ( true , false 중 택 1)
    // └ true = 광고 , false = 일반
    // - 미입력 시 기본값 false 처리
    var adsYN = false;

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    messageService.sendSMS(
        CorpNum,
        sendNum,
        receiveNum,
        receiveName,
        contents,
        reserveDT,
        adsYN,
        sendName,
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
 * 최대 90byte의 단문(SMS) 메시지 다수건 전송을 팝빌에 접수합니다. (최대 1,000건)
 * - 모든 수신자에게 동일한 내용을 전송하거나(동보전송), 수신자마다 개별 내용을 전송할 수 있습니다(대량전송).
 * - https://developers.popbill.com/reference/sms/node/api/send#SendSMSAll
 */
router.get("/SendSMS_multi", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 발신번호(동보전송용)
    var sendNum = "";

    // 메시지 내용(동보전송용), 90Byte 초과시 길이가 조정되어 전송
    var contents = "동보전송 메시지";

    // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
    var reserveDT = "";

    // 광고성 메시지 여부 ( true , false 중 택 1)
    // └ true = 광고 , false = 일반
    // - 미입력 시 기본값 false 처리
    var adsYN = false;

    // 개별전송정보 배열, 최대 1000건
    var Messages = [
        {
            Sender: "", // 발신번호, 개별전송정보 배열에 발신자번호(Sender)가 없는 경우 동보전송 발신번호로 전송
            SenderName: "발신자명", // 발신자명
            Receiver: "", // 수신번호
            ReceiverName: "수신자명1", // 수신자명
            Contents: "문자 메시지 내용1", // 메시지 내용, 90Byte 초과시 길이가 조정되어 전송
            // 개벌전송정보 배열에 메시지내용(Contents)이 없는경우 동보전송 메시지내용로 전송
            interOPRefKey: "20220629-SMS001", // 파트너 지정키, 수신자 구별용 메모
        },
        {
            Sender: "", // 발신번호, 개별전송정보 배열에 발신자번호(Sender)가 없는 경우 동보전송 발신번호로 전송
            SenderName: "발신자명", // 발신자명
            Receiver: "", // 수신번호
            ReceiverName: "수신자명2", // 수신자명
            Contents: "문자 메시지 내용2", // 메시지 내용, 90Byte 초과시 길이가 조정되어 전송
            // 개벌전송정보 배열에 메시지내용(Contents)이 없는경우 동보전송 메시지내용로 전송
            interOPRefKey: "20220629-SMS002", // 파트너 지정키, 수신자 구별용 메모
        },
    ];

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    messageService.sendSMS_multi(
        CorpNum,
        sendNum,
        contents,
        Messages,
        reserveDT,
        adsYN,
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
 * 최대 2,000byte의 장문(LMS) 메시지 1건 전송을 팝빌에 접수합니다.
 * - https://developers.popbill.com/reference/sms/node/api/send#SendLMSOne
 */
router.get("/SendLMS", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 발신번호
    var sendNum = "";

    // 발신자명
    var sendName = "발신자명";

    // 수신번호
    var receiveNum = "01012341234";

    // 수신자명
    var receiveName = "수신자명";

    // 메시지 제목
    var subject = "장문 메시지 제목";

    // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
    var contents = "LMS 단건전송 테스트";

    // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
    var reserveDT = "";

    // 광고성 메시지 여부 ( true , false 중 택 1)
    // └ true = 광고 , false = 일반
    // - 미입력 시 기본값 false 처리
    var adsYN = false;

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    messageService.sendLMS(
        CorpNum,
        sendNum,
        receiveNum,
        receiveName,
        subject,
        contents,
        reserveDT,
        adsYN,
        sendName,
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
 * 최대 2,000byte의 장문(LMS) 메시지 다수건 전송을 팝빌에 접수합니다. (최대 1,000건)
 * - 모든 수신자에게 동일한 내용을 전송하거나(동보전송), 수신자마다 개별 내용을 전송할 수 있습니다(대량전송).
 * - https://developers.popbill.com/reference/sms/node/api/send#SendLMSAll
 */
router.get("/SendLMS_multi", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 발신번호
    var sendNum = "";

    // 메시지 제목
    var subject = "장문 메시지 제목";

    // 메시지 내용(동보전송용), 2000byte 초과시 길이가 조정되어 전송
    var contents = "LMS 대량전송 테스트";

    // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
    var reserveDT = "";

    // 광고성 메시지 여부 ( true , false 중 택 1)
    // └ true = 광고 , false = 일반
    // - 미입력 시 기본값 false 처리
    var adsYN = false;

    // 개별전송정보 배열, 최대 1000건
    var Messages = [
        {
            Sender: "", // 발신번호, 개별전송정보 배열에 발신자번호(Sender) 항목이 없는 경우 동보전송 발신번호로 전송
            SenderName: "발신자명1", // 발신자명
            Receiver: "", // 수신번호
            ReceiverName: "수신자명1", // 수신자명
            Subject: "메시지 제목1", // 메시지 제목
            Contents: "문자 메시지 내용1", // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송,
            // 개벌전송정보 배열에 메시지내용(Contents)항목 없는경우 동보전송 메시지내용로 전송
            interOPRefKey: "20220629-LMS001", // 파트너 지정키, 수신자 구별용 메모
        },
        {
            Sender: "", // 발신번호
            SenderName: "발신자명2", // 발신자명
            Receiver: "", // 수신번호
            ReceiverName: "수신자명2", // 수신자명
            Subject: "메시지 제목2", // 메시지 제목, 2000Byte 초과시 길이가 조정되어 전송
            Contents:
                "문자 메시지 내용 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 ", // 메시지 내용
            interOPRefKey: "20220629-LMS002", // 파트너 지정키, 수신자 구별용 메모
        },
    ];

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    messageService.sendLMS_multi(
        CorpNum,
        sendNum,
        subject,
        contents,
        Messages,
        reserveDT,
        adsYN,
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
 * 최대 2,000byte의 메시지와 이미지로 구성된 포토문자(MMS) 1건 전송을 팝빌에 접수합니다.
 * - 이미지 파일 포맷/규격 : 최대 300Kbyte(JPEG, JPG), 가로/세로 1,000px 이하 권장
 * - https://developers.popbill.com/reference/sms/node/api/send#SendMMSOne
 */
router.get("/SendMMS", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 발신번호
    var sendNum = "";

    // 수신번호
    var receiveNum = "01012341234";

    // 수신자명
    var receiveName = "수신자명";

    // 메시지 제목
    var subject = "MMS 메시지 제목";

    // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
    var contents = "MMS 단건전송 테스트";

    // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
    var reserveDT = "";

    // 광고성 메시지 여부 ( true , false 중 택 1)
    // └ true = 광고 , false = 일반
    // - 미입력 시 기본값 false 처리
    var adsYN = false;

    // MMS 이미지 파일경로, 최대 300Kbyte, JPEG 포맷
    var filePaths = ["./fmsImage.jpg"];

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    messageService.sendMMS(
        CorpNum,
        sendNum,
        receiveNum,
        receiveName,
        subject,
        contents,
        filePaths,
        reserveDT,
        adsYN,
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
 * 최대 2,000byte의 메시지와 이미지로 구성된 포토문자(MMS) 다수건 전송을 팝빌에 접수합니다. (최대 1,000건)
 * - 모든 수신자에게 동일한 내용을 전송하거나(동보전송), 수신자마다 개별 내용을 전송할 수 있습니다(대량전송).
 * - 이미지 파일 포맷/규격 : 최대 300Kbyte(JPEG), 가로/세로 1,000px 이하 권장
 * - https://developers.popbill.com/reference/sms/node/api/send#SendMMSAll
 */
router.get("/SendMMS_multi", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 발신번호(동보전송용)
    var senderNum = "";

    // 메시지 제목(동보전송용)
    var subject = "장문 메시지 제목";

    // 메시지 내용(동보전송용), 2000Byte 초과시 길이가 조정되어 전송
    var contents =
        "MMS 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 대한사람 대한으로";

    // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
    var reserveDT = "";

    // 광고성 메시지 여부 ( true , false 중 택 1)
    // └ true = 광고 , false = 일반
    // - 미입력 시 기본값 false 처리
    var adsYN = false;

    // MMS 이미지 파일경로, 최대 300Kbyte, JPEG 포맷
    var filePaths = ["./fmsimage.jpg"];

    // 개별전송정보, 최대 1000건
    var Messages = [
        {
            Sender: "", // 발신번호
            SenderName: "발신자명", // 발신자명
            Receiver: "", // 수신번호
            ReceiverName: "수신자명",
            Subject: "MMS 테스트 제목1",
            Contents: "MMS 전송 테스트 내용1", // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
            interOPRefKey: "20220629-MMS001", // 파트너 지정키, 수신자 구별용 메모
        },
        {
            Sender: "", // 발신번호
            SenderName: "발신자명", // 발신자명
            Receiver: "", // 수신번호
            ReceiverName: "수신자명",
            Subject: "MMS 테스트 제목2",
            Contents:
                "MMS 전송 테스트 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만 무궁화 삼천리 화려강산 ", // 메시지 내용, 2000Byte 초과시 길이가 조정되어 전송
            interOPRefKey: "20220629-MMS001", // 파트너 지정키, 수신자 구별용 메모
        },
    ];

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    messageService.sendMMS_multi(
        CorpNum,
        senderNum,
        subject,
        contents,
        Messages,
        filePaths,
        reserveDT,
        adsYN,
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
 * 메시지 크기(90byte)에 따라 단문/장문(SMS/LMS)을 자동으로 인식하여 1건의 메시지를 전송을 팝빌에 접수합니다.
 * - 단문(SMS) = 90byte 이하의 메시지, 장문(LMS) = 2000byte 이하의 메시지.
 * - https://developers.popbill.com/reference/sms/node/api/send#SendXMSOne
 */
router.get("/SendXMS", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 발신번호
    var sendNum = "";

    // 발신자명
    var sendName = "발신자명";

    // 수신번호
    var receiveNum = "01012341234";

    // 수신자명
    var receiveName = "수신자명";

    // 메시지 제목
    var subject = "자동인식 문자전송 제목";

    // 메시지 내용, 길이에 따라 90Byte 기준으로 단/장문 자동인식되어 전송 됨.
    var contents = "XMS 자동인식 단건전송";

    // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
    var reserveDT = "";

    // 광고성 메시지 여부 ( true , false 중 택 1)
    // └ true = 광고 , false = 일반
    // - 미입력 시 기본값 false 처리
    var adsYN = false;

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    messageService.sendXMS(
        CorpNum,
        sendNum,
        receiveNum,
        receiveName,
        subject,
        contents,
        reserveDT,
        adsYN,
        sendName,
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
 * 메시지 크기(90byte)에 따라 단문/장문(SMS/LMS)을 자동으로 인식하여 다수건의 메시지 전송을 팝빌에 접수합니다. (최대 1,000건)
 * - 모든 수신자에게 동일한 내용을 전송하거나(동보전송), 수신자마다 개별 내용을 전송할 수 있습니다(대량전송).
 * - 단문(SMS) = 90byte 이하의 메시지, 장문(LMS) = 2000byte 이하의 메시지.
 * - https://developers.popbill.com/reference/sms/node/api/send#SendXMSAll
 */
router.get("/SendXMS_multi", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 발신번호(동보전송용)
    var sendNum = "";

    // 메시지 제목(동보전송용)
    var subject = "자동인식 문자전송 제목";

    // 메시지 내용, 길이에 따라 90Byte 기준으로 단/장문 자동인식되어 전송 됨.
    var contents =
        "XMS 자동인식 단건전송 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 대한사람 대한으로";

    // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
    var reserveDT = "";

    // 광고성 메시지 여부 ( true , false 중 택 1)
    // └ true = 광고 , false = 일반
    // - 미입력 시 기본값 false 처리
    var adsYN = false;

    // 개별전송정보 배열, 최대 1000건
    var Messages = [
        {
            Sender: "", // 발신번호
            SenderName: "발신자명", // 발신자명
            Receiver: "", // 수신번호
            ReceiverName: "수신자명", // 수신자명
            Subject: "메시지 제목1", // 메시지 제목
            Contents: "문자 메시지 내용1", // 메시지 내용, 90Byte 기준으로 SMS/LMS 자동인식되어 전송
            interOPRefKey: "20220629-XMS001", // 파트너 지정키, 수신자 구별용 메모
        },
        {
            Sender: "", // 발신번호
            SenderName: "발신자명", // 발신자명
            Receiver: "", // 수신번호
            ReceiverName: "수신자명", // 수신자명
            Subject: "메시지 제목2", // 메시지 제목
            // 메시지 내용, 90Byte 기준으로 SMS/LMS 자동인식되어 전송
            Contents:
                "단/장문 자동인식 문자전송 내용 동해물과 백두산이 마르고 닳도록 하느님이 보호하사 우리나라만세 무궁화 삼천리 화려강산 ",
            interOPRefKey: "20220629-XMS001", // 파트너 지정키, 수신자 구별용 메모
        },
    ];

    // 전송요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "20221221123456";

    messageService.sendXMS_multi(
        CorpNum,
        sendNum,
        subject,
        contents,
        Messages,
        reserveDT,
        adsYN,
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
 * 팝빌에서 반환받은 접수번호를 통해 예약접수된 문자 메시지 전송을 취소합니다. (예약시간 10분 전까지 가능)
 * - https://developers.popbill.com/reference/sms/node/api/send#CancelReserve
 */
router.get("/CancelReserve", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문자전송 접수번호
    var receiptNum = "021010911000000010";

    messageService.cancelReserve(
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
 * 파트너가 할당한 전송요청 번호를 통해 예약접수된 문자 전송을 취소합니다. (예약시간 10분 전까지 가능)
 * - https://developers.popbill.com/reference/sms/node/api/send#CancelReserveRN
 */
router.get("/CancelReserveRN", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문자전송 요청번호
    var requestNum = "20221221123456";

    messageService.cancelReserveRN(
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
 * 팝빌에서 반환받은 접수번호와 수신번호를 통해 예약접수된 문자 메시지 전송을 취소합니다. (예약시간 10분 전까지 가능)
 * - https://developers.popbill.com/reference/sms/node/api/send#CancelReservebyRCV
 */
router.get("/CancelReservebyRCV", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    // 문자전송 접수번호
    var receiptNum = "";

    // 문자전송 수신번호
    var receiveNum = "01012341234";

    messageService.cancelReservebyRCV(
        CorpNum,
        receiptNum,
        receiveNum,
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
 * 파트너가 할당한 전송요청 번호와 수신번호를 통해 예약접수된 문자 전송을 취소합니다. (예약시간 10분 전까지 가능)
 * - https://developers.popbill.com/reference/sms/node/api/send#CancelReserveRNbyRCV
 */
router.get("/CancelReserveRNbyRCV", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    // 문자전송 요청번호
    var requestNum = "20221221123456";

    // 문자전송 수신번호
    var receiveNum = "01012341234";

    messageService.cancelReserveRNbyRCV(
        CorpNum,
        requestNum,
        receiveNum,
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
 * 팝빌에서 반환받은 접수번호를 통해 문자 전송상태 및 결과를 확인합니다.
 * - https://developers.popbill.com/reference/sms/node/api/info#GetMessages
 */
router.get("/GetMessages", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문자전송 접수번호
    var receiptNum = "022070115000000018";

    messageService.getMessages(
        CorpNum,
        receiptNum,
        function (result) {
            res.render("Message/SentMessage", {
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
 * 파트너가 할당한 전송요청 번호를 통해 문자 전송상태 및 결과를 확인합니다.
 * - https://developers.popbill.com/reference/sms/node/api/info#GetMessagesRN
 */
router.get("/GetMessagesRN", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문자전송 요청번호
    var requestNum = "20221221123456";

    messageService.getMessagesRN(
        CorpNum,
        requestNum,
        function (result) {
            res.render("Message/SentMessage", {
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
 * 검색조건에 해당하는 문자 전송내역을 조회합니다. (조회기간 단위 : 최대 2개월)
 * - 문자 접수일시로부터 6개월 이내 접수건만 조회할 수 있습니다.
 * - https://developers.popbill.com/reference/sms/node/api/info#Search
 */
router.get("/Search", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 검색시작일자, 날짜형식(yyyyMMdd)
    var SDate = "20220601";

    // 검색종료일자, 날짜형식(yyyyMMdd)
    var EDate = "20220629";

    // 전송상태 배열 ("1" , "2" , "3" , "4" 중 선택, 다중 선택 가능)
    // └ 1 = 대기 , 2 = 성공 , 3 = 실패 , 4 = 취소
    // - 미입력 시 전체조회
    var State = [1, 2, 3, 4];

    // 검색대상 배열 ("SMS" , "LMS" , "MMS" 중 선택, 다중 선택 가능)
    // └ SMS = 단문 , LMS = 장문 , MMS = 포토문자
    // - 미입력 시 전체조회
    var Item = ["SMS", "LMS", "MMS"];

    // 예약여부 (false , true 중 택 1)
    // └ false = 전체조회, true = 예약전송건 조회
    // - 미입력시 기본값 false 처리
    var ReserveYN = false;

    // 개인조회 여부 (false , true 중 택 1)
    // └ false = 접수한 문자 전체 조회 (관리자권한)
    // └ true = 해당 담당자 계정으로 접수한 문자만 조회 (개인권한)
    // - 미입력시 기본값 false 처리
    var SenderYN = false;

    // 정렬방향, D-내림차순, A-오름차순
    var Order = "D";

    // 페이지번호
    var Page = 1;

    // 페이지 목록개수, 최대 1000건
    var PerPage = 30;

    // 조회하고자 하는 발신자명 또는 수신자명
    // - 미입력시 전체조회
    var Qstring = "";

    messageService.search(
        CorpNum,
        SDate,
        EDate,
        State,
        Item,
        ReserveYN,
        SenderYN,
        Order,
        Page,
        PerPage,
        Qstring,
        function (result) {
            res.render("Message/search", {
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
 * 문자 전송내역 확인 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/sms/node/api/info#GetSentListURL
 */
router.get("/GetSentListURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    messageService.getSentListURL(
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
 * 전용 080 번호에 등록된 수신거부 목록을 반환합니다.
 * - https://developers.popbill.com/reference/sms/node/api/info#GetAutoDenyList
 */
router.get("/GetAutoDenyList", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    messageService.getAutoDenyList(
        CorpNum,
        function (response) {
            res.render("Message/AutoDenyList", {
                path: req.path,
                result: response,
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetBalance
 */
router.get("/GetBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    messageService.getBalance(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetChargeURL
 */
router.get("/GetChargeURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    messageService.getChargeURL(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetPaymentURL
 */
router.get("/GetPaymentURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    messageService.getPaymentURL(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetUseHistoryURL
 */
router.get("/GetUseHistoryURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    messageService.getUseHistoryURL(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetPartnerBalance
 */
router.get("/GetPartnerBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    messageService.getPartnerBalance(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetPartnerURL
 */
router.get("/GetPartnerURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // CHRG(포인트충전)
    var TOGO = "CHRG";

    messageService.getPartnerURL(
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
 * 문자 전송시 과금되는 포인트 단가를 확인합니다.
 * - https://developers.popbill.com/reference/sms/node/api/point#GetUnitCost
 */
router.get("/GetUnitCost", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문자전송유형, SMS(단문), LMS(장문), MMS(포토)
    var messageType = popbill.MessageType.LMS;

    messageService.getUnitCost(
        CorpNum,
        messageType,
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
 * 팝빌 문자 API 서비스 과금정보를 확인합니다.
 * - https://developers.popbill.com/reference/sms/node/api/point#GetChargeInfo
 */
router.get("/GetChargeInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문자전송유형, SMS(단문), LMS(장문), MMS(포토)
    var messageType = popbill.MessageType.SMS;

    messageService.getChargeInfo(
        CorpNum,
        messageType,
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
 * - https://developers.popbill.com/reference/sms/node/api/member#CheckIsMember
 */
router.get("/CheckIsMember", function (req, res, next) {
    // 조회할 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    messageService.checkIsMember(
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
 * - https://developers.popbill.com/reference/sms/node/api/member#CheckID
 */
router.get("/CheckID", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var testID = "testkorea";

    messageService.checkID(
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
 * - https://developers.popbill.com/reference/sms/node/api/member#JoinMember
 */
router.get("/JoinMember", function (req, res, next) {
    // 회원정보
    var joinInfo = {
        // 회원 아이디 (6자 이상 50자 미만)
        ID: "userid",

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: "asdf8536!@#",

        // 링크아이디
        LinkID: messageService._config.LinkID,

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

    messageService.joinMember(
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
 * - https://developers.popbill.com/reference/sms/node/api/member#GetAccessURL
 */
router.get("/GetAccessURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    messageService.getAccessURL(
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
 * 연동회원 사업자번호에 담당자(팝빌 로그인 계정)를 추가합니다.
 * - https://developers.popbill.com/reference/sms/node/api/member#RegistContact
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

    messageService.registContact(
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
 * - https://developers.popbill.com/reference/sms/node/api/member#GetContactInfo
 */
router.get("/GetContactInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 확인할 담당자 아이디
    var contactID = "checkContactID";

    messageService.getContactInfo(
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
 * - https://developers.popbill.com/reference/sms/node/api/member#ListContact
 */
router.get("/ListContact", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    messageService.listContact(
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
 * - https://developers.popbill.com/reference/sms/node/api/member#UpdateContact
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

    messageService.updateContact(
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
 * 연동회원의 회사정보를 확인합니다.
 * - https://developers.popbill.com/reference/sms/node/api/member#GetCorpInfo
 */
router.get("/GetCorpInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    messageService.getCorpInfo(
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
 * - https://developers.popbill.com/reference/sms/node/api/member#UpdateCorpInfo
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

    messageService.updateCorpInfo(
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
 * 팝빌회원에 등록된 080 수신거부 번호 정보를 확인합니다.
 * - https://developers.popbill.com/reference/sms/node/api/info#CheckAutoDenyNumber
 */
router.get("/CheckAutoDenyNumber", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    messageService.checkAutoDenyNumber(
        CorpNum,
        function (result) {
            res.render("Message/AutoDenyNumber", {
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
 * 연동회원 포인트 충전을 위해 무통장입금을 신청합니다.
 * - https://developers.popbill.com/reference/sms/node/api/point#PaymentRequest
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

    messageService.paymentRequest(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetSettleResult
 */
router.get("/GetSettleResult", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 정산코드 - PaymentRequest 호출시 반환되는 값
    var SettleCode = "202305120000000035";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    messageService.getSettleResult(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetPaymentHistory
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

    messageService.getPaymentHistory(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetUseHistory
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

    messageService.getUseHistory(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#Refund
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

    messageService.refund(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetRefundHistory
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

    messageService.getRefundHistory(
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
 * - https://developers.popbill.com/reference/sms/node/api/member#QuitMember
 */
router.get("/QuitMember", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 탈퇴 사유
    var QuitReason = "탈퇴 사유";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    messageService.quitMember(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetRefundableBalance
 */
router.get("/GetRefundableBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    messageService.getRefundableBalance(
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
 * - https://developers.popbill.com/reference/sms/node/api/point#GetRefundInfo
 */
router.get("/GetRefundInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 환불 코드
    var RefundCode = "023040000017";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    messageService.getRefundInfo(
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
