var express = require("express");
var router = express.Router();
var popbill = require("popbill");

/**
 * 휴폐업조회 API 모듈초기화
 */
var closedownService = popbill.ClosedownService();

/**
 * CloseDown API Index 목록
 */
router.get("/", function (req, res, next) {
    res.render("Closedown/index", {});
});

/**
 * 사업자번호 1건에 대한 휴폐업정보를 확인합니다.
 * - https://developers.popbill.com/reference/closedown/node/api/check#CheckCorpNum
 */
router.get("/CheckCorpNum", function (req, res, next) {
    if (req.query.CorpNum) {
        // 팝빌회원 사업자번호, "-" 제외 10자리
        var CorpNum = "1234567890";

        // 조회 사업자번호
        var checkCorpNum = req.query.CorpNum;

        closedownService.checkCorpNum(
            CorpNum,
            checkCorpNum,
            function (CorpState) {
                res.render("Closedown/CheckCorpNum", {
                    path: req.path,
                    result: CorpState,
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
        var CorpState;
        res.render("Closedown/CheckCorpNum", {
            path: req.path,
            result: CorpState,
        });
    }
});

/**
 * 다수건의 사업자번호에 대한 휴폐업정보를 확인합니다. (최대 1,000건)
 * - https://developers.popbill.com/reference/closedown/node/api/check#CheckCorpNums
 */
router.get("/CheckCorpNums", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 조회 사업자번호 배열, 최대 1000건
    var checkCorpNumList = ["1234567890", "6798700433", "123-12-12312"];

    closedownService.checkCorpNums(
        CorpNum,
        checkCorpNumList,
        function (CorpState) {
            res.render("Closedown/CheckCorpNums", {
                path: req.path,
                result: CorpState,
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetBalance
 */
router.get("/GetBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    closedownService.getBalance(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetChargeURL
 */
router.get("/GetChargeURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    closedownService.getChargeURL(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetPaymentURL
 */
router.get("/GetPaymentURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    closedownService.getPaymentURL(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetUseHistoryURL
 */
router.get("/GetUseHistoryURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    closedownService.getUseHistoryURL(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetPartnerBalance
 */
router.get("/GetPartnerBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    closedownService.getPartnerBalance(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetPartnerURL
 */
router.get("/GetPartnerURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // CHRG(포인트충전)
    var TOGO = "CHRG";

    closedownService.getPartnerURL(
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
 * 휴폐업 조회시 과금되는 포인트 단가를 확인합니다.
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetUnitCost
 */
router.get("/GetUnitCost", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    closedownService.getUnitCost(
        CorpNum,
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
 * 휴폐업조회 API 서비스 과금정보를 확인합니다.
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetChargeInfo
 */
router.get("/GetChargeInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    closedownService.getChargeInfo(
        CorpNum,
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
 * - https://developers.popbill.com/reference/closedown/node/api/member#CheckIsMember
 */
router.get("/CheckIsMember", function (req, res, next) {
    // 조회할 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    closedownService.checkIsMember(
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
 * - https://developers.popbill.com/reference/closedown/node/api/member#CheckID
 */
router.get("/CheckID", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var testID = "testkorea";

    closedownService.checkID(
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
 * - https://developers.popbill.com/reference/closedown/node/api/member#JoinMember
 */
router.get("/JoinMember", function (req, res, next) {
    // 회원정보
    var joinInfo = {
        // 회원 아이디 (6자 이상 50자 미만)
        ID: "userid",

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: "asdf8536!@#",

        // 링크아이디
        LinkID: closedownService._config.LinkID,

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

    closedownService.joinMember(
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
 * - https://developers.popbill.com/reference/closedown/node/api/member#GetAccessURL
 */
router.get("/GetAccessURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    closedownService.getAccessURL(
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
 * - https://developers.popbill.com/reference/closedown/node/api/member#GetCorpInfo
 */
router.get("/GetCorpInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    closedownService.getCorpInfo(
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
 * - https://developers.popbill.com/reference/closedown/node/api/member#UpdateCorpInfo
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

    closedownService.updateCorpInfo(
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
 * - https://developers.popbill.com/reference/closedown/node/api/member#RegistContact
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

    closedownService.registContact(
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
 * - https://developers.popbill.com/reference/closedown/node/api/member#GetContactInfo
 */
router.get("/GetContactInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 확인할 담당자 아이디
    var contactID = "checkContactID";

    closedownService.getContactInfo(
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
 * - https://developers.popbill.com/reference/closedown/node/api/member#ListContact
 */
router.get("/ListContact", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    closedownService.listContact(
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
 * - https://developers.popbill.com/reference/closedown/node/api/member#UpdateContact
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

    closedownService.updateContact(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#PaymentRequest
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

    closedownService.paymentRequest(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetSettleResult
 */
router.get("/GetSettleResult", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 정산코드 - PaymentRequest 호출시 반환되는 값
    var SettleCode = "202305120000000035";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    closedownService.getSettleResult(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetPaymentHistory
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

    closedownService.getPaymentHistory(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetUseHistory
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

    closedownService.getUseHistory(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#Refund
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

    closedownService.refund(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetRefundHistory
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

    closedownService.getRefundHistory(
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
 * 포인트 환불에 대한 상세정보 1건을 확인합니다.
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetRefundInfo
 */
router.get("/GetRefundInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 환불 코드
    var RefundCode = "023040000017";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    closedownService.getRefundInfo(
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

/**
 * 가입된 연동회원의 탈퇴를 요청합니다.
 * - 회원탈퇴 신청과 동시에 팝빌의 모든 서비스 이용이 불가하며, 관리자를 포함한 모든 담당자 계정도 일괄탈퇴 됩니다.
 * - 회원탈퇴로 삭제된 데이터는 복원이 불가능합니다.
 * - 관리자 계정만 회원탈퇴가 가능합니다.
 * - https://developers.popbill.com/reference/closedown/node/api/member#QuitMember
 */
router.get("/QuitMember", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 탈퇴 사유
    var QuitReason = "탈퇴 사유";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    closedownService.quitMember(
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
 * - https://developers.popbill.com/reference/closedown/node/api/point#GetRefundableBalance
 */
router.get("/GetRefundableBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    closedownService.getRefundableBalance(
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

module.exports = router;
