import { Resolvers } from "../../../types/resolvers";
import { EmailSignInMutationArgs, EmailSignInResponse } from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        EmailSignUp: async (_, args: EmailSignInMutationArgs): Promise<EmailSignInResponse> => {
            try {
                const { email } = args;
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return {
                        ok: false,
                        error: "existing email. You should log in instead",
                        token: null
                    }
                } else {
                    const newUser = await User.create({ ...args }).save();
                    const token = createJWT(newUser.id);
                    return {
                        ok: true,
                        error: null,
                        token
                    }
                }
            } catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                }
            }
        }
    }
}

export default resolvers;