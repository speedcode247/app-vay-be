import Joi from 'joi';

const accpeted_fields = ['avatar', 'phone', 'name'];

const schema = Joi.object({
  name: Joi.string().max(30).min(2).required(),
  phone: Joi.string()
    .pattern(
      new RegExp('^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$')
    )
    .required(),
});

export const valid_update_form = (req, res, next) => {
  const fields = Object.keys(req.body);
  try {
    fields.map((item) => {
      if (!accpeted_fields.includes(item)) {
        throw new Error(`Do not accpet ${item} field`);
      }
    });
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const valid_sigup_form = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ message: err.details[0].message });
  }
};
