import { Layout } from "@/components/layouts";
import { Grid2 as Grid, Typography } from "@mui/material";
import { UploadButton } from "@/components/upload-button";
import { useState } from "react";

export const DeepfakeDectector = () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <>
      <Layout>
        <div
          style={{
            maxWidth: 600,
            minHeight: "60vh",
            margin: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            direction="column"
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Upload the image or video which you want to check for deepfakes.
            </Typography>

            <UploadButton files={files} setFiles={setFiles} />
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  {file.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width="200"
                    />
                  )}
                  {file.type.startsWith("video/") && (
                    <video width="320" height="240" controls onError={(e) => console.error("Error loading video:", e)}>
                      <source
                        src={URL.createObjectURL(file)}
                        type={file.type}
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <p>{file.name}</p>
                </li>
              ))}
            </ul>
          </Grid>
        </div>
      </Layout>
    </>
  );
};
