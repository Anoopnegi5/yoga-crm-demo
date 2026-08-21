// Direct Google Drive REST API & OAuth Integration Utility for Yoganjali
// Handles automatic folder creation ('Yoganjali Studio Backups') and daily file overwriting
import { safeStorage } from './safeStorage';

const FOLDER_NAME = 'Yoganjali Studio Backups';
const FILE_NAME = 'Yoganjali_Latest_Backup.json';
const GDRIVE_TOKEN_KEY = 'yoganjali_gdrive_token';
const GDRIVE_FOLDER_ID_KEY = 'yoganjali_gdrive_folder_id';

export interface GDriveStatus {
  isConnected: boolean;
  folderId?: string;
  folderUrl?: string;
  lastSyncedAt?: string;
  error?: string;
}

export function getStoredGDriveToken(): string | null {
  return safeStorage.getItem(GDRIVE_TOKEN_KEY);
}

export function saveGDriveToken(token: string): void {
  safeStorage.setItem(GDRIVE_TOKEN_KEY, token);
}

export function clearGDriveToken(): void {
  safeStorage.removeItem(GDRIVE_TOKEN_KEY);
  safeStorage.removeItem(GDRIVE_FOLDER_ID_KEY);
}

// Quick 1-Click Google OAuth Token Generator URL
export function openGoogleOAuthTokenPage(): void {
  const scope = encodeURIComponent('https://www.googleapis.com/auth/drive.file');
  const authUrl = `https://developers.google.com/oauthplayground/#step1&scopes=${scope}&url=https://www.googleapis.com/drive/v3/files`;
  window.open(authUrl, '_blank');
}

export function getStoredFolderId(): string | null {
  return safeStorage.getItem(GDRIVE_FOLDER_ID_KEY);
}

// 1. Find existing folder or create 'Yoganjali Studio Backups'
export async function findOrCreateYoganjaliFolder(accessToken: string): Promise<string> {
  const cachedFolderId = getStoredFolderId();
  if (cachedFolderId) return cachedFolderId;

  // Search query for folder
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(FOLDER_NAME)}'+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&fields=files(id,name)`;
  const res = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearGDriveToken();
      throw new Error('Google Drive authorization expired. Please reconnect your account.');
    }
    throw new Error(`Google Drive API error (${res.status})`);
  }

  const data = await res.json();
  if (data.files && data.files.length > 0) {
    const folderId = data.files[0].id;
    safeStorage.setItem(GDRIVE_FOLDER_ID_KEY, folderId);
    return folderId;
  }

  // Create folder if missing
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder'
    })
  });

  if (!createRes.ok) {
    throw new Error('Failed to create Yoganjali Studio Backups folder on Google Drive.');
  }

  const newFolder = await createRes.json();
  safeStorage.setItem(GDRIVE_FOLDER_ID_KEY, newFolder.id);
  return newFolder.id;
}

// 2. Upload or Overwrite Yoganjali_Latest_Backup.json inside folder
export async function uploadOrOverwriteBackupFile(
  accessToken: string,
  backupPayload: any
): Promise<{ success: boolean; fileId: string; folderUrl: string }> {
  const folderId = await findOrCreateYoganjaliFolder(accessToken);

  // Search if Yoganjali_Latest_Backup.json already exists in folder
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(FILE_NAME)}'+and+'${folderId}'+in+parents+and+trashed=false&fields=files(id,name)`;
  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  let existingFileId: string | null = null;
  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      existingFileId = searchData.files[0].id;
    }
  }

  const jsonContent = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });

  if (existingFileId) {
    // PATCH / update existing file content
    const uploadRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: blob
      }
    );

    if (!uploadRes.ok) {
      throw new Error(`Failed to update backup file in Google Drive (${uploadRes.status})`);
    }

    const file = await uploadRes.json();
    return {
      success: true,
      fileId: file.id || existingFileId,
      folderUrl: `https://drive.google.com/drive/folders/${folderId}`
    };
  } else {
    // POST / Multipart upload to create new file inside folder
    const metadata = {
      name: FILE_NAME,
      parents: [folderId],
      mimeType: 'application/json'
    };

    const formData = new FormData();
    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    formData.append('file', blob);

    const createRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: formData
      }
    );

    if (!createRes.ok) {
      throw new Error(`Failed to create backup file in Google Drive (${createRes.status})`);
    }

    const file = await createRes.json();
    return {
      success: true,
      fileId: file.id,
      folderUrl: `https://drive.google.com/drive/folders/${folderId}`
    };
  }
}
