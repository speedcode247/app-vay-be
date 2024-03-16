/* Copyright (c) 2024 Toriti Tech Team https://t.me/ToritiTech */

//Danh sách text cần dịch theo ngôn ngữ
//Bên trong từng module thì sẽ sắp xếp theo key với thứ tự từ A-Z
const LANGUAGE_ML = {
    depositBankingFailedTitle: 'Deposit perbankan gagal',
    depositBankingFailedContent: 'Anda telah dinafikan deposit sebanyak {{amount}} {{paymentUnit}} - ke akaun bank yang dipautkan',
    depositBankingSuccessTitle: 'Deposit perbankan berjaya',
    depositBankingSuccessContent: 'Anda telah berjaya mendepositkan {{amount}} {{paymentUnit}} - ditukar kepada {{usdtAmount}} USDT - semak dompet USDT',
    welcomeMessage: 'Selamat datang',
  };
  module.exports = {
    LANGUAGE_ML,
  };