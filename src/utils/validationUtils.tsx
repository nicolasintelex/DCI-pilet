import * as yup from 'yup';

export const validateUrl = (message: string) => {
  return yup
    .string()
    .transform((url: string) => {
      const newUrl = url.toLowerCase().replace('www.', '');
      return newUrl;
    })
    .url(message)
    // @ts-ignore
    .test('is a valid decoded url', message, (url: string) => {
      const urlRegex = /[^\w-./?&=#()% :]/;
      try {
        const decoded = decodeURI(url);
        return !urlRegex.test(decoded);
      } catch {
        return false;
      }
    });
};
