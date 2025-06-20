import React, { useState, useContext } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import AuthService from '../Services/AuthService';
import { AuthContext } from '../components/AuthContext';

const SwitchOrganization = ({ navigation }) => {
  const [organizationName, setOrganizationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { markOrgSelected } = useContext(AuthContext);

  const submitDemo = async () => {
    if (!organizationName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Organization Name is required',
        position: 'bottom',
        visibilityTime: 2000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save the organization name (e.g., to API or domain logic)
      await AuthService.setDomainName(organizationName);

      // Mark organization as selected in context & AsyncStorage
      await markOrgSelected();

      Toast.show({
        type: 'success',
        text1: 'Organization saved successfully',
        position: 'bottom',
        visibilityTime: 1500,
      });

      setTimeout(() => {
        navigation.replace('Login');
      }, 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again later.',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.maincontainer}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/images/Assets/login-pic.png')} />
      </View>
      <View style={styles.Content}>
        <Text style={styles.contentText}>Switch Organization</Text>
        <View style={styles.contentView}>
          <TextInput
            style={styles.Inputbox}
            placeholder="Organization Name"
            placeholderTextColor="gray"
            onChangeText={setOrganizationName}
            value={organizationName}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.Btn, isLoading && styles.disabledBtn]}
            onPress={submitDemo}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </View>
  );
};

export default SwitchOrganization;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Content: {
    flex: 1,
    padding: 25,
    justifyContent: 'flex-start',
  },
  contentText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 150,
  },
  contentView: {
    width: '100%',
  },
  Inputbox: {
    width: '100%',
    padding: 15,
    marginVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#697ce3',
    color: 'gray',
  },
  Btn: {
    width: '100%',
    padding: 12,
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: '#697ce3',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#A9D0F5',
  },
  btnText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
});
