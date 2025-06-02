// import ProfileServices from '@/Services/API/ProfileServices';
// import * as ImagePicker from 'expo-image-picker';
// import get from 'lodash/get';
// import { useCallback, useEffect, useState } from 'react';
// import {
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useSelector, useDispatch } from 'react-redux';
// import Toast from 'react-native-toast-message';
// import { useNavigation } from '@react-navigation/native';

// const ProfileUpdate = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [profilePic, setProfilePic] = useState(null);
//   const selector = useSelector((state) => state.employeedetails);
//   const profiles = useSelector((state) => state.setprofiledata.profilePic);
//   const genders = useSelector((state) => state.setprofiledata.gender);
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

//   const getUserDetails = useCallback(async () => {
//     try {
//       const updatedData = await ProfileServices.getUserDetails(selector?.id);
//       dispatch({ type: 'SET_EMPLOYEE_DETAILS', payload: updatedData });
//     } catch (err) {
//       console.error('Failed to fetch user details:', err);
//     }
//   }, [selector?.id]);

//   const handleFilePick = useCallback(async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Permission to access media library is required!');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         quality: 1,
//         base64: true,
//       });

//       if (!result.canceled) {
//         const imageAsset = result.assets[0];
//         setIsLoading(true);

//         const res = await ProfileServices.updateProfilePic(
//           selector?.id,
//           {
//             uri: imageAsset.uri,
//             type: imageAsset.type || 'image/jpeg',
//             name: imageAsset.fileName || `profile_${Date.now()}.jpg`,
//             base64: imageAsset.base64,
//           }
//         );

//         const s3Link = get(res, 'url');
//         const s3SplitUrl = `${s3Link?.split('.png')[0]}.png`;

//         const uploadResponse = await ProfileServices.sendImagesToS3({
//           file: {
//             uri: imageAsset.uri,
//             type: imageAsset.type || 'image/jpeg',
//             name: imageAsset.fileName || `profile_${Date.now()}.jpg`,
//           },
//           S3URL: s3Link,
//           type: 'png',
//         });

//         if (uploadResponse?.success) {
//           setProfilePic(s3SplitUrl + `?t=${Date.now()}`);
//           getUserDetails();

//           Toast.show({
//             type: 'success',
//             text1: 'Profile Updated Successfully',
//             position: 'bottom',
//           });
//         } else {
//           throw new Error('S3 upload failed');
//         }
//         setIsLoading(false);
//       }
//     } catch (error) {
//       console.error('Upload error', error);
//       setIsLoading(false);
//       Toast.show({
//         type: 'error',
//         text1: 'Upload Failed',
//         text2: error.message,
//       });
//     }
//   }, [selector?.id]);

//   const currentProfilePic = profilePic || profiles;

//   return (
//     <View style={styles.container}>
//       <View style={styles.topcontainer}>
//         <Image source={require('../assets/images/Assets/blue-bg.png')} style={styles.images} />
//       </View>
//       <View style={styles.updateproinner}>
//         {Array.isArray(selector) && selector.map((data) => (
//           <View key={data.id} style={styles.updatepro}>
//             <View style={styles.updatetop}>
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Icon name="angle-left" size={30} color="white" />
//               </TouchableOpacity>
//               <Text style={styles.modalText}>My Profile</Text>
//             </View>

