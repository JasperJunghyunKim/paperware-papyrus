var express = require("express");
var router = express.Router();
var popbill = require("popbill");

/**
 * 현금영수증 API 모듈초기화
 */
var cashbillService = popbill.CashbillService();

/**
 * Cashbill API Index 목록
 */
router.get("/", function (req, res, next) {
    res.render("Cashbill/index", {});
});

/**
 * 파트너가 현금영수증 관리 목적으로 할당하는 문서번호 사용여부를 확인합니다.
 * - 이미 사용 중인 문서번호는 중복 사용이 불가하며 현금영수증이 삭제된 경우에만 문서번호의 재사용이 가능합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/info#CheckMgtKeyInUse
 */
router.get("/CheckMgtKeyInUse", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    cashbillService.checkMgtKeyInUse(
        CorpNum,
        mgtKey,
        function (result) {
            res.render("result", {
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
 * 작성된 현금영수증 데이터를 팝빌에 저장과 동시에 발행하여 "발행완료" 상태로 처리합니다.
 * - 현금영수증 국세청 전송 정책 : https://developers.popbill.com/guide/cashbill/node/introduction/policy-of-send-to-nts
 * - https://developers.popbill.com/reference/cashbill/node/api/issue#RegistIssue
 */
router.get("/RegistIssue", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    // 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
    var MgtKey = "20221110-node-101";

    // 현금영수증 상태메모
    var stateMemo = "발행메모";

    // 발행안내메일 제목
    // 미기재시 기본양식으로 전송
    var emailSubject = "";

    // 현금영수증 항목
    var cashbill = {
        // 문서번호
        mgtKey: MgtKey,

        // 문서형태, 승인거래 기재
        tradeType: "승인거래",

        // 과세형태 (과세, 비과세) 중 기재
        taxationType: "과세",

        // 거래구분 (소득공제용, 지출증빙용) 중 기재
        tradeUsage: "소득공제용",

        // 거래유형 (일반, 도서공연, 대중교통) 중 기재
        // - 미입력시 기본값 "일반" 처리
        tradeOpt: "일반",

        // 식별번호, 거래구분에 따라 작성
        // └ 소득공제용 - 주민등록/휴대폰/카드번호(현금영수증 카드)/자진발급용 번호(010-000-1234) 기재가능
        // └ 지출증빙용 - 사업자번호/주민등록/휴대폰/카드번호(현금영수증 카드) 기재가능
        // └ 주민등록번호 13자리, 휴대폰번호 10~11자리, 카드번호 13~19자리, 사업자번호 10자리 입력 가능
        identityNum: "0100001234",

        // 가맹점 사업자번호
        franchiseCorpNum: CorpNum,

        // 가맹점 종사업장 식별번호
        franchiseTaxRegID: "",

        // 가맹점 상호
        franchiseCorpName: "가맹점 상호",

        // 가맹점 대표자성명
        franchiseCEOName: "가맹점 대표자 성명",

        // 가맹점 주소
        franchiseAddr: "가맹점 주소",

        // 가맹점 연락처
        franchiseTEL: "01012341234",

        // 공급가액
        supplyCost: "10000",

        // 세액
        tax: "1000",

        // 봉사료
        serviceFee: "0",

        // 거래금액 (공급가액 + 세액 + 봉사료)
        totalAmount: "11000",

        // 고객명
        customerName: "고객명",

        // 상품명
        itemName: "상품명",

        // 주문번호
        orderNumber: "주문번호",

        // 고객 메일주소
        // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
        // 실제 거래처의 메일주소가 기재되지 않도록 주의
        email: "",

        // 고객 핸드폰번호
        hp: "",

        // 발행시 알림문자 전송여부
        // 문자전송시 포인트가 차감되며 전송실패시 환불처리됨.
        smssendYN: false,

        // 거래일시, 날짜(yyyyMMddHHmmss)
        // 당일, 전일만 가능 미입력시 기본값 발행일시 처리
        tradeDT: "",
    };

    cashbillService.registIssue(
        CorpNum,
        cashbill,
        stateMemo,
        UserID,
        emailSubject,
        function (result) {
            res.render("Cashbill/IssueResponse", {
                path: req.path,
                code: result.code,
                message: result.message,
                confirmNum: result.confirmNum,
                tradeDate: result.tradeDate,
                tradeDT: result.tradeDT,
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
 * 최대 100건의 현금영수증 발행을 한번의 요청으로 접수합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/issue#BulkSubmit
 */
router.get("/BulkSubmit", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 제출 아이디
    var submitID = "20221110_NODE_BULK02";

    // 현금영수증 객체정보 목록
    var cashbillList = [];

    for (var i = 0; i < 5; i++) {
        // 현금영수증 항목
        var cashbill = {
            // 문서번호
            mgtKey: submitID + "-" + i,

            // 문서형태, (승인거래, 취소거래) 중 기재
            tradeType: "승인거래",

            // // 원본 현금영수증 국세청 승인번호
            // // 취소 현금영수증 작성시 필수
            // orgConfirmNum: "",
            //
            // // 원본 현금영수증 거래일자
            // // 취소 현금영수증 작성시 필수
            // orgTradeDate: "",

            // 과세형태 (과세, 비과세) 중 기재
            taxationType: "과세",

            // 거래구분 (소득공제용, 지출증빙용) 중 기재
            tradeUsage: "소득공제용",

            // 거래유형 (일반, 도서공연, 대중교통) 중 기재
            // - 미입력시 기본값 "일반" 처리
            tradeOpt: "일반",

            // 식별번호, 거래구분에 따라 작성
            // └ 소득공제용 - 주민등록/휴대폰/카드번호(현금영수증 카드)/자진발급용 번호(010-000-1234) 기재가능
            // └ 지출증빙용 - 사업자번호/주민등록/휴대폰/카드번호(현금영수증 카드) 기재가능
            // └ 주민등록번호 13자리, 휴대폰번호 10~11자리, 카드번호 13~19자리, 사업자번호 10자리 입력 가능
            identityNum: "0100001234",

            // 가맹점 사업자번호
            franchiseCorpNum: CorpNum,

            // 가맹점 종사업장 식별번호
            franchiseTaxRegID: "",

            // 가맹점 상호
            franchiseCorpName: "가맹점 상호",

            // 가맹점 대표자성명
            franchiseCEOName: "가맹점 대표자 성명",

            // 가맹점 주소
            franchiseAddr: "가맹점 주소",

            // 가맹점 연락처
            franchiseTEL: "",

            // 공급가액
            supplyCost: "10000",

            // 세액
            tax: "1000",

            // 봉사료
            serviceFee: "0",

            // 거래금액 (공급가액 + 세액 + 봉사료)
            totalAmount: "11000",

            // 고객명
            customerName: "고객명",

            // 상품명
            itemName: "상품명",

            // 주문번호
            orderNumber: "주문번호",

            // 고객 메일주소
            // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
            // 실제 거래처의 메일주소가 기재되지 않도록 주의
            email: "",

            // 고객 핸드폰번호
            hp: "",

            // 발행시 알림문자 전송여부
            // 문자전송시 포인트가 차감되며 전송실패시 환불처리됨.
            smssendYN: false,

            // 거래일시, 날짜(yyyyMMddHHmmss)
            // 당일, 전일만 가능 미입력시 기본값 발행일시 처리
            tradeDT: "",
        };

        cashbillList.push(cashbill);
    }

    cashbillService.bulkSubmit(
        CorpNum,
        submitID,
        cashbillList,
        function (result) {
            res.render("response", {
                path: req.path,
                code: result.code,
                message: result.message,
                receiptID: result.receiptID,
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
 * 접수시 기재한 SubmitID를 사용하여 현금영수증 접수결과를 확인합니다.
 * - 개별 현금영수증 처리상태는 접수상태(txState)가 완료(2) 시 반환됩니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/issue#GetBulkResult
 */
router.get("/GetBulkResult", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 초대량 발행 접수시 기재한 제출아이디
    var submitID = "20221110_NODE_BULK02";

    cashbillService.getBulkResult(
        CorpNum,
        submitID,
        function (result) {
            res.render("Cashbill/BulkResult", {
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
 * 삭제 가능한 상태의 현금영수증을 삭제합니다.
 * - 삭제 가능한 상태: "전송실패"
 * - 현금영수증을 삭제하면 사용된 문서번호(mgtKey)를 재사용할 수 있습니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/issue#Delete
 */
router.get("/Delete", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    cashbillService.delete(
        CorpNum,
        mgtKey,
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
 * 취소 현금영수증 데이터를 팝빌에 저장과 동시에 발행하여 "발행완료" 상태로 처리합니다.
 * - 취소 현금영수증의 금액은 원본 금액을 넘을 수 없습니다.
 * - 현금영수증 국세청 전송 정책 [https://developers.popbill.com/guide/cashbill/node/introduction/policy-of-send-to-nts]
 * - 취소 현금영수증 발행 시 구매자 메일주소로 발행 안내 베일이 전송되니 유의하시기 바랍니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/issue#RevokeRegistIssue
 */
router.get("/RevokeRegistIssue", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
    var mgtKey = "20221110-003";

    // 원본 현금영수증 국세청 승인번호
    // 취소 현금영수증 작성시 필수
    var orgConfirmNum = "TB0000178";

    // 원본 현금영수증 거래일자
    // 취소 현금영수증 작성시 필수
    var orgTradeDate = "20221109";

    cashbillService.revokeRegistIssue(
        CorpNum,
        mgtKey,
        orgConfirmNum,
        orgTradeDate,
        function (result) {
            res.render("Cashbill/IssueResponse", {
                path: req.path,
                code: result.code,
                message: result.message,
                confirmNum: result.confirmNum,
                tradeDate: result.tradeDate,
                tradeDT: result.tradeDT,
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
 * 작성된 (부분)취소 현금영수증 데이터를 팝빌에 저장과 동시에 발행하여 "발행완료" 상태로 처리합니다.
 * - 취소 현금영수증의 금액은 원본 금액을 넘을 수 없습니다.
 * - 현금영수증 국세청 전송 정책 [https://developers.popbill.com/guide/cashbill/node/introduction/policy-of-send-to-nts]
 * - 취소 현금영수증 발행 시 구매자 메일주소로 발행 안내 베일이 전송되니 유의하시기 바랍니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/issue#RevokeRegistIssue
 */
router.get("/RevokeRegistIssue_part", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
    var mgtKey = "20221110-004";

    // 원본 현금영수증 국세청 승인번호
    // 취소 현금영수증 작성시 필수
    var orgConfirmNum = "TB0000178";

    // 원본 현금영수증 거래일자
    // 취소 현금영수증 작성시 필수
    var orgTradeDate = "20221109";

    // 현금영수증 발행시 알림문자 전송여부 : true / false 중 택 1
    // └ true = 전송, false = 미전송
    // └ 원본 현금영수증의 구매자(고객)의 휴대폰번호 문자 전송
    var smssendYN = false;

    // 현금영수증 상태 이력을 관리하기 위한 메모
    var memo = "부분취소발행 메모";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    // 현금영수증 취소유형 : true / false 중 택 1
    // └ true = 부분 취소, false = 전체 취소
    // - 미입력시 기본값 false 처리
    var isPartCancel = true;

    // 현금영수증 취소사유 : 1 / 2 / 3 중 택 1
    // └ 1 = 거래취소, 2 = 오류발급취소, 3 = 기타
    // - 미입력시 기본값 1 처리
    var cancelType = 1;

    // [취소] 공급가액
    // - 현금영수증 취소유형이 true 인 경우 취소할 공급가액 입력
    // - 현금영수증 취소유형이 false 인 경우 미입력
    var supplyCost = "7000";

    // [취소] 부가세
    // - 현금영수증 취소유형이 true 인 경우 취소할 부가세 입력
    // - 현금영수증 취소유형이 false 인 경우 미입력
    var tax = "700";

    // [취소] 봉사료
    // - 현금영수증 취소유형이 true 인 경우 취소할 봉사료 입력
    // - 현금영수증 취소유형이 false 인 경우 미입력
    var serviceFee = "0";

    // [취소] 거래금액 (공급가액+부가세+봉사료)
    // - 현금영수증 취소유형이 true 인 경우 취소할 거래금액 입력
    // - 현금영수증 취소유형이 false 인 경우 미입력
    var totalAmount = "7700";

    // 안내메일 제목, 공백처리시 기본양식으로 전송
    var emailSubject = "";

    // 거래일시, 날짜(yyyyMMddHHmmss)
    // 당일, 전일만 가능 미입력시 기본값 발행일시 처리
    var tradeDT = "";

    cashbillService.revokeRegistIssue(
        CorpNum,
        mgtKey,
        orgConfirmNum,
        orgTradeDate,
        smssendYN,
        memo,
        UserID,
        isPartCancel,
        cancelType,
        supplyCost,
        tax,
        serviceFee,
        totalAmount,
        emailSubject,
        tradeDT,
        function (result) {
            res.render("Cashbill/IssueResponse", {
                path: req.path,
                code: result.code,
                message: result.message,
                confirmNum: result.confirmNum,
                tradeDate: result.tradeDate,
                tradeDT: result.tradeDT,
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
 * 현금영수증 1건의 상태 및 요약정보를 확인합니다.
 * - 리턴값 "CashbillInfo"의 변수 "stateCode"를 통해 현금영수증의 상태코드를 확인합니다.
 * - 현금영수증 상태코드 [https://developers.popbill.com/reference/cashbill/node/response-code#state-code]
 * - https://developers.popbill.com/reference/cashbill/node/api/info#GetInfo
 */
router.get("/GetInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    cashbillService.getInfo(
        CorpNum,
        mgtKey,
        function (result) {
            res.render("Cashbill/CashbillInfo", {
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
 * 다수건의 현금영수증 상태 및 요약 정보를 확인합니다. (1회 호출 시 최대 1,000건 확인 가능)
 * - 리턴값 "CashbillInfo"의 변수 "stateCode"를 통해 현금영수증의 상태코드를 확인합니다.
 * - 현금영수증 상태코드 [https://developers.popbill.com/reference/cashbill/node/response-code#state-code]
 * - https://developers.popbill.com/reference/cashbill/node/api/info#GetInfos
 */
router.get("/GetInfos", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호 배열, 최대 1000건
    var mgtKeyList = ["20220629-001", "20220629-002"];

    cashbillService.getInfos(
        CorpNum,
        mgtKeyList,
        function (result) {
            res.render("Cashbill/CashbillInfos", {
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
 * 현금영수증 1건의 상세정보를 확인합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/info#GetDetailInfo
 */
router.get("/GetDetailInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    cashbillService.getDetailInfo(
        CorpNum,
        mgtKey,
        function (result) {
            res.render("Cashbill/CashbillDetail", {
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
 * 검색조건에 해당하는 현금영수증을 조회합니다. (조회기간 단위 : 최대 6개월)
 * - https://developers.popbill.com/reference/cashbill/node/api/info#Search
 */
router.get("/Search", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 일자 유형 ("R" , "T" , "I" 중 택 1)
    // └ R = 등록일자 , T = 거래일자 , I = 발행일자
    var DType = "R";

    // 시작일자, 작성형식(yyyyMMdd)
    var SDate = "20220601";

    // 종료일자, 작성형식(yyyyMMdd)
    var EDate = "20220629";

    // 상태코드 배열 (2,3번째 자리에 와일드카드(*) 사용 가능)
    // - 미입력시 전체조회
    var State = ["3**"];

    // 문서형태 배열 ("N" , "C" 중 선택, 다중 선택 가능)
    // - N = 일반 현금영수증 , C = 취소 현금영수증
    // - 미입력시 전체조회
    var TradeType = ["N", "C"];

    // 거래구분 배열 ("P" , "C" 중 선택, 다중 선택 가능)
    // - P = 소득공제용 , C = 지출증빙용
    // - 미입력시 전체조회
    var TradeUsage = ["P", "C"];

    // 거래유형 배열 ("N" , "B" , "T" 중 선택, 다중 선택 가능)
    // - N = 일반 , B = 도서공연 , T = 대중교통
    // - 미입력시 전체조회
    var TradeOpt = ["N", "B", "T"];

    // 과세형태 배열 ("T" , "N" 중 선택, 다중 선택 가능)
    // - T = 과세 , N = 비과세
    // - 미입력시 전체조회
    var TaxationType = ["T", "N"];

    // 현금영수증 식별번호, 미기재시 전체조회
    var QString = "";

    // 정렬방향, D-내림차순, A-오름차순
    var Order = "D";

    // 페이지 번호, 기본값 1
    var Page = 1;

    // 페이지당 검색개수, 최대 1000건
    var PerPage = 50;

    // 가맹점 종사업장 번호
    // └ 다수건 검색시 콤마(",")로 구분. 예) "1234,1000"
    // └ 미입력시 전제조회
    var FranchiseTaxRegID = "";

    cashbillService.search(
        CorpNum,
        DType,
        SDate,
        EDate,
        State,
        TradeType,
        TradeUsage,
        TradeOpt,
        TaxationType,
        QString,
        Order,
        Page,
        PerPage,
        FranchiseTaxRegID,
        function (result) {
            res.render("Cashbill/Search", {
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
 * 로그인 상태로 팝빌 사이트의 현금영수증 문서함 메뉴에 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/info#GetURL
 */
router.get("/GetURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 접근 메뉴 : "TBOX" / "PBOX" / "WRITE" 중 택 1
    // └ TBOX = 임시 문서함, PBOX = 발행 문서함, WRITE = 현금영수증 작성 중 택 1
    var TOGO = "PBOX";

    cashbillService.getURL(
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
 * 팝빌 사이트와 동일한 현금영수증 1건의 상세 정보 페이지의 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/view#GetPopUpURL
 */
router.get("/GetPopUpURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    cashbillService.getPopUpURL(
        CorpNum,
        mgtKey,
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
 * 팝빌 사이트와 동일한 현금영수증 1건의 상세 정보 페이지(사이트 상단, 좌측 메뉴 및 버튼 제외)의 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/view#GetViewURL
 */
router.get("/GetViewURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    cashbillService.getViewURL(
        CorpNum,
        mgtKey,
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
 * 현금영수증 1건을 인쇄하기 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/view#GetPrintURL
 */
router.get("/GetPrintURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    cashbillService.getPrintURL(
        CorpNum,
        mgtKey,
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
 * 다수건의 현금영수증을 인쇄하기 위한 페이지의 팝업 URL을 반환합니다. (최대 100건)
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/view#GetMassPrintURL
 */
router.get("/GetMassPrintURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호 배열, 최대 100건
    var mgtKeyList = ["20220629-001", "20220629-002"];

    cashbillService.getMassPrintURL(
        CorpNum,
        mgtKeyList,
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
 * 현금영수증 안내 메일의 상세보기 링크 URL을 반환합니다.
 * - 함수 호출로 반환 받은 URL에는 유효시간이 없습니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/view#GetMailURL
 */
router.get("/GetMailURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    cashbillService.getMailURL(
        CorpNum,
        mgtKey,
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
 * 현금영수증 PDF 파일을 다운 받을 수 있는 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/view#GetPDFURL
 */
router.get("/GetPDFURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    cashbillService.getPDFURL(
        CorpNum,
        mgtKey,
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
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/member#GetAccessURL
 */
router.get("/GetAccessURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    cashbillService.getAccessURL(
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
 * 현금영수증과 관련된 안내 메일을 재전송 합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/etc#SendEmail
 */
router.get("/SendEmail", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    // 수신메일주소
    // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
    // 실제 거래처의 메일주소가 기재되지 않도록 주의
    var receiver = "";

    cashbillService.sendEmail(
        CorpNum,
        mgtKey,
        receiver,
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
 * 현금영수증과 관련된 안내 SMS(단문) 문자를 재전송하는 함수로, 팝빌 사이트 [문자·팩스] > [문자] > [전송내역] 메뉴에서 전송결과를 확인 할 수 있습니다.
 * - 메시지는 최대 90byte까지 입력 가능하고, 초과한 내용은 자동으로 삭제되어 전송합니다. (한글 최대 45자)
 * - 알림문자 전송시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - https://developers.popbill.com/reference/cashbill/node/api/etc#SendSMS
 */
router.get("/SendSMS", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    // 발신번호
    var senderNum = "";

    // 수신번호
    var receiverNum = "";

    // 메세지 내용, 90byte 초과시 길이가 조정되어 전송됨
    var contents = "현금영수증 API 문자전송 테스트";

    cashbillService.sendSMS(
        CorpNum,
        mgtKey,
        senderNum,
        receiverNum,
        contents,
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
 * 현금영수증을 팩스로 전송하는 함수로, 팝빌 사이트 [문자·팩스] > [팩스] > [전송내역] 메뉴에서 전송결과를 확인 할 수 있습니다.
 * - 팩스 전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - https://developers.popbill.com/reference/cashbill/node/api/etc#SendFAX
 */
router.get("/SendFAX", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 문서번호
    var mgtKey = "20220629-001";

    // 발신번호
    var senderNum = "";

    // 수신팩스번호
    var receiverNum = "";

    cashbillService.sendFAX(
        CorpNum,
        mgtKey,
        senderNum,
        receiverNum,
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
 * 팝빌 사이트를 통해 발행하여 문서번호가 부여되지 않은 현금영수증에 문서번호를 할당합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/etc#AssignMgtKey
 */
router.get("/AssignMgtKey", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 현금영수증 팝빌번호, 문서 목록조회(Search API) 함수의 반환항목중 ItemKey 참조
    var itemKey = "021021116561000001";

    // 할당할 문서번호, 숫자, 영문 "-", "_" 조합으로 최대 24자리 식별키 구성
    // 사업자번호별 중복없는 고유번호 할당
    var mgtKey = "20220629-007";

    cashbillService.assignMgtKey(
        CorpNum,
        itemKey,
        mgtKey,
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
 * 현금영수증 관련 메일 항목에 대한 발송설정을 확인합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/etc#ListEmailConfig
 */
router.get("/ListEmailConfig", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    cashbillService.listEmailConfig(
        CorpNum,
        function (result) {
            res.render("Cashbill/ListEmailConfig", {
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
 * 현금영수증 관련 메일 항목에 대한 발송설정을 수정합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/etc#UpdateEmailConfig
 *
 * 메일전송유형
 * CSH_ISSUE : 고객에게 현금영수증이 발행 되었음을 알려주는 메일 입니다.
 * CSH_CANCEL : 고객에게 현금영수증이 발행취소 되었음을 알려주는 메일 입니다.
 */
router.get("/UpdateEmailConfig", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 메일 전송 유형
    var emailType = "CSH_ISSUE";

    // 전송 여부 (true = 전송, false = 미전송)
    var sendYN = true;

    cashbillService.updateEmailConfig(
        CorpNum,
        emailType,
        sendYN,
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
 * 연동회원의 잔여포인트를 확인합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetBalance
 */
router.get("/GetBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    cashbillService.getBalance(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetChargeURL
 */
router.get("/GetChargeURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    cashbillService.getChargeURL(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetPaymentURL
 */
router.get("/GetPaymentURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    cashbillService.getPaymentURL(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetUseHistoryURL
 */
router.get("/GetUseHistoryURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    cashbillService.getUseHistoryURL(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetPartnerBalance
 */
router.get("/GetPartnerBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    cashbillService.getPartnerBalance(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetPartnerURL
 */
router.get("/GetPartnerURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // CHRG(포인트충전)
    var TOGO = "CHRG";

    cashbillService.getPartnerURL(
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
 * 현금영수증 발행시 과금되는 포인트 단가를 확인합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetUnitCost
 */
router.get("/GetUnitCost", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    cashbillService.getUnitCost(
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
 * 팝빌 현금영수증 API 서비스 과금정보를 확인합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetChargeInfo
 */
router.get("/GetChargeInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    cashbillService.getChargeInfo(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/member#CheckIsMember
 */
router.get("/CheckIsMember", function (req, res, next) {
    // 조회할 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    cashbillService.checkIsMember(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/member#CheckID
 */
router.get("/CheckID", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var testID = "testkorea";

    cashbillService.checkID(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/member#JoinMember
 */
router.get("/JoinMember", function (req, res, next) {
    // 회원정보
    var joinInfo = {
        // 회원 아이디 (6자 이상 50자 미만)
        ID: "userid",

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: "asdf8536!@#",

        // 링크아이디
        LinkID: cashbillService._config.LinkID,

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

    cashbillService.joinMember(
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
 * 연동회원의 회사정보를 확인합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/member#GetCorpInfo
 */
router.get("/GetCorpInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    cashbillService.getCorpInfo(
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
 * 연동회원의 회사정보를 수정합니다.
 * - https://developers.popbill.com/reference/cashbill/node/api/member#UpdateCorpInfo
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

    cashbillService.updateCorpInfo(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/member#RegistContact
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

    cashbillService.registContact(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/member#GetContactInfo
 */
router.get("/GetContactInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 확인할 담당자 아이디
    var contactID = "checkContactID";

    cashbillService.getContactInfo(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/member#ListContact
 */
router.get("/ListContact", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    cashbillService.listContact(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/member#UpdateContact
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

    cashbillService.updateContact(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#PaymentRequest
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

    cashbillService.paymentRequest(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetSettleResult
 */
router.get("/GetSettleResult", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 정산코드 - PaymentRequest 호출시 반환되는 값
    var SettleCode = "202305120000000035";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    cashbillService.getSettleResult(
        CorpNum,
        SettleCode,
        UserID,
        function (result) {
            res.render("Base/paymentHistory", {
                path: req.path,
                paymentHistory: result,
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetPaymentHistory
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

    cashbillService.getPaymentHistory(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetUseHistory
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

    cashbillService.getUseHistory(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#Refund
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

    cashbillService.refund(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetRefundHistory
 */
router.get("/GetRefundHistory", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 목록 페이지번호 (기본값 1)
    var Page = 1;

    // 페이지당 표시할 목록 개수 (기본값 500, 최대 1,000)
    var PerPage = 500;

    // 팝빌회원 아이디
    var UserID = "testkorea";

    cashbillService.getRefundHistory(
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
 * 환불 가능한 포인트를 확인합니다. (보너스 포인트는 환불가능포인트에서 제외됩니다.)
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetRefundableBalance
 */
router.get("/GetRefundableBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    cashbillService.getRefundableBalance(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/point#GetRefundInfo
 */
router.get("/GetRefundInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 환불 코드
    var RefundCode = "023040000017";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    cashbillService.getRefundInfo(
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
 * - https://developers.popbill.com/reference/cashbill/node/api/member#QuitMember
 */
router.get("/QuitMember", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 탈퇴 사유
    var QuitReason = "테스트 탈퇴 사유";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    cashbillService.quitMember(
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

module.exports = router;
