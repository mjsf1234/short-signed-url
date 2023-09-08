require('dotenv').config();
const { Storage } = require('@google-cloud/storage');

async function getLatestSignedUrlById(id) {
  try {
    const storage = new Storage();
    const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
    
    const [matchingFiles] = await bucket.getFiles({ prefix: `${id}` });

    if (matchingFiles.length === 0) return 'PDF not found';

    let highestVersion = 0;
    matchingFiles.forEach((file) => {
      const match = file.name.match(/\((\d+)\)\.pdf$/);
      const version = match ? parseInt(match[1], 10) : 0;
      if (version > highestVersion) highestVersion = version;
    });

    const latestVersionFileName = highestVersion > 0 ? `${id} (${highestVersion}).pdf` : `${id}.pdf`;
    const latestVersionFile = matchingFiles.find((file) => file.name === latestVersionFileName);

    if (!latestVersionFile) return 'Latest version file not found';

    const [signedUrl] = await latestVersionFile.getSignedUrl({ action: 'read', expires: Date.now() + 1 * 60 * 1000 });

    return signedUrl;
  } catch (error) {
    console.error('Error:', error);
    return 'Error generating signed URL';
  }
}

const id = '103';
getLatestSignedUrlById(id)
  .then((signedUrl) => console.log('Latest Signed URL:', signedUrl))
  .catch((err) => console.error(err));
