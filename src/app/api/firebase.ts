import admin from "firebase-admin";
import serviceAccount from "./service_account.json";
import { ServiceAccount, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const apps = getApps();

apps.length === 0
  ? initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    })
  : apps[0];

export const firestore = getFirestore();
