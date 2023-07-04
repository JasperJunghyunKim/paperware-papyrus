require('dotenv').config();
/**
 * 팝빌 API Node.js SDK Example
 *
 * Node.js SDK 연동환경 설정방법 안내 : https://developers.popbill.com/guide/taxinvoice/node/getting-started/tutorial
 * 업데이트 일자 : 2023-05-11
 * 연동기술지원 연락처 : 1600-9854
 * 연동기술지원 이메일 : code@linkhubcorp.com
 *
 * <테스트 연동개발 준비사항>
 * 21번째 , 24번째 라인에 선언된 링크아이디(LinkID)와 비밀키(SecretKey)를
 * 링크허브 가입시 메일로 발급받은 인증정보를 참조하여 변경합니다.
 */
var popbill = require("popbill");

/**
 * 팝빌 서비스 연동환경 초기화
 */
popbill.config({
    // 링크아이디
    LinkID: process.env.LINK_ID || "TESTER",

    // 비밀키
    SecretKey: process.env.SECRET_KEY || "SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=",

    // 연동환경 설정값, 개발용(true), 상업용(false)
    IsTest: process.env.IS_TEST,

    // 인증토큰 IP제한기능 사용여부, 권장(true)
    IPRestrictOnOff: process.env.IP_RESTRICT_ON_OFF,

    // 팝빌 API 서비스 고정 IP 사용여부, 기본값(false)
    UseStaticIP: process.env.USE_STATIC_IP,

    // 로컬서버 시간 사용 여부 true(기본값) - 사용, false(미사용)
    UseLocalTimeYN: process.env.USE_LOCAL_TIME_YN,

    // function 타입이 아닌 error 를 파라미터로 넣고 API 요청에 대한 응답이 실패할 경우 동작하게 되는 handler.
    defaultErrorHandler: function (Error) {
        console.log("Error Occur : [" + Error.code + "] " + Error.message);
    },
});
