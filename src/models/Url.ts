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
    let url = this;
    QRCode.toDataURL(url.full, (err, code) => {
      if (err) {
        // Handle the error
        return next(err);
      }
      url.qrcode = code;

      next();
    });
  }
);



const Url = mongoose.model<IUrl>("Url", UrlSchema);
export default Url;