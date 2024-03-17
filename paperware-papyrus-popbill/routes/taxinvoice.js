var express = require("express");
var router = express.Router();
const { popbill, popbillConfig } = require('../config/popbill')
var fs = require("fs");

/**
 * 전자세금계산서 API 모듈 초기화
 */
var taxinvoiceService = popbill.TaxinvoiceService();

/**
 * Taxinvoice API Index 목록
 */
router.get("/", function (req, res, next) {
    res.render("Taxinvoice/index", {});
});

/**
 * 파트너가 세금계산서 관리 목적으로 할당하는 문서번호의 사용여부를 확인합니다.
 * - 문서번호는 최대 24자리 영문 대소문자, 숫자, 특수문자("-","_")로 구성 합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/info#CheckMgtKeyInUse
 */
// router.get("/CheckMgtKeyInUse", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
//     var mgtKey = "20220629-001";

//     taxinvoiceService.checkMgtKeyInUse(
//         CorpNum,
//         keyType,
//         mgtKey,
//         function (result) {
//             res.render("result", {
//                 path: req.path,
//                 result: "사용중",
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 작성된 세금계산서 데이터를 팝빌에 저장과 동시에 발행(전자서명)하여 "발행완료" 상태로 처리합니다.
 * - 세금계산서 국세청 전송 정책 [https://developers.popbill.com/guide/taxinvoice/node/introduction/policy-of-send-to-nts]
 * - "발행완료"된 전자세금계산서는 국세청 전송 이전에 발행취소(CancelIssue API) 함수로 국세청 신고 대상에서 제외할 수 있습니다.
 * - 임시저장(Register API) 함수와 발행(Issue API) 함수를 한 번의 프로세스로 처리합니다.
 * - 세금계산서 발행을 위해서 공급자의 인증서가 팝빌 인증서버에 사전등록 되어야 합니다.
 *   └ 위수탁발행의 경우, 수탁자의 인증서 등록이 필요합니다
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#RegistIssue
 */
// router.get("/RegistIssue", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
//     var mgtKey = "20220629-001";

//     // 세금계산서 항목
//     var Taxinvoice = {
//         // 작성일자, 날짜형식 yyyyMMdd
//         writeDate: "20220629",

//         // 과금방향, {정과금, 역과금}중 선택
//         // - 정과금(공급자과금), 역과금(공급받는자과금)
//         // - 역과금은 역발행 세금계산서를 발행하는 경우만 가능
//         chargeDirection: "정과금",

//         // 발행형태, {정발행, 역발행, 위수탁} 중 기재
//         issueType: "정발행",

//         // {영수, 청구, 없음} 중 기재
//         purposeType: "영수",

//         // 과세형태, {과세, 영세, 면세} 중 기재
//         taxType: "과세",

//         /************************************************************************
//          *                              공급자 정보
//          **************************************************************************/

//         // 공급자 사업자번호, "-" 제외 10자리
//         invoicerCorpNum: CorpNum,

//         // [정발행시 필수] 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
//         invoicerMgtKey: mgtKey,

//         // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//         invoicerTaxRegID: "",

//         // 공급자 상호
//         invoicerCorpName: "공급자 상호",

//         // 대표자 성명
//         invoicerCEOName: "대표자 성명",

//         // 공급자 주소
//         invoicerAddr: "공급자 주소",

//         // 공급자 종목
//         invoicerBizClass: "공급자 업종",

//         // 공급자 업태
//         invoicerBizType: "공급자 업태",

//         // 공급자 담당자명
//         invoicerContactName: "공급자 담당자명",

//         // 공급자 연락처
//         invoicerTEL: "",

//         // 공급자 휴대폰번호
//         invoicerHP: "",

//         // 공급자 메일주소
//         invoicerEmail: "",

//         // 발행 안내 문자 전송여부 (true / false 중 택 1)
//         // └ true = 전송 , false = 미전송
//         // └ 공급받는자 (주)담당자 휴대폰번호 {invoiceeHP1} 값으로 문자 전송
//         // - 전송 시 포인트 차감되며, 전송실패시 환불처리
//         invoicerSMSSendYN: false,

//         /************************************************************************
//          *                           공급받는자 정보
//          **************************************************************************/

//         // 공급받는자 구분, {사업자, 개인, 외국인} 중 기재
//         invoiceeType: "사업자",

//         // 공급받는자 사업자번호
//         // - {invoiceeType}이 "사업자" 인 경우, 사업자번호 (하이픈 ("-") 제외 10자리)
//         // - {invoiceeType}이 "개인" 인 경우, 주민등록번호 (하이픈 ("-") 제외 13자리)
//         // - {invoiceeType}이 "외국인" 인 경우, "9999999999999" (하이픈 ("-") 제외 13자리)
//         invoiceeCorpNum: "8888888888",

//         // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//         invoiceeTaxRegID: "",

//         // 공급받는자 상호
//         invoiceeCorpName: "공급받는자 상호",

//         // 공급받는자 대표자 성명
//         invoiceeCEOName: "공급받는자 대표자 성명",

//         // 공급받는자 주소
//         invoiceeAddr: "공급받는자 주소",

//         // 공급받는자 종목
//         invoiceeBizClass: "공급받는자 종목",

//         // 공급받는자 업태
//         invoiceeBizType: "공급받는자 업태",

//         // 공급받는자 담당자명
//         invoiceeContactName1: "공급받는자 담당자명",

//         // 공급받는자 연락처
//         invoiceeTEL1: "",

//         // 공급받는자 휴대폰번호
//         invoiceeHP1: "",

//         // 공급받는자 이메일 주소
//         // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//         // 실제 거래처의 메일주소가 기재되지 않도록 주의
//         invoiceeEmail1: "",

//         /************************************************************************
//          *                           세금계산서 기재정보
//          **************************************************************************/

//         // 공급가액 합계
//         supplyCostTotal: "10000",

//         // 세액합계
//         taxTotal: "1000",

//         // 합계금액 (공급가액 합계 + 세액 합계)
//         totalAmount: "11000",

//         // 기재 상 "일련번호"" 항목
//         serialNum: "123",

//         // 기재 상 "현금"" 항목
//         cash: "",

//         // 기재 상 "수표" 항목
//         chkBill: "",

//         // 기재 상 "어음" 항목
//         note: "",

//         // 기재 상 "외상" 항목
//         credit: "",

//         // 비고
//         // {invoiceeType}이 "외국인" 이면 remark1 필수
//         // - 외국인 등록번호 또는 여권번호 입력
//         remark1: "비고",
//         remark2: "비고2",
//         remark3: "비고3",

//         // 기재 상 "권" 항목, 최대값 32767
//         kwon: "",

//         // 기재 상 "호" 항목, 최대값 32767
//         ho: "",

//         // 사업자등록증 이미지 첨부여부 (true / false 중 택 1)
//         // └ true = 첨부 , false = 미첨부(기본값)
//         // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
//         businessLicenseYN: false,

//         // 통장사본 이미지 첨부여부 (true / false 중 택 1)
//         // └ true = 첨부 , false = 미첨부(기본값)
//         // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
//         bankBookYN: false,

//         /************************************************************************
//          *                           상세항목(품목) 정보 (최대 99건)
//          **************************************************************************/

//         detailList: [
//             {
//                 serialNum: 1, // 일련번호, 1부터 순차기재
//                 purchaseDT: "20220629", // 거래일자, 형식 : yyyyMMdd
//                 itemName: "품명1",
//                 spec: "규격",
//                 qty: "1", // 수량, 소수점 2자리까지 기재 가능
//                 unitCost: "5000", // 단가, 소수점 2자리까지 기재 가능
//                 supplyCost: "5000", // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 tax: "500", // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 remark: "비고",
//             },
//             {
//                 serialNum: 2, // 일련번호, 1부터 순차기재
//                 purchaseDT: "20220629", // 거래일자, 형식 : yyyyMMdd
//                 itemName: "품명2",
//                 spec: "규격",
//                 qty: "1", // 수량, 소수점 2자리까지 기재 가능
//                 unitCost: "5000", // 단가, 소수점 2자리까지 기재 가능
//                 supplyCost: "5000", // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 tax: "500", // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 remark: "비고",
//             },
//         ],

//         /************************************************************************
//          *                         수정세금계산서 기재정보
//          * - 수정세금계산서를 작성하는 경우에만 값을 기재합니다.
//          * - 수정세금계산서 관련 정보는 연동매뉴얼 또는 개발가이드 링크 참조
//          * - [참고] 수정세금계산서 작성방법 안내 - https://developers.popbill.com/guide/taxinvoice/node/introduction/modified-taxinvoice
//          **************************************************************************/

//         // [수정세금계산서 발행시 필수] 수정사유코드, 수정사유에 따라 1~6 숫자 기재
//         modifyCode: "",

//         // [수정세금계산서 발행시 필수] 원본세금계산서 국세청승인번호 기재
//         orgNTSConfirmNum: "",

//         /************************************************************************
//          *                             추가담당자 정보
//          * - 세금계산서 발행안내 메일을 수신받을 공급받는자 담당자가 다수인 경우
//          * 추가 담당자 정보를 등록하여 발행안내메일을 다수에게 전송할 수 있습니다. (최대 5명)
//          **************************************************************************/

//         // 추가담당자 정보
//         addContactList: [
//             {
//                 // 일련번호, 1부터 순차기재
//                 serialNum: 1,

//                 // 담당자명
//                 contactName: "담당자 성명",

//                 // 담당자 메일
//                 // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//                 // 실제 거래처의 메일주소가 기재되지 않도록 주의
//                 email: "",
//             },
//             {
//                 // 일련번호, 1부터 순차기재
//                 serialNum: 2,

//                 // 담당자명
//                 contactName: "담당자 성명 2",

//                 // 담당자 메일
//                 // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//                 // 실제 거래처의 메일주소가 기재되지 않도록 주의
//                 email: "",
//             },
//         ],
//     };

//     taxinvoiceService.registIssue(
//         CorpNum,
//         Taxinvoice,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//                 ntsConfirmNum: result.ntsConfirmNum,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 최대 100건의 세금계산서 발행을 한번의 요청으로 접수합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#BulkSubmit
 */
// router.get("/BulkSubmit", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 제출 아이디
//     var submitID = "20220629-NODE";

//     // 세금계산서 객체정보 목록
//     var taxinvoiceList = [];

//     // 지연발행 강제여부
//     // - 지연발행 세금계산서를 발행하는 경우, 가산세가 부과될 수 있습니다.
//     var forceIssue = false;

//     for (var i = 0; i < 100; i++) {
//         // 세금계산서 항목
//         var Taxinvoice = {
//             // 작성일자, 날짜형식 yyyyMMdd
//             writeDate: "20220629",

//             // 과금방향, {정과금, 역과금}중 선택
//             // - 정과금(공급자과금), 역과금(공급받는자과금)
//             // - 역과금은 역발행 세금계산서를 발행하는 경우만 가능
//             chargeDirection: "정과금",

//             // 발행형태, {정발행, 역발행, 위수탁} 중 기재
//             issueType: "정발행",

//             // {영수, 청구, 없음} 중 기재
//             purposeType: "영수",

//             // 과세형태, {과세, 영세, 면세} 중 기재
//             taxType: "과세",

//             /************************************************************************
//              *                              공급자 정보
//              **************************************************************************/

//             // 공급자 사업자번호, "-" 제외 10자리
//             invoicerCorpNum: CorpNum,

//             // [정발행시 필수] 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
//             invoicerMgtKey: submitID + i,

//             // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//             invoicerTaxRegID: "",

//             // 공급자 상호
//             invoicerCorpName: "공급자 상호",

//             // 대표자 성명
//             invoicerCEOName: "대표자 성명",

//             // 공급자 주소
//             invoicerAddr: "공급자 주소",

//             // 공급자 종목
//             invoicerBizClass: "공급자 업종",

//             // 공급자 업태
//             invoicerBizType: "공급자 업태",

//             // 공급자 담당자명
//             invoicerContactName: "공급자 담당자명",

//             // 공급자 연락처
//             invoicerTEL: "",

//             // 공급자 휴대폰번호
//             invoicerHP: "",

//             // 공급자 메일주소
//             invoicerEmail: "",

//             // 발행 안내 문자 전송여부 (true / false 중 택 1)
//             // └ true = 전송 , false = 미전송
//             // └ 공급받는자 (주)담당자 휴대폰번호 {invoiceeHP1} 값으로 문자 전송
//             // - 전송 시 포인트 차감되며, 전송실패시 환불처리
//             invoicerSMSSendYN: false,

//             /************************************************************************
//              *                           공급받는자 정보
//              **************************************************************************/

//             // 공급받는자 구분, {사업자, 개인, 외국인} 중 기재
//             invoiceeType: "사업자",

//             // 공급받는자 사업자번호
//             // - {invoiceeType}이 "사업자" 인 경우, 사업자번호 (하이픈 ("-") 제외 10자리)
//             // - {invoiceeType}이 "개인" 인 경우, 주민등록번호 (하이픈 ("-") 제외 13자리)
//             // - {invoiceeType}이 "외국인" 인 경우, "9999999999999" (하이픈 ("-") 제외 13자리)
//             invoiceeCorpNum: "8888888888",

//             // [역발행시 필수] 공급받는자 문서번호
//             invoiceeMgtKey: "",

//             // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//             invoiceeTaxRegID: "",

//             // 공급받는자 상호
//             invoiceeCorpName: "공급받는자 상호",

//             // 공급받는자 대표자 성명
//             invoiceeCEOName: "공급받는자 대표자 성명",

//             // 공급받는자 주소
//             invoiceeAddr: "공급받는자 주소",

//             // 공급받는자 종목
//             invoiceeBizClass: "공급받는자 종목",

//             // 공급받는자 업태
//             invoiceeBizType: "공급받는자 업태",

//             // 공급받는자 담당자명
//             invoiceeContactName1: "공급받는자 담당자명",

//             // 공급받는자 연락처
//             invoiceeTEL1: "",

//             // 공급받는자 휴대폰번호
//             invoiceeHP1: "",

//             // 공급받는자 이메일 주소
//             // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//             // 실제 거래처의 메일주소가 기재되지 않도록 주의
//             invoiceeEmail1: "",

//             // 역발행시 알림문자 전송여부
//             // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
//             invoiceeSMSSendYN: false,

//             /************************************************************************
//              *                           세금계산서 기재정보
//              **************************************************************************/

//             // 공급가액 합계
//             supplyCostTotal: "10000",

//             // 세액합계
//             taxTotal: "1000",

//             // 합계금액 (공급가액 합계 + 세액 합계)
//             totalAmount: "11000",

//             // 기재 상 "일련번호"" 항목
//             serialNum: "123",

//             // 기재 상 "현금"" 항목
//             cash: "",

//             // 기재 상 "수표" 항목
//             chkBill: "",

//             // 기재 상 "어음" 항목
//             note: "",

//             // 기재 상 "외상" 항목
//             credit: "",

//             // 비고
//             // {invoiceeType}이 "외국인" 이면 remark1 필수
//             // - 외국인 등록번호 또는 여권번호 입력
//             remark1: "비고",
//             remark2: "비고2",
//             remark3: "비고3",

//             // 기재 상 "권" 항목, 최대값 32767
//             kwon: "",

//             // 기재 상 "호" 항목, 최대값 32767
//             ho: "",

//             // 사업자등록증 이미지 첨부여부 (true / false 중 택 1)
//             // └ true = 첨부 , false = 미첨부(기본값)
//             // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
//             businessLicenseYN: false,

//             // 통장사본 이미지 첨부여부 (true / false 중 택 1)
//             // └ true = 첨부 , false = 미첨부(기본값)
//             // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
//             bankBookYN: false,

//             /************************************************************************
//              *                           상세항목(품목) 정보 (최대 99건)
//              **************************************************************************/

//             detailList: [
//                 {
//                     serialNum: 1, // 일련번호, 1부터 순차기재
//                     purchaseDT: "20220629", // 거래일자, 형식 : yyyyMMdd
//                     itemName: "품명1",
//                     spec: "규격",
//                     qty: "1", // 수량, 소수점 2자리까지 기재 가능
//                     unitCost: "5000", // 단가, 소수점 2자리까지 기재 가능
//                     supplyCost: "5000", // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                     tax: "500", // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                     remark: "비고",
//                 },
//                 {
//                     serialNum: 2, // 일련번호, 1부터 순차기재
//                     purchaseDT: "20220629", // 거래일자, 형식 : yyyyMMdd
//                     itemName: "품명2",
//                     spec: "규격",
//                     qty: "1", // 수량, 소수점 2자리까지 기재 가능
//                     unitCost: "5000", // 단가, 소수점 2자리까지 기재 가능
//                     supplyCost: "5000", // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                     tax: "500", // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                     remark: "비고",
//                 },
//             ],

//             /************************************************************************
//              *                         수정세금계산서 기재정보
//              * - 수정세금계산서를 작성하는 경우에만 값을 기재합니다.
//              * - 수정세금계산서 관련 정보는 연동매뉴얼 또는 개발가이드 링크 참조
//              * - [참고] 수정세금계산서 작성방법 안내 - https://developers.popbill.com/guide/taxinvoice/node/introduction/modified-taxinvoice
//              **************************************************************************/

//             // [수정세금계산서 발행시 필수] 수정사유코드, 수정사유에 따라 1~6 숫자 기재
//             modifyCode: "",

//             // [수정세금계산서 발행시 필수] 원본세금계산서 국세청승인번호 기재
//             orgNTSConfirmNum: "",

//             /************************************************************************
//              *                             추가담당자 정보
//              * - 세금계산서 발행안내 메일을 수신받을 공급받는자 담당자가 다수인 경우
//              * 추가 담당자 정보를 등록하여 발행안내메일을 다수에게 전송할 수 있습니다. (최대 5명)
//              **************************************************************************/

//             // 추가담당자 정보
//             addContactList: [
//                 {
//                     // 일련번호, 1부터 순차기재
//                     serialNum: 1,

//                     // 담당자명
//                     contactName: "담당자 성명",

//                     // 담당자 메일
//                     // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//                     // 실제 거래처의 메일주소가 기재되지 않도록 주의
//                     email: "",
//                 },
//                 {
//                     // 일련번호, 1부터 순차기재
//                     serialNum: 2,

//                     // 담당자명
//                     contactName: "담당자 성명 2",

//                     // 담당자 메일
//                     // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//                     // 실제 거래처의 메일주소가 기재되지 않도록 주의
//                     email: "",
//                 },
//             ],
//         };
//         // 세금계산서 객체 목록에 추가
//         taxinvoiceList.push(Taxinvoice);
//     }
//     taxinvoiceService.bulkSubmit(
//         CorpNum,
//         submitID,
//         taxinvoiceList,
//         forceIssue,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//                 receiptID: result.receiptID,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 접수시 기재한 SubmitID를 사용하여 세금계산서 접수결과를 확인합니다.
 * - 개별 세금계산서 처리상태는 접수상태(txState)가 완료(2) 시 반환됩니다
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#GetBulkResult
 */
// router.get("/GetBulkResult", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 초대량 발행 접수시 기재한 제출아이디
//     var submitID = "20220629-NODE";

//     taxinvoiceService.getBulkResult(
//         CorpNum,
//         submitID,
//         function (result) {
//             res.render("Taxinvoice/BulkResult", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 작성된 세금계산서 데이터를 팝빌에 저장합니다.
 * - "임시저장" 상태의 세금계산서는 발행(Issue) 함수를 호출하여 "발행완료" 처리한 경우에만 국세청으로 전송됩니다.
 * - 정발행 시 임시저장(Register)과 발행(Issue)을 한번의 호출로 처리하는 즉시발행(RegistIssue API) 프로세스 연동을 권장합니다.
 * - 역발행 시 임시저장(Register)과 역발행요청(Request)을 한번의 호출로 처리하는 즉시요청(RegistRequest API) 프로세스 연동을 권장합니다.
 * - 세금계산서 파일첨부 기능을 구현하는 경우, 임시저장(Register API) -> 파일첨부(AttachFile API) -> 발행(Issue API) 함수를 차례로 호출합니다.
 * - 역발행 세금계산서를 저장하는 경우, 객체 "Taxinvoice"의 변수 "chargeDirection" 값을 통해 과금 주체를 지정할 수 있습니다.
 *   └ 정과금 : 공급자 과금 , 역과금 : 공급받는자 과금
 * - 임시저장된 세금계산서는 팝빌 사이트 "임시문서함"에서 확인 가능합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#Register
 */
// router.get("/Register", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
//     var mgtKey = "20220629-002";

//     // 세금계산서 항목
//     var Taxinvoice = {
//         // 작성일자, 날짜형식 yyyyMMdd
//         writeDate: "20220629",

//         // 과금방향, {정과금, 역과금}중 선택
//         // - 정과금(공급자과금), 역과금(공급받는자과금)
//         // - 역과금은 역발행 세금계산서를 발행하는 경우만 가능
//         chargeDirection: "정과금",

//         // 발행형태, {정발행, 역발행, 위수탁} 중 기재
//         issueType: "정발행",

//         // {영수, 청구, 없음} 중 기재
//         purposeType: "영수",

//         // 과세형태, {과세, 영세, 면세} 중 기재
//         taxType: "과세",

//         /************************************************************************
//          *                              공급자 정보
//          **************************************************************************/

//         // 공급자 사업자번호, "-" 제외 10자리
//         invoicerCorpNum: CorpNum,

//         // [정발행시 필수] 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
//         invoicerMgtKey: mgtKey,

//         // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//         invoicerTaxRegID: "",

//         // 공급자 상호
//         invoicerCorpName: "공급자 상호",

//         // 대표자 성명
//         invoicerCEOName: "대표자 성명",

//         // 공급자 주소
//         invoicerAddr: "공급자 주소",

//         // 공급자 종목
//         invoicerBizClass: "공급자 업종",

//         // 공급자 업태
//         invoicerBizType: "공급자 업태",

//         // 공급자 담당자명
//         invoicerContactName: "공급자 담당자명",

//         // 공급자 연락처
//         invoicerTEL: "",

//         // 공급자 휴대폰번호
//         invoicerHP: "",

//         // 공급자 메일주소
//         invoicerEmail: "",

//         // 발행 안내 문자 전송여부 (true / false 중 택 1)
//         // └ true = 전송 , false = 미전송
//         // └ 공급받는자 (주)담당자 휴대폰번호 {invoiceeHP1} 값으로 문자 전송
//         // - 전송 시 포인트 차감되며, 전송실패시 환불처리
//         invoicerSMSSendYN: false,

//         /************************************************************************
//          *                           공급받는자 정보
//          **************************************************************************/

//         // 공급받는자 구분, {사업자, 개인, 외국인} 중 기재
//         invoiceeType: "사업자",

//         // 공급받는자 사업자번호
//         // - {invoiceeType}이 "사업자" 인 경우, 사업자번호 (하이픈 ("-") 제외 10자리)
//         // - {invoiceeType}이 "개인" 인 경우, 주민등록번호 (하이픈 ("-") 제외 13자리)
//         // - {invoiceeType}이 "외국인" 인 경우, "9999999999999" (하이픈 ("-") 제외 13자리)
//         invoiceeCorpNum: "8888888888",

//         // [역발행시 필수] 공급받는자 문서번호
//         invoiceeMgtKey: "",

//         // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//         invoiceeTaxRegID: "",

//         // 공급받는자 상호
//         invoiceeCorpName: "공급받는자 상호",

//         // 공급받는자 대표자 성명
//         invoiceeCEOName: "공급받는자 대표자 성명",

//         // 공급받는자 주소
//         invoiceeAddr: "공급받는자 주소",

//         // 공급받는자 종목
//         invoiceeBizClass: "공급받는자 종목",

//         // 공급받는자 업태
//         invoiceeBizType: "공급받는자 업태",

//         // 공급받는자 담당자명
//         invoiceeContactName1: "공급받는자 담당자명",

//         // 공급받는자 연락처
//         invoiceeTEL1: "",

//         // 공급받는자 휴대폰번호
//         invoiceeHP1: "",

//         // 공급받는자 이메일 주소
//         // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//         // 실제 거래처의 메일주소가 기재되지 않도록 주의
//         invoiceeEmail1: "",

//         // 역발행 요청시 알림문자 전송여부 (역발행에서만 사용가능)
//         // - 공급자 담당자 휴대폰번호(invoicerHP)로 전송
//         // - 전송시 포인트가 차감되며 전송실패하는 경우 포인트 환불처리
//         invoiceeSMSSendYN: false,

//         /************************************************************************
//          *                           세금계산서 기재정보
//          **************************************************************************/

//         // 공급가액 합계
//         supplyCostTotal: "10000",

//         // 세액합계
//         taxTotal: "1000",

//         // 합계금액 (공급가액 합계 + 세액 합계)
//         totalAmount: "11000",

//         // 기재 상 "일련번호"" 항목
//         serialNum: "123",

//         // 기재 상 "현금"" 항목
//         cash: "",

//         // 기재 상 "수표" 항목
//         chkBill: "",

//         // 기재 상 "어음" 항목
//         note: "",

//         // 기재 상 "외상" 항목
//         credit: "",

//         // 비고
//         // {invoiceeType}이 "외국인" 이면 remark1 필수
//         // - 외국인 등록번호 또는 여권번호 입력
//         remark1: "비고",
//         remark2: "비고2",
//         remark3: "비고3",

//         // 기재 상 "권" 항목, 최대값 32767
//         kwon: "",

//         // 기재 상 "호" 항목, 최대값 32767
//         ho: "",

//         // 사업자등록증 이미지 첨부여부 (true / false 중 택 1)
//         // └ true = 첨부 , false = 미첨부(기본값)
//         // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
//         businessLicenseYN: false,

//         // 통장사본 이미지 첨부여부 (true / false 중 택 1)
//         // └ true = 첨부 , false = 미첨부(기본값)
//         // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
//         bankBookYN: false,

//         /************************************************************************
//          *                           상세항목(품목) 정보 (최대 99건)
//          **************************************************************************/

//         detailList: [
//             {
//                 serialNum: 1, // 일련번호, 1부터 순차기재
//                 purchaseDT: "20220629", // 거래일자, 형식 : yyyyMMdd
//                 itemName: "품명1",
//                 spec: "규격",
//                 qty: "1", // 수량, 소수점 2자리까지 기재 가능
//                 unitCost: "5000", // 단가, 소수점 2자리까지 기재 가능
//                 supplyCost: "5000", // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 tax: "500", // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 remark: "비고",
//             },
//             {
//                 serialNum: 2, // 일련번호, 1부터 순차기재
//                 purchaseDT: "20220629", // 거래일자, 형식 : yyyyMMdd
//                 itemName: "품명2",
//                 spec: "규격",
//                 qty: "1", // 수량, 소수점 2자리까지 기재 가능
//                 unitCost: "5000", // 단가, 소수점 2자리까지 기재 가능
//                 supplyCost: "5000", // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 tax: "500", // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 remark: "비고",
//             },
//         ],

//         /************************************************************************
//          *                         수정세금계산서 기재정보
//          * - 수정세금계산서를 작성하는 경우에만 값을 기재합니다.
//          * - 수정세금계산서 관련 정보는 연동매뉴얼 또는 개발가이드 링크 참조
//          * - [참고] 수정세금계산서 작성방법 안내 - https://developers.popbill.com/guide/taxinvoice/node/introduction/modified-taxinvoice
//          **************************************************************************/

//         // [수정세금계산서 발행시 필수] 수정사유코드, 수정사유에 따라 1~6 숫자 기재
//         modifyCode: "",

//         // [수정세금계산서 발행시 필수] 원본세금계산서 국세청승인번호 기재
//         orgNTSConfirmNum: "",

//         /************************************************************************
//          *                             추가담당자 정보
//          * - 세금계산서 발행안내 메일을 수신받을 공급받는자 담당자가 다수인 경우
//          * 추가 담당자 정보를 등록하여 발행안내메일을 다수에게 전송할 수 있습니다. (최대 5명)
//          **************************************************************************/

//         // 추가담당자 정보
//         addContactList: [
//             {
//                 // 일련번호, 1부터 순차기재
//                 serialNum: 1,

//                 // 담당자명
//                 contactName: "담당자 성명",

//                 // 담당자 메일
//                 // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//                 // 실제 거래처의 메일주소가 기재되지 않도록 주의
//                 email: "",
//             },
//             {
//                 // 일련번호, 1부터 순차기재
//                 serialNum: 2,

//                 // 담당자명
//                 contactName: "담당자 성명 2",

//                 // 담당자 메일
//                 // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//                 // 실제 거래처의 메일주소가 기재되지 않도록 주의
//                 email: "",
//             },
//         ],
//     };

//     taxinvoiceService.register(
//         CorpNum,
//         Taxinvoice,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * "임시저장" 상태의 세금계산서를 수정합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#Update
 */
// router.get("/Update", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 세금계산서 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
//     var mgtKey = "20220629-002";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 세금계산서 항목
//     var Taxinvoice = {
//         // 작성일자, 날짜형식 yyyyMMdd
//         writeDate: "20220629",

//         // 과금방향, {정과금, 역과금}중 선택
//         // - 정과금(공급자과금), 역과금(공급받는자과금)
//         // - 역과금은 역발행 세금계산서를 발행하는 경우만 가능
//         chargeDirection: "정과금",

//         // 발행형태, {정발행, 역발행, 위수탁} 중 기재
//         issueType: "정발행",

//         // {영수, 청구, 없음} 중 기재
//         purposeType: "영수",

//         // 과세형태, {과세, 영세, 면세} 중 기재
//         taxType: "과세",

//         /************************************************************************
//          *                              공급자 정보
//          **************************************************************************/

//         // 공급자 사업자번호, "-" 제외 10자리
//         invoicerCorpNum: CorpNum,

//         // [정발행시 필수] 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
//         invoicerMgtKey: mgtKey,

//         // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//         invoicerTaxRegID: "",

//         // 공급자 상호
//         invoicerCorpName: "공급자 상호_수정",

//         // 대표자 성명
//         invoicerCEOName: "대표자 성명_수정",

//         // 공급자 주소
//         invoicerAddr: "공급자 주소",

//         // 공급자 종목
//         invoicerBizClass: "공급자 업종",

//         // 공급자 업태
//         invoicerBizType: "공급자 업태",

//         // 공급자 담당자명
//         invoicerContactName: "공급자 담당자명",

//         // 공급자 연락처
//         invoicerTEL: "",

//         // 공급자 휴대폰번호
//         invoicerHP: "",

//         // 공급자 메일주소
//         invoicerEmail: "",

//         // 발행 안내 문자 전송여부 (true / false 중 택 1)
//         // └ true = 전송 , false = 미전송
//         // └ 공급받는자 (주)담당자 휴대폰번호 {invoiceeHP1} 값으로 문자 전송
//         // - 전송 시 포인트 차감되며, 전송실패시 환불처리
//         invoicerSMSSendYN: false,

//         /************************************************************************
//          *                           공급받는자 정보
//          **************************************************************************/

//         // 공급받는자 구분, {사업자, 개인, 외국인} 중 기재
//         invoiceeType: "사업자",

//         // 공급받는자 사업자번호
//         // - {invoiceeType}이 "사업자" 인 경우, 사업자번호 (하이픈 ("-") 제외 10자리)
//         // - {invoiceeType}이 "개인" 인 경우, 주민등록번호 (하이픈 ("-") 제외 13자리)
//         // - {invoiceeType}이 "외국인" 인 경우, "9999999999999" (하이픈 ("-") 제외 13자리)
//         invoiceeCorpNum: "8888888888",

//         // [역발행시 필수] 공급받는자 문서번호
//         invoiceeMgtKey: "",

//         // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//         invoiceeTaxRegID: "",

//         // 공급받는자 상호
//         invoiceeCorpName: "공급받는자 상호",

//         // 공급받는자 대표자 성명
//         invoiceeCEOName: "공급받는자 대표자 성명",

//         // 공급받는자 주소
//         invoiceeAddr: "공급받는자 주소",

//         // 공급받는자 종목
//         invoiceeBizClass: "공급받는자 종목",

//         // 공급받는자 업태
//         invoiceeBizType: "공급받는자 업태",

//         // 공급받는자 담당자명
//         invoiceeContactName1: "공급받는자 담당자명",

//         // 공급받는자 연락처
//         invoiceeTEL1: "",

//         // 공급받는자 휴대폰번호
//         invoiceeHP1: "",

//         // 공급받는자 이메일 주소
//         // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//         // 실제 거래처의 메일주소가 기재되지 않도록 주의
//         invoiceeEmail1: "",

//         // 역발행 요청시 알림문자 전송여부 (역발행에서만 사용가능)
//         // - 공급자 담당자 휴대폰번호(invoicerHP)로 전송
//         // - 전송시 포인트가 차감되며 전송실패하는 경우 포인트 환불처리
//         invoiceeSMSSendYN: false,

//         /************************************************************************
//          *                           세금계산서 기재정보
//          **************************************************************************/

//         // 공급가액 합계
//         supplyCostTotal: "10000",

//         // 세액합계
//         taxTotal: "1000",

//         // 합계금액 (공급가액 합계 + 세액 합계)
//         totalAmount: "11000",

//         // 기재 상 "일련번호"" 항목
//         serialNum: "123",

//         // 기재 상 "현금"" 항목
//         cash: "",

//         // 기재 상 "수표" 항목
//         chkBill: "",

//         // 기재 상 "어음" 항목
//         note: "",

//         // 기재 상 "외상" 항목
//         credit: "",

//         // 비고
//         // {invoiceeType}이 "외국인" 이면 remark1 필수
//         // - 외국인 등록번호 또는 여권번호 입력
//         remark1: "비고",
//         remark2: "비고2",
//         remark3: "비고3",

//         // 기재 상 "권" 항목, 최대값 32767
//         kwon: "",

//         // 기재 상 "호" 항목, 최대값 32767
//         ho: "",

//         // 사업자등록증 이미지 첨부여부 (true / false 중 택 1)
//         // └ true = 첨부 , false = 미첨부(기본값)
//         // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
//         businessLicenseYN: false,

//         // 통장사본 이미지 첨부여부 (true / false 중 택 1)
//         // └ true = 첨부 , false = 미첨부(기본값)
//         // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
//         bankBookYN: false,

//         /************************************************************************
//          *                           상세항목(품목) 정보 (최대 99건)
//          **************************************************************************/

//         detailList: [
//             {
//                 serialNum: 1, // 일련번호, 1부터 순차기재
//                 purchaseDT: "20220629", // 거래일자, 형식 : yyyyMMdd
//                 itemName: "품명1",
//                 spec: "규격",
//                 qty: "1", // 수량, 소수점 2자리까지 기재 가능
//                 unitCost: "5000", // 단가, 소수점 2자리까지 기재 가능
//                 supplyCost: "5000", // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 tax: "500", // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 remark: "비고",
//             },
//             {
//                 serialNum: 2, // 일련번호, 1부터 순차기재
//                 purchaseDT: "20220629", // 거래일자, 형식 : yyyyMMdd
//                 itemName: "품명2",
//                 spec: "규격",
//                 qty: "1", // 수량, 소수점 2자리까지 기재 가능
//                 unitCost: "5000", // 단가, 소수점 2자리까지 기재 가능
//                 supplyCost: "5000", // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 tax: "500", // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 remark: "비고",
//             },
//         ],

//         /************************************************************************
//          *                         수정세금계산서 기재정보
//          * - 수정세금계산서를 작성하는 경우에만 값을 기재합니다.
//          * - 수정세금계산서 관련 정보는 연동매뉴얼 또는 개발가이드 링크 참조
//          * - [참고] 수정세금계산서 작성방법 안내 - https://developers.popbill.com/guide/taxinvoice/node/introduction/modified-taxinvoice
//          **************************************************************************/

//         // [수정세금계산서 발행시 필수] 수정사유코드, 수정사유에 따라 1~6 숫자 기재
//         modifyCode: "",

//         // [수정세금계산서 발행시 필수] 원본세금계산서 국세청승인번호 기재
//         orgNTSConfirmNum: "",

//         /************************************************************************
//          *                             추가담당자 정보
//          * - 세금계산서 발행안내 메일을 수신받을 공급받는자 담당자가 다수인 경우
//          * 추가 담당자 정보를 등록하여 발행안내메일을 다수에게 전송할 수 있습니다. (최대 5명)
//          **************************************************************************/

//         // 추가담당자 정보
//         addContactList: [
//             {
//                 // 일련번호, 1부터 순차기재
//                 serialNum: 1,

//                 // 담당자명
//                 contactName: "담당자 성명",

//                 // 담당자 메일
//                 // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//                 // 실제 거래처의 메일주소가 기재되지 않도록 주의
//                 email: "",
//             },
//             {
//                 // 일련번호, 1부터 순차기재
//                 serialNum: 2,

//                 // 담당자명
//                 contactName: "담당자 성명 2",

//                 // 담당자 메일
//                 // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//                 // 실제 거래처의 메일주소가 기재되지 않도록 주의
//                 email: "",
//             },
//         ],
//     };

//     taxinvoiceService.update(
//         CorpNum,
//         keyType,
//         mgtKey,
//         Taxinvoice,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * "임시저장" 또는 "(역)발행대기" 상태의 세금계산서를 발행(전자서명)하며, "발행완료" 상태로 처리합니다.
 * - 세금계산서 국세청 전송정책 [https://developers.popbill.com/guide/taxinvoice/node/introduction/policy-of-send-to-nts]
 * - "발행완료" 된 전자세금계산서는 국세청 전송 이전에 발행취소(CancelIssue API) 함수로 국세청 신고 대상에서 제외할 수 있습니다.
 * - 세금계산서 발행을 위해서 공급자의 인증서가 팝빌 인증서버에 사전등록 되어야 합니다.
 *   └ 위수탁발행의 경우, 수탁자의 인증서 등록이 필요합니다.
 * - 세금계산서 발행 시 공급받는자에게 발행 메일이 발송됩니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#Issue
 */
// router.get("/Issue", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-002";

//     // 메모
//     var memo = "발행 테스트";

//     // 발행 안내메일 제목, 미기재시 기본제목으로 전송
//     var emailSubject = "";

//     // 지연발행 강제여부  (true / false 중 택 1)
//     // └ true = 가능 , false = 불가능
//     // - 미입력 시 기본값 false 처리
//     // - 발행마감일이 지난 세금계산서를 발행하는 경우, 가산세가 부과될 수 있습니다.
//     // - 가산세가 부과되더라도 발행을 해야하는 경우에는 forceIssue의 값을
//     //   true로 선언하여 발행(Issue API)를 호출하시면 됩니다.
//     var forceIssue = false;

//     taxinvoiceService.issue(
//         CorpNum,
//         keyType,
//         mgtKey,
//         memo,
//         emailSubject,
//         forceIssue,
//         UserID,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//                 ntsConfirmNum: result.ntsConfirmNum,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

// /**
//  * 국세청 전송 이전 "발행완료" 상태의 세금계산서를 "발행취소"하고 국세청 전송 대상에서 제외합니다.
//  * - Delete(삭제)함수를 호출하여 "발행취소" 상태의 전자세금계산서를 삭제하면, 문서번호 재사용이 가능합니다.
//  * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#CancelIssue
//  */
// router.get("/CancelIssue", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     // 메모
//     var memo = "발행취소 메모";

//     taxinvoiceService.cancelIssue(
//         CorpNum,
//         keyType,
//         mgtKey,
//         memo,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 공급받는자가 작성한 세금계산서 데이터를 팝빌에 저장하고 공급자에게 송부하여 발행을 요청합니다.
 * - 역발행 세금계산서 프로세스를 구현하기 위해서는 공급자/공급받는자가 모두 팝빌에 회원이여야 합니다.
 * - 발행 요청된 세금계산서는 "(역)발행대기" 상태이며, 공급자가 팝빌 사이트 또는 함수를 호출하여 발행한 경우에만 국세청으로 전송됩니다.
 * - 공급자는 팝빌 사이트의 "매출 발행 대기함"에서 발행대기 상태의 역발행 세금계산서를 확인할 수 있습니다.
 * - 임시저장(Register API) 함수와 역발행 요청(Request API) 함수를 한 번의 프로세스로 처리합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#RegistRequest
 */
// router.get("/RegistRequest", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 세금계산서 항목
//     var Taxinvoice = {
//         // 작성일자, 날짜형식 yyyyMMdd
//         writeDate: "20220629",

//         // 과금방향, {정과금, 역과금}중 선택
//         // - 정과금(공급자과금), 역과금(공급받는자과금)
//         // - 역과금은 역발행 세금계산서를 발행하는 경우만 가능
//         chargeDirection: "정과금",

//         // 발행형태, {정발행, 역발행, 위수탁} 중 기재
//         issueType: "역발행",

//         // {영수, 청구, 없음} 중 기재
//         purposeType: "영수",

//         // 과세형태, {과세, 영세, 면세} 중 기재
//         taxType: "과세",

//         /************************************************************************
//          *                              공급자 정보
//          **************************************************************************/

//         // 공급자 사업자번호, "-" 제외 10자리
//         invoicerCorpNum: "8888888888",

//         // [정발행시 필수] 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
//         invoicerMgtKey: "",

//         // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//         invoicerTaxRegID: "",

//         // 공급자 상호
//         invoicerCorpName: "공급자 상호",

//         // 대표자 성명
//         invoicerCEOName: "대표자 성명",

//         // 공급자 주소
//         invoicerAddr: "공급자 주소",

//         // 공급자 종목
//         invoicerBizClass: "공급자 업종",

//         // 공급자 업태
//         invoicerBizType: "공급자 업태",

//         // 공급자 담당자명
//         invoicerContactName: "공급자 담당자명",

//         // 공급자 연락처
//         invoicerTEL: "",

//         // 공급자 휴대폰번호
//         invoicerHP: "",

//         // 공급자 메일주소
//         invoicerEmail: "",

//         // 발행 안내 문자 전송여부 (true / false 중 택 1)
//         // └ true = 전송 , false = 미전송
//         // └ 공급받는자 (주)담당자 휴대폰번호 {invoiceeHP1} 값으로 문자 전송
//         // - 전송 시 포인트 차감되며, 전송실패시 환불처리
//         invoicerSMSSendYN: false,

//         /************************************************************************
//          *                           공급받는자 정보
//          **************************************************************************/

//         // 공급받는자 구분, {사업자, 개인, 외국인} 중 기재
//         invoiceeType: "사업자",

//         // 공급받는자 사업자번호
//         // - {invoiceeType}이 "사업자" 인 경우, 사업자번호 (하이픈 ("-") 제외 10자리)
//         // - {invoiceeType}이 "개인" 인 경우, 주민등록번호 (하이픈 ("-") 제외 13자리)
//         // - {invoiceeType}이 "외국인" 인 경우, "9999999999999" (하이픈 ("-") 제외 13자리)
//         invoiceeCorpNum: CorpNum,

//         // [역발행시 필수] 공급받는자 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
//         invoiceeMgtKey: "20220629-100",

//         // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
//         invoiceeTaxRegID: "",

//         // 공급받는자 상호
//         invoiceeCorpName: "공급받는자 상호",

//         // 공급받는자 대표자 성명
//         invoiceeCEOName: "공급받는자 대표자 성명",

//         // 공급받는자 주소
//         invoiceeAddr: "공급받는자 주소",

//         // 공급받는자 종목
//         invoiceeBizClass: "공급받는자 종목",

//         // 공급받는자 업태
//         invoiceeBizType: "공급받는자 업태",

//         // 공급받는자 담당자명
//         invoiceeContactName1: "공급받는자 담당자명",

//         // 공급받는자 연락처
//         invoiceeTEL1: "",

//         // 공급받는자 휴대폰번호
//         invoiceeHP1: "",

//         // 공급받는자 이메일 주소
//         // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//         // 실제 거래처의 메일주소가 기재되지 않도록 주의
//         invoiceeEmail1: "",

//         // 역발행 요청시 알림문자 전송여부 (역발행에서만 사용가능)
//         // - 공급자 담당자 휴대폰번호(invoicerHP)로 전송
//         // - 전송시 포인트가 차감되며 전송실패하는 경우 포인트 환불처리
//         invoiceeSMSSendYN: false,

//         /************************************************************************
//          *                           세금계산서 기재정보
//          **************************************************************************/

//         // 공급가액 합계
//         supplyCostTotal: "10000",

//         // 세액합계
//         taxTotal: "1000",

//         // 합계금액 (공급가액 합계 + 세액 합계)
//         totalAmount: "11000",

//         // 기재 상 "일련번호"" 항목
//         serialNum: "123",

//         // 기재 상 "현금"" 항목
//         cash: "",

//         // 기재 상 "수표" 항목
//         chkBill: "",

//         // 기재 상 "어음" 항목
//         note: "",

//         // 기재 상 "외상" 항목
//         credit: "",

//         // 비고
//         // {invoiceeType}이 "외국인" 이면 remark1 필수
//         // - 외국인 등록번호 또는 여권번호 입력
//         remark1: "비고",
//         remark2: "비고2",
//         remark3: "비고3",

//         // 기재 상 "권" 항목, 최대값 32767
//         kwon: "",

//         // 기재 상 "호" 항목, 최대값 32767
//         ho: "",

//         // 사업자등록증 이미지 첨부여부 (true / false 중 택 1)
//         // └ true = 첨부 , false = 미첨부(기본값)
//         // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
//         businessLicenseYN: false,

//         // 통장사본 이미지 첨부여부 (true / false 중 택 1)
//         // └ true = 첨부 , false = 미첨부(기본값)
//         // - 팝빌 사이트 또는 인감 및 첨부문서 등록 팝업 URL (GetSealURL API) 함수를 이용하여 등록
//         bankBookYN: false,

//         /************************************************************************
//          *                           상세항목(품목) 정보 (최대 99건)
//          **************************************************************************/

//         detailList: [
//             {
//                 serialNum: 1, // 일련번호, 1부터 순차기재
//                 purchaseDT: "20220629", // 거래일자, 형식 : yyyyMMdd
//                 itemName: "품명1",
//                 spec: "규격",
//                 qty: "1", // 수량, 소수점 2자리까지 기재 가능
//                 unitCost: "5000", // 단가, 소수점 2자리까지 기재 가능
//                 supplyCost: "5000", // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 tax: "500", // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 remark: "비고",
//             },
//             {
//                 serialNum: 2, // 일련번호, 1부터 순차기재
//                 purchaseDT: "20220629", // 거래일자, 형식 : yyyyMMdd
//                 itemName: "품명2",
//                 spec: "규격",
//                 qty: "1", // 수량, 소수점 2자리까지 기재 가능
//                 unitCost: "5000", // 단가, 소수점 2자리까지 기재 가능
//                 supplyCost: "5000", // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 tax: "500", // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
//                 remark: "비고",
//             },
//         ],

//         /************************************************************************
//          *                         수정세금계산서 기재정보
//          * - 수정세금계산서를 작성하는 경우에만 값을 기재합니다.
//          * - 수정세금계산서 관련 정보는 연동매뉴얼 또는 개발가이드 링크 참조
//          * - [참고] 수정세금계산서 작성방법 안내 - https://developers.popbill.com/guide/taxinvoice/node/introduction/modified-taxinvoice
//          **************************************************************************/

//         // [수정세금계산서 발행시 필수] 수정사유코드, 수정사유에 따라 1~6 숫자 기재
//         modifyCode: "",

//         // [수정세금계산서 발행시 필수] 원본세금계산서 국세청승인번호 기재
//         orgNTSConfirmNum: "",

//         /************************************************************************
//          *                             추가담당자 정보
//          * - 세금계산서 발행안내 메일을 수신받을 공급받는자 담당자가 다수인 경우
//          * 추가 담당자 정보를 등록하여 발행안내메일을 다수에게 전송할 수 있습니다. (최대 5명)
//          **************************************************************************/
//     };

//     // 메모
//     var memo = "즉시요청 메모";

//     taxinvoiceService.registRequest(
//         CorpNum,
//         Taxinvoice,
//         memo,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 공급받는자가 저장된 역발행 세금계산서를 공급자에게 송부하여 발행 요청합니다.
 * - 역발행 세금계산서 프로세스를 구현하기 위해서는 공급자/공급받는자가 모두 팝빌에 회원이여야 합니다.
 * - 역발행 요청된 세금계산서는 "(역)발행대기" 상태이며, 공급자가 팝빌 사이트 또는 함수를 호출하여 발행한 경우에만 국세청으로 전송됩니다.
 * - 공급자는 팝빌 사이트의 "매출 발행 대기함"에서 발행대기 상태의 역발행 세금계산서를 확인할 수 있습니다.
 * - 역발행 요청시 공급자에게 역발행 요청 메일이 발송됩니다.
 * - 공급자가 역발행 세금계산서 발행시 포인트가 과금됩니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#Request
 */
// router.get("/Request", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.BUY;

//     // 문서번호
//     var mgtKey = "20220629-003";

//     // 메모
//     var memo = "역발행요청 메모";

//     taxinvoiceService.request(
//         CorpNum,
//         keyType,
//         mgtKey,
//         memo,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 공급자가 요청받은 역발행 세금계산서를 발행하기 전, 공급받는자가 역발행요청을 취소합니다.
 * - 함수 호출시 상태 값이 "취소"로 변경되고, 해당 역발행 세금계산서는 공급자에 의해 발행 될 수 없습니다.
 * - [취소]한 세금계산서의 문서번호를 재사용하기 위해서는 삭제 (Delete API) 함수를 호출해야 합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#CancelRequest
 */
// router.get("/CancelRequest", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.BUY;

//     // 문서번호
//     var mgtKey = "20220629-003";

//     // 메모
//     var memo = "역발행요청 취소 메모";

//     taxinvoiceService.cancelRequest(
//         CorpNum,
//         keyType,
//         mgtKey,
//         memo,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 공급자가 공급받는자에게 역발행 요청 받은 세금계산서의 발행을 거부합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#Refuse
 */
// router.get("/Refuse", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-003";

//     // 메모
//     var memo = "역발행요청 거부 메모";

//     taxinvoiceService.refuse(
//         CorpNum,
//         keyType,
//         mgtKey,
//         memo,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 삭제 가능한 상태의 세금계산서를 삭제합니다.
 * - 삭제 가능한 상태: "임시저장", "발행취소", "역발행거부", "역발행취소", "전송실패"
 * - 세금계산서를 삭제해야만 문서번호(mgtKey)를 재사용할 수 있습니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#Delete
 */
// router.get("/Delete", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     taxinvoiceService.delete(
//         CorpNum,
//         keyType,
//         mgtKey,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 공급자가 "발행완료" 상태의 전자세금계산서를 국세청에 즉시 전송하며, 함수 호출 후 최대 30분 이내에 전송 처리가 완료됩니다.
 * - 국세청 즉시전송을 호출하지 않은 세금계산서는 발행일 기준 익일 오후 3시에 팝빌 시스템에서 일괄적으로 국세청으로 전송합니다.
 * - 익일전송시 전송일이 법정공휴일인 경우 다음 영업일에 전송됩니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/issue#SendToNTS
 */
// router.get("/SendToNTS", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     taxinvoiceService.sendToNTS(
//         CorpNum,
//         keyType,
//         mgtKey,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서 1건의 상태 및 요약정보를 확인합니다.
 * 리턴값 "TaxinvoiceInfo"의 변수 "stateCode"를 통해 세금계산서의 상태코드를 확인합니다.
 * 세금계산서 상태코드 [https://developers.popbill.com/reference/taxinvoice/node/response-code#state-code]
 * - https://developers.popbill.com/reference/taxinvoice/node/api/info#GetInfo
 */
// router.get("/GetInfo", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     taxinvoiceService.getInfo(
//         CorpNum,
//         keyType,
//         mgtKey,
//         function (result) {
//             res.render("Taxinvoice/TaxinvoiceInfo", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 다수건의 세금계산서 상태 및 요약 정보를 확인합니다. (1회 호출 시 최대 1,000건 확인 가능)
 * 리턴값 "TaxinvoiceInfo"의 변수 "stateCode"를 통해 세금계산서의 상태코드를 확인합니다.
 * 세금계산서 상태코드 [https://developers.popbill.com/reference/taxinvoice/node/response-code#state-code]
 * - https://developers.popbill.com/reference/taxinvoice/node/api/info#GetInfos
 */
// router.get("/GetInfos", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호 배열, 최대 1000건
//     var mgtKeyList = ["20220629-001", "20220629-002"];

//     taxinvoiceService.getInfos(
//         CorpNum,
//         keyType,
//         mgtKeyList,
//         function (result) {
//             res.render("Taxinvoice/TaxinvoiceInfos", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서 1건의 상세정보를 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/info#GetDetailInfo
 */
// router.get("/GetDetailInfo", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     taxinvoiceService.getDetailInfo(
//         CorpNum,
//         keyType,
//         mgtKey,
//         function (result) {
//             res.render("Taxinvoice/TaxinvoiceDetail", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서 1건의 상세정보를 XML로 반환합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/info#GetXML
 */
// router.get("/GetXML", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     taxinvoiceService.getXML(
//         CorpNum,
//         keyType,
//         mgtKey,
//         function (result) {
//             res.render("Taxinvoice/TaxinvoiceXML", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 검색조건에 해당하는 세금계산서를 조회합니다. (조회기간 단위 : 최대 6개월)
 * - https://developers.popbill.com/reference/taxinvoice/node/api/info#Search
 */
// router.get("/Search", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 일자유형 ("R" , "W" , "I" 중 택 1)
//     // - R = 등록일자 , W = 작성일자 , I = 발행일자
//     var DType = "W";

//     // 시작일자, 날짜형식yyyyMMdd)
//     var SDate = "20220601";

//     // 종료일자, 날짜형식yyyyMMdd)
//     var EDate = "20220629";

//     // 세금계산서 상태코드 배열 (2,3번째 자리에 와일드카드(*) 사용 가능)
//     // - 미입력시 전체조회
//     var State = ["3**", "6**"];

//     // 문서유형 배열 ("N" , "M" 중 선택, 다중 선택 가능)
//     // - N = 일반세금계산서 , M = 수정세금계산서
//     // - 미입력시 전체조회
//     var Type = ["N", "M"];

//     // 과세형태 배열 ("T" , "N" , "Z" 중 선택, 다중 선택 가능)
//     // - T = 과세 , N = 면세 , Z = 영세
//     // - 미입력시 전체조회
//     var TaxType = ["T", "N", "Z"];

//     // 발행형태 배열 ("N" , "R" , "T" 중 선택, 다중 선택 가능)
//     // - N = 정발행 , R = 역발행 , T = 위수탁발행
//     // - 미입력시 전체조회
//     var IssueType = ["N", "R", "T"];

//     // 등록유형 배열 ("P" , "H" 중 선택, 다중 선택 가능)
//     // - P = 팝빌에서 등록 , H = 홈택스 또는 외부ASP 등록
//     // - 미입력시 전체조회
//     var RegType = ["P", "H"];

//     // 공급받는자 휴폐업상태 배열 ("N" , "0" , "1" , "2" , "3" , "4" 중 선택, 다중 선택 가능)
//     // - N = 미확인 , 0 = 미등록 , 1 = 사업 , 2 = 폐업 , 3 = 휴업 , 4 = 확인실패
//     // - 미입력시 전체조회
//     var CloseDownState = ["N", "0", "1", "2", "3"];

//     // 지연발행 여부 (null , true , false 중 택 1)
//     // - null = 전체조회 , true = 지연발행 , false = 정상발행
//     var LateOnly = null;

//     // 정렬방향, D-내림차순, A-오름차순
//     var Order = "D";

//     // 페이지 번호
//     var Page = 1;

//     // 페이지당 검색개수, 최대 1000건
//     var PerPage = 5;

//     // 종사업장번호의 주체 ("S" , "B" , "T" 중 택 1)
//     // └ S = 공급자 , B = 공급받는자 , T = 수탁자
//     // - 미입력시 전체조회
//     var TaxRegIDType = "S";

//     // 종사업장번호 유무 (null , "0" , "1" 중 택 1)
//     // - null = 전체 , 0 = 없음, 1 = 있음
//     var TaxRegIDYN = "";

//     // 종사업장번호, 콤마(",")로 구분하여 구성 ex) "0001,1234"
//     var TaxRegID = "";

//     // 거래처 상호 / 사업자번호 (사업자) / 주민등록번호 (개인) / "9999999999999" (외국인) 중 검색하고자 하는 정보 입력
//     // └ 사업자번호 / 주민등록번호는 하이픈("-")을 제외한 숫자만 입력
//     // - 미입력시 전체조회
//     var QString = "";

//     // 문서번호 또는 국세청승인번호 조회 검색어
//     var MgtKey = "";

//     // 연동문서 여부 (null , "0" , "1" 중 택 1)
//     // └ null = 전체조회 , 0 = 일반문서 , 1 = 연동문서
//     // - 일반문서 : 팝빌 사이트를 통해 저장 또는 발행한 세금계산서
//     // - 연동문서 : 팝빌 API를 통해 저장 또는 발행한 세금계산서
//     var InterOPYN = "";

//     taxinvoiceService.search(
//         CorpNum,
//         keyType,
//         DType,
//         SDate,
//         EDate,
//         State,
//         Type,
//         TaxType,
//         LateOnly,
//         Order,
//         Page,
//         PerPage,
//         TaxRegIDType,
//         TaxRegIDYN,
//         TaxRegID,
//         QString,
//         InterOPYN,
//         UserID,
//         IssueType,
//         RegType,
//         CloseDownState,
//         MgtKey,
//         function (result) {
//             res.render("Taxinvoice/Search", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서의 상태에 대한 변경이력을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/info#GetLogs
 */
// router.get("/GetLogs", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-01";

//     taxinvoiceService.getLogs(
//         CorpNum,
//         keyType,
//         mgtKey,
//         function (result) {
//             res.render("Taxinvoice/TaxinvoiceLogs", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 로그인 상태로 팝빌 사이트의 전자세금계산서 문서함 메뉴에 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/info#GetURL
 */
// router.get("/GetURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // TBOX : 임시 문서함 , SWBOX : 매출 발행 대기함 , SBOX : 매출 문서함 , PWBOX : 매입 발행 대기함 , PBOX : 매입 문서함 , WRITE : 정발행 작성
//     var TOGO = "TBOX";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getURL(
//         CorpNum,
//         TOGO,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 팝빌 사이트와 동일한 세금계산서 1건의 상세 정보 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/view#GetPopUpURL
 */
// router.get("/GetPopUpURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getPopUpURL(
//         CorpNum,
//         keyType,
//         mgtKey,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 1건의 전자세금계산서 보기 팝업 URL을 반환합니다. (버튼/메뉴 제외)
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/view#GetViewURL
 */
// router.get("/GetViewURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getViewURL(
//         CorpNum,
//         keyType,
//         mgtKey,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서 1건을 인쇄하기 위한 페이지의 팝업 URL을 반환하며, 페이지내에서 인쇄 설정값을 "공급자" / "공급받는자" / "공급자+공급받는자"용 중 하나로 지정할 수 있습니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/view#GetPrintURL
 */
// router.get("/GetPrintURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getPrintURL(
//         CorpNum,
//         keyType,
//         mgtKey,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서 1건을 구버전 양식으로 인쇄하기 위한 페이지의 팝업 URL을 반환하며, 페이지내에서 인쇄 설정값을 "공급자" / "공급받는자" / "공급자+공급받는자"용 중 하나로 지정할 수 있습니다..
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/view#GetOldPrintURL
 */
// router.get("/GetOldPrintURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getOldPrintURL(
//         CorpNum,
//         keyType,
//         mgtKey,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * "공급받는자" 용 세금계산서 1건을 인쇄하기 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/view#GetEPrintURL
 */
// router.get("/GetEPrintURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getEPrintURL(
//         CorpNum,
//         keyType,
//         mgtKey,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 다수건의 세금계산서를 인쇄하기 위한 페이지의 팝업 URL을 반환합니다. (최대 100건)
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/view#GetMassPrintURL
 */
// router.get("/GetMassPrintURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호 배열, 최대 100건
//     var mgtKeyList = ["20220629-001", "20220629-002"];

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getMassPrintURL(
//         CorpNum,
//         keyType,
//         mgtKeyList,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 안내메일과 관련된 전자세금계산서를 확인 할 수 있는 상세 페이지의 팝업 URL을 반환하며, 해당 URL은 메일 하단의 "전자세금계산서 보기" 버튼의 링크와 같습니다.
 * - 함수 호출로 반환 받은 URL에는 유효시간이 없습니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/view#GetMailURL
 */
// router.get("/GetMailURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getMailURL(
//         CorpNum,
//         keyType,
//         mgtKey,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 전자세금계산서 PDF 파일을 다운 받을 수 있는 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * -  https://developers.popbill.com/reference/taxinvoice/node/api/view#GetPDFURL
 */
// router.get("/GetPDFURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getPDFURL(
//         CorpNum,
//         keyType,
//         mgtKey,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/member#GetAccessURL
 */
// router.get("/GetAccessURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getAccessURL(
//         CorpNum,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서에 첨부할 인감, 사업자등록증, 통장사본을 등록하는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#GetSealURL
 */
// router.get("/GetSealURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getSealURL(
//         CorpNum,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * "임시저장" 상태의 세금계산서에 1개의 파일을 첨부합니다. (최대 5개)
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#AttachFile
 */
// router.get("/AttachFile", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-002";

//     // 파일경로
//     var FilePaths = ["./test.jpg"];

//     // 파일명
//     var fileName = FilePaths[0].replace(/^.*[\\\/]/, "");

//     taxinvoiceService.attachFile(
//         CorpNum,
//         keyType,
//         mgtKey,
//         fileName,
//         FilePaths,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * "임시저장" 상태의 세금계산서에 첨부된 1개의 파일을 삭제합니다.
 * - 파일을 식별하는 파일아이디는 첨부파일 목록(GetFiles API) 의 응답항목 중 파일아이디(AttachedFile) 값을 통해 확인할 수 있습니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#DeleteFile
 */
// router.get("/DeleteFile", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-002";

//     // 삭제할 파일아이디, getFiles API의 attachedFile 변수값으로 확인
//     var fileID = "";

//     taxinvoiceService.deleteFile(
//         CorpNum,
//         keyType,
//         mgtKey,
//         fileID,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서에 첨부된 파일목록을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#GetFiles
 */
// router.get("/GetFiles", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-002";

//     taxinvoiceService.getFiles(
//         CorpNum,
//         keyType,
//         mgtKey,
//         function (result) {
//             res.render("Taxinvoice/AttachedFile", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서와 관련된 안내 메일을 재전송 합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#SendEmail
 */
// router.get("/SendEmail", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     // 수신 메일주소
//     // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
//     // 실제 거래처의 메일주소가 기재되지 않도록 주의
//     var receiver = "";

//     taxinvoiceService.sendEmail(
//         CorpNum,
//         keyType,
//         mgtKey,
//         receiver,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서와 관련된 안내 SMS(단문) 문자를 재전송하는 함수로, 팝빌 사이트 [문자·팩스] > [문자] > [전송내역] 메뉴에서 전송결과를 확인 할 수 있습니다.
 * - 메시지는 최대 90byte까지 입력 가능하고, 초과한 내용은 자동으로 삭제되어 전송합니다. (한글 최대 45자)
 * - 함수 호출시 포인트가 과금됩니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#SendSMS
 */
// router.get("/SendSMS", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     // 발신번호
//     var senderNum = "";

//     // 수신번호
//     var receiverNum = "";

//     // 메세지 내용, 90byte 초과시 길이가 조정되어 전송됨
//     var contents = "팝빌 전자세금계산서 문자전송";

//     taxinvoiceService.sendSMS(
//         CorpNum,
//         keyType,
//         mgtKey,
//         senderNum,
//         receiverNum,
//         contents,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서를 팩스로 전송하는 함수로, 팝빌 사이트 [문자·팩스] > [팩스] > [전송내역] 메뉴에서 전송결과를 확인 할 수 있습니다.
 * - 메시지는 최대 90byte까지 입력 가능하고, 초과한 내용은 자동으로 삭제되어 전송합니다. (한글 최대 45자)
 * - 함수 호출시 포인트가 과금됩니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#SendFAX
 */
// router.get("/SendFAX", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-001";

//     // 발신번호
//     var senderNum = "";

//     // 수신팩스번호
//     var receiverNum = "";

//     taxinvoiceService.sendFAX(
//         CorpNum,
//         keyType,
//         mgtKey,
//         senderNum,
//         receiverNum,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 팝빌 전자명세서 API를 통해 발행한 전자명세서를 세금계산서에 첨부합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#AttachStatement
 */
// router.get("/AttachStatement", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-003";

//     // 첨부할 전자명세서 종류코드, 121-거래명세서, 122-청구서, 123-발주서, 124-견적서, 125-입금표, 126-영수증
//     var subItemCode = 121;

//     // 첨부할 전자명세서 문서번호
//     var subMgtKey = "20220629-001";

//     taxinvoiceService.attachStatement(
//         CorpNum,
//         keyType,
//         mgtKey,
//         subItemCode,
//         subMgtKey,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서에 첨부된 전자명세서를 해제합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#DetachStatement
 */
// router.get("/DetachStatement", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 문서번호
//     var mgtKey = "20220629-003";

//     // 첨부해제할 전자명세서 종류코드, 121-거래명세서, 122-청구서, 123-발주서, 124-견적서, 125-입금표, 126-영수증
//     var subItemCode = 121;

//     // 첨부해제할 전자명세서 문서번호
//     var subMgtKey = "20220629-001";

//     taxinvoiceService.detachStatement(
//         CorpNum,
//         keyType,
//         mgtKey,
//         subItemCode,
//         subMgtKey,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 전자세금계산서 유통사업자의 메일 목록을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#GetEmailPublicKeys
 */
// router.get("/GetEmailPublicKeys", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     taxinvoiceService.getEmailPublicKeys(
//         CorpNum,
//         function (result) {
//             res.render("Taxinvoice/EmailPublicKeys", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 팝빌 사이트를 통해 발행하여 문서번호가 부여되지 않은 세금계산서에 문서번호를 할당합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#AssignMgtKey
 */
// router.get("/AssignMgtKey", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
//     var keyType = popbill.MgtKeyType.SELL;

//     // 세금계산서 팝빌번호, 문서 목록조회(Search) API의 반환항목중 ItemKey 참조
//     var itemKey = "021111509343200001";

//     // 할당할 문서번호, 최대 24자리, 영문, 숫자 "-", "_"를 조합하여 사업자별로 중복되지 않도록 구성
//     var mgtKey = "20220629-001";

//     taxinvoiceService.assignMgtKey(
//         CorpNum,
//         keyType,
//         itemKey,
//         mgtKey,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서 관련 메일 항목에 대한 발송설정을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#ListEmailConfig
 */
// router.get("/ListEmailConfig", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     taxinvoiceService.listEmailConfig(
//         CorpNum,
//         function (result) {
//             res.render("Taxinvoice/ListEmailConfig", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 세금계산서 관련 메일 항목에 대한 발송설정을 수정합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#UpdateEmailConfig
 * 메일전송유형
 * [정발행]
 * TAX_ISSUE : 공급받는자에게 전자세금계산서가 발행 되었음을 알려주는 메일입니다.
 * TAX_ISSUE_INVOICER : 공급자에게 전자세금계산서가 발행 되었음을 알려주는 메일입니다.
 * TAX_CHECK : 공급자에게 전자세금계산서가 수신확인 되었음을 알려주는 메일입니다.
 * TAX_CANCEL_ISSUE : 공급받는자에게 전자세금계산서가 발행취소 되었음을 알려주는 메일입니다.
 *
 *
 * [역발행]
 * TAX_REQUEST : 공급자에게 세금계산서를 전자서명 하여 발행을 요청하는 메일입니다.
 * TAX_CANCEL_REQUEST : 공급받는자에게 세금계산서가 취소 되었음을 알려주는 메일입니다.
 * TAX_REFUSE : 공급받는자에게 세금계산서가 거부 되었음을 알려주는 메일입니다.
 *
 * [위수탁발행]
 * TAX_TRUST_ISSUE : 공급받는자에게 전자세금계산서가 발행 되었음을 알려주는 메일입니다.
 * TAX_TRUST_ISSUE_TRUSTEE : 수탁자에게 전자세금계산서가 발행 되었음을 알려주는 메일입니다.
 * TAX_TRUST_ISSUE_INVOICER : 공급자에게 전자세금계산서가 발행 되었음을 알려주는 메일입니다.
 * TAX_TRUST_CANCEL_ISSUE : 공급받는자에게 전자세금계산서가 발행취소 되었음을 알려주는 메일입니다.
 * TAX_TRUST_CANCEL_ISSUE_INVOICER : 공급자에게 전자세금계산서가 발행취소 되었음을 알려주는 메일입니다.
 *
 * [처리결과]
 * TAX_CLOSEDOWN : 거래처의 휴폐업 여부를 확인하여 안내하는 메일입니다.
 * TAX_NTSFAIL_INVOICER : 전자세금계산서 국세청 전송실패를 안내하는 메일입니다.
 *
 * [정기발송]
 * ETC_CERT_EXPIRATION : 팝빌에 등록된 인증서의 만료예정을 안내하는 메일입니다.
 */
// router.get("/UpdateEmailConfig", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 메일 전송 유형
//     var emailType = "TAX_ISSUE";

//     // 전송 여부 (true = 전송, false = 미전송)
//     var sendYN = true;

//     taxinvoiceService.updateEmailConfig(
//         CorpNum,
//         emailType,
//         sendYN,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원의 국세청 전송 옵션 설정 상태를 확인합니다.
 * - 팝빌 국세청 전송 정책 [https://developers.popbill.com/guide/taxinvoice/node/introduction/policy-of-send-to-nts]
 * - 국세청 전송 옵션 설정은 팝빌 사이트 [전자세금계산서] > [환경설정] > [세금계산서 관리] 메뉴에서 설정할 수 있으며, API로 설정은 불가능 합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/etc#GetSendToNTSConfig
 */
// router.get("/GetSendToNTSConfig", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     taxinvoiceService.getSendToNTSConfig(
//         CorpNum,
//         function (result) {
//             res.render("Taxinvoice/SendToNTSConfig", {
//                 path: req.path,
//                 sendToNTSConfig: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 전자세금계산서 발행에 필요한 인증서를 팝빌 인증서버에 등록하기 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - 인증서 갱신/재발급/비밀번호 변경한 경우, 변경된 인증서를 팝빌 인증서버에 재등록 해야합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/cert#GetTaxCertURL
 */
// router.get("/GetTaxCertURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getTaxCertURL(
//         CorpNum,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 팝빌 인증서버에 등록된 인증서의 만료일을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/cert#GetCertificateExpireDate
 */
// router.get("/GetCertificateExpireDate", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     taxinvoiceService.getCertificateExpireDate(
//         CorpNum,
//         function (expireDate) {
//             res.render("result", {
//                 path: req.path,
//                 result: expireDate,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 팝빌 인증서버에 등록된 인증서의 유효성을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/cert#CheckCertValidation
 */
// router.get("/CheckCertValidation", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     taxinvoiceService.checkCertValidation(
//         CorpNum,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 팝빌 인증서버에 등록된 공동인증서의 정보를 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/cert#GetTaxCertInfo
 */
// router.get("/GetTaxCertInfo", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     taxinvoiceService.getTaxCertInfo(
//         CorpNum,
//         function (result) {
//             res.render("Taxinvoice/TaxinvoiceCertificate", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원의 잔여포인트를 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetBalance
 */
// router.get("/GetBalance", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     taxinvoiceService.getBalance(
//         CorpNum,
//         function (remainPoint) {
//             res.render("result", {
//                 path: req.path,
//                 result: remainPoint,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetChargeURL
//  */
// router.get("/GetChargeURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getChargeURL(
//         CorpNum,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원 포인트 결제내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetPaymentURL
 */
// router.get("/GetPaymentURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getPaymentURL(
//         CorpNum,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원 포인트 사용내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetUseHistoryURL
 */
// router.get("/GetUseHistoryURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getUseHistoryURL(
//         CorpNum,
//         UserID,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 파트너의 잔여포인트를 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetPartnerBalance
 */
// router.get("/GetPartnerBalance", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     taxinvoiceService.getPartnerBalance(
//         CorpNum,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 파트너 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetPartnerURL
 */
// router.get("/GetPartnerURL", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // CHRG(포인트충전)
//     var TOGO = "CHRG";

//     taxinvoiceService.getPartnerURL(
//         CorpNum,
//         TOGO,
//         function (url) {
//             res.render("result", {
//                 path: req.path,
//                 result: url,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 전자세금계산서 발행단가를 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetUnitCost
 */
// router.get("/GetUnitCost", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     taxinvoiceService.getUnitCost(
//         CorpNum,
//         function (unitCost) {
//             res.render("result", {
//                 path: req.path,
//                 result: unitCost,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 팝빌 전자세금계산서 API 서비스 과금정보를 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetChargeInfo
 */
// router.get("/GetChargeInfo", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     taxinvoiceService.getChargeInfo(
//         CorpNum,
//         function (result) {
//             res.render("Base/getChargeInfo", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 사업자번호를 조회하여 연동회원 가입여부를 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/member#CheckIsMember
 */
router.get("/CheckIsMember", async (req, res, next) => {
    // 조회할 사업자번호, "-" 제외 10자리
    const CorpNum = req.query.companyRegistrationNumber;

    try {
        const result = await new Promise((res, rej) => {
            taxinvoiceService.checkIsMember(
                CorpNum,
                function (result) {
                    res(result);
                },
                function (err) {
                    console.log(err);
                    rej(err);
                },
            );
        });
    
        res.send(result);
    } catch(e) {
        res.status(500).send(e);
    }
});

/**
 * 사용하고자 하는 아이디의 중복여부를 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/member#CheckID
 */
router.get("/CheckID", async (req, res, next) => {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    const id = req.query.id;

    try {
        const result = await new Promise((res, rej) => {
            taxinvoiceService.checkID(
                id,
                function (result) {
                    res(result)
                },
                function (err) {
                    console.log(err);
                    rej(err);
                },
            );
        });
    
        res.send(result);
    } catch(e) {
        res.status(500).send(e);
    }
});

/**
 * 사용자를 연동회원으로 가입처리합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/member#JoinMember
 */
router.post("/JoinMember", async (req, res, next) => {
    const {
        id,
        password,
        companyRegistrationNumber,
        ceoName,
        companyName,
        address,
        bizType,
        bizItem,
        contactName,
        contactEmail,
        contactPhoneNo,
    } = req.body;
 
    // 회원정보
    const joinInfo = {
        // 회원 아이디 (6자 이상 50자 미만)
        ID: id,

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: password,

        // 링크아이디
        LinkID: popbillConfig.POPBILL_LINK_ID,

        // 사업자번호, "-" 제외 10자리
        CorpNum: companyRegistrationNumber,

        // 대표자명 (최대 100자)
        CEOName: ceoName,

        // 상호 (최대 200자)
        CorpName: companyName,

        // 주소 (최대 300자)
        Addr: address,

        // 업태 (최대 100자)
        BizType: bizType,

        // 종목 (최대 100자)
        BizClass: bizItem,

        // 담당자 성명 (최대 100자)
        ContactName: contactName,

        // 담당자 이메일 (최대 20자)
        ContactEmail: contactEmail,

        // 담당자 연락처 (최대 20자)
        ContactTEL: contactPhoneNo,
    };

    try {
        const result = await new Promise((res, rej) => {
            taxinvoiceService.joinMember(
                joinInfo,
                function (result) {
                    res(result);
                },
                function (err) {
                    console.log(err)
                    rej(err);
                },
            );
        })
    
        res.send(result);
    } catch(e) {
        res.status(500).send(e);
    }
});

/**
 * 연동회원의 회사정보를 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/member#GetCorpInfo
 */
router.get("/GetCorpInfo", async (req, res, next) => {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    const CorpNum = req.query.companyRegistrationNumber;

    try {
        const result = await new Promise((res, rej) => {
            taxinvoiceService.getCorpInfo(
                CorpNum,
                function (result) {
                    res(result);
                },
                function (err) {
                    console.log(err);
                    rej(err);
                },
            );
        });

        res.send(result);
    } catch(e) {
        res.status(500).send(e);
    }
});

/**
 * 연동회원의 회사정보를 수정합니다
 * - https://developers.popbill.com/reference/taxinvoice/node/api/member#UpdateCorpInfo
 */
// router.get("/UpdateCorpInfo", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 회사정보
//     var corpInfo = {
//         // 대표자명 (최대 100자)
//         ceoname: "대표자성명_nodejs",

//         // 상호 (최대 200자)
//         corpName: "업체명_nodejs",

//         // 주소 (최대 300자)
//         addr: "서구 천변좌로_nodejs",

//         // 업태 (최대 100자)
//         bizType: "업태_nodejs",

//         // 종목 (최대 100자)
//         bizClass: "종목_nodejs",
//     };

//     taxinvoiceService.updateCorpInfo(
//         CorpNum,
//         corpInfo,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원 사업자번호에 담당자(팝빌 로그인 계정)를 추가합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/member#RegistContact
 */
// router.get("/RegistContact", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 아이디 (6자 이상 50자 미만)
//     var ID = "testkorea03033";

//     // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
//     var Password = "asdf8536!@#";

//     // 담당자명 (최대 100자)
//     var PersonName = "담당자명0309";

//     // 연락처 (최대 20자)
//     var TEL = "010-1234-1234";

//     // 이메일 (최대 100자)
//     var Email = "test@email.com";

//     // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
//     var SearchRole = 3;

//     // 담당자 정보
//     var contactInfo = {
//         id: ID,
//         Password: Password,
//         personName: PersonName,
//         tel: TEL,
//         email: Email,
//         searchRole: SearchRole,
//     };

//     taxinvoiceService.registContact(
//         CorpNum,
//         contactInfo,
//         function (result) {
//             res.render("response", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보를 수정합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/member#UpdateContact
 */
router.put("/UpdateContact", async (req, res, next) => {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    const CorpNum = req.body.companyRegistrationNumber;

    // 팝빌회원 아이디
    const UserID = req.body.popbillId;

    // 담당자 정보 항목
    const contactInfo = {
        // 담당자 아이디
        id: req.body.popbillId,

        // 담당자명 (최대 100자)
        personName: req.body.contactName,

        // 연락처 (최대 20자)
        tel: req.body.contactPhoneNo,

        // 이메일 (최대 100자)
        email:req.body.contactEmail,

        // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
        searchRole: 3,
    };

    try {
        const result = await new Promise((res, rej) => {
            taxinvoiceService.updateContact(
                CorpNum,
                UserID,
                contactInfo,
                function (result) {
                    res(result);
                },
                function (err) {
                    console.log(err);
                    rej(err);
                },
            );
        });
        res.send(result);
    } catch(e) {
        res.status(500).send(e);
    }
});

/**
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/member#GetContactInfo
 */
// router.get("/GetContactInfo", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 확인할 담당자 아이디
//     var contactID = "checkContactID";

//     taxinvoiceService.getContactInfo(
//         CorpNum,
//         contactID,
//         function (result) {
//             res.render("Base/getContactInfo", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 목록을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/member#ListContact
 */
// router.get("/ListContact", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     taxinvoiceService.listContact(
//         CorpNum,
//         function (result) {
//             res.render("Base/listContact", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원 포인트 충전을 위해 무통장입금을 신청합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#PaymentRequest
 */
// router.get("/PaymentRequest", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 입금신청 객체 정보
//     var PaymentForm = {
//         // 담당자명
//         settlerName: "테스트_담당자",

//         // 담당자 이메일
//         settlerEmail: "damdang@email.com",

//         // 담당자 휴대폰
//         notifyHP: "01011112222",

//         // 입금자명
//         paymentName: "입금자_테스트",

//         // 결제금액
//         settleCost: "1000",
//     };

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.paymentRequest(
//         CorpNum,
//         PaymentForm,
//         UserID,
//         function (result) {
//             res.render("Base/paymentResponse", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원 포인트 무통장 입금신청내역 1건을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetSettleResult
 */
// router.get("/GetSettleResult", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 정산코드 - PaymentRequest 호출시 반환되는 값
//     var SettleCode = "202305120000000035";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getSettleResult(
//         CorpNum,
//         SettleCode,
//         UserID,
//         function (result) {
//             res.render("Base/paymentHistory", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원의 포인트 결제내역을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetPaymentHistory
 */
// router.get("/GetPaymentHistory", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 조회 기간의 시작일자 (형식 : yyyyMMdd)
//     var SDate = "20230101";

//     // 조회 기간의 종료일자 (형식 : yyyyMMdd)
//     var EDate = "20230107";

//     // 목록 페이지번호 (기본값 1)
//     var Page = 1;

//     // 페이지당 표시할 목록 개수 (기본값 500, 최대 1,000)
//     var PerPage = 500;

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getPaymentHistory(
//         CorpNum,
//         SDate,
//         EDate,
//         Page,
//         PerPage,
//         UserID,
//         function (result) {
//             res.render("Base/paymentHistoryResult", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원의 포인트 사용내역을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetUseHistory
 */
// router.get("/GetUseHistory", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 조회 기간의 시작일자 (형식 : yyyyMMdd)
//     var SDate = "20230501";

//     // 조회 기간의 종료일자 (형식 : yyyyMMdd)
//     var EDate = "20230530";

//     // 목록 페이지번호 (기본값 1)
//     var Page = 1;

//     // 페이지당 표시할 목록 개수(기본값 500, 최대 1,000)
//     var PerPage = 500;

//     // 거래일자를 기준으로 하는 목록 정렬 방향 : "D" / "A" 중 택 1
//     var Order = "D";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getUseHistory(
//         CorpNum,
//         SDate,
//         EDate,
//         Page,
//         PerPage,
//         Order,
//         UserID,
//         function (result) {
//             res.render("Base/useHistoryResult", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원 포인트를 환불 신청합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#Refund
 */
// router.get("/Refund", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 환불신청 객체정보
//     var RefundForm = {
//         // 담당자명
//         ContactName: "환불_담당자",

//         // 담당자 연락처
//         TEL: "010-1234-1234",

//         // 환불 신청 포인트
//         RequestPoint: "100",

//         // 은행명
//         AccountBank: "국민",

//         // 계좌번호
//         AccountNum: "123123123-123",

//         // 예금주명
//         AccountName: "환불_예금주",

//         // 환불 사유
//         Reason: "환불사유",
//     };

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.refund(
//         CorpNum,
//         RefundForm,
//         UserID,
//         function (result) {
//             res.render("Base/refundResponse", {
//                 path: req.path,
//                 code: result.code,
//                 message: result.message,
//                 refundCode: result.refundCode,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 연동회원의 포인트 환불신청내역을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetRefundHistory
 */
// router.get("/GetRefundHistory", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 목록 페이지번호 (기본값 1)
//     var Page = 1;

//     // 페이지당 표시할 목록 개수 (기본값 500, 최대 1,000)
//     var PerPage = 500;

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getRefundHistory(
//         CorpNum,
//         Page,
//         PerPage,
//         UserID,
//         function (result) {
//             res.render("Base/RefundHistoryResult", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 가입된 연동회원의 탈퇴를 요청합니다.
 * - 회원탈퇴 신청과 동시에 팝빌의 모든 서비스 이용이 불가하며, 관리자를 포함한 모든 담당자 계정도 일괄탈퇴 됩니다.
 * - 회원탈퇴로 삭제된 데이터는 복원이 불가능합니다.
 * - 관리자 계정만 회원탈퇴가 가능합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/member#QuitMember
 */
router.post("/QuitMember", async (req, res, next) => {
    // 팝빌회원 사업자번호, "-" 제외 10자리
    const CorpNum = req.body.companyRegistrationNumber;

    // 탈퇴 사유
    const QuitReason = req.body.reason;

    // 팝빌회원 아이디
    const UserID = req.body.popbillId;

    try {
        const result = await new Promise((res, rej) => {
            taxinvoiceService.quitMember(
                CorpNum,
                QuitReason,
                UserID,
                function (result) {
                    res(result);
                },
                function (err) {
                    console.log(err);
                    rej(err);
                },
            );
        });

        res.send(result);
    } catch(e) {
        res.status(500).send(e);
    }
});

/**
 * 환불 가능한 포인트를 확인합니다. (보너스 포인트는 환불가능포인트에서 제외됩니다.)
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetRefundableBalance
 */
// router.get("/GetRefundableBalance", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getRefundableBalance(
//         CorpNum,
//         UserID,
//         function (result) {
//             res.render("Base/getRefundableBalance", {
//                 path: req.path,
//                 refundableBalance: result.refundableBalance,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/**
 * 포인트 환불에 대한 상세정보 1건을 확인합니다.
 * - https://developers.popbill.com/reference/taxinvoice/node/api/point#GetRefundInfo
 */
// router.get("/GetRefundInfo", function (req, res, next) {
//     // 팝빌회원 사업자번호, "-" 제외 10자리
//     var CorpNum = "1234567890";

//     // 환불 코드
//     var RefundCode = "023040000017";

//     // 팝빌회원 아이디
//     var UserID = "testkorea";

//     taxinvoiceService.getRefundInfo(
//         CorpNum,
//         RefundCode,
//         UserID,
//         function (result) {
//             res.render("Base/getRefundInfo", {
//                 path: req.path,
//                 result: result,
//             });
//         },
//         function (Error) {
//             res.render("response", {
//                 path: req.path,
//                 code: Error.code,
//                 message: Error.message,
//             });
//         },
//     );
// });

/** 담당자 한명 조회 */
router.get("/GetContact", async (req, res, next) => {
 // 팝빌회원 사업자번호, "-" 제외 10자리
 const CorpNum = req.query.companyRegistrationNumber;

 try {
    const result = await new Promise((res, rej) => {
        taxinvoiceService.listContact(
            CorpNum,
            function (result) {
                res(result);
            },
            function (err) {
                console.log(err)
                rej(err)
            },
        );
     });
     if (result.length === 0) throw new Error('담당자 정보가 없습니다.');
     res.send(result[0]);
 } catch(e) {
    res.status(500).send(e);
 }
});

module.exports = router;