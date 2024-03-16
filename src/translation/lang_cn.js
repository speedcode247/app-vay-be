/* Copyright (c) 2024 Toriti Tech Team https://t.me/ToritiTech */

//Danh sách text cần dịch theo ngôn ngữ
//Bên trong từng module thì sẽ sắp xếp theo key với thứ tự từ A-Z
const LANGUAGE_CN = {
  depositBankingFailedTitle: '銀行存款失敗',
  depositBankingFailedContent: '您已被拒絕存入與關聯的銀行帳戶 {{amount}} {{paymentUnit}} 的款項',
  depositBankingSuccessTitle: '銀行存款成功',
  depositBankingSuccessContent: '您已成功存入 {{amount}} {{ paymentUnit}} - 轉換為 {{usdtAmount}} USDT - 檢查 USDT 錢包',
  welcomeMessage: 'Xiao',
};
module.exports = {
  LANGUAGE_CN,
};
