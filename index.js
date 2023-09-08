const { Storage } = require('@google-cloud/storage');
require('dotenv').config(); // Load environment variables from .env file


// Replace with your own GCP project ID, GCS bucket name, and PDF file name.
const projectId = 'short-signed-url';
const bucketName = 'temp-bucket-001';
const fileName = 'dummmy.pdf'; // Include the path to your PDF file within the bucket

// Initialize a GCS client
const storage = new Storage({
  projectId: projectId,
});

// Create a reference to the PDF file
const bucket = storage.bucket(bucketName);
const file = bucket.file(fileName);

// Generate a signed URL that is valid for 15 minutes
const options = {
  action: 'read',
  expires: Date.now() + 1 * 60 * 1000, // 15 minutes from now
};

file.getSignedUrl(options)
  .then(([signedUrl]) => {
    console.log('Signed URL for the PDF:', signedUrl);
  })
  .catch((err) => {
    console.error('Error generating signed URL:', err);
  });
