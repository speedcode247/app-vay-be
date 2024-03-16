/* Copyright (c) 2024 Toriti Tech Team https://t.me/ToritiTech */
require('dotenv').config();
const { LANGUAGE_CN } = require('./lang_cn');
const { LANGUAGE_EN } = require('./lang_en');
const { LANGUAGE_VI } = require('./lang_vi');
const { LANGUAGE_KR } = require('././lang_kr');
const { LANGUAGE_LA } = require('./lang_la');
const { LANGUAGE_ML } = require('./lang_ml');
const { LANGUAGE_CB } = require('./lang_cb');

const SYSTEM_LANGUAGE = {
  VI: 1, //Tiéng Việt
  EN: 2, //Tiếng Anh
  CN: 3, //Tiếng Trung Quốc
  KR: 4, //Tiếng Hàn Quốc
  LA: 5, //Tiếng Lao
  ML: 6, //Tiếng Malaysia
  CB: 7, //Tiếng Cambodia
  PL: 8  //Tiếng Philipin
};

const DEFAULT_LANGUAGE = process.env.SYSTEM_LANGUAGE || 'vi'
function translate(key, language = DEFAULT_LANGUAGE) {
  if (Object.values(SYSTEM_LANGUAGE).includes(language)) {
    let _translateText = '';
    switch (language) {
      case SYSTEM_LANGUAGE.EN:
        _translateText = LANGUAGE_EN[key];
        break;
      case SYSTEM_LANGUAGE.VI:
        _translateText = LANGUAGE_VI[key];
        break;
      case SYSTEM_LANGUAGE.CN:
        _translateText = LANGUAGE_CN[key];
        break;
      case SYSTEM_LANGUAGE.KR:
        _translateText = LANGUAGE_KR[key];
        break;
      case SYSTEM_LANGUAGE.ML:
        _translateText = LANGUAGE_ML[key];
        break;
      case SYSTEM_LANGUAGE.LA:
        _translateText = LANGUAGE_LA[key];
        break;
      case SYSTEM_LANGUAGE.CB:
        _translateText = LANGUAGE_CB[key];
        break;
      default:
        break;
    }

    //Nếu nội dung chưa được định nghĩa hoặc xảy ra sai sót thì sẽ coi như là "chưa dịch"
    if (_translateText && _translateText !== "") {
      return _translateText;
    }
  }

  //khi không dịch thì sẽ xuất hiện nội dung này.
  //đọc vào đây developer sẽ biết là thiếu định nghĩa cho translation của text này
  return 'Not Translate Yet';
}

module.exports = {
  SYSTEM_LANGUAGE,
  translate,
};
