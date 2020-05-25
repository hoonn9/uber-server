import User from "../../../entities/User";
import { UpdateMyProfileMutationArgs } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
    Mutation: {
        UpdateMyProfile: privateResolver(
            async (_, args: UpdateMyProfileMutationArgs, { req }) => {
                const user: User = req.user;
                const notNull: any = cleanNullArgs(args);

                // for BeforeInsert && BeforeUpdate event 
                if (notNull.hasOwnProperty('password')) {
                    user.password = notNull['password'];
                    user.save();
                    delete notNull['password'];
                }

                try {
                    await User.update({ id: user.id }, { ...notNull });
                    return {
                        ok: true,
                        error: null
                    };
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message
                    };
                }
            }
        )
    }
};

export default resolvers;