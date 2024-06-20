import admin from "firebase-admin";
import { ServiceAccount, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = process.env.SERVICE_ACCOUNT;

if(serviceAccount === undefined) throw new Error("Service Account not found please provide it in .env")

const apps = getApps();

apps.length === 0
  ? initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount) as ServiceAccount),
    })
  : apps[0];

export const firestore = getFirestore();
