import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';
import shortid from "shortid";


interface IUser extends Document {
    fullname: string;
    username: string;
    id: String;
    password: any,
    isValidPassword(password: string): Promise<boolean>;
}


const UserSchema = new Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String , required: true},
    password: { type: String, required: true },
    id: {type: String, default: shortid.generate, required: true}
  },
  { timestamps: true},
);


UserSchema.pre( 
  'save',
  async function (next) {
      const user = this;
      const hash = await bcrypt.hash(user.password, 10);
      this.password = hash;
      next();
  }
)

UserSchema.methods.isValidPassword = async function(password : string) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
}

const User = mongoose.model<IUser>('User', UserSchema);

export {User, IUser} ;