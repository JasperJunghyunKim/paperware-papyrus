/**
 * 에러 열거형 상수 인터페이스이다.
 */
export interface AppError extends Error {
  /**
   * code
   */
  readonly code: string;
  /**
   * 메시지
   */
  readonly message: string;
  /**
   * 메시지 아규먼트
   */
  msgArgs?: Array<string> | Array<number>;
}
