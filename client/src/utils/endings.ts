import { object, string, number, boolean, ZodIssueCode } from "zod";

export const customEndingSchema = (defaultEnding: boolean) => {
  return object({
    redirectUrl: string().url(),
    label: string().max(100).optional().nullable(),
    defaultEnding: boolean()
      .optional()
      .refine((val) => !defaultEnding || val, {
        message: "defaultEnding",
      }),
  });
};

export const fileSchema = () => {
  return object({
    type: string().refine((val) => val.startsWith("image/"), {
      message: "invalidImageType",
    }),
  });
};

export const defaultEndingSchema = (
  isDescriptionEnabled: boolean,
  isImageUploadEnabled: boolean,
  shareSurvey: boolean,
  defaultEnding: boolean,
  reloadOrRedirectButton: boolean,
  autoReload: boolean
) => {
  return object({
    label: string()
      .min(1, { message: "labelRequired" })
      .max(100, { message: "labelIsTooLong" }),

    description: string()
      .max(300, { message: "descriptionTooLong" })
      .optional()
      .nullable()
      .refine((val) => !isDescriptionEnabled || (val && val.length > 0), {
        message: "descriptionRequired",
      }),

    imageUrl: string()
      .optional()
      .nullable()
      .refine(
        (val) =>
          !isImageUploadEnabled ||
          (val && val.match(/^data:image\/(jpeg|png|gif|bmp|webp);base64,/)),
        {
          message: "InvalidImageFormat",
        }
      ),

    defaultEnding: boolean()
      .optional()
      .nullable()
      .refine((val) => !defaultEnding || val, {
        message: "defaultEnding",
      }),
    shareSurvey: boolean()
      .optional()
      .nullable()
      .refine((val) => !shareSurvey || val, {
        message: "defaultEnding",
      }),
    buttonText: string()
      .max(50, { message: "buttonTextTooLong" })
      .optional()
      .nullable()
      .refine((val) => !reloadOrRedirectButton || (val && val.length > 0), {
        message: "buttonTextRequired",
      }),
    redirectToWhat: string()
      .max(50, { message: "buttonTextTooLong" })
      .optional()
      .nullable()
      .refine((val) => !reloadOrRedirectButton || (val && val.length > 0), {
        message: "buttonTextRequired",
      }),
    anotherLink: string().url().optional(),
    reloadTimeInSeconds: number()
      .optional()
      .nullable()
      .refine((val) => !autoReload || (val && val >= 1), {
        message: "invalidRealodTime",
      }),
    autoReload: boolean()
      .optional()
      .refine((val) => !autoReload || val, {
        message: "reloadOrDirectButtonRequired",
      }),
    reloadOrRedirect: boolean()
      .optional()
      .nullable()
      .refine((val) => !reloadOrRedirectButton || val, {
        message: "reloadOrDirectButtonRequired",
      }),
  }).superRefine((val, ctx) => {
    if (
      reloadOrRedirectButton &&
      val.redirectToWhat?.toLowerCase() === "another link".toLowerCase() &&
      !val.anotherLink
    ) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "missingAnotherLink",
        path: ["anotherLink"],
      });
    }
  });
};

export const editDefaultEndingSchema = (
  isDescriptionEnabled: boolean,
  isImageUploadEnabled: boolean,
  shareSurvey: boolean,
  defaultEnding: boolean,
  reloadOrRedirectButton: boolean,
  autoReload: boolean
) => {
  return object({
    label: string()
      .min(1, { message: "labelRequired" })
      .max(100, { message: "labelIsTooLong" }),

    description: string()
      .max(300, { message: "descriptionTooLong" })
      .optional()
      .nullable()
      .refine((val) => !isDescriptionEnabled || (val && val.length > 0), {
        message: "descriptionRequired",
      }),

    imageUrl: string()
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!isImageUploadEnabled || val === null || val === undefined) {
            return true;
          }

          const isValidBase64 = val.match(
            /^data:image\/(jpeg|png|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/
          );
          const isValidExternalImage = val.includes("\\uploads\\");

          return isValidBase64 || isValidExternalImage;
        },
        {
          message: "InvalidImageFormat",
        }
      ),

    defaultEnding: boolean()
      .optional()
      .nullable()
      .refine((val) => !defaultEnding || val, {
        message: "defaultEnding",
      }),
    shareSurvey: boolean()
      .optional()
      .nullable()
      .refine((val) => !shareSurvey || val, {
        message: "defaultEnding",
      }),
    buttonText: string()
      .max(50, { message: "buttonTextTooLong" })
      .optional()
      .nullable()
      .refine((val) => !reloadOrRedirectButton || (val && val.length > 0), {
        message: "buttonTextRequired",
      }),
    redirectToWhat: string()
      .max(50, { message: "buttonTextTooLong" })
      .optional()
      .nullable()
      .refine((val) => !reloadOrRedirectButton || (val && val.length > 0), {
        message: "buttonTextRequired",
      }),
    anotherLink: string().url().optional().nullable(),
    reloadTimeInSeconds: number()
      .optional()
      .nullable()
      .refine((val) => !autoReload || (val && val >= 1), {
        message: "invalidRealodTime",
      }),
    reloadOrRedirect: boolean()
      .optional()
      .nullable()
      .refine((val) => !reloadOrRedirectButton || val, {
        message: "reloadOrDirectButtonRequired",
      }),
    autoReload: boolean()
      .optional()
      .nullable()
      .refine((val) => !autoReload || val, {
        message: "reloadOrDirectButtonRequired",
      }),
  }).superRefine((val, ctx) => {
    if (
      reloadOrRedirectButton &&
      val.redirectToWhat?.toLowerCase() === "another link".toLowerCase() &&
      !val.anotherLink
    ) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "missingAnotherLink",
        path: ["anotherLink"],
      });
    }
  });
};
