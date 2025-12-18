export interface LogoOverlayOptions {
  logoDataUrl: string;
  imageDataUrl: string;
  logoSizePercent?: number;
  paddingPercent?: number;
}

export async function overlayLogoOnImage(options: LogoOverlayOptions): Promise<string> {
  const {
    logoDataUrl,
    imageDataUrl,
    logoSizePercent = 6,
    paddingPercent = 3,
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    const mainImage = new window.Image();
    mainImage.crossOrigin = "anonymous";
    
    mainImage.onload = () => {
      canvas.width = mainImage.width;
      canvas.height = mainImage.height;
      
      ctx.drawImage(mainImage, 0, 0);
      
      const logoImage = new window.Image();
      logoImage.crossOrigin = "anonymous";
      
      logoImage.onload = () => {
        const logoWidth = (canvas.width * logoSizePercent) / 100;
        const logoAspectRatio = logoImage.width / logoImage.height;
        const logoHeight = logoWidth / logoAspectRatio;
        
        const padding = (canvas.width * paddingPercent) / 100;
        const x = canvas.width - logoWidth - padding;
        const y = canvas.height - logoHeight - padding;
        
        // Draw logo as-is (logo should have its own transparency)
        ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);
        
        const resultDataUrl = canvas.toDataURL("image/png");
        resolve(resultDataUrl);
      };
      
      logoImage.onerror = () => {
        resolve(imageDataUrl);
      };
      
      logoImage.src = logoDataUrl;
    };
    
    mainImage.onerror = () => {
      reject(new Error("Failed to load main image"));
    };
    
    mainImage.src = imageDataUrl;
  });
}
