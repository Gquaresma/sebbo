import {
  auth_domain,
  api_key,
  project_id,
  storage_bucket,
  messagin_sender_id,
  app_id,
  measurement_id,
} from "../../env.js";

export const firebaseConfig = {
  apiKey: api_key,
  authDomain: auth_domain,
  projectId: project_id,
  storageBucket: storage_bucket,
  messagingSenderId: messagin_sender_id,
  appId: app_id,
  measurementId: measurement_id,
};
