const createPermissionResponse = (
  isAllowed,
  errorMessage = "somthing went wrong!",
  statusCode = 403
) => {
  const response = { isAllowed };

  if (!isAllowed) {
    response.errorMessage = errorMessage;
    response.statusCode = statusCode;
  }

  return response;
};

const canAssignNoteToUser = ({ roles }) => {
  const isAdminOnly =
    roles.includes("admin") &&
    !roles.includes("employee") &&
    !roles.includes("manager");

  if (isAdminOnly) {
    return createPermissionResponse(
      false,
      "Cannot assign notes to an admin-only role.",
      403
    );
  }

  return createPermissionResponse(true);
};

const canUpdateNote = ({ user, note }) => {
  const isEmployeeRestricted =
    user.role === "employee" && user.id !== note.assignedTo.toString();

  if (isEmployeeRestricted) {
    return createPermissionResponse(
      false,
      "Employees can only update notes assigned to them.",
      403
    );
  }

  const isManagerRestricted =
    user.role === "manager" &&
    user.id !== note.createdBy.toString() &&
    user.id !== note.assignedTo.toString();

  if (isManagerRestricted) {
    return createPermissionResponse(
      false,
      "Managers can only update notes they created or are assigned to.",
      403
    );
  }

  return createPermissionResponse(true);
};

const canDeleteNote = ({ user, note }) => {
  const isManagerRestricted =
    user.role === "manager" && user.id !== note.createdBy.toString();

  if (isManagerRestricted) {
    return createPermissionResponse(
      false,
      "Managers can only delete notes they created.",
      403
    );
  }

  return createPermissionResponse(true);
};

const canCreateUser = ({ user, roles, createdUserName }) => {
  if (createdUserName === process.env.SUPER_USER_NAME) {
    return createPermissionResponse(
      false,
      `You can't use '${process.env.SUPER_USER_NAME}' as a name, choose another.`,
      409
    );
  }

  const isManagerRestricted =
    user.role === "manager" &&
    (roles.includes("manager") || roles.includes("admin"));

  if (isManagerRestricted) {
    return createPermissionResponse(
      false,
      "Managers cannot create another manager or admin.",
      403
    );
  }

  return createPermissionResponse(true);
};

const canUpdateUser = ({ user, roles, updatedUserName }) => {
  if (updatedUserName === process.env.SUPER_USER_NAME) {
    return createPermissionResponse(
      false,
      `The '${process.env.SUPER_USER_NAME}' user account cannot be updated.`,
      409
    );
  }

  const isManagerRestricted =
    user.role === "manager" &&
    (roles.includes("manager") || roles.includes("admin"));

  if (isManagerRestricted) {
    return createPermissionResponse(
      false,
      "Managers cannot update a manager or admin.",
      403
    );
  }

  return createPermissionResponse(true);
};

const canDeleteUser = ({ user, roles, deletedUserName }) => {
  if (deletedUserName === process.env.SUPER_USER_NAME) {
    return createPermissionResponse(
      false,
      `The '${process.env.SUPER_USER_NAME}' user account cannot be deleted.`,
      409
    );
  }

  const isManagerRestricted =
    user.role === "manager" &&
    (roles.includes("manager") || roles.includes("admin"));

  if (isManagerRestricted) {
    return createPermissionResponse(
      false,
      "Managers cannot delete a manager or admin.",
      403
    );
  }

  return createPermissionResponse(true);
};

module.exports = {
  canAssignNoteToUser,
  canUpdateNote,
  canDeleteNote,
  canCreateUser,
  canUpdateUser,
  canDeleteUser,
};
