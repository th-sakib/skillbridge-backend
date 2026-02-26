export interface IRole {
  STUDENT: "STUDENT";
  TUTOR: "TUTOR";
  ADMIN: "ADMIN";
}

export interface IUserStatus {
  ACTIVE: "ACTIVE";
  BANNED: "BANNED";
}

export type TAvailability = {
  [day: string]: {
    startTime: string;
    endTime: string;
  };
};
