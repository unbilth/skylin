import { message } from 'antd';

export function noKeys() {
  message.error("You don't have a public key. Generate your pgp keys and try again", 10);
};

export function uploadFileFailed() {
  message.error("We advise you not to exceed 1 gigabyte per file. Try again if it still doesn't work. Try again later.", 10);
};

export function uploadSymmetricFileFailed() {
  message.error("It seems that an error has occurred. Make sure you type a password, we advise you not to exceed 1 gigabyte per file.", 10);
};

export function uploadAsymmetricFileFailed() {
  message.error("It seems that an error has occurred, Make sure you type a passphrase and have previously generated at least one public key. We advise you not to exceed 1 gigabyte per file.", 10);
};

export function downloadFileFailed() {
  message.error("Try again if it still doesn't work. Try again later.", 10);
};

export function downloadSymmetricFileFailed() {
  message.error("It seems that an error has occurred, it may be due to a wrong password or a file that is not symmetrically encrypted.", 10);
};

export function downloadAsymmetricFileFailed() {
  message.error("It seems that an error has occurred, it may be due to a wrong passphrase or a file that is not asymmetrically encrypted. If you don't have a public key generate one and try again with another skylink.", 10);
};