import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    nickname: string;
    email: string;
    password: string;
    role: string;
}

export interface IUserModel extends Model<IUser> {
    findByCredentials(email: string, password: string | Buffer): Promise<IUser | null>;
}

const userSchema = new Schema<IUser>({
    nickname: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: [true, "Email address is required"],
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    password: { type: String, required: true },
    role: {
        type: String, required: true, enum: ["Admin", "User"]
    }
});

userSchema.statics.findByCredentials = async function (email: string, password: string | Buffer): Promise<IUser | null> {
    const user = await this.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);

        return isMatch ? user : null;
    } else {
        return null;
    }
};

userSchema.pre("save", async function (next) {
    const user = this as IUser;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT!));
    }
    next();
});

const userModel = model<IUser, IUserModel>("User", userSchema);

export default userModel;
