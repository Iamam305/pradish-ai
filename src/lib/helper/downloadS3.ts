import { envConf } from "@/config/envConfig";
import { s3 } from "@/config/s3Config";
import { S3 } from "@aws-sdk/client-s3";
import os from "os";
import fs from "fs";
import { v4 as uuid } from "uuid";
export async function downloadFromS3(fileKey: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: envConf.doSpaceBucket,
        Key: fileKey,
      };

      const obj = await s3.getObject(params);

      let fileName: string;
      if (os.platform() === "win32") {
        fileName = `C:\\Users\\${
          os.userInfo().username
        }\\AppData\\Local\\Temp\\pdf-${uuid()}.pdf`;
      } else {
        fileName = `/tmp/pdf-${uuid()}.pdf`;
      }

      if (obj.Body instanceof require("stream").Readable) {
        // AWS-SDK v3 has some issues with their typescript definitions, but this works
        // https://github.com/aws/aws-sdk-js-v3/issues/843
        //open the writable stream and write the file
        const file = fs.createWriteStream(fileName);
        file.on("open", function (fd) {
          // @ts-ignore
          obj.Body?.pipe(file).on("finish", () => {
            return resolve(fileName);
          });
        });
        file.on("error", (error: Error) => {
          console.error(error);
          reject(error);
        });
        // obj.Body?.pipe(fs.createWriteStream(file_name));
      } else {
        reject("something went wrong");
      }
    } catch (error) {
      console.error(error);
      reject(error);
      return null;
    }
  });
}

// downloadFromS3("uploads/1693568801787chongzhisheng_resume.pdf");
