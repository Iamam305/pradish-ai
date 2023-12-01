import { S3 } from "@aws-sdk/client-s3";
import { envConf } from "./envConfig";

export const s3 = new S3({
  forcePathStyle: false,
  endpoint: envConf.doSpaceEndPoint,
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: envConf.doSpaceKey,
    secretAccessKey: envConf.doSpaceSecret,
  },
});
