/* Copyright (c) 2024 Toriti Tech Team https://t.me/ToritiTech */

//Danh sách text cần dịch theo ngôn ngữ
//Bên trong từng module thì sẽ sắp xếp theo key với thứ tự từ A-Z
const LANGUAGE_KR = {
    depositBankingFailedTitle: '은행 입금 실패',
    depositBankingFailedContent: '연결된 은행 계좌에 대한 {{amount}} {{paymentUnit}} 입금이 거부되었습니다',
    depositBankingSuccessTitle: '은행 입금 성공',
    depositBankingSuccessContent: '{{amount}} {{paymentUnit}}를 성공적으로 입금했습니다 - {{usdtAmount}} USDT로 전환되었습니다 - USDT 지갑을 확인하세요',
    welcomeMessage: '환영',
  };
  module.exports = {
    LANGUAGE_KR,
  };