import { Op } from "sequelize";
import Survey from "../db/models/Survey";
import UserGroup from "../db/models/UserGroup";
import WorkSpace from "../db/models/WorkSpace";
import { CustomError } from "../errors/customError";
import { UpdateWorkspaceTitleResponse, WorkSpaceModel } from "../types/types";

export const addWorkSpaceService = async (userId: number, title: string) => {
  try {
    const group = await UserGroup.findOne({ where: { userId: userId } });
    if (!group) {
      throw new CustomError("error finding your group", 404, true);
    }
    const workspace = await WorkSpace.create({
      title,
      maker: userId,
      groupId: group.groupId,
      
    });
    return workspace.get({ plain: true });
  } catch (error) {
    throw error;
  }
};

export const getWorkSpacesService = async (
  userId: number
): Promise<WorkSpaceModel[]> => {
  try {
    const userGroups = await UserGroup.findAll({ where: { userId } });

    const groupIds = userGroups.map((userGroup) => userGroup.groupId);

    // Fetch workspaces created by the user
    const myWorkspaces = await WorkSpace.findAll({
      where: { maker: userId },
      include: [{ model: Survey, as: "surveys" }],
      order: [["createdAt", "ASC"]],
    });

    const groupWorkspaces = await WorkSpace.findAll({
      where: {
        groupId: groupIds,
        id: { [Op.not]: myWorkspaces.map((ws) => ws.id) },
      },
      include: [{ model: Survey, as: "surveys" }],
      order: [["createdAt", "ASC"]],
    });

    const allWorkspaces = [...myWorkspaces, ...groupWorkspaces];

    return allWorkspaces;
  } catch (error) {
    throw error;
  }
};
export const updateWorkspaceTitleService = async (
  workspaceId: number,
  title: string
): Promise<UpdateWorkspaceTitleResponse> => {
  try {
    const updatedDate = new Date();
    await WorkSpace.update(
      { title, updatedAt: updatedDate },
      {
        where: {
          id: workspaceId,
        },
      }
    );
    return { title, updatedAt: updatedDate };
  } catch (error) {
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId: number) => {
  try {
    await WorkSpace.destroy({
      where: {
        id: workspaceId,
      },
    });
  } catch (error) {
    throw error;
  }
};
