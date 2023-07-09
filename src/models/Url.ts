import mongoose, { Schema, Document } from "mongoose";
import shortid from "shortid";

export interface IUrl extends Document {
  full: string;
  short: string;
  qrcode: String;
  createdBy: string;

}

export const UrlSchema = new Schema({
  full: {
    required: true,
    type: String,
  },
  qrcode: {
    type: String,
  },
  short: {
    required: true,
    type: String,
    default: shortid.generate,
  },
  createdBy: {
    required: true,
    type: String
  },
});

const Url = mongoose.model<IUrl>("Url", UrlSchema);
export default Url;