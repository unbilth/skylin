import { notification } from 'antd';

export function successFullDownload() {
  notification['success']({
    message: 'Successful download',
    description: 'Your file has been downloaded successfully. The file is in your /Downloads directory.',
  });
};

export function successFullUpload() {
  notification['success']({
    message: 'Successful upload',
    description: 'Your file has been uploaded successfully.',
  });
};