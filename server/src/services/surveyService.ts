import GeneralRegex from "../db/models/GeneralRegex";
import GeneralText from "../db/models/GeneralText";
import GenericText from "../db/models/GenericText";
import Survey from "../db/models/Survey";
import WelcomePart from "../db/models/WelcomePart";
import { CustomError } from "../errors/customError";
import {
  SurveyModel,
  UpdateSurveyStatusResponse,
  UpdateSurveyTitleResponse,
  UpdateSurveyUrlResponse,
} from "../types/types";

export const addSurveyService = async (
  workSpaceID: number,
  title: string,
  isActive?: boolean
) => {
  try {
    const survey = await Survey.create({
      title,
      workspace: workSpaceID,
      isActive,
      url: Date.now().toString(),
    });
    return survey.get();
  } catch (error) {
    throw error;
  }
};

export const getSurveyService = async (
  surveyId: number
): Promise<SurveyModel> => {
  try {
    console.log("ma", surveyId);
    const surveys = await Survey.findByPk(surveyId, {
      include: [
        {
          model: WelcomePart,
          as: "welcomePart",
        },
        {
          model: GenericText,
          as: "genericTexts",
          include: [
            { model: GeneralRegex, as: "generalRegexes" },
            {
              model: GeneralText,
              as: "generalTexts",
            },
          ],
        },
      ],
    });
    return surveys!.get({ plain: true });
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const updateSurveyStatusService = async (
  surveyId: number,
  isActive: boolean
): Promise<UpdateSurveyStatusResponse> => {
  try {
    const updatedDate = new Date();
    await Survey.update(
      { isActive, updatedAt: updatedDate },
      {
        where: {
          id: surveyId,
        },
      }
    );
    return { updatedAt: updatedDate };
  } catch (error) {
    throw error;
  }
};

export const updateSurveyTitleService = async (
  surveyId: number,
  title: string
): Promise<UpdateSurveyTitleResponse> => {
  try {
    const updatedDate = new Date();
    await Survey.update(
      { title, updatedAt: updatedDate },
      {
        where: {
          id: surveyId,
        },
      }
    );

    return { title, updatedAt: updatedDate };
  } catch (error) {
    throw error;
  }
};

export const updateSurveyUrlService = async (
  surveyId: number,
  url: string
): Promise<UpdateSurveyUrlResponse> => {
  try {
    const updatedDate = new Date();
    await Survey.update(
      { url, updatedAt: updatedDate },
      {
        where: {
          id: surveyId,
        },
      }
    );

    return { url, updatedAt: updatedDate };
  } catch (error) {
    throw error;
  }
};

export const deleteSurveyService = async (surveyId: number) => {
  try {
    await Survey.destroy({
      where: {
        id: surveyId,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const moveSurveyService = async (
  targetWorkspaceId: number,
  surveyId: number
) => {
  console.log("moveSurveyService", targetWorkspaceId, surveyId);
  try {
    await Survey.update(
      { workspace: targetWorkspaceId },
      {
        where: {
          id: surveyId,
        },
      }
    );
    return targetWorkspaceId;
  } catch (error) {
    throw error;
  }
};

export const duplicateSurveyService = async (
  targetWorkspaceId: number,
  survey: SurveyModel
) => {
  console.log("duplicateSurveyService", survey);
  try {
    const duplicatedSurvey = await Survey.create({
      ...survey,
      id: undefined,
      workspace: targetWorkspaceId,
    });
    return duplicatedSurvey;
  } catch (error) {
    throw error;
  }
};
