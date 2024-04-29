import { prop } from "@typegoose/typegoose";
import { timeRegex, invalidTimeMsg } from "../config/constants";

export default class ReservationPeriod {
  @prop({
    match: [timeRegex, invalidTimeMsg],
    required: true,
  })
  public start!: string;

  @prop({
    match: [timeRegex, invalidTimeMsg],
    required: true,
  })
  public end!: string;

  public equals(rhs: ReservationPeriod) {
    if (this.start == rhs.start && this.end == rhs.end) {
      return true;
    }
  }
}
