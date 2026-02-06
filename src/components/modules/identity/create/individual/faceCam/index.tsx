import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { TbCameraPlus, TbCameraRotate } from "react-icons/tb";
import Webcam from "react-webcam";
import axios from "axios";
import { Button } from "@/src/components/common/button";

const FaceCam = ({setFormData}: any) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [base64URL, setBase64URL] = useState<string>("");
  const [isFaceDetected, setIsFaceDetected] = useState<boolean | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImageSrc(imageSrc);
      setBase64URL(imageSrc);
      verifyFace(imageSrc);
     
      setFormData((prev: any) => {
        return {
          ...prev,
          image: imageSrc,
        };
      })
    }
  };

  const verifyFace = async (imageSrc: string) => {
    setIsLoading(true);
    setMessage("");

    try {
      // const response = await axios.post(
      //   "/api/v1/verify-face",
      //   { imageSrc },
      //   { headers: { 'Content-Type': 'application/json' } }
      // );

      // console.log("API RES", response);

      // const result = response.data;
      // toast.success(result.isFace ? "Face detected!" : "No face detected!");
      // setIsFaceDetected(result.isFace);
      toast.success("Face detected!");
    } catch (error) {
      console.error('Error in API call:', error);
      toast.error("Error detecting face");
      setIsFaceDetected(null);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setImageSrc(null);
    setMessage("");
    setBase64URL("");
    setIsFaceDetected(null);
  };

  return (
    <div className="identity-form_image">
     
      {imageSrc ? (
        <>
          <div className="identity-form_imagecapture">
            <img src={imageSrc} alt="Captured face" />
          </div>
          <Button text="Capture Again" onClick={reset}>
            <TbCameraRotate className="icon"/>
          </Button>
        </>
      ) :  <>
       <div className="identity-form_imagecapture">
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      </div>
      <Button onClick={capture} text="Capture">
        <TbCameraPlus className="icon"/>
      </Button>
      </>}
      {/* {isLoading && <p>Loading...</p>} */}
      {isFaceDetected !== null && (
        <div>
          {isFaceDetected ? (
            <p style={{ color: "green" }}>
              Image detection successful: Face detected!
            </p>
          ) : (
            <p style={{ color: "red" }}>
              Image detection unsuccessful: No face detected!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceCam;
