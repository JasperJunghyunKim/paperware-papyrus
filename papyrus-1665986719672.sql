
CREATE TABLE company
(
  company_id            INT          NOT NULL AUTO_INCREMENT COMMENT '기업ID',
  company_type          TINYINT      NOT NULL COMMENT '기업구분',
  company_nm_paperware  VARCHAR(30)  NOT NULL COMMENT '기업명(페이퍼웨어)',
  company_nm_registered VARCHAR(30)  NOT NULL COMMENT '기업명(사업자등록증)',
  logo_img              VARCHAR(100) NULL     COMMENT '로고 이미지 URL',
  reg_img               VARCHAR(100) NULL     COMMENT '사업자등록증 이미지 URL',
  invoice_code          CHAR(4)      NOT NULL COMMENT '송장코드',
  registration_no       CHAR(10)     NULL     COMMENT '사업자등록번호',
  corporation_no        CHAR(13)     NULL     COMMENT '법인등록번호',
  headquarter_id        INT          NULL     COMMENT '본사ID',
  biz_type              VARCHAR(20)  NULL     COMMENT '업태',
  biz_items             VARCHAR(20)  NULL     COMMENT '종목',
  original_yn           TINYINT(1)   NOT NULL COMMENT '진위여부',
  paperware_yn          TINYINT(1)   NOT NULL COMMENT '페이퍼웨어 사용여부',
  creator_uid           INT          NOT NULL COMMENT '등록자UID',
  created_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  updater_uid           INT          NULL     COMMENT '수정자UID',
  updated_at            TIMESTAMP    NULL     COMMENT '수정일시',
  PRIMARY KEY (company_id)
) COMMENT '기업';

CREATE TABLE staff
(
  company_id             INT          NOT NULL COMMENT '기업ID',
  staff_uid              INT          NOT NULL AUTO_INCREMENT COMMENT '직원ID',
  id                     VARCHAR(20)  NOT NULL COMMENT '아이디',
  password               VARCHAR(60)  NOT NULL COMMENT '비밀번호',
  staff_nm               VARCHAR(20)  NOT NULL COMMENT '직원명',
  birth_date             DATE         NOT NULL COMMENT '생년월일',
  phone_no               VARCHAR(11)  NOT NULL COMMENT '휴대폰번호',
  gender                 TINYINT         NOT NULL COMMENT '성별',
  email                  VARCHAR(50)  NOT NULL COMMENT '이메일',
  position               TINYINT         NULL     COMMENT '직위',
  duty                   TINYINT         NULL     COMMENT '직책',
  active_yn              TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '활성화여부',
  join_date              DATE         NULL     COMMENT '입사일',
  drop_dt                TIMESTAMP    NULL     COMMENT '탈퇴일시',
  login_fail_cnt         TINYINT      NOT NULL DEFAULT 0 COMMENT '로그인실패횟수',
  memo                   VARCHAR(100) NOT NULL DEFAULT '' COMMENT '비고',
  sell_req_days          TINYINT      NULL     DEFAULT NULL COMMENT '기본매출일',
  sell_ship_req_days     TINYINT      NULL     DEFAULT NULL COMMENT '기본매출납기일',
  purchase_req_days      TINYINT      NULL     DEFAULT NULL COMMENT '기본매입일',
  purchase_ship_req_days TINYINT      NULL     DEFAULT NULL COMMENT '기본매입납기일',
  sheet_input_type       TINYINT      NOT NULL DEFAULT 1 COMMENT 'SHEET재고입력타입',
  creator_uid            INT          NOT NULL COMMENT '등록자UID',
  created_at             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  updater_uid            INT          NULL     COMMENT '수정자UID',
  updated_at             TIMESTAMP    NULL     COMMENT '수정일시',
  PRIMARY KEY (company_id, staff_uid)
) COMMENT '직원';