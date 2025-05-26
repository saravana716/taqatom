import {Toast} from 'react-native-toast-message/lib/src/Toast';

export function formatErrorsToToastMessages(error) {
  const { errors, status } = error?.errorResponse || {};
  if (!errors || !Array.isArray(errors)) {
    Toast.show({
      text1:'Something went wrong',
      type:'error',
      position:'bottom',visibilityTime:2000
    })
    return;
  }
  errors.forEach((errorItem) => {
    if (errorItem?.message && typeof errorItem.message === 'object') {
      // Loop through each field inside the "message" object
      Object.entries(errorItem.message).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg) => {
            Toast.show({
              text1:`${msg}`,
              type:'error',
              position:'bottom',visibilityTime:2000
            })
          });
        } else if (typeof messages === 'object') {
          // Handle nested objects (e.g., user.username)
          Object.entries(messages).forEach(([nestedField, nestedMessages]) => {
            if (Array.isArray(nestedMessages)) {
              nestedMessages.forEach((msg) => {
                Toast.show({
                  text1:`${msg}`,
                  type:'error',
                  position:'bottom',visibilityTime:2000
                })
              });
            } else {
              Toast.show({
                text1:`${nestedMessages}`,
                type:'error',
                position:'bottom',visibilityTime:2000
              })
            }
          });
        } else {
          Toast.show({
            text1:`${messages}`,
            type:'error',
            position:'bottom',visibilityTime:2000
          })
        }
      });
    } else {
      Toast.show({
        text1:errorItem?.message || 'Unknown error occurred',
        type:'error',
        position:'bottom',visibilityTime:2000
      })
    }
  });
}