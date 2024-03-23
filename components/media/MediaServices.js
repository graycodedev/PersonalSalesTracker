
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from 'expo-document-picker';


const MediaServices = {
  convertImageToBase64: async function convertImageToBase64(uri) {
    try {
      const fileUri = uri.replace("file://", ""); // Remove the "file://" prefix if it exists
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return base64;
    } catch (error) {
    }
  },
  GetImageUriFromPicker: async function GetImageUriFromPicker() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
  },
  PickFile: async function PickFile() {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: '*/*', // you can specify the file type here, e.g., 'image/*' for images
      });

      if (file.type === 'success') {
        const fileInfo = await FileSystem.getInfoAsync(file.uri);
        return file;
      }
    } catch (error) {
    }
  },
  PickFiles: async function PickFiles() {
    try {
      const files = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
        multiple: true
      });
      if(files.canceled === false){
        return files.assets;
      }
      
    } catch (error) {
    }
  },
 
};

export default MediaServices;
