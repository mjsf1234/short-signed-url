class FileMock {
    constructor(bucket, name) {
      this.bucket = bucket;
      this.name = name;
    }
  
    getSignedUrl(config, callback) {
      // Mock the behavior of generating a signed URL
      const signedUrl = `https://${this.bucket}/${this.name}?signature=mockedSignature`;
      callback(null, [signedUrl]);
    }
  }
  
  class BucketMock {
    file(name) {
      // Return a mock file instance
      return new FileMock(this.name, name);
    }
  }
  
  class StorageMock {
    constructor() {
      // Mock the storage instance
      this.buckets = {
        [process.env.MOCK_BUCKET_NAME]: new BucketMock(),
      };
    }
  
    bucket(name) {
      return this.buckets[name];
    }
  }
  
  module.exports = { StorageMock };
  