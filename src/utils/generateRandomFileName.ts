export default function generateRandomFileName(length = 6, fileName : string, firsFileName : string) {
    let newFileName = '';
    for (let i = 0; i < length; i++) {
      newFileName += fileName.charAt(Math.floor(Math.random() * fileName.length));
    }
    return `${firsFileName}_${newFileName}`;
} 
  