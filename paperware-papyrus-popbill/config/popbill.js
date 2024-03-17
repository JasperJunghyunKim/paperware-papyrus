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
const popbill = require("popbill");

/**
 * 팝빌 서비스 연동환경 초기화
 */
const popbillConfig = {
    POPBILL_LINK_ID: process.env.POPBILL_LINK_ID,
    POPBILL_SECRET_KEY: process.env.POPBILL_SECRET_KEY,
    POPBILL_IS_TEST: process.env.POPBILL_IS_TEST === 'true',
    POPBILL_IP_RESTRICT_ON_OFF: process.env.POPBILL_IP_RESTRICT_ON_OFF === 'true',
    POPBILL_USE_STATIC_IP: process.env.POPBILL_USE_STATIC_IP === 'true',
    POPBILL_USE_LOCAL_TIME_YN: process.env.POPBILL_USE_LOCAL_TIME_YN === 'true',
    POPBILL_USER_ID: process.env.POPBILL_USER_ID,
    POPBILL_CORP_NUM: process.env.POPBILL_CORP_NUM,
    PIPBILL_SEND_NUM: process.env.PIPBILL_SEND_NUM,
  };
  
popbill.config({
    // 링크아이디
    LinkID: popbillConfig.POPBILL_LINK_ID,
  
    // 비밀키
    SecretKey: popbillConfig.POPBILL_SECRET_KEY,
  
    // 연동환경 설정값, 개발용(true), 상업용(false)
    IsTest: popbillConfig.POPBILL_IS_TEST,
  
    // 인증토큰 IP제한기능 사용여부, 권장(true)
    IPRestrictOnOff: popbillConfig.POPBILL_IP_RESTRICT_ON_OFF,
  
    // 팝빌 API 서비스 고정 IP 사용여부, 기본값(false)
    UseStaticIP: popbillConfig.POPBILL_USE_STATIC_IP,
  
    // 로컬서버 시간 사용 여부 true(기본값) - 사용, false(미사용)
    UseLocalTimeYN: popbillConfig.POPBILL_USE_LOCAL_TIME_YN,
  
    // function 타입이 아닌 error 를 파라미터로 넣고 API 요청에 대한 응답이 실패할 경우 동작하게 되는 handler.
    defaultErrorHandler: function (Error) {
      console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    },
  });

module.exports = {
    popbill,
    popbillConfig,
}
