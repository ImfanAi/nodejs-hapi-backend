import { ObjectId } from "mongoose";

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  referralCode?: string;
  emailVerified?: boolean;
  status?: boolean;
  doneMilestones?: { milestoneId?: ObjectId }[];
  middleName?: string;
}

export interface UpdateMilestonePayload {
  action?: string;
  amount?: number;
}

export interface UpdateVesselPayload {
  name?: string;
  description?: string;
}

export interface UpdateKYCPayload {
  panManual?: number;
  liveManual?: number;
  status?: string;
}
