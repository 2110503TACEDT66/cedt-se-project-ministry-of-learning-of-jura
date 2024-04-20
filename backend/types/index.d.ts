import { Document } from "mongoose"
import type { User } from "../src/models/User"
declare global {
   namespace Express {
      interface Request {
         user?: User & Document | null,
         isSuperUser?: boolean,
      }
   }
}