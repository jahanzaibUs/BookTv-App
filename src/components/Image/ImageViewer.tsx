import React from "react";
import ImageView from "react-native-image-viewing";

interface Props {
  data: any;
  visible: boolean;
  onRequestClose: () => void;
  imageIndex?: number;
}

export default function ImageViewer({
  data,
  visible,
  onRequestClose,
  imageIndex = 0,
}: Props) {
  const [images, setImages] = React.useState([]);

  React.useEffect(() => {
    if (data && data.length !== 0) {
      setImages(data.map((d: any) => ({ uri: d.url })));
    }
  }, [data]);

  return (
    <ImageView
      images={images}
      imageIndex={imageIndex}
      visible={visible}
      onRequestClose={() => onRequestClose()}
    />
  );
}
