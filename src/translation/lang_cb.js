/* Copyright (c) 2024 Toriti Tech Team https://t.me/ToritiTech */

//Danh sách text cần dịch theo ngôn ngữ
//Bên trong từng module thì sẽ sắp xếp theo key với thứ tự từ A-Z
const LANGUAGE_CB = {
    depositBankingFailedTitle: 'ការដាក់ប្រាក់តាមធនាគារបានបរាជ័យ',
    depositBankingFailedContent: 'អ្នកត្រូវបានបដិសេធការដាក់ប្រាក់ចំនួន {{amount}} {{paymentUnit}} - ទៅគណនីធនាគារដែលបានភ្ជាប់',
    depositBankingSuccessTitle: 'ការដាក់ប្រាក់តាមធនាគារបានជោគជ័យ',
    depositBankingSuccessContent: 'អ្នកបានដាក់ប្រាក់ដោយជោគជ័យ {{amount}} {{paymentUnit}} - បំប្លែងទៅជា {{usdtAmount}} USDT - ពិនិត្យកាបូប USDT',
    welcomeMessage: 'ស្វាគមន៍',
  };
  module.exports = {
    LANGUAGE_CB,
  };