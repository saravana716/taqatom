import ProfileServices from '@/Services/API/ProfileServices'; // Your API service
import * as ImagePicker from 'expo-image-picker';
import get from 'lodash/get';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

const ProfileUpdate = ({ navigation }) => {
  const isRTL = false; // Set manually or dynamically

  const [isLoading, setIsLoading] = useState(false);
  const selector = useSelector((data) => data.employeedetails);
  const profilePicFromStore = useSelector((data) => data.setprofiledata.profilePic);
  const gender = useSelector((data) => data.setprofiledata.gender);
  const [profilePic, setProfilePic] = useState(profilePicFromStore || null);

  const backto = () => {
    navigation.navigate('Profile');
  };

  const uploadToS3 = async (file, presignedUrl) => {
    try {
      const fileResponse = await fetch(file.uri);
      const blob = await fileResponse.blob();
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
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const imageAsset = result.assets[0];
        setIsLoading(true);

        const myid = selector.length > 0 ? selector[0].id : null;
        if (!myid) throw new Error('User ID not found.');

        const base64Image = `data:${imageAsset.type};base64,${imageAsset.base64}`;

        const res = await ProfileServices.updateProfilePic(myid, {
          profile_url: base64Image,
        });

        if (!res?.success) {
          throw new Error('Failed to update profile image');
        }

        setProfilePic(base64Image);
        Toast.show({
          type: 'success',
          text1: 'Profile Updated Successfully',
          position: 'bottom',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: error.message || 'Please try again later.',
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
              <TouchableOpacity onPress={backto}>
                <Icon name="angle-left" size={30} color="white" />
              </TouchableOpacity>
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
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>Name</Text>
                <Text style={styles.titlename}>{data.first_name} {data.last_name}</Text>
              </View>

              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>Employee Code</Text>
                <Text style={styles.titlename}>{data.emp_code}</Text>
              </View>

              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>Employee Type</Text>
                <Text style={styles.titlename}>{data.emp_type}</Text>
              </View>

              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>Mobile Number</Text>
                <Text style={styles.titlename}>{data.mobile}</Text>
              </View>

              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>Office Contact Number</Text>
                <Text style={styles.titlename}>{data.office_tel}</Text>
              </View>

              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>Office Email</Text>
                <Text style={styles.titlename}>{data.email}</Text>
              </View>

              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>Position</Text>
                <Text style={styles.titlename}>{data.position_name}</Text>
              </View>

              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>Department</Text>
                <Text style={styles.titlename}>{data.department_name}</Text>
              </View>

              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>Date of Joining</Text>
                <Text style={styles.titlename}>{data.hire_date}</Text>
              </View>

              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>Date of Birth</Text>
                <Text style={styles.titlename}>{data.birthday}</Text>
              </View>

              <View style={styles.updatename}>
                <Text style={[styles.titles, { textAlign: isRTL ? 'right' : 'left' }]}>Country</Text>
                <Text style={styles.titlename}>{data.national}</Text>
              </View>
            </ScrollView>
          </View>
        ))}
      </View>
      <Toast />
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
