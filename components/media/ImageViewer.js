import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Modal, Image } from "react-native";

function ImageViewer({ source, onClose, header }) {
  //   const [visible, setVisible] = useState(show);
  //   useEffect(() => {
  //     setVisible(show);
  //   }, []);

  return (
    <View>
      {/* Modal for image viewer */}
      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
        // onRequestClose={closeImageViewer}
      >
        <View
          style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
        >
          {header()}
          <View style={{ flex: 1, justifyContent: "center", bottom: 20 }}>
            <Image
              source={source}
              style={{
                height: "70%",
                resizeMode: "contain",
                aspectRatio: 1,
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ImageViewer;
