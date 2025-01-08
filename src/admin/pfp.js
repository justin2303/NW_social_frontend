import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactCrop from 'react-image-crop';
import { centerCrop, makeAspectCrop } from 'react-image-crop';
import './admin.css'

import 'react-image-crop/dist/ReactCrop.css';


function useDebounceEffect(fn, waitTime, deps) {
    useEffect(() => {
      const t = setTimeout(() => {
        fn.apply(undefined, deps);
      }, waitTime);
  
      return () => {
        clearTimeout(t);
      };
    }, deps);
}

const TO_RADIANS = Math.PI / 180;

async function canvasPreview(
  image,
  canvas,
  crop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  ctx.translate(-cropX, -cropY);
  ctx.translate(centerX, centerY);
  ctx.rotate(rotateRads);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -centerY);

  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}

  
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

function CropPFP() {
    const navigate = useNavigate();
    const location = useLocation();
    const {GUID } = location.state || {}; // Accessing reg and GUID from state
const [imgSrc, setImgSrc] = useState('');
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(1);
 const [error, setError] = useState('');
  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function UploadPfp() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }
  
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
  
    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }
  
    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
  
    // Convert the canvas to a Base64 string
    const base64String = offscreen.convertToBlob().then(blob => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // This will log the Base64 string
        console.log(reader.result); // print res
        console.log(GUID)
        const sessionID = localStorage.getItem("SessionID")
        const response = fetch('http://localhost:8080/change-pfp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ GUID, Picture:reader.result, Session: sessionID}),
        });
  
        if (response.ok){
          console.log("we did it!")
        }else{
          setError("there was an error uploading the cropped image")
        }
      };
      reader.readAsDataURL(blob);
    });
    // Note: This function will now log the Base64 string to the console
    // You can also save it to state or pass it to your API call as needed
  }
  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(1);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 1);
        setCrop(newCrop);
        setCompletedCrop(newCrop);
      }
    }
  }

  return (
    <div className='Image-Container'>
        <div>
        <a
      href="#home" // Use href for accessibility purposes but prevent the default behavior with onClick
      onClick={(e) => {
        e.preventDefault(); // Prevent the default link behavior
        navigate('/home', { state: { GUID } });
      }}
    >
        Go to HomePage
    </a>
        </div>
      <div className="Crop-Controls">
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      <div className='Images-Section'>
      {!!imgSrc && (
        <div className='selected-Image'>
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
        </div>
      )}
      {!!completedCrop && (
        <div className='cropped-Image'>
          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: '75px',
                height: '75px',
              }}
            />
          </div>
          <div>
            <button onClick={UploadPfp}>Set as ProfilePicture</button>
            <div style={{ fontSize: 12, color: '#666' }}>
              If you get a security error when downloading, try opening the
              Preview in a new tab (icon near top right).
            </div>
            <a
              href="#hidden"
              ref={hiddenAnchorRef}
              download
              style={{
                position: 'absolute',
                top: '-200vh',
                visibility: 'hidden',
              }}
            >
              Hidden download
            </a>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
export default CropPFP;
