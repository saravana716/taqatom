import tokens from '@/locales/tokens';
import ProfileServices from '@/Services/API/ProfileServices'; // Your API service
import { myreducers } from '@/Store/Store';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message'; // Assuming you're using this Toast lib
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';

const ProfileUpdate = ({navigation}) => {
const dispatch=useDispatch()
  const {t,i18n} = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [isLoading, setIsLoading] = useState(false);
  const selector = useSelector((data) => data.employeedetails);
  console.log("ii",selector);
  
  
  function backto(params) {
    navigation.navigate("Profile")
  }
  
  const profilePicFromStore = useSelector((data) => data.setprofiledata.profilePic);
  const gender = useSelector((data) => data.setprofiledata.gender);

  const [profilePic, setProfilePic] = useState(profilePicFromStore || null);

 
const handleFilePick = useCallback(async () => {
  try {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required!');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1, // full quality before manipulation
      base64: false,
    });

    if (result?.canceled || !result.assets?.length) return;

    const image = result.assets[0];
    setIsLoading(true);

    // Resize and compress
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ resize: { width: 600 } }], // resize to 600px width
      { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;
    console.log('📷 Base64 Preview:', base64Image.slice(0, 100) + '...');

    const myid = selector?.[0]?.id;
    if (!myid) throw new Error('User ID not found.');
console.log(myid);

    const existingDetails = selector?.[0];
    if (!existingDetails) throw new Error('Employee data not available.');

    // Clean payload
    const {
      id,
      profile_url,
      update_time,
      change_time,
      area_details,
      leave_group_details,
      department_name,
      department_code,
      position_name,
      position_code,
      dependents,
      payroll,
      salary_template,
      ssn,
      user,
      ...cleanedDetails
    } = existingDetails;

    const updatedPayload = {
  ...cleanedDetails,
  profile_file: base64Image,
  user: {
    id: existingDetails.user,
    first_name: existingDetails.first_name,
    last_name: existingDetails.last_name,
    email: existingDetails.email,
  },
  ...(payroll ? { payroll } : {}), // optional
};

    console.log("📦 Payload:", JSON.stringify(updatedPayload, null, 2));

   const res = await ProfileServices.putEmployeeFullDetails(myid, updatedPayload);
console.log("myresponse", res);

// ✅ Only proceed if success
if (!res || (res?.success === false && res?.status !== 200)) {
  throw new Error('Failed to update profile image');
}

// ✅ Now safely use the result
let mydata = res.profile_url;
console.log(mydata);

setProfilePic(base64Image);

// ✅ Dispatch only if successful
dispatch(myreducers.profiledetails({ profilePic: res.profile_url, gender }));

Toast.show({
  type: 'success',
  text1: 'Profile Updated Successfully',
  position: 'bottom',
});
  } 
  catch (error) {
    console.log('❌ Error (full):', JSON.stringify(error?.errorResponse || error, null, 2));
    console.error('❌ Error Message:', error.message);

    Toast.show({
      type: 'error',
      text1: 'Upload Failed',
      text2: error.message || 'Please try again.',
      position: 'bottom',
    });
  } finally {
    setIsLoading(false);
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
  <TouchableOpacity onPress={backto} style={{ padding: 10 }}>
    <Icon name="angle-left" size={30} color="white" />
  </TouchableOpacity>
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text style={styles.modalText}>
      {t(tokens.nav.myProfile)}
    </Text>
  </View>
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
                  <Image source={{ uri: profilePic }} style={styles.po1} />
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
