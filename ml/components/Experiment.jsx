import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';

const ExperimentPage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage , setResultImage] = useState(null);


  useEffect(() => {
    console.log("Result Image URL updated:", resultImage);
  }, [resultImage]); // This logs every time resultImage changes.

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Show a preview of the image
    setPrediction(''); // Reset prediction when a new file is selected
  };




  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5000/predictedImage", {
        responseType: 'blob', // Receive image as a blob
      });
  
      // Convert the blob to an object URL
      const imageUrl = URL.createObjectURL(response.data);
      setResultImage(imageUrl); // Set the result image URL
      console.log(resultImage)
    } catch (error) {
      console.error("Error fetching the predicted image:", error);
    } finally {
      setIsLoading(false);
    }
  };




  const handlePredict = async () => {
    if (!image) {
      alert('Please upload an image before predicting.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', image); // Ensure the key matches your backend requirement
  
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const responseData = response.data;
  
      let formattedPrediction = [];
      if (typeof responseData === 'object') {
        // Extract and process yolo_class_counts
        if (responseData.yolo_class_counts && typeof responseData.yolo_class_counts === 'object') {
          formattedPrediction.push(
            'YOLO Class Counts:',
            ...Object.entries(responseData.yolo_class_counts).map(
              ([key, value]) => `${key}: ${value}`
            )
          );
        }
  
        // Process other fields (e.g., random_forest_label)
        if (responseData.random_forest_label) {
          formattedPrediction.push(`Random Forest Label: ${responseData.random_forest_label}`);
          formattedPrediction.push(responseData.ann_confidence)
        }
      } else {
        formattedPrediction.push(responseData.toString());
      }
  
      setPrediction(formattedPrediction);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setPrediction(['Error: Unable to process the image.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
     <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(135deg, #121212, #2c3e50)', // Gradient background for depth
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: "center"
    }}>

        <Navbar/>

        <div style={{alignItems: "center" , marginLeft: "5px"}}>
      
      <h1 style={{ marginTop: '1.5rem' , marginBottom: "1.5rem" , marginLeft: "20px", fontSize: '2.5rem', color: '#f39c12' }}>
        Image Prediction
      </h1>
      <p style={{ marginTop: '1.5rem', marginLeft: "20px" , marginBottom: '1rem', fontSize: '1.2rem', color: '#ecf0f1' }}>
        Upload an image to predict its label:
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{
          marginBottom: '1.5rem',
         marginLeft: "20px",
          padding: '0.5rem',
          backgroundColor: '#34495e',
          color: '#ecf0f1',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      />
      {preview && (
        <div
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <p style={{ fontSize: '1.2rem', color: '#bdc3c7' }}>Preview:</p>
          <img
            src={preview}
            alt="Uploaded Preview"
            style={{
              width: '800px',
              maxHeight: '300px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>
      )}
      <button
        onClick={handlePredict}
        style={{
          display: "flex",
          padding: '1rem 2rem',
           marginLeft: "20px",
          margin: '5px',
          backgroundColor: isLoading ? '#bdc3c7' : '#f39c12',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s ease',
          fontSize: '1.2rem',
        }}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Predict'}
      </button>
      {prediction.length > 0 && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#34495e',
            color: '#ecf0f1',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#f39c12' }}>
            Prediction Result:
          </h3>
          {prediction.map((item, index) => (
            <p key={index} style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {item}
            </p>
          ))}
          <img src={prediction[2]}/>
        </div>
      )}


  {resultImage && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#f39c12' }}>Predicted Image:</h3>
          <img
            src={resultImage} // Use the generated blob URL
            alt="Predicted Result"
            style={{
              width: '800px',
              maxHeight: '300px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>
      )}
    </div>

    <button onClick={handleGenerate}> 
        generate the predicted image
    </button>

   

    </div>
    
    </>
    
  );
};

export default ExperimentPage;
