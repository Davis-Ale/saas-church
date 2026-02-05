import * as admin from "firebase-admin";

import { createChurchHttp } from "./churches/createChurch";


admin.initializeApp();

export { createChurch, createChurchHttp };
