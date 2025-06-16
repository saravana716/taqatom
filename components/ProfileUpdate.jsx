import ProfileServices from '@/Services/API/ProfileServices'; // Your API service
import * as ImagePicker from 'expo-image-picker';
import get from 'lodash/get';
import React, { useCallback, useState } from 'react';
import {useTranslation} from 'react-i18next';
import tokens from '@/locales/tokens';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message'; // Assuming you're using this Toast lib
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

const ProfileUpdate = () => {

  const {t,i18n} = useTranslation();
  const isRTL = i18n.language === 'ar';
  console.log("yyyyyyyyyyyyyyyyyyyy",isRTL);
  const [isLoading, setIsLoading] = useState(false);
  const selector = useSelector((data) => data.employeedetails);
  
  
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
      
      if (!myid) throw new Error('User ID not found.');

      const mimeType = imageAsset.type ?? 'image/jpeg';

      // Step 1: Get presigned URL from backend
      const res = await ProfileServices.updateProfilePic(myid, {
        uri: imageAsset.uri,
        type: mimeType,
        name: imageAsset.fileName ?? `profile_${Date.now()}.jpg`,
      });

      

      const s3Link = get(res, 'url');
      

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
      
      setProfilePic(updatedPicUrl);

      Toast.show({
        type: 'success',
        text1: 'Profile Updated Successfully',
        position: 'bottom',
      });

      // setIsLoading(false);
    }
  } catch (error) {
    
    // setIsLoading(false);
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
              <Text style={styles.modalText}>
                  {t(tokens.nav.myProfile)}
              </Text>
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
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.common.name)}</Text>
                <Text style={styles.titlename}>
                  {data.first_name} {data.last_name}
                </Text>
              </View>
              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.common.employeeCode)}</Text>
                <Text style={styles.titlename}>{data.emp_code}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.common.employeeType)}</Text>
                <Text style={styles.titlename}>{data.emp_type}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.common.mobileNumber)}</Text>
                <Text style={styles.titlename}>{data.mobile}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.common.officeContactNumber)}</Text>
                <Text style={styles.titlename}>{data.office_tel}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.common.officeEmail)}</Text>
                <Text style={styles.titlename}>{data.email}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.nav.position)}</Text>
                <Text style={styles.titlename}>{data.position_name}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.nav.department)}</Text>
                <Text style={styles.titlename}>{data.department_name}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.common.dateOfJoining)}</Text>
                <Text style={styles.titlename}>{data.hire_date}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.common.dateOfBirth)}</Text>
                <Text style={styles.titlename}>{data.birthday}</Text>
              </View>
              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>{t(tokens.common.country)}</Text>
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
