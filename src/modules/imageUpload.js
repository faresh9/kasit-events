export class ImageUploadService {
  async uploadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        // In a real application, you would upload to a server
        // For now, we'll store in localStorage as base64
        resolve(reader.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }
}

export const imageUploadService = new ImageUploadService();