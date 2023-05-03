
/**
 * 사용자 요청
 */
export interface UserRequest {
  /**
   * 사용자 아이디
   */
  readonly userId: string;
  /**
   * 사용자명
   */
  readonly userNm: string;
  /**
   * 비밀번호
   */
  readonly userPwd: string;
  /**
   * 연락처
   */
  readonly userPhone: string;
}
