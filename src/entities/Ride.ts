import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from "typeorm";
import { rideStatus } from "../types/types";
import User from "./User";
import Chat from "./Chat";

@Entity()
class Ride extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    type: "text",
    enum: ["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"],
    default: "REQUESTING"
  })
  status: rideStatus;

  @Column({ type: "text" })
  pickUpAddress: string;

  @Column({ type: "double precision", default: 0 })
  pickUpLat: number;

  @Column({ type: "double precision", default: 0 })
  pickUpLng: number;

  @Column({ type: "text" })
  dropOffAddress: string;

  @Column({ type: "double precision", default: 0 })
  dropOffLat: number;

  @Column({ type: "double precision", default: 0 })
  dropOffLng: number;

  @Column({ type: "double precision", default: 0 })
  price: number;

  @Column({ type: "text" })
  distance: string;

  @Column({ type: "text" })
  duration: string;

  @ManyToOne(type => User, user => user.ridesAsPassenger)
  passenger: User;

  @Column({ nullable: true })
  passengerId: number;

  @ManyToOne(type => User, user => user.ridesAsDriver, { nullable: true })
  driver: User;

  @Column({ nullable: true })
  driverId: number;

  @OneToOne(type => Chat, chat => chat.ride)
  @JoinColumn()
  chat: Chat;

  @Column({ nullable: true })
  chatId: number;


  @CreateDateColumn() createdAt: string;

  @UpdateDateColumn() updatedAt: string;
}
export default Ride;
