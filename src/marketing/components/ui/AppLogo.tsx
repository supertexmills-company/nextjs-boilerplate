"use client";

import AppIcon from "./AppIcon";
import AppImage from "./AppImage";

interface AppLogoProps {
  src?: string;
  text?: string;
  iconName?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

function AppLogo({
  src = "/assets/images/app_logo.png",
  text,
  iconName = "SparklesIcon",
  size = 64,
  className = "",
  onClick,
}: AppLogoProps) {
  return (
    <div
      className={`flex items-center gap-2 ${onClick ? "cursor-pointer hover:opacity-80" : ""} ${className}`}
      onClick={onClick}
    >
      {src ? (
        <AppImage
          src={src}
          alt="Logo"
          width={size}
          height={size}
          className="shrink-0"
        />
      ) : (
        <AppIcon name={iconName} size={size} className="shrink-0" />
      )}

      {text && <span className="text-xl font-bold">{text}</span>}
    </div>
  );
}

export default AppLogo;
