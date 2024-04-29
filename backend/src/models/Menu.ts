import { prop } from "@typegoose/typegoose";

export default class Menu {
  @prop({
    required: true,
  })
  public name!: string;

  @prop({
    required: true,
    min: 1,
  })
  public price!: number;
}
