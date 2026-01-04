export type LogoPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface LogoOverlayOptions {
  logoDataUrl: string;
  imageDataUrl: string;
  logoSizePercent?: number;
  paddingPercent?: number;
  position?: LogoPosition;
  opacity?: number;
}

export async function overlayLogoOnImage(options: LogoOverlayOptions): Promise<string> {
  const {
    logoDataUrl,
    imageDataUrl,
    logoSizePercent = 25,
    paddingPercent = 3,
    position = "bottom-right",
    opacity = 100,
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

        // Calculate position based on selected corner
        let x: number;
        let y: number;

        switch (position) {
          case "top-left":
            x = padding;
            y = padding;
            break;
          case "top-right":
            x = canvas.width - logoWidth - padding;
            y = padding;
            break;
          case "bottom-left":
            x = padding;
            y = canvas.height - logoHeight - padding;
            break;
          case "bottom-right":
          default:
            x = canvas.width - logoWidth - padding;
            y = canvas.height - logoHeight - padding;
            break;
        }

        // Apply opacity and draw logo
        ctx.globalAlpha = opacity / 100;
        ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);
        ctx.globalAlpha = 1;
        
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
