import { EmailSignInMutationArgs, EmailSignInResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User"
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        EmailSignIn: async (_, args: EmailSignInMutationArgs): Promise<EmailSignInResponse> => {
            try {
                const { email, password } = args;
                const user = await User.findOne({ email });
                if (!user) {
                    return {
                        ok: false,
                        error: "No User found with that email",
                        token: null
                    }
                } else {
                    const checkPassword = await user.comparePassword(password);
                    if (checkPassword) {
                        const token = createJWT(user.id);
                        return {
                            ok: true,
                            error: null,
                            token
                        }
                    } else {
                        return {
                            ok: true,
                            error: "Wrong password",
                            token: ""
                        }
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