import {
  Dialog,
  DialogPanel,
  Listbox,
  ListboxOptions,
  ListboxOption,
  ListboxButton,
} from "@headlessui/react";
import { useState } from "react";
import { useLanguage } from "../../lang/LanguageProvider";
import InputSwitchField from "../InputSwitchField";
import ImageUploadField from "../ImageUploadField";
import { validateWithSchema } from "../../../utils/survey";
import PreviewGenericTextArea from "./PreviewGenericTextArea";
import SwitchContainer from "../SwitchContainer";
import { genericTextSchema } from "../../../utils/genericText";
import { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setDescription,
  setLabel,
  setIsDescriptionEnabled,
  setIsImageUploadEnabled,
  setImageFile,
  setPreviewImageUrl,
} from "../../../store/slices/sharedFormSlice";
import {
  setAnswerFormat,
  setHideQuestionNumber,
  setIsRequired,
  setMaxLength,
  setMinLength,
  setRegex,
  setRegexErrorMessage,
  setRegexPlaceHolder,
} from "../../../store/slices/genericTextSlice";
import { handleMinMaxChange, returnFileAndUrl } from "../../../utils";

const GenericTextQuestion = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);
  const [selected, setSelected] = useState("Text");

  const options = [
    { id: 1, name: "Text" },
    { id: 2, name: "Custom Pattern" },
  ];

  const { t, getCurrentLanguage } = useLanguage();
  const {
    label,
    description,
    isImageUploadEnabled,
    isDescriptionEnabled,
    previewImageUrl,
    hideQuestionNumber,
    isRequired,
    maxLength,
    minLength,
    regex,
    regexPlaceHolder,
    regexErrorMessage,
    answerFormat,
  } = useSelector((state: RootState) => ({
    label: state.sharedForm.label,
    description: state.sharedForm.description,
    imageFile: state.sharedForm.fileImage,
    isImageUploadEnabled: state.sharedForm.isImageUploadEnabled,
    isDescriptionEnabled: state.sharedForm.isDescriptionEnabled,
    previewImageUrl: state.sharedForm.previewImageUrl,
    hideQuestionNumber: state.genericText.hideQuestionNumber,
    isRequired: state.genericText.isRequired,
    maxLength: state.genericText.maxLength,
    minLength: state.genericText.minLength,
    regex: state.genericText.regex,
    regexPlaceHolder: state.genericText.regexPlaceHolder,
    regexErrorMessage: state.genericText.regexErrorMessage,
    answerFormat: state.genericText.answerFormat,
  }));

  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = async (file: File | null) => {
    const { file: _file, url } = await returnFileAndUrl(file);

    setFile(_file);
    dispatch(setImageFile({ fileType: _file?.type, fileSize: _file?.size }));
    dispatch(setPreviewImageUrl(url));
  };

  const handleSwitchChange =
    (
      field: "isRequired" | "description" | "imageUpload" | "hideQuestionNumber"
    ) =>
    (enabled: boolean) => {
      if (field === "isRequired") {
        dispatch(setIsRequired(enabled));
      } else if (field === "description") {
        dispatch(setIsDescriptionEnabled(enabled));
      } else if (field === "imageUpload") {
        dispatch(setIsImageUploadEnabled(enabled));
      } else if (field === "hideQuestionNumber") {
        dispatch(setHideQuestionNumber(enabled));
      }
    };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setValidationErrors(null);
      e.preventDefault();
      setIsSubmitting(true);

      const isCustomPattern = selected.toLowerCase() === "custom pattern";
      const isText = selected.toLowerCase() === "text";

      const schema = genericTextSchema(
        isText,
        isCustomPattern,
        regexPlaceHolder.trim().length !== 0,
        isCustomPattern,
        hideQuestionNumber,
        isDescriptionEnabled,
        isImageUploadEnabled,
        isRequired
      );

      const formData = {
        label,
        ...(isDescriptionEnabled && { description }),
        ...(isImageUploadEnabled && { file }),
        ...(isCustomPattern && { regex, regexErrorMessage }),
        ...(regexPlaceHolder.trim().length !== 0 && { regexPlaceHolder }),
        ...(isText && { minLength, maxLength }),
        ...(isRequired && { isRequired }),
        ...(hideQuestionNumber && { hideQuestionNumber }),
      };

      const data = schema.parse(formData);
      console.log(data);
    } catch (error) {
      setValidationErrors(validateWithSchema(error, getCurrentLanguage()));
      console.log("Error saving survey:", validationErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (type: "min" | "max", value: string) => {
    const { updatedMin, updatedMax, validationErrors } = handleMinMaxChange(
      type,
      value,
      Number(minLength),
      Number(maxLength),
      t
    );
    console.log(updatedMin, updatedMax, validationErrors);

    dispatch(setMinLength(updatedMin));
    dispatch(setMaxLength(updatedMax));
    setValidationErrors(validationErrors);
  };
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50 text-sm main_text"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-[#1e1e1e] rounded-md w-full h-full flex flex-col">
          <div className="flex items-center gap-5 border-b border-b-gray-500 pb-2 px-2">
            <button type="button" onClick={onClose}>
              <img
                src="/assets/icons/close.svg"
                alt="Close"
                className="w-[20px] h-[20px]"
              />
            </button>
            <span className="text-lg main_text_bold">{t("welcomePage")}</span>
          </div>
          <div className="flex h-full overflow-y-auto">
            <form
              className="flex flex-col space-y-4 w-full h-full overflow-y-scroll md:w-1/4 border-r border-r-gray-600 pb-4 pt-2 px-3"
              onSubmit={handleSave}
            >
              <div className="flex flex-col flex-grow gap-5 px-4">
                <InputSwitchField
                  label={t("Label")}
                  value={label}
                  onChange={(e) => dispatch(setLabel(e.target.value))}
                  switchChecked={true}
                  placeholder={t("Label")}
                  required={false}
                  hasSwitch={false}
                  type={"editor"}
                  border={false}
                  errorMessage={validationErrors?.label}
                />
                <InputSwitchField
                  label={t("description")}
                  value={description}
                  onChange={(e) => dispatch(setDescription(e.target.value))}
                  switchChecked={isDescriptionEnabled}
                  onSwitchChange={handleSwitchChange("description")}
                  placeholder={t("description")}
                  required={false}
                  hasSwitch={true}
                  type={"editor"}
                  border={false}
                  errorMessage={validationErrors?.description}
                />
                <div className="flex justify-between gap-4 p-4 main_text items-center flex-wrap">
                  <span className="main_text_bold">Answer Format</span>
                  <Listbox
                    value={selected}
                    onChange={(value) => {
                      setSelected(value);
                      dispatch(setAnswerFormat(value));
                    }}
                  >
                    <div className="relative">
                      <ListboxButton className="cursor-default py-2 px-4 w-[150px] text-left bg-transparent border border-[#85808025]">
                        <span className="block truncate">{selected}</span>
                      </ListboxButton>
                      <ListboxOptions className="absolute mt-1 bg-black border w-full top-8 border-[#85808025] shadow-lg max-h-60 overflow-y-auto z-[51]">
                        {options.map((option) => (
                          <ListboxOption
                            key={option.id}
                            value={option.name}
                            className={({ active }) =>
                              `cursor-pointer select-none relative text-white w-full ${
                                active
                                  ? "bg-[#141414] font-semibold"
                                  : "bg-black font-semibold"
                              }`
                            }
                          >
                            {({ selected }) => (
                              <span
                                className={`block truncate p-2 ${
                                  selected
                                    ? "font-medium bg-blue-600"
                                    : "font-normal"
                                }`}
                              >
                                {option.name}
                              </span>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                </div>

                {/* Conditional Fields */}
                {selected.toLowerCase() === "custom pattern" && (
                  <>
                    <InputSwitchField
                      label="Pattern(RegEx validation)"
                      value={regex}
                      onChange={(e) => dispatch(setRegex(e.target.value))}
                      hasSwitch={false}
                      switchChecked={true}
                      required={false}
                      type="text"
                      border={false}
                      errorMessage={validationErrors?.regex}
                    />
                    <InputSwitchField
                      label="Example"
                      value={regexPlaceHolder}
                      onChange={(e) =>
                        dispatch(setRegexPlaceHolder(e.target.value))
                      }
                      hasSwitch={false}
                      switchChecked={true}
                      required={false}
                      type="text"
                      border={false}
                      errorMessage={validationErrors?.regexPlaceHolder}
                    />
                    <InputSwitchField
                      label="Message to display when answer does not pass RegEx "
                      value={regexErrorMessage}
                      onChange={(e) =>
                        dispatch(setRegexErrorMessage(e.target.value))
                      }
                      hasSwitch={false}
                      switchChecked={true}
                      required={false}
                      type="text"
                      border={true}
                      errorMessage={validationErrors?.regexErrorMessage}
                    />
                  </>
                )}
                {selected.toLowerCase() === "text" && (
                  <div className=" flex flex-col gap-2 border-b border-b-[#85808025] px-4">
                    <span className="main_text_bold">Min/Max characters</span>
                    <InputSwitchField
                      label={t("min")}
                      value={minLength.toString()}
                      onChange={(e) => handleChange("min", e.target.value)}
                      switchChecked={true}
                      placeholder={t("min")}
                      disabled={isSubmitting}
                      required={true}
                      hasSwitch={false}
                      errorMessage={validationErrors?.minLength}
                      type="number"
                      border={false}
                    />
                    <InputSwitchField
                      label={t("max")}
                      value={maxLength.toString()}
                      onChange={(e) => handleChange("max", e.target.value)}
                      switchChecked={true}
                      placeholder={t("max")}
                      disabled={isSubmitting}
                      required={true}
                      hasSwitch={false}
                      errorMessage={validationErrors?.maxLength}
                      type="number"
                      border={false}
                    />
                  </div>
                )}

                <ImageUploadField
                  file={file}
                  setFile={handleFileChange}
                  title=""
                  label="Image"
                  switchChecked={isImageUploadEnabled}
                  onSwitchChange={handleSwitchChange("imageUpload")}
                  errorMessage={validationErrors?.imageFile}
                />
                <SwitchContainer
                  label={t("isRequired")}
                  isRequired={isRequired}
                  setIsRequired={handleSwitchChange("isRequired")}
                  errorMessage={validationErrors?.isRequired}
                />
                <SwitchContainer
                  label={t("hideQuestionNumber")}
                  isRequired={hideQuestionNumber}
                  setIsRequired={handleSwitchChange("hideQuestionNumber")}
                  errorMessage={validationErrors?.hideQuestionNumber}
                />
              </div>

              <div className="flex justify-start gap-5 items-center p-4">
                <button
                  disabled={
                    isSubmitting ||
                    (label.length === 0 &&
                      !isImageUploadEnabled &&
                      !isDescriptionEnabled)
                  }
                  type="submit"
                  className={`${
                    isSubmitting ||
                    (label.length === 0 &&
                      !isImageUploadEnabled &&
                      !isDescriptionEnabled)
                      ? "bg-[#0000001e]"
                      : "bg-[#2f2b72] "
                  } transition-all main_text_bold py-2 px-4 rounded`}
                >
                  {t("save")}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#2f2b7226] main_text_bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
            <PreviewGenericTextArea
              imageUrl={
                isImageUploadEnabled && previewImageUrl
                  ? previewImageUrl
                  : undefined
              }
              label={label ? label : undefined}
              description={isDescriptionEnabled ? description : undefined}
              isRequired={isRequired}
              regex={regex.trim().length !== 0 ? regex : undefined}
              regexErrorMessage={regexErrorMessage}
              regexPlaceHolder={regexPlaceHolder}
              max={+maxLength}
              min={+minLength}
              answerFormat={answerFormat}
              hideQuestionNumber={hideQuestionNumber}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default GenericTextQuestion;