import { NextFunction, Request, Response } from "express";
import { SurveyModel } from "../types/types";
import {
  addSurveyService,
  deleteSurveyService,
  duplicateSurveyService,
  getSurveyService,
  moveSurveyService,
  updateSurveyStatusService,
  updateSurveyTitleService,
  updateSurveyUrlService,
} from "../services/surveyService";
import { json } from "sequelize";

export const addSurvey = async (
  req: Request<
    { workspaceId: string },
    {},
    { title: string; workspaceId: string }
  >,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const { title, workspaceId } = req.body;
    const surveyData = await addSurveyService(+workspaceId, title);
    res.status(201).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const getSurvey = async (
  req: Request<{ surveyId: string; workspaceId: string }, {}, {}>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    console.log(req.params);
    const { surveyId } = req.params;
    const surveyData = await getSurveyService(+surveyId);
    console.log(surveyData);
    return res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const updateSurveyTitle = async (
  req: Request<{ surveyId: string }, {}, { title: string }>,
  res: Response<{}, { userId: string; workspaceId: string }>,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const { title } = req.body;
    const surveyData = await updateSurveyTitleService(+surveyId, title);
    return res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const updateSurvyStatus = async (
  req: Request<{ surveyId: string }, { isActive: boolean; title: string }>,
  res: Response<{}, { workspaceId: string }>,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const { isActive } = req.body;
    const surveyData = await updateSurveyStatusService(+surveyId, isActive);
    return res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const updateSurveyUrl = async (
  req: Request<
    { surveyId: string },
    { url: string; isActive: boolean; title: string }
  >,
  res: Response<{}, { workspaceId: string }>,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const { url } = req.body;
    const surveyData = await updateSurveyUrlService(+surveyId, url);
    return res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const deleteSurvey = async (
  req: Request<{ surveyId: string }, {}>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    await deleteSurveyService(+surveyId);
    return res.status(200).json("deleted");
  } catch (error) {
    next(error);
  }
};

export const duplicateSurvey = async (
  req: Request<
    { surveyId: string },
    {},
    { workspaceId: string; targetWorkspaceId: string }
  >,
  res: Response<{}, { duplicateSurvey: SurveyModel }>,
  next: NextFunction
) => {
  try {
    const { duplicateSurvey } = res.locals;
    const { targetWorkspaceId } = req.body;
    const survey = await duplicateSurveyService(
      +targetWorkspaceId,
      duplicateSurvey
    );

    return res.status(201).json(survey);
  } catch (error) {
    next(error);
  }
};

export const moveSurvey = async (
  req: Request<{ surveyId: string }, {}, { targetWorkspaceId: string }>,
  res: Response<{}>,
  next: NextFunction
) => {
  try {
    // console.log("controller", req.body);
    const { targetWorkspaceId } = req.body;
    const { surveyId } = req.params;
    await moveSurveyService(+targetWorkspaceId, +surveyId);
    return res.status(200).json({ targetWorkspaceId });
  } catch (error) {
    next(error);
  }
};
