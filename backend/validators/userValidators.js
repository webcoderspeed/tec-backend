import Joi from 'joi';

export const validateRegister = (body, next) => {

  const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
  });

  const { error } = registerSchema.validate(body)

  if (error) next(error)
};

export const validateLogin = (body, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
  })

  const { error } = loginSchema.validate(body);

  if (error) next(error);
};

export const validateUpdateUserProfile = (body, next) => {

  const updateUserProfileSchema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).optional(),
    file: Joi.string().optional(),
    password: Joi.string().min(6).pattern(/^[a-zA-Z0-9]{3,30}$/).optional(),
    isAdmin: Joi.string().max(10).optional(),
  });

  const { error } = updateUserProfileSchema.validate(body);

  if (error) next(error)
};

export const validateUpdateUser = (body, next) => {
  const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).optional(),
    file: Joi.string().optional(),
    password: Joi.string().min(6).pattern(/^[a-zA-Z0-9]{3,30}$/).optional(),
    isAdmin: Joi.string().optional()
  });

  const { error } = updateUserSchema.validate(body);

  if (error) next(error)
}

export const validateAddUser = (body, next) => {
  const addUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    file: Joi.string().required(),
    password: Joi.string().min(6).pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
    isAdmin: Joi.string().required()
  });

  const { error } = addUserSchema.validate(body);

  if (error) next(error)
}

export const validateFollowUserId = (body, next) => {
  const followUserIdSchema = Joi.object({
    userId: Joi.string().optional()
  });

  const { error } = followUserIdSchema.validate(body);

  if (error) next(error);
};


