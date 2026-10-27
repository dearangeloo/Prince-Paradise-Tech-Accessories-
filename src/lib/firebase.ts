import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, type Auth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let app: FirebaseApp | null = null;
export let db: Firestore | null = null;
export let auth: Auth | null = null;
export let isFirebaseConfigured = false;

// Attempt to load firebase configuration if provided
try {
  // @ts-ignore dynamic import for optional config
  const configModule = await import('../../firebase-applet-config.json').catch(() => null);
  const config = configModule?.default || (typeof window !== 'undefined' && (window as any).__FIREBASE_CONFIG__);

  if (config && config.projectId && config.projectId !== 'remixed-project-id') {
    app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
    db = getFirestore(app, config.firestoreDatabaseId || undefined);
    auth = getAuth(app);
    isFirebaseConfigured = true;

    // Test connection on boot per Skill requirement
    (async () => {
      try {
        if (db) {
          await getDocFromServer(doc(db, 'test', 'connection')).catch(() => {});
        }
      } catch (err: any) {
        if (err?.message?.includes('the client is offline')) {
          console.warn('Firebase client offline, check configuration.');
        }
      }
    })();
  }
} catch (e) {
  // Firebase configuration not present yet; application will use secure server API routes
  isFirebaseConfigured = false;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { GoogleAuthProvider, signInWithPopup, signOut };
