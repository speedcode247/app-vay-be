/* Copyright (c) 2024 Toriti Tech Team https://t.me/ToritiTech */

//Danh sách text cần dịch theo ngôn ngữ
//Bên trong từng module thì sẽ sắp xếp theo key với thứ tự từ A-Z
const LANGUAGE_EN = {
  depositBankingFailedTitle: 'Banking deposit failed',
  depositBankingFailedContent: 'You have been denied a deposit of {{amount}} {{paymentUnit}} - to the linked bank account',
  depositBankingSuccessTitle: 'Banking deposit successful',
  depositBankingSuccessContent: 'You have successfully deposited {{amount}} {{paymentUnit}} - converted to {{usdtAmount}} USDT - check USDT wallet',
  welcomeMessage: 'Hello world',
};
module.exports = {
  LANGUAGE_EN,
};
