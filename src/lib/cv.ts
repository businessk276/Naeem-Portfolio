const DEFAULT_CV_PATH = '/Naeem_CV_pdf.pdf';
const DOWNLOAD_NAME = 'Naeem_CV.pdf';

function normalizeDriveDownloadUrl(value?: string) {
  const url = value?.trim();
  if (!url) return url || DEFAULT_CV_PATH;
  if (!url.includes('drive.google.com')) return url;

  const driveId =
    url.match(/\/file\/d\/([^/]+)/i)?.[1] ||
    url.match(/\/d\/([^/]+)/i)?.[1] ||
    url.match(/[?&]id=([^&]+)/i)?.[1] ||
    url.match(/[?&]export=download&id=([^&]+)/i)?.[1];

  return driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : url;
}

export function getCvHref(resumeUrl?: string) {
  const url = resumeUrl?.trim();
  return normalizeDriveDownloadUrl(url) || DEFAULT_CV_PATH;
}

export function getCvDownloadName() {
  return DOWNLOAD_NAME;
}

export async function downloadOriginalCv(resumeUrl?: string) {
  const href = getCvHref(resumeUrl);
  const response = await fetch(href);
  if (!response.ok) {
    throw new Error('Unable to download CV');
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = DOWNLOAD_NAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}

