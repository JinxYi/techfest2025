import { Layout } from "@/components/layouts";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { Grid2 as Grid } from "@mui/material";
import { UploadButton } from "@/components/upload-button";
import { useState } from "react";
import { niceBytes } from "@/utils/bytes-converter";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CustomLoader } from "@/components/custom-loader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const DeepfakeDectector = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);

  const handleScan = async () => {
    setLoading(true);
    const formData = new FormData();
    setTimeout(() => {
      setLoading(false);
      setStep(1);
    }, 2000);
    // files.forEach((file) => {
    //   formData.append("files", file);
    // });
    // try {
    //   const response = await fetch("/api/deepfake", {
    //     method: "POST",
    //     body: formData,
    //   });
    //   const data = await response.json();
    //   console.log(data);
    //   setLoading(false);
    //   setStep(1);
    // } catch (error) {
    //   console.error("Error scanning files:", error);
    // }
  };

  return (
    <>
      <Layout>
        <Box
          style={{
            maxWidth: 650,
            margin: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {step === 0 && (
            <Grid
              container
              direction="column"
              spacing={2}
              sx={{ marginTop: "20vh" }}
              flex={"1 1 auto"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography
                level="title-md"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Upload the image or video which you want to check for deepfakes.
              </Typography>

              <UploadButton files={files} setFiles={setFiles} />

              {files.map((file, index) => (
                <Card key={index} sx={{ display: "flex", width: "100%" }}>
                  <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid size={6}>
                      {file.type.startsWith("image/") && (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          style={{ width: "100%", height: "auto" }}
                        />
                      )}
                      {file.type.startsWith("video/") && (
                        <video
                          style={{ width: "100%", height: "auto" }}
                          controls
                          onError={(e) =>
                            console.error("Error loading video:", e)
                          }
                        >
                          <source
                            src={URL.createObjectURL(file)}
                            type={file.type}
                          />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </Grid>
                    <Grid size={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignSelf: "flex-start",
                        }}
                      >
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Typography level="title-md">{file.name}</Typography>
                          <Typography
                            level="body-sm"
                            component="div"
                            sx={{ color: "text.secondary" }}
                          >
                            {niceBytes(file.size)}
                          </Typography>
                        </CardContent>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            setFiles(files.filter((f) => f !== file));
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                    {/* <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image="/static/images/cards/live-from-space.jpg"
                      alt="Live from space album cover"
                    /> */}
                  </Grid>
                </Card>
              ))}
              <Button
                variant="solid"
                disabled={files.length == 0}
                sx={{ width: "100%" }}
                onClick={() => {
                  handleScan();
                }}
              >
                Scan
              </Button>
            </Grid>
          )}
          {loading && <CustomLoader />}
          {step === 1 && (
            <Grid spacing={1} flex={"1 1 0"} flexDirection={"column"} container>
              <Card sx={{ padding: "1rem" }}>
                <Grid spacing={2} container>
                  <CheckCircleIcon />
                  <Typography level="title-lg">No deepfake detected</Typography>
                </Grid>
              </Card>
              <Card sx={{ padding: "1rem" }}>
                <Grid spacing={1} container flex={"1 1 0"}>
                  <Typography level="h4">Details</Typography>
                  <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    SallyRise2.0 provides opinions on uploaded media but is not
                    responsible for the outcomes. As it is still in beta, its
                    results should not be considered absolute truth or
                    definitive evidence.
                  </Typography>
                  {files.map((file, index) => (
                    <Grid size={6}>
                      <Box key={index}>
                        {file.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            style={{ width: "100%", height: "auto" }}
                          />
                        )}
                        {file.type.startsWith("video/") && (
                          <video
                            style={{ width: "100%", height: "auto" }}
                            controls
                            onError={(e) =>
                              console.error("Error loading video:", e)
                            }
                          >
                            <source
                              src={URL.createObjectURL(file)}
                              type={file.type}
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Divider />
                <Grid spacing={4} flex={1} flexDirection={"row"} container>
                  <Grid size={6}>
                    <Typography level="title-lg" marginBottom={1}>
                      Model Results
                    </Typography>
                    <Grid container>
                      <Grid size={6}>Deepfake %</Grid>
                      <Grid size={6}>0.5015527</Grid>
                    </Grid>
                    <Grid container>
                      <Grid size={6}>Real %</Grid>
                      <Grid size={6}>0.4984472</Grid>
                    </Grid>
                  </Grid>
                  <Grid size={6}>
                    <Typography level="title-lg" marginBottom={1}>
                      Video
                    </Typography>
                    <Grid container>
                      <Grid size={6}>Size</Grid>
                      <Grid size={6}>3.3MiB</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          )}
        </Box>
      </Layout>
    </>
  );
};
const a = {
  message: "Prediction: Deepfake with confidence 0.5016",
  result: [
    { label: "Deepfake", score: 0.5015527606010437 },
    { label: "Real", score: 0.4984472393989563 },
  ],
};
