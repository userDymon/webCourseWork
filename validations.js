import { body } from "express-validator";

export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage("Must be a valid email address"),
    body('password')
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters long"),
];

export const registerValidation = [
    body('email')
        .isEmail()
        .withMessage("Must be a valid email address"),
    body('password')
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters long"),
    body('fullName')
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters long"),
    body('avatarUrl')
        .optional()
        .isURL()
        .withMessage("Must be a valid url"),
];

export const postCreateValidation = [
    body('title')
        .isLength({ min: 3 })
        .isString()
        .withMessage("Title must be at least 3 characters long"),
    body('text')
        .isLength({ min: 10 })
        .isString()
        .withMessage("Text must be at least 10 characters long"),
    body('tags')
        .optional()
        .isString(),
    body('imageUrl')
        .optional()
        .isString(),
];