//             <ScrollView style={styles.updatecontent} showsVerticalScrollIndicator={false}>
//               <View style={styles.profileupdate}>
//                 <View style={styles.po1}>
//                   {currentProfilePic && currentProfilePic !== 'null' ? (
//                     <Image source={{ uri: currentProfilePic }} style={styles.po1} resizeMode="cover" />
//                   ) : (
//                     <Image
//                       source={
//                         genders === 'M'
//                           ? require('../assets/images/Assets/profile-image.png')
//                           : require('../assets/images/Assets/girl-profile-image.jpg')
//                       }
//                       style={styles.po1}
//                       resizeMode="cover"
//                     />
//                   )}
//                   <TouchableOpacity style={styles.po} onPress={handleFilePick} disabled={isLoading}>
//                     <Icon name="edit" size={25} color="black" />
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {[{
//                 label: 'Name',
//                 value: `${data.first_name} ${data.last_name}`,
//               },
//               { label: 'Employee Code', value: data.emp_code },
//               { label: 'Employee Type', value: data.emp_type },
//               { label: 'Mobile Number', value: data.mobile },
//               { label: 'Office Contact Number', value: data.office_tel },
//               { label: 'Office Email', value: data.email },
//               { label: 'Position', value: data.position_name },
//               { label: 'Department', value: data.department_name },
//               { label: 'Date Of joining', value: data.hire_date },
//               { label: 'Date Of Birth', value: data.birthday },
//               { label: 'Country', value: data.national }].map((item, index) => (
//                 <View key={index} style={styles.updatename}>
//                   <Text style={styles.titles}>{item.label}</Text>
//                   <Text style={styles.titlename}>{item.value}</Text>
//                 </View>
//               ))}
//             </ScrollView>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// export default ProfileUpdate;

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'lightgray',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     flexDirection: 'column',
//   },
//   topcontainer: {
//     width: '100%',
//     height: '30%',
//     backgroundColor: 'red',
//     borderBottomRightRadius: 30,
//     borderBottomLeftRadius: 30,
//   },
//   images: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//     borderBottomRightRadius: 30,
//     borderBottomLeftRadius: 30,
//   },
//   updateproinner: {
//     width: '90%',
//     height: '95%',
//     position: 'absolute',
//     top: '50%',
//     left: '5%',
//   },
//   updatepro: {
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     flexDirection: 'column',
//   },
//   updatetop: {
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   modalText: {
//     fontSize: 20,
//     fontWeight: '700',
//     width: '100%',
//     textAlign: 'center',
//     color: 'white',
//     marginLeft: -30,
//   },
//   updatecontent: {
//     width: '100%',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 15,
//     backgroundColor: 'white',
//     marginTop: 10,
//   },
//   profileupdate: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   po1: {
//     borderRadius: 100,
//     width: 130,
//     height: 130,
//   },
//   po: {
//     width: 40,
//     height: 40,
//     position: 'absolute',
//     backgroundColor: 'white',
//     borderRadius: 100,
//     borderWidth: 1,
//     borderColor: 'black',
//     alignItems: 'center',
//     justifyContent: 'center',
//     bottom: 2,
//     right: -2,
//   },
//   updatename: {
//     width: '100%',
//     backgroundColor: 'lightgray',
//     padding: 15,
//     borderRadius: 15,
//     marginVertical: 5,
//   },
//   titles: {
//     fontSize: 12,
//     color: 'gray',
//   },
//   titlename: {
//     fontWeight: '800',
//   },
// });

import ProfileServices from '@/Services/API/ProfileServices'; // Your API service
import * as ImagePicker from 'expo-image-picker';
import get from 'lodash/get';
import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message'; // Assuming you're using this Toast lib
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

const ProfileUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const selector = useSelector((data) => data.employeedetails);
  console.log("myselector",selector);
  
  const profilePicFromStore = useSelector((data) => data.setprofiledata.profilePic);
  const gender = useSelector((data) => data.setprofiledata.gender);

  const [profilePic, setProfilePic] = useState(profilePicFromStore || null);

  // Helper: Upload file to S3 using PUT fetch
  const uploadToS3 = async (file, presignedUrl) => {
    try {
      // Fetch file as blob
      const fileResponse = await fetch(file.uri);
      const blob = await fileResponse.blob();

      // Upload to S3 with PUT
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: blob,
      });

      if (!uploadResponse.ok) {
        throw new Error(`S3 upload failed with status ${uploadResponse.status}`);
      }

      return true;
    } catch (err) {
      console.error('S3 Upload Error:', err);
      throw err;
    }
  };

const handleFilePick = useCallback(async () => {
  try {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const imageAsset = result.assets[0];
      setIsLoading(true);

      // Get the user ID from selector array (first item)
      const myid = selector.length > 0 ? selector[0].id : null;
      console.log('Selected user id:', myid);
      if (!myid) throw new Error('User ID not found.');

      const mimeType = imageAsset.type ?? 'image/jpeg';

      // Step 1: Get presigned URL from backend
      const res = await ProfileServices.updateProfilePic(myid, {
        uri: imageAsset.uri,
        type: mimeType,
        name: imageAsset.fileName ?? `profile_${Date.now()}.jpg`,
      });

      console.log('response12345', res);

      const s3Link = get(res, 'url');
      console.log('mylink', s3Link);

      if (!s3Link) {
        throw new Error('Failed to get S3 presigned URL');
      }

      // Step 2: Upload file to S3
      let yyy=await uploadToS3(
        {
          uri: imageAsset.uri,
          type: mimeType,
          name: imageAsset.fileName ?? `profile_${Date.now()}.jpg`,
        },
        s3Link
      );

      // Step 3: Update profilePic state with cache busting
      const updatedPicUrl = `${s3Link.split('?')[0]}?t=${Date.now()}`;
      console.log('updatepic', updatedPicUrl);
      setProfilePic(updatedPicUrl);

      Toast.show({
        type: 'success',
        text1: 'Profile Updated Successfully',
        position: 'bottom',
      });

      setIsLoading(false);
    }
  } catch (error) {
    console.error('Upload error', error);
    setIsLoading(false);
    Toast.show({
      type: 'error',
      text1: 'Upload failed',
      text2: error.message || 'Please try again later.',
      position: 'bottom',
    });
  }
}, [selector]);


  return (
    <View style={styles.container}>
      <View style={styles.topcontainer}>
        <Image source={require('../assets/images/Assets/blue-bg.png')} style={styles.images} />
      </View>

      <View style={styles.updateproinner}>
        {selector.map((data) => (
          <View key={data.id} style={styles.updatepro}>
            <View style={styles.updatetop}>
              <Icon name="angle-left" size={30} color="white" />
              <Text style={styles.modalText}>My Profile</Text>
            </View>

            <ScrollView
              style={{
                width: '100%',
                backgroundColor: 'white',
                flexDirection: 'column',
                gap: 15,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 15,
              }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.profileupdate}>
                <View style={styles.po1}>
                  {profilePic && profilePic !== 'null' ? (
                   <Image
  key={profilePic} // forces rerender
  source={{ uri: profilePic }}
  style={styles.po1}
  resizeMode="cover"
/>
                  ) : gender === 'M' ? (
                    <Image
                      source={require('../assets/images/Assets/profile-image.png')}
                      style={styles.po1}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={require('../assets/images/Assets/girl-profile-image.jpg')}
                      style={styles.po1}
                      resizeMode="cover"
                    />
                  )}

                  <TouchableOpacity style={styles.po} onPress={handleFilePick} disabled={isLoading}>
                    <Icon name="edit" size={25} color="black" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.updatename}>
                <Text style={styles.titles}>Name</Text>
                <Text style={styles.titlename}>
                  {data.first_name} {data.last_name}
                </Text>
              </View>
              <View style={styles.updatename}>
                <Text style={styles.titles}>Employee Code</Text>
                <Text style={styles.titlename}>{data.emp_code}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={styles.titles}>Employee Type</Text>
                <Text style={styles.titlename}>{data.emp_type}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={styles.titles}>Mobile Number</Text>
                <Text style={styles.titlename}>{data.mobile}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={styles.titles}>Office Contact Number</Text>
                <Text style={styles.titlename}>{data.office_tel}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={styles.titles}>Office Email</Text>
                <Text style={styles.titlename}>{data.email}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={styles.titles}>Position</Text>
                <Text style={styles.titlename}>{data.position_name}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={styles.titles}>Department</Text>
                <Text style={styles.titlename}>{data.department_name}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={styles.titles}>Date Of joining</Text>
                <Text style={styles.titlename}>{data.hire_date}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={styles.titles}>Date Of Birth</Text>
                <Text style={styles.titlename}>{data.birthday}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={styles.titles}>Country</Text>
                <Text style={styles.titlename}>{data.national}</Text>
              </View>
            </ScrollView>
          </View>
        ))}
      </View>
      <Toast/>
    </View>
  );
};

export default ProfileUpdate;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'lightgray',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  topcontainer: {
    width: '100%',
    height: '30%',
    backgroundColor: 'red',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    position: 'relative',
  },
  images: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  updateproinner: {
    width: '90%',
    height: '95%',
    backgroundColor: 'transparent',
    padding: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -0.5 * 100 + '%' }, { translateY: -0.5 * 100 + '%' }],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  updatepro: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    gap: 20,
  },
  updatetop: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',
  },
  modalText: {
    fontSize: 20,
    fontWeight: '700',
    width: '100%',
    textAlign: 'center',
    color: 'white',
  },
  updatecontent: {
    width: '100%',
    height: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    gap: 15,
  },
  profileupdate: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  po1: {
    borderRadius: 100,
    width: 130,
    height: 130,
    position: 'relative',
    objectFit: 'cover',
  },
  po: {
    width: 40,
    height: 40,
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 2,
    right: -2,
  },
  fl: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    paddingVertical: 10,
  },
  updatename: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'lightgray',
    padding: 15,
    borderRadius: 15,
    gap: 7,
    marginVertical: 10,
  },
  titles: {
    fontSize: 12,
    color: 'gray',
  },
  titlename: {
    fontWeight: '800',
  },
});
