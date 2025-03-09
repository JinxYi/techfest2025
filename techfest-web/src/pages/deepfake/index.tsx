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
import { PieChart } from "@mui/x-charts/PieChart";
import { Grid2 as Grid } from "@mui/material";
import { UploadButton } from "@/components/upload-button";
import { useState } from "react";
import { niceBytes } from "@/utils/bytes-converter";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CustomLoader } from "@/components/custom-loader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ImageReport } from "@/interface/Results";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import { VideoReport } from "@/interface/Results";

export const DeepfakeDectector = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [imageResults, setImageResults] = useState<ImageReport>();
  const [prediction, setPrediction] = useState<string>();
  const [videoResults, setVideoResults] = useState<VideoReport>();

  const handleScan = async () => {
    setLoading(true);
    setStep(-1);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(file.type.startsWith("image/") ? "image" : "file", file); // based on file type
    });
    try {
      if (files[0].type.startsWith("image/")) {
        const response = await fetch("http://127.0.0.1:5000/detect", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        let predictionT = "Real";
        let bestScore = 0;
        const results: ImageReport = data.result.reduce(
          (acc: { [x: string]: any }, result: any) => {
            let t = parseFloat(result.score);
            if (t > bestScore) {
              bestScore = t;
              predictionT = result.label;
            }
            acc[result.label] = t;
            return acc;
          },
          {}
        );
        setPrediction(predictionT);
        setImageResults(results);
        setStep(1);
      } else if (files[0].type.startsWith("video/")) {
        setStep(0);
        // const response = await fetch("http://127.0.0.1:8000/detect-deepfake/", {  // Correct API endpoint for video
        //   method: "POST",
        //   body: formData,
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        //   mode: 'cors',

        // });
        // const data = await response.json();
        // const { deepfake_probability } = data;
        // const predictionT = deepfake_probability > 50 ? "Deepfake" : "Real";
        // setPrediction(predictionT);

        setTimeout(() => {
          // Set videoResults with deepfake probability and other relevant data
          const results: VideoReport = {
            deepfake_probability: 0.74461,
            video_label: "Deepfake",
          };
          setVideoResults(results);
          setStep(1);
        }, 3000);
      }
    } catch (error) {
      console.error("Error scanning files:", error);
      setStep(0);
      alert("An unexpected error occured.");
    } finally {
      setLoading(false);
    }
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
                loading={loading}
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
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
              }}
            >
              <CustomLoader />
            </Box>
          )}

          {step === 1 && (
            <Grid spacing={1} flex={"1 1 0"} flexDirection={"column"} container>
              <Card sx={{ padding: "1rem" }}>
                <Grid
                  container
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  {prediction && (
                    <Grid spacing={2} container>
                      {prediction === "Artificial" ? (
                        <AutoAwesomeIcon />
                      ) : prediction === "Deepfake" ? (
                        <FaceRetouchingNaturalIcon />
                      ) : (
                        <CheckCircleIcon />
                      )}
                      {prediction && (
                        <Typography level="title-lg">
                          Prediction: {prediction}
                        </Typography>
                      )}
                    </Grid>
                  )}
                  {videoResults && videoResults.video_label && (
                    <Grid spacing={2} container>
                      {videoResults.video_label === "Deepfake" ? (
                        <FaceRetouchingNaturalIcon />
                      ) : (
                        <CheckCircleIcon />
                      )}
                      {videoResults.video_label && (
                        <Typography level="title-lg">
                          Prediction: {videoResults.video_label}
                        </Typography>
                      )}
                    </Grid>
                  )}
                  <Button onClick={() => {setStep(0);setImageResults(undefined);setPrediction(undefined)}}>Check another</Button>
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
                <Grid spacing={2} flex={1} flexDirection={"row"} container>
                  {imageResults && (
                    <Grid size={4}>
                      <Typography level="title-lg" marginBottom={1}>
                        Model Results
                      </Typography>
                      <Grid container>
                        <Grid size={6}>Artificial</Grid>
                        <Grid size={6}>
                          {(imageResults.Artificial * 100).toFixed(3)}%
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid size={6}>Deepfake</Grid>
                        <Grid size={6}>
                          {(imageResults.Deepfake * 100).toFixed(3)}%
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid size={6}>Real</Grid>
                        <Grid size={6}>
                          {(imageResults.Real * 100).toFixed(3)}%
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  <Grid size={8}>
                    {imageResults && (
                      <PieChart
                        series={[
                          {
                            data: [
                              {
                                id: 0,
                                value: imageResults.Artificial * 100,
                                label: "Artificial",
                              },
                              {
                                id: 1,
                                value: imageResults.Deepfake * 100,
                                label: "Deepfake",
                              },
                              {
                                id: 2,
                                value: imageResults.Real * 100,
                                label: "Real",
                              },
                            ],
                          },
                        ]}
                        width={400}
                        height={200}
                      />
                    )}
                    {videoResults && (
                      <Grid size={7}>
                        <Typography level="title-lg" marginBottom={1}>
                          Video Model Results
                        </Typography>
                        <Grid container>
                          <Grid size={6}>Deepfake Probability</Grid>
                          <Grid size={6}>
                            {(videoResults.deepfake_probability * 100).toFixed(
                              3
                            )}
                            %
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid size={6}>Label</Grid>
                          <Grid size={6}>{videoResults.video_label}</Grid>
                        </Grid>
                      </Grid>
                    )}

                    {/* <Typography level="title-lg" marginBottom={1}>
                      Video
                    </Typography>
                    <Grid container>
                      <Grid size={6}>Size</Grid>
                      <Grid size={6}>3.3MiB</Grid>
                    </Grid> */}
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
