export interface GroupModel {
  id: number;
  maker: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  UserGroups?: UserGroupModel[];
}
export interface UserModel {
  id: number;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  groupId: number;
  workspaces?: WorkSpaceModel[];
  UserGroups?: UserGroupModel[];
}

export interface UserGroupModel {
  userId: number;
  groupId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkSpaceModel {
  id: number;
  maker: number;
  title: string;
  groupId: number;
  createdAt?: Date;
  updatedAt?: Date;
  surveys?: SurveyModel[];
}
export interface SurveyModel {
  id: number;
  title: string;
  isActive: boolean;
  url: string;
  workspace: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UpdateSurveyModel {
  id: number;
  title: string;
  sisActive: boolean;
  url: string;
  workspace: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EndPartModel {
  id: number;
  surveyId: number;
  label: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SignUpParams {
  username: string;
  password: string;
}

export interface signInParams {
  username: string;
  password: string;
}
export interface SafeUser {
  id: string;
  username: string;
  email: string;
  role: string;
}
export interface ReturnedJWTPaylod {
  id: number;
  userType: string;
  iat: number;
  exp: number;
}
export interface NewWorkSpace {
  title: string;
}

export interface NewSurvey {
  title: string;
  active?: boolean;
}
export interface NewGroup {
  invitedUsers: number[];
  groupName: string;
}

export interface UpdateSurveyStatusResponse {
  updatedAt: Date;
}

export interface UpdateSurveyTitleResponse {
  title: string;
  updatedAt: Date;
}
export interface UpdateSurveyUrlResponse {
  url: string;
  updatedAt: Date;
}

export interface UpdateWorkspaceTitleResponse {
  title: string;
  updatedAt: Date;
}

export interface UpdateWorkspaceDescriptionResponse {
  description: string;
  updatedAt: Date;
}

export interface UpdateWorkspaceOwnerResponse {
  ownerId: number;
  updatedAt: Date;
}

export interface WelcomePartModel {
  id: number;
  surveyId: number;
  label: string;
  description?: string;
  buttonText?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewWelcomePart {
  surveyId: number;
  label?: string;
  imageUrl?: string;
  description?: string;
  buttonText?: string;
}

export interface welcomePartOptions {
  isLabelEnabled: boolean;
  isDescriptionEnabled: boolean;
  isImageUploadEnabled: boolean;
}

export interface GenericTextModel {
  id: number;
  surveyId: number;
  label: string;
  description?: string;
  answerFormat: "text" | "regex";
  imageUrl?: string;
  required?: boolean;
  hideQuestionNumber?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  generalTexts?: GeneralTextModel[];
  generalRegexes?: GeneralRegexModel[];
}

export interface GeneralTextModel {
  id: number;
  questionId: number;
  min: number;
  max: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GeneralRegexModel {
  id: number;
  questionId: number;
  regex: string;
  regexErrorMessage: string;
  regexPlaceHolder?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
