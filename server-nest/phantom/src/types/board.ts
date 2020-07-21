import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface board extends Document {
  url: String;
  name: String;
  startDate: Date;
  endDate: Date;
  status: String;
  topic: String;
  description: String;
  personalization: Boolean;
  creator: {
    firstName: String;
    lastName: String;
    id: mongoose.Schema.Types.ObjectId;
    profileUrl: String;
  };
  collaborators: Array<mongoose.Schema.Types.ObjectId>;
  pins: Array<mongoose.Schema.Types.ObjectId>;
  createdAt: Date;
  counts: {
    followers: Number;
    joiners: Number;
    pins: Number;
  };
}
