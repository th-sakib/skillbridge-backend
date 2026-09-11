import { auth } from "../../lib/auth";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ILoginPayload, IRegisterPayload } from "./auth.interface";

const registerUser = async (payload: IRegisterPayload) => {
  const { name, email, password, role } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role,
    },
  });

  if (!data.user) {
    throw new ApiError("user creation failed.", 500);
  }

  return data;
};

const loginUser = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  return data;
};

export const authService = {
  registerUser,
  loginUser,
};
