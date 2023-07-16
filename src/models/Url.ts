import mongoose, { Schema, Document } from "mongoose";
import shortid from "shortid";
import QRCode from 'qrcode';


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

UrlSchema.pre(
  'save',
  async function (next) {
    QRCode.toString(this.short, (err, code) => {
      if (err) {
        // Handle the error
        return next(err);
      }
      console.log(code)
      this.qrcode = JSON.stringify(code);
      next();
    });
  }
);



const Url = mongoose.model<IUrl>("Url", UrlSchema);
export default Url;