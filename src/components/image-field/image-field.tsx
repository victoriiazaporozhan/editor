import { FC, useEffect, useState } from "react";
import { ImagePlaceholder } from "../image-placeholder";
import { Markdown } from "../markdown";

export const ImageField: FC<{ src?: string }> = ({ src }) => {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [src])
  
  if (imageError) return <Markdown className="text-align-center warning">*The image link is not valid. Please check the url.*</Markdown>

  return (
    src ? 
      <img src={src} alt="image" onError={() => setImageError(true)} onLoad={() => setImageError(false)} />
      :
      <ImagePlaceholder />
  )
}