var express = require("express");
var router = express.Router();
var popbill = require("popbill");

/**
 * 전자명세서 API 모듈 초기화
 */
var statementService = popbill.StatementService();

/**
 * Statement API Index 목록
 */
router.get("/", function (req, res, next) {
    res.render("Statement/index", {});
});

/**
 * 파트너가 전자명세서 관리 목적으로 할당하는 문서번호의 사용여부를 확인합니다.
 * - 이미 사용 중인 문서번호는 중복 사용이 불가하고, 전자명세서가 삭제된 경우에만 문서번호의 재사용이 가능합니다.
 * - https://developers.popbill.com/reference/statement/node/api/info#CheckMgtKeyInUse
 */
router.get("/CheckMgtKeyInUse", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    statementService.checkMgtKeyInUse(
        CorpNum,
        itemCode,
        mgtKey,
        function (result) {
            res.render("result", {
                path: req.path,
                result: "사용중",
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
 * 작성된 전자명세서 데이터를 팝빌에 저장과 동시에 발행하여, "발행완료" 상태로 처리합니다.
 * - 팝빌 사이트 [전자명세서] > [환경설정] > [전자명세서 관리] 메뉴의 발행시 자동승인 옵션 설정을 통해 전자명세서를 "발행완료" 상태가 아닌 "승인대기" 상태로 발행 처리 할 수 있습니다.
 * - https://developers.popbill.com/reference/statement/node/api/issue#RegistIssue
 */
router.get("/RegistIssue", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var ItemCode = 121;

    // 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
    var MgtKey = "20220629-001";

    // 메모
    var memo = "";

    // 발행 안내 메일 제목
    // - 미입력 시 팝빌에서 지정한 이메일 제목으로 전송
    var emailSubject = "";

    // 전자명세서 정보
    var statement = {
        // 기재상 작성일자, 날짜형식(yyyyMMdd)
        writeDate: "20220629",

        // {영수, 청구, 없음} 중 기재
        purposeType: "영수",

        // 과세형태, {과세, 영세, 면세} 중 기재
        taxType: "과세",

        // 맞춤양식코드, 기본값을 공백("")으로 처리하면 기본양식으로 처리.
        formCode: "",

        // 명세서 코드
        itemCode: ItemCode,

        // 문서번호
        mgtKey: MgtKey,

        /*************************************************************************
         *                             발신자 정보
         **************************************************************************/

        // 발신자 사업자번호
        senderCorpNum: CorpNum,

        // 발신자 상호
        senderCorpName: "발신자 상호",

        // 발신자 주소
        senderAddr: "발신자 주소",

        // 발신자 대표자 성명
        senderCEOName: "발신자 대표자 성명",

        // 종사업장 식별번호, 필요시기재, 형식은 숫자 4자리
        senderTaxRegID: "",

        // 발신자 종목
        senderBizClass: "종목",

        // 발신자 업태
        senderBizType: "업태",

        // 발신자 담당자명
        senderContactName: "담당자명",

        // 발신자 메일주소
        senderEmail: "",

        // 발신자 연락처
        senderTEL: "",

        // 발신자 휴대폰번호
        senderHP: "",

        /*************************************************************************
         *                             수신자 정보
         **************************************************************************/

        // 수신자 사업자번호
        receiverCorpNum: "8888888888",

        // 수신자 상호
        receiverCorpName: "수신자상호",

        // 수신자 대표자 성명
        receiverCEOName: "수신자 대표자 성명",

        // 수신자 주소
        receiverAddr: "수신자 주소",

        // 수신자 종사업장 식별번호, 필요시 기재
        recieverTaxRegID: "",

        // 수신자 종목
        receiverBizClass: "종목",

        // 수신자 업태
        receiverBizType: "업태",

        // 수신자 담당자명
        receiverContactName: "수신자 담당자 성명",

        // 수신자 메일주소
        // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
        // 실제 거래처의 메일주소가 기재되지 않도록 주의
        receiverEmail: "",

        // 수신자 연락처
        receiverTEL: "",

        // 수신자 휴대폰 번호
        receiverHP: "",

        /*************************************************************************
         *                            전자명세서 기재정보
         **************************************************************************/

        // 공급가액 합계
        supplyCostTotal: "20000",

        // 세액 합계
        taxTotal: "2000",

        // 합계금액 (공급가액 합계+ 세액 합계)
        totalAmount: "22000",

        // 기재 상 "일련번호" 항목
        serialNum: "1",

        // 기재 상 "비고" 항목
        remark1: "비고1",
        remark2: "비고2",
        remark3: "비고3",

        // 사업자등록증 이미지 첨부여부 (true / false 중 택 1)
        // └ true = 첨부 , false = 미첨부(기본값)
        // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
        businessLicenseYN: false,

        // 통장사본 이미지 첨부여부 (true / false 중 택 1)
        // └ true = 첨부 , false = 미첨부(기본값)
        // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
        bankBookYN: false,

        /*************************************************************************
         *                          상세9항목(품목) 정보
         **************************************************************************/

        detailList: [
            {
                serialNum: 1, // 품목 일련번호 1부터 순차기재
                itemName: "품명",
                purchaseDT: "20220629", // 구매일자
                qty: "1", // 수량
                unitCost: "10000", // 단가
                spec: "규격", // 규격
                supplyCost: "10000", // 공급가액
                tax: "1000", // 세액
                remark: "비고",
            },
            {
                serialNum: 2, // 품목 일련번호 1부터 순차기재
                itemName: "품명2",
                purchaseDT: "20220629", // 구매일자
                qty: "1", // 수량
                unitCost: "10000", // 단가
                spec: "규격", // 규격
                supplyCost: "10000", // 공급가액
                tax: "1000", // 세액
                remark: "비고",
            },
        ],

        /*************************************************************************
         *                               전자명세서 추가속성
         * - https://developers.popbill.com/guide/statement/node/introduction/statement-form#propertybag-table
         **************************************************************************/

        propertyBag: {
            Balance: "2000", // 전잔액
            Deposit: "500", // 입금액
            CBalance: "2500", // 현잔액
        },
    };

    statementService.registIssue(
        CorpNum,
        statement,
        memo,
        UserID,
        emailSubject,
        function (result) {
            res.render("Statement/IssueResponse", {
                path: req.path,
                code: result.code,
                message: result.message,
                invoiceNum: result.invoiceNum,
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
 * 작성된 전자명세서 데이터를 팝빌에 저장합니다
 * - https://developers.popbill.com/reference/statement/node/api/issue#Register
 */
router.get("/Register", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var ItemCode = 121;

    // 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
    var MgtKey = "20220629-002";

    // 전자명세서 정보
    var statement = {
        // 기재상 작성일자, 날짜형식(yyyyMMdd)
        writeDate: "20220629",

        // {영수, 청구, 없음} 중 기재
        purposeType: "영수",

        // 과세형태, {과세, 영세, 면세} 중 기재
        taxType: "과세",

        // 맞춤양식코드, 기본값을 공백("")으로 처리하면 기본양식으로 처리.
        formCode: "",

        // 명세서 코드
        itemCode: ItemCode,

        // 문서번호
        mgtKey: MgtKey,

        /*************************************************************************
         *                             발신자 정보
         **************************************************************************/

        // 발신자 사업자번호
        senderCorpNum: CorpNum,

        // 발신자 상호
        senderCorpName: "발신자 상호",

        // 발신자 주소
        senderAddr: "발신자 주소",

        // 발신자 대표자 성명
        senderCEOName: "발신자 대표자 성명",

        // 종사업장 식별번호, 필요시기재, 형식은 숫자 4자리
        senderTaxRegID: "",

        // 발신자 종목
        senderBizClass: "종목",

        // 발신자 업태
        senderBizType: "업태",

        // 발신자 담당자명
        senderContactName: "담당자명",

        // 발신자 메일주소
        senderEmail: "",

        // 발신자 연락처
        senderTEL: "",

        // 발신자 휴대폰번호
        senderHP: "",

        /*************************************************************************
         *                             수신자 정보
         **************************************************************************/

        // 수신자 사업자번호
        receiverCorpNum: "8888888888",

        // 수신자 상호
        receiverCorpName: "수신자상호",

        // 수신자 대표자 성명
        receiverCEOName: "수신자 대표자 성명",

        // 수신자 주소
        receiverAddr: "수신자 주소",

        // 수신자 종사업장 식별번호, 필요시 기재
        recieverTaxRegID: "",

        // 수신자 종목
        receiverBizClass: "종목",

        // 수신자 업태
        receiverBizType: "업태",

        // 수신자 담당자명
        receiverContactName: "수신자 담당자 성명",

        // 수신자 메일주소
        // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
        // 실제 거래처의 메일주소가 기재되지 않도록 주의
        receiverEmail: "",

        // 수신자 연락처
        receiverTEL: "",

        // 수신자 휴대폰 번호
        receiverHP: "",

        /*************************************************************************
         *                            전자명세서 기재정보
         **************************************************************************/

        // 공급가액 합계
        supplyCostTotal: "20000",

        // 세액 합계
        taxTotal: "2000",

        // 합계금액 (공급가액 합계+ 세액 합계)
        totalAmount: "22000",

        // 기재 상 "일련번호" 항목
        serialNum: "1",

        // 기재 상 "비고" 항목
        remark1: "비고1",
        remark2: "비고2",
        remark3: "비고3",

        // 사업자등록증 이미지 첨부여부 (true / false 중 택 1)
        // └ true = 첨부 , false = 미첨부(기본값)
        // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
        businessLicenseYN: false,

        // 통장사본 이미지 첨부여부 (true / false 중 택 1)
        // └ true = 첨부 , false = 미첨부(기본값)
        // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
        bankBookYN: false,

        /*************************************************************************
         *                          상세9항목(품목) 정보
         **************************************************************************/

        detailList: [
            {
                serialNum: 1, // 품목 일련번호 1부터 순차기재
                itemName: "품명",
                purchaseDT: "20220629", // 구매일자
                qty: "1", // 수량
                unitCost: "10000", // 단가
                spec: "규격", // 규격
                supplyCost: "10000", // 공급가액
                tax: "1000", // 세액
                remark: "비고",
            },
            {
                serialNum: 2, // 품목 일련번호 1부터 순차기재
                itemName: "품명2",
                purchaseDT: "20220629", // 구매일자
                qty: "1", // 수량
                unitCost: "10000", // 단가
                spec: "규격", // 규격
                supplyCost: "10000", // 공급가액
                tax: "1000", // 세액
                remark: "비고",
            },
        ],

        /*************************************************************************
         *                               전자명세서 추가속성
         * - https://developers.popbill.com/guide/statement/node/introduction/statement-form#propertybag-table
         **************************************************************************/

        propertyBag: {
            Balance: "2000", // 전잔액
            Deposit: "500", // 입금액
            CBalance: "2500", // 현잔액
        },
    };

    statementService.register(
        CorpNum,
        statement,
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
 * "임시저장" 상태의 전자명세서를 수정합니다.건의 전자명세서를 [수정]합니다.
 * - https://developers.popbill.com/reference/statement/node/api/issue#Update
 */
router.get("/Update", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var ItemCode = 121;

    // 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
    var MgtKey = "20220629-002";

    // 전자명세서 정보
    var statement = {
        // 기재상 작성일자, 날짜형식(yyyyMMdd)
        writeDate: "20220629",

        // {영수, 청구, 없음} 중 기재
        purposeType: "영수",

        // 과세형태, {과세, 영세, 면세} 중 기재
        taxType: "과세",

        // 맞춤양식코드, 기본값을 공백("")으로 처리하면 기본양식으로 처리.
        formCode: "",

        // 명세서 코드
        itemCode: ItemCode,

        // 문서번호
        mgtKey: MgtKey,

        /*************************************************************************
         *                             발신자 정보
         **************************************************************************/

        // 발신자 사업자번호
        senderCorpNum: CorpNum,

        // 발신자 상호
        senderCorpName: "발신자 상호_수정",

        // 발신자 주소
        senderAddr: "발신자 주소_수정",

        // 발신자 대표자 성명
        senderCEOName: "발신자 대표자 성명",

        // 종사업장 식별번호, 필요시기재, 형식은 숫자 4자리
        senderTaxRegID: "",

        // 발신자 종목
        senderBizClass: "종목",

        // 발신자 업태
        senderBizType: "업태",

        // 발신자 담당자명
        senderContactName: "담당자명",

        // 발신자 메일주소
        senderEmail: "",

        // 발신자 연락처
        senderTEL: "",

        // 발신자 휴대폰번호
        senderHP: "",

        /*************************************************************************
         *                             수신자 정보
         **************************************************************************/

        // 수신자 사업자번호
        receiverCorpNum: "8888888888",

        // 수신자 상호
        receiverCorpName: "수신자상호",

        // 수신자 대표자 성명
        receiverCEOName: "수신자 대표자 성명",

        // 수신자 주소
        receiverAddr: "수신자 주소",

        // 수신자 종사업장 식별번호, 필요시 기재
        recieverTaxRegID: "",

        // 수신자 종목
        receiverBizClass: "종목",

        // 수신자 업태
        receiverBizType: "업태",

        // 수신자 담당자명
        receiverContactName: "수신자 담당자 성명",

        // 수신자 메일주소
        // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
        // 실제 거래처의 메일주소가 기재되지 않도록 주의
        receiverEmail: "",

        // 수신자 연락처
        receiverTEL: "",

        // 수신자 휴대폰 번호
        receiverHP: "",

        /*************************************************************************
         *                            전자명세서 기재정보
         **************************************************************************/

        // 공급가액 합계
        supplyCostTotal: "20000",

        // 세액 합계
        taxTotal: "2000",

        // 합계금액 (공급가액 합계+ 세액 합계)
        totalAmount: "22000",

        // 기재 상 "일련번호" 항목
        serialNum: "1",

        // 기재 상 "비고" 항목
        remark1: "비고1",
        remark2: "비고2",
        remark3: "비고3",

        // 사업자등록증 이미지 첨부여부 (true / false 중 택 1)
        // └ true = 첨부 , false = 미첨부(기본값)
        // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
        businessLicenseYN: false,

        // 통장사본 이미지 첨부여부 (true / false 중 택 1)
        // └ true = 첨부 , false = 미첨부(기본값)
        // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
        bankBookYN: false,

        /*************************************************************************
         *                          상세9항목(품목) 정보
         **************************************************************************/

        detailList: [
            {
                serialNum: 1, // 품목 일련번호 1부터 순차기재
                itemName: "품명",
                purchaseDT: "20220629", // 구매일자
                qty: "1", // 수량
                unitCost: "10000", // 단가
                spec: "규격", // 규격
                supplyCost: "10000", // 공급가액
                tax: "1000", // 세액
                remark: "비고",
            },
            {
                serialNum: 2, // 품목 일련번호 1부터 순차기재
                itemName: "품명2",
                purchaseDT: "20220629", // 구매일자
                qty: "1", // 수량
                unitCost: "10000", // 단가
                spec: "규격", // 규격
                supplyCost: "10000", // 공급가액
                tax: "1000", // 세액
                remark: "비고",
            },
        ],

        /*************************************************************************
         *                               전자명세서 추가속성
         * - https://developers.popbill.com/guide/statement/node/introduction/statement-form#propertybag-table
         **************************************************************************/

        propertyBag: {
            Balance: "2000", // 전잔액
            Deposit: "500", // 입금액
            CBalance: "2500", // 현잔액
        },
    };

    statementService.update(
        CorpNum,
        ItemCode,
        MgtKey,
        statement,
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
 * "임시저장" 상태의 전자명세서를 발행하여, "발행완료" 상태로 처리합니다.
 * - 팝빌 사이트 [전자명세서] > [환경설정] > [전자명세서 관리] 메뉴의 발행시 자동승인 옵션 설정을 통해 전자명세서를 "발행완료" 상태가 아닌 "승인대기" 상태로 발행 처리 할 수 있습니다.
 * - 전자명세서 발행 함수 호출시 포인트가 과금되며, 수신자에게 발행 안내 메일이 발송됩니다.
 * - https://developers.popbill.com/reference/statement/node/api/issue#Issue
 */
router.get("/Issue", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-002";

    // 전자명세서 발행 안내메일 제목
    var EmailSubject = "";

    // 메모
    var memo = "발행메모";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.issue(
        CorpNum,
        itemCode,
        mgtKey,
        memo,
        EmailSubject,
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
 * 발신자가 발행한 전자명세서를 발행취소합니다.
 * - https://developers.popbill.com/reference/statement/node/api/issue#Cancel
 */
router.get("/CancelIssue", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    // 메모
    var memo = "발행취소 메모";

    statementService.cancel(
        CorpNum,
        itemCode,
        mgtKey,
        memo,
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
 * 삭제 가능한 상태의 전자명세서를 삭제합니다.
 * - 삭제 가능한 상태: "임시저장", "취소", "승인거부", "발행취소"
 * - https://developers.popbill.com/reference/statement/node/api/issue#Delete
 */
router.get("/Delete", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    statementService.delete(
        CorpNum,
        itemCode,
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
 * 전자명세서의 1건의 상태 및 요약정보 확인합니다.
 * - https://developers.popbill.com/reference/statement/node/api/info#GetInfo
 */
router.get("/GetInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    statementService.getInfo(
        CorpNum,
        itemCode,
        mgtKey,
        function (result) {
            res.render("Statement/StatementInfo", {
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
 * 다수건의 전자명세서 상태/요약 정보를 확인합니다.
 * - https://developers.popbill.com/reference/statement/node/api/info#GetInfos
 */
router.get("/GetInfos", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호 배열, 최대 1000건
    var mgtKeyList = ["20220629-001", "20220629-002"];

    statementService.getInfos(
        CorpNum,
        itemCode,
        mgtKeyList,
        function (result) {
            res.render("Statement/StatementInfos", {
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
 * 전자명세서 1건의 상세정보 확인합니다.
 * - https://developers.popbill.com/reference/statement/node/api/info#GetDetailInfo
 */
router.get("/GetDetailInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    statementService.getDetailInfo(
        CorpNum,
        itemCode,
        mgtKey,
        function (result) {
            res.render("Statement/StatementDetail", {
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
 * 검색조건에 해당하는 전자명세서를 조회합니다. (조회기간 단위 : 최대 6개월)
 * - https://developers.popbill.com/reference/statement/node/api/info#Search
 */
router.get("/Search", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 일자 유형 ("R" , "W" , "I" 중 택 1)
    // └ R = 등록일자 , W = 작성일자 , I = 발행일자
    var DType = "W";

    // 시작일자, 작성형식(yyyyMMdd)
    var SDate = "20220601";

    // 종료일자, 작성형식(yyyyMMdd)
    var EDate = "20220629";

    // 전자명세서 상태코드 배열 (2,3번째 자리에 와일드카드(*) 사용 가능)
    // - 미입력시 전체조회
    var State = ["200", "3**"];

    // 전자명세서 종류코드 배열, 121-거래명세서, 122-청구서, 123-견적서, 124-발주서, 125-입금표, 126-영수증
    var ItemCode = [121, 122, 123, 124, 125, 126];

    // 통합검색어, 거래처 상호명 또는 거래처 사업자번호로 조회
    // - 미입력시 전체조회
    var QString = "";

    // 정렬방향, D-내림차순, A-오름차순
    var Order = "D";

    // 페이지 번호
    var Page = 1;

    // 페이지당 검색개수, 최대 1000건
    var PerPage = 10;

    statementService.search(
        CorpNum,
        DType,
        SDate,
        EDate,
        State,
        ItemCode,
        QString,
        Order,
        Page,
        PerPage,
        function (result) {
            res.render("Statement/Search", {
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
 * 전자명세서의 상태에 대한 변경이력을 확인합니다.
 * - https://developers.popbill.com/reference/statement/node/api/info#GetLogs
 */
router.get("/GetLogs", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    statementService.getLogs(
        CorpNum,
        itemCode,
        mgtKey,
        function (result) {
            res.render("Statement/StatementLogs", {
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
 * 로그인 상태로 팝빌 사이트의 전자명세서 문서함 메뉴에 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/statement/node/api/info#GetURL
 */
router.get("/GetURL", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // SBOX(매출문서함), TBOX(임시문서함)
    var TOGO = "SBOX";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getURL(
        CorpNum,
        TOGO,
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
 * 팝빌 사이트와 동일한 전자명세서 1건의 상세 정보 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/statement/node/api/view#GetPopUpURL
 */
router.get("/GetPopUpURL", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getPopUpURL(
        CorpNum,
        itemCode,
        mgtKey,
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
 * 팝빌 사이트와 동일한 전자명세서 1건의 상세 정보 페이지(사이트 상단, 좌측 메뉴 및 버튼 제외)의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/statement/node/api/view#GetViewURL
 */
router.get("/GetViewURL", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getViewURL(
        CorpNum,
        itemCode,
        mgtKey,
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
 * 전자명세서 1건을 인쇄하기 위한 페이지의 팝업 URL을 반환하며, 페이지내에서 인쇄 설정값을 "공급자" / "공급받는자" / "공급자+공급받는자"용 중 하나로 지정할 수 있습니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/statement/node/api/view#GetPrintURL
 */
router.get("/GetPrintURL", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getPrintURL(
        CorpNum,
        itemCode,
        mgtKey,
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
 * "공급받는자" 용 전자명세서 1건을 인쇄하기 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/statement/node/api/view#GetEPrintURL
 */
router.get("/GetEPrintURL", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getEPrintURL(
        CorpNum,
        itemCode,
        mgtKey,
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
 * 다수건의 전자명세서를 인쇄하기 위한 페이지의 팝업 URL을 반환합니다. (최대 100건)
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/statement/node/api/view#GetMassPrintURL
 */
router.get("/GetMassPrintURL", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호 배열, 최대 100건
    var mgtKeyList = ["20220629-001", "20220629-002"];

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getMassPrintURL(
        CorpNum,
        itemCode,
        mgtKeyList,
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
 * 안내메일과 관련된 전자명세서를 확인 할 수 있는 상세 페이지의 팝업 URL을 반환하며, 해당 URL은 메일 하단의 파란색 버튼의 링크와 같습니다.
 * - 함수 호출로 반환 받은 URL에는 유효시간이 없습니다.
 * - https://developers.popbill.com/reference/statement/node/api/view#GetMailURL
 */
router.get("/GetMailURL", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getMailURL(
        CorpNum,
        itemCode,
        mgtKey,
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
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/statement/node/api/member#GetAccessURL
 */
router.get("/GetAccessURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getAccessURL(
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
 * 전자명세서에 첨부할 인감, 사업자등록증, 통장사본을 등록하는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/statement/node/api/etc#GetSealURL
 */
router.get("/GetSealURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getSealURL(
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
 * "임시저장" 상태의 명세서에 1개의 파일을 첨부합니다. (최대 5개)
 * - https://developers.popbill.com/reference/statement/node/api/etc#AttachFile
 */
router.get("/AttachFile", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-002";

    // 파일경로
    var filePaths = ["./test.jpg"];

    // 파일명
    var fileName = filePaths[0].replace(/^.*[\\\/]/, "");

    statementService.attachFile(
        CorpNum,
        itemCode,
        mgtKey,
        fileName,
        filePaths,
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
 * "임시저장" 상태의 전자명세서에 첨부된 1개의 파일을 삭제합니다.
 * - https://developers.popbill.com/reference/statement/node/api/etc#DeleteFile
 */
router.get("/DeleteFile", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-002";

    // 파일아이디 getFiles API의 attachedFile 변수값
    var fileID = "";

    statementService.deleteFile(
        CorpNum,
        itemCode,
        mgtKey,
        fileID,
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
 * 전자명세서에 첨부된 파일목록을 확인합니다.
 * - 응답항목 중 파일아이디(AttachedFile) 항목은 파일삭제(DeleteFile API) 호출시 이용할 수 있습니다.
 * - https://developers.popbill.com/reference/statement/node/api/etc#GetFiles
 */
router.get("/GetFiles", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-002";

    statementService.getFiles(
        CorpNum,
        itemCode,
        mgtKey,
        function (result) {
            res.render("Statement/AttachedFile", {
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
 * "승인대기", "발행완료" 상태의 전자명세서와 관련된 발행 안내 메일을 재전송 합니다.
 * - https://developers.popbill.com/reference/statement/node/api/etc#SendEmail
 */
router.get("/SendEmail", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    // 수신메일주소
    // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
    // 실제 거래처의 메일주소가 기재되지 않도록 주의
    var receiver = "";

    statementService.sendEmail(
        CorpNum,
        itemCode,
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
 * 전자명세서와 관련된 안내 SMS(단문) 문자를 재전송하는 함수로, 팝빌 사이트 [문자·팩스] > [문자] > [전송내역] 메뉴에서 전송결과를 확인 할 수 있습니다.
 * - 메시지는 최대 90byte까지 입력 가능하고, 초과한 내용은 자동으로 삭제되어 전송합니다. (한글 최대 45자)
 * - 함수 호출시 포인트가 과금됩니다.
 * - https://developers.popbill.com/reference/statement/node/api/etc#SendSMS
 */
router.get("/SendSMS", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    // 발신번호
    var senderNum = "";

    // 수신번호
    var receiverNum = "";

    // 문자메시지 내용, 최대 90Byte 초과시 길이가 조정되어 전송됨
    var contents = "전자명세서 알림문자재전송 테스트";

    statementService.sendSMS(
        CorpNum,
        itemCode,
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
 * 전자명세서를 팩스로 전송하는 함수로, 팝빌 사이트 [문자·팩스] > [팩스] > [전송내역] 메뉴에서 전송결과를 확인 할 수 있습니다.
 * - 함수 호출시 포인트가 과금됩니다.
 * - https://developers.popbill.com/reference/statement/node/api/etc#SendFAX
 */
router.get("/SendFAX", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    // 발신번호
    var senderNum = "";

    // 수신팩스번호
    var receiverNum = "";

    statementService.sendFAX(
        CorpNum,
        itemCode,
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
 * 전자명세서를 팩스로 전송하는 함수로, 팝빌에 데이터를 저장하는 과정이 없습니다.
 * - 팝빌 사이트 [문자·팩스] > [팩스] > [전송내역] 메뉴에서 전송결과를 확인 할 수 있습니다.
 * - 함수 호출시 포인트가 과금됩니다.
 * - 팩스 발행 요청시 작성한 문서번호는 팩스전송 파일명으로 사용됩니다.
 * - 팩스 전송결과를 확인하기 위해서는 선팩스 전송 요청 시 반환받은 접수번호를 이용하여 팩스 API의 전송결과 확인 (GetFaxResult) API를 이용하면 됩니다.
 * - https://developers.popbill.com/reference/statement/node/api/etc#FAXSend
 */
router.get("/FAXSend", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 발신번호
    var sendNum = "";

    // 수신팩스번호
    var receiveNum = "01012341234";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var ItemCode = 121;

    // 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
    var MgtKey = "20220629-003";

    // 전자명세서 정보
    var statement = {
        // 기재상 작성일자, 날짜형식(yyyyMMdd)
        writeDate: "20220629",

        // {영수, 청구, 없음} 중 기재
        purposeType: "영수",

        // 과세형태, {과세, 영세, 면세} 중 기재
        taxType: "과세",

        // 맞춤양식코드, 기본값을 공백("")으로 처리하면 기본양식으로 처리.
        formCode: "",

        // 명세서 코드
        itemCode: ItemCode,

        // 문서번호
        mgtKey: MgtKey,

        /*************************************************************************
         *                             발신자 정보
         **************************************************************************/

        // 발신자 사업자번호
        senderCorpNum: CorpNum,

        // 발신자 상호
        senderCorpName: "발신자 상호",

        // 발신자 주소
        senderAddr: "발신자 주소",

        // 발신자 대표자 성명
        senderCEOName: "발신자 대표자 성명",

        // 종사업장 식별번호, 필요시기재, 형식은 숫자 4자리
        senderTaxRegID: "",

        // 발신자 종목
        senderBizClass: "종목",

        // 발신자 업태
        senderBizType: "업태",

        // 발신자 담당자명
        senderContactName: "담당자명",

        // 발신자 메일주소
        senderEmail: "",

        // 발신자 연락처
        senderTEL: "",

        // 발신자 휴대폰번호
        senderHP: "",

        /*************************************************************************
         *                             수신자 정보
         **************************************************************************/

        // 수신자 사업자번호
        receiverCorpNum: "8888888888",

        // 수신자 상호
        receiverCorpName: "수신자상호",

        // 수신자 대표자 성명
        receiverCEOName: "수신자 대표자 성명",

        // 수신자 주소
        receiverAddr: "수신자 주소",

        // 수신자 종사업장 식별번호, 필요시 기재
        recieverTaxRegID: "",

        // 수신자 종목
        receiverBizClass: "종목",

        // 수신자 업태
        receiverBizType: "업태",

        // 수신자 담당자명
        receiverContactName: "수신자 담당자 성명",

        // 수신자 메일주소
        // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
        // 실제 거래처의 메일주소가 기재되지 않도록 주의
        receiverEmail: "",

        // 수신자 연락처
        receiverTEL: "",

        // 수신자 휴대폰 번호
        receiverHP: "",

        /*************************************************************************
         *                            전자명세서 기재정보
         **************************************************************************/

        // 공급가액 합계
        supplyCostTotal: "20000",

        // 세액 합계
        taxTotal: "2000",

        // 합계금액 (공급가액 합계+ 세액 합계)
        totalAmount: "22000",

        // 기재 상 "일련번호" 항목
        serialNum: "1",

        // 기재 상 "비고" 항목
        remark1: "비고1",
        remark2: "비고2",
        remark3: "비고3",

        // 사업자등록증 이미지 첨부여부 (true / false 중 택 1)
        // └ true = 첨부 , false = 미첨부(기본값)
        // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
        businessLicenseYN: false,

        // 통장사본 이미지 첨부여부 (true / false 중 택 1)
        // └ true = 첨부 , false = 미첨부(기본값)
        // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
        bankBookYN: false,

        /*************************************************************************
         *                          상세9항목(품목) 정보
         **************************************************************************/

        detailList: [
            {
                serialNum: 1, // 품목 일련번호 1부터 순차기재
                itemName: "품명",
                purchaseDT: "20220629", // 구매일자
                qty: "1", // 수량
                unitCost: "10000", // 단가
                spec: "규격", // 규격
                supplyCost: "10000", // 공급가액
                tax: "1000", // 세액
                remark: "비고",
            },
            {
                serialNum: 2, // 품목 일련번호 1부터 순차기재
                itemName: "품명2",
                purchaseDT: "20220629", // 구매일자
                qty: "1", // 수량
                unitCost: "10000", // 단가
                spec: "규격", // 규격
                supplyCost: "10000", // 공급가액
                tax: "1000", // 세액
                remark: "비고",
            },
        ],

        /*************************************************************************
         *                               전자명세서 추가속성
         * - https://developers.popbill.com/guide/statement/node/introduction/statement-form#propertybag-table
         **************************************************************************/

        propertyBag: {
            Balance: "2000", // 전잔액
            Deposit: "500", // 입금액
            CBalance: "2500", // 현잔액
        },
    };

    statementService.FAXSend(
        CorpNum,
        statement,
        sendNum,
        receiveNum,
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
 * 하나의 전자명세서에 다른 전자명세서를 첨부합니다.
 * - https://developers.popbill.com/reference/statement/node/api/etc#AttachStatement
 */
router.get("/AttachStatement", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 종류코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    // 첨부할 명세서 종류코드
    var subItemCode = 121;

    // 첨부할 명세서 문서번호
    var subMgtKey = "20220629-002";

    statementService.attachStatement(
        CorpNum,
        itemCode,
        mgtKey,
        subItemCode,
        subMgtKey,
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
 * 하나의 전자명세서에 첨부된 다른 전자명세서를 해제합니다.
 * - https://developers.popbill.com/reference/statement/node/api/etc#DetachStatement
 */
router.get("/DetachStatement", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 종류코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    // 문서번호
    var mgtKey = "20220629-001";

    // 첨부해제할 명세서 종류코드
    var subItemCode = 121;

    // 첨부해제할 명세서 문서번호
    var subMgtKey = "20220629-002";

    statementService.detachStatement(
        CorpNum,
        itemCode,
        mgtKey,
        subItemCode,
        subMgtKey,
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
 * 전자명세서 관련 메일 항목에 대한 발송설정을 확인합니다.
 * - https://developers.popbill.com/reference/statement/node/api/etc#ListEmailConfig
 */
router.get("/ListEmailConfig", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    statementService.listEmailConfig(
        CorpNum,
        function (result) {
            res.render("Statement/ListEmailConfig", {
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
 * 전자명세서 관련 메일 항목에 대한 발송설정을 수정합니다.
 * - https://developers.popbill.com/reference/statement/node/api/etc#UpdateEmailConfig
 *
 * 메일전송유형
 * SMT_ISSUE : 수신자에게 전자명세서가 발행 되었음을 알려주는 메일입니다.
 * SMT_ACCEPT : 발신자에게 전자명세서가 승인 되었음을 알려주는 메일입니다.
 * SMT_DENY : 발신자에게 전자명세서가 거부 되었음을 알려주는 메일입니다.
 * SMT_CANCEL : 수신자에게 전자명세서가 취소 되었음을 알려주는 메일입니다.
 * SMT_CANCEL_ISSUE : 수신자에게 전자명세서가 발행취소 되었음을 알려주는 메일입니다.
 */
router.get("/UpdateEmailConfig", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 메일 전송 유형
    var emailType = "SMT_ISSUE";

    // 전송 여부 (true = 전송, false = 미전송)
    var sendYN = true;

    statementService.updateEmailConfig(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetBalance
 */
router.get("/GetBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    statementService.getBalance(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetChargeURL
 */
router.get("/GetChargeURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getChargeURL(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetPaymentURL
 */
router.get("/GetPaymentURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getPaymentURL(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetUseHistoryURL
 */
router.get("/GetUseHistoryURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getUseHistoryURL(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetPartnerBalance
 */
router.get("/GetPartnerBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    statementService.getPartnerBalance(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetPartnerURL
 */
router.get("/GetPartnerURL", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // CHRG(포인트충전)
    var TOGO = "CHRG";

    statementService.getPartnerURL(
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
 * 전자명세서 발행시 과금되는 포인트 단가를 확인합니다.
 * - https://developers.popbill.com/reference/statement/node/api/point#GetUnitCost
 */
router.get("/GetUnitCost", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    statementService.getUnitCost(
        CorpNum,
        itemCode,
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
 * 팝빌 전자명세서 API 서비스 과금정보를 확인합니다.
 * - https://developers.popbill.com/reference/statement/node/api/point#GetChargeInfo
 */
router.get("/GetChargeInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 명세서 종류코드 - 121(거래명세서), 122(청구서), 123(견적서), 124(발주서), 125(입금표), 126(영수증)
    var itemCode = 121;

    statementService.getChargeInfo(
        CorpNum,
        itemCode,
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
 * - https://developers.popbill.com/reference/statement/node/api/member#CheckIsMember
 */
router.get("/CheckIsMember", function (req, res, next) {
    // 조회할 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    statementService.checkIsMember(
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
 * - https://developers.popbill.com/reference/statement/node/api/member#CheckID
 */
router.get("/CheckID", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var testID = "testkorea";

    statementService.checkID(
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
 * - https://developers.popbill.com/reference/statement/node/api/member#JoinMember
 */
router.get("/JoinMember", function (req, res, next) {
    // 회원정보
    var joinInfo = {
        // 회원 아이디 (6자 이상 50자 미만)
        ID: "userid",

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: "asdf8536!@#",

        // 링크아이디
        LinkID: statementService._config.LinkID,

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

    statementService.joinMember(
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
 * - https://developers.popbill.com/reference/statement/node/api/member#GetCorpInfo
 */
router.get("/GetCorpInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    statementService.getCorpInfo(
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
 * - https://developers.popbill.com/reference/statement/node/api/member#UpdateCorpInfo
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

    statementService.updateCorpInfo(
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
 * - https://developers.popbill.com/reference/statement/node/api/member#RegistContact
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

    statementService.registContact(
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
 * - https://developers.popbill.com/reference/statement/node/api/member#GetContactInfo
 */
router.get("/GetContactInfo", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    // 확인할 담당자 아이디
    var contactID = "checkContactID";

    statementService.getContactInfo(
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
 * - https://developers.popbill.com/reference/statement/node/api/member#ListContact
 */
router.get("/ListContact", function (req, res, next) {
    // 팝빌회원 사업자번호
    var CorpNum = "1234567890";

    statementService.listContact(
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
 * - https://developers.popbill.com/reference/statement/node/api/member#UpdateContact
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

    statementService.updateContact(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#PaymentRequest
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

    statementService.paymentRequest(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetSettleResult
 */
router.get("/GetSettleResult", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 정산코드 - PaymentRequest 호출시 반환되는 값
    var SettleCode = "202305120000000035";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getSettleResult(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetPaymentHistory
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

    statementService.getPaymentHistory(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetUseHistory
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

    statementService.getUseHistory(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#Refund
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

    statementService.refund(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetRefundHistory
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

    statementService.getRefundHistory(
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
 * - https://developers.popbill.com/reference/statement/node/api/member#QuitMember
 */
router.get("/QuitMember", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 탈퇴 사유
    var QuitReason = "탈퇴 사유";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.quitMember(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetRefundableBalance
 */
router.get("/GetRefundableBalance", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getRefundableBalance(
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
 * - https://developers.popbill.com/reference/statement/node/api/point#GetRefundInfo
 */
router.get("/GetRefundInfo", function (req, res, next) {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    var CorpNum = "1234567890";

    // 환불 코드
    var RefundCode = "023040000017";

    // 팝빌회원 아이디
    var UserID = "testkorea";

    statementService.getRefundInfo(
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
