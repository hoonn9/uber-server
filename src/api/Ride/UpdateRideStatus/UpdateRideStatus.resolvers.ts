import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import {
    UpdateRideStatusMutationArgs,
    UpdateRideStatusResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Chat from "../../../entities/Chat";

const resolvers: Resolvers = {
    Mutation: {
        UpdateRideStatus: privateResolver(
            async (
                _,
                args: UpdateRideStatusMutationArgs,
                { req, pubSub }
            ): Promise<UpdateRideStatusResponse> => {
                const user: User = req.user;
                if (user.isDriving) {
                    try {
                        let ride: Ride | undefined;
                        if (args.status === "ACCEPTED") {
                            ride = await Ride.findOne({
                                id: args.rideId,
                                status: "REQUESTING"
                            }, { relations: ["driver", "passenger"] });
                            if (ride) {
                                ride.driver = user;
                                user.isTaken = true;
                                user.save();
                                const chat = await Chat.create({ driver: user, passenger: ride.passenger, ride }).save();
                                ride.chat = chat;
                                ride.save();
                            }
                        } else {
                            ride = await Ride.findOne({
                                id: args.rideId,
                                driver: user
                            });
                        }
                        if (ride) {
                            ride.status = args.status;
                            ride.save();
                            pubSub.publish("rideUpdate", { RideStatusSubscription: ride });
                            return {
                                ok: true,
                                error: null,
                                rideId: ride.id
                            };
                        } else {
                            return {
                                ok: false,
                                error: "Cant update ride",
                                rideId: args.rideId
                            };
                        }
                    } catch (error) {
                        return {
                            ok: false,
                            error: error.message,
                            rideId: args.rideId
                        };
                    }
                } else {
                    return {
                        ok: false,
                        error: "You are not driving",
                        rideId: args.rideId
                    };
                }
            }
        )
    }
};
export default resolvers;