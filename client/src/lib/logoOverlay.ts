export interface LogoOverlayOptions {
  logoDataUrl: string;
  imageDataUrl: string;
  logoSizePercent?: number;
  paddingPercent?: number;
  addBadgeBackground?: boolean;
  badgeColor?: string;
  badgePadding?: number;
}

export async function overlayLogoOnImage(options: LogoOverlayOptions): Promise<string> {
  const {
    logoDataUrl,
    imageDataUrl,
    logoSizePercent = 6,
    paddingPercent = 3,
    addBadgeBackground = true,
    badgeColor = "rgba(255, 255, 255, 0.85)",
    badgePadding = 8,
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
        
        if (addBadgeBackground) {
          const badgeX = x - badgePadding;
          const badgeY = y - badgePadding;
          const badgeWidth = logoWidth + badgePadding * 2;
          const badgeHeight = logoHeight + badgePadding * 2;
          const borderRadius = 6;
          
          ctx.fillStyle = badgeColor;
          ctx.beginPath();
          ctx.moveTo(badgeX + borderRadius, badgeY);
          ctx.lineTo(badgeX + badgeWidth - borderRadius, badgeY);
          ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY, badgeX + badgeWidth, badgeY + borderRadius);
          ctx.lineTo(badgeX + badgeWidth, badgeY + badgeHeight - borderRadius);
          ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY + badgeHeight, badgeX + badgeWidth - borderRadius, badgeY + badgeHeight);
          ctx.lineTo(badgeX + borderRadius, badgeY + badgeHeight);
          ctx.quadraticCurveTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - borderRadius);
          ctx.lineTo(badgeX, badgeY + borderRadius);
          ctx.quadraticCurveTo(badgeX, badgeY, badgeX + borderRadius, badgeY);
          ctx.closePath();
          ctx.fill();
        }
        
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
