import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Eye,
  EyeOff,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { updateProfile } from '../../api/profile-api/profileApi';
import {
  EditProfileForm,
  editProfileSchema,
} from '../../schemas/profileSchema';
import { useUserStore } from '../../store/useUserStore';
import { showToast } from '../../utils/ToastHelper';
import { styles } from './EditProfileStyles';

// ---------- Password input ----------
const PasswordInput = ({ field, error, placeholder }: any) => {
  const [show, setShow] = useState(false);

  return (
    <View style={{ position: 'relative' }}>
      <TextInput
        secureTextEntry={!show}
        value={field.value}
        onChangeText={field.onChange}
        placeholder={placeholder}
        autoCapitalize="none"
        style={[styles.passwordInput, error && styles.inputError]}
      />

      <TouchableOpacity
        onPress={() => setShow(prev => !prev)}
        style={{
          position: 'absolute',
          right: 12,
          top: 12,
          height: 36,
          width: 36,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {show ? (
          <Eye size={20} color="#6b6b6b" />
        ) : (
          <EyeOff size={20} color="#6b6b6b" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const EditProfileScreen = ({ navigation }: any) => {
  const { user, setUser, team_name } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // image preview
  const [profileImage, setProfileImage] = useState<string | undefined>(
    typeof user?.profile_picture === 'string'
      ? user?.profile_picture
      : undefined,
  );

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const contentHeightRef = useRef(0);

  const isoToDDMMYYYY = (iso: string) => {
    if (!iso) return '';
    iso = iso.split('T')[0];
    const [year, month, day] = iso.split('-');
    return `${day}-${month}-${year}`;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      dob: '',
      team: user?.team_name || team_name || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      const formattedDob = user.dob ? isoToDDMMYYYY(user.dob) : '';
      reset({
        name: user.name,
        email: user.email,
        dob: formattedDob,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user, reset]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel) return;

      const uri = response.assets?.[0]?.uri;
      if (uri) {
        setProfileImage(uri);
        setUser({ ...user!, profile_picture: uri });
      }
    });
  };

  const togglePasswordSection = () => {
    const toValue = showPasswordSection ? 0 : contentHeightRef.current || 160;
    setShowPasswordSection(prev => !prev);

    Animated.timing(animatedHeight, {
      toValue,
      duration: 230,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const onPasswordLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    contentHeightRef.current = h;
    if (showPasswordSection) animatedHeight.setValue(h);
  };

  const onDobChange = (onChange: any) => (_event: any, selectedDate?: Date) => {
    setShowDobPicker(false);
    if (!selectedDate) return;

    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = selectedDate.getFullYear();

    // store DD-MM-YYYY only
    onChange(`${day}-${month}-${year}`);
  };

  const ddmmyyyyToISO = (dob: string) => {
    const [day, month, year] = dob.split('-');
    return `${year}-${month}-${day}`;
  };

  const onSubmit = async (data: EditProfileForm) => {
    setLoading(true);
    try {
      const dobForBackend = data.dob ? ddmmyyyyToISO(data.dob) : null;

      const payload: any = {
        name: data.name,
        email: data.email,
        team: data.team,
        dob: dobForBackend,
        current_password: data.currentPassword || null,
        new_password: data.newPassword || null,
      };

      const updatedUser = await updateProfile(payload);
      setUser(updatedUser);
      showToast('Success', 'Profile updated successfully!', 'success');

      navigation.goBack();
    } catch (err: any) {
      const isNetworkError =
        err.message?.toLowerCase().includes('network') ||
        err.code === 'ERR_NETWORK' ||
        (err.response === undefined && err.request); // <-- best RN check

      if (isNetworkError) {
        showToast(
          'No Internet',
          'Please check your internet connection.',
          'error',
        );
        return;
      }

      showToast(
        'Update failed',
        err.response?.data?.detail || err.message || 'Something went wrong',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* SAFE AREA HEADER */}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          keyboardVisible ? (StatusBar.currentHeight ?? 10) : 0
        }
      >
        <ScrollView
          style={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Svg
            width="100%"
            height={styles.headerBg.height} // ensure this matches your header height
            style={styles.headerBg}
          >
            <Defs>
              <LinearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#592AC7" />
                <Stop offset="100%" stopColor="#CCB6FF" />
              </LinearGradient>
            </Defs>

            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#headerGrad)"
            />
          </Svg>

          {/* 🔙 Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: 15,
              left: 15,
              zIndex: 10,
              padding: 5,
            }}
          >
            <ChevronLeft size={32} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          {/* Profile Image */}
          <View style={styles.editTopWrapper}>
            <View style={styles.header}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require('../../assets/logo/yuvabe-logo.png')
                }
                style={styles.profileImage}
              />

              <TouchableOpacity
                style={styles.changePhotoBtn}
                onPress={pickImage}
              >
                <Text style={styles.changePhotoText}>Change image</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name */}
            <Text style={styles.title}>Personal Details</Text>
            <Text style={styles.label}>Full Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  style={[styles.input, errors.name && styles.inputError]}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  editable={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={[styles.input, errors.email && styles.inputError]}
                />
              )}
            />

            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
            <Text style={styles.label}>Team</Text>
            <Controller
              control={control}
              name="team"
              render={({ field }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  editable={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={[styles.input, errors.email && styles.inputError]}
                />
              )}
            />
            {/* DOB */}
            <Text style={styles.label}>Date of Birth</Text>
            <Controller
              control={control}
              name="dob"
              render={({ field }) => (
                <>
                  <TouchableOpacity onPress={() => setShowDobPicker(true)}>
                    <TextInput
                      value={field.value}
                      editable={false}
                      placeholder="DD-MM-YYYY"
                      style={[styles.input, errors.dob && styles.inputError]}
                    />
                  </TouchableOpacity>

                  {showDobPicker && (
                    <DateTimePicker
                      value={
                        field.value
                          ? new Date(ddmmyyyyToISO(field.value))
                          : new Date(2000, 0, 1)
                      }
                      mode="date"
                      display={
                        Platform.OS === 'android' ? 'calendar' : 'spinner'
                      }
                      onChange={onDobChange(field.onChange)}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              )}
            />
            {errors.dob && (
              <Text style={styles.errorText}>{errors.dob.message}</Text>
            )}

            {/* Password Dropdown */}
            <TouchableOpacity
              style={styles.dropdownHeader}
              onPress={togglePasswordSection}
            >
              <Text style={styles.dropdownHeaderText}>Change Password</Text>
              {showPasswordSection ? (
                <ChevronUp size={22} color="#444" />
              ) : (
                <ChevronDown size={22} color="#444" />
              )}
            </TouchableOpacity>

            {/* Animated Password Content */}
            <Animated.View
              style={{ height: animatedHeight, overflow: 'hidden' }}
            >
              <View onLayout={onPasswordLayout} style={{ paddingTop: 8 }}>
                <Text style={styles.label}>Current Password</Text>
                <Controller
                  control={control}
                  name="currentPassword"
                  render={({ field }) => (
                    <>
                      <PasswordInput
                        field={field}
                        error={errors.currentPassword}
                        placeholder="Current password"
                      />
                      {errors.currentPassword && (
                        <Text style={styles.errorText}>
                          {errors.currentPassword.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Text style={styles.label}>New Password</Text>
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field }) => (
                    <>
                      <PasswordInput
                        field={field}
                        error={errors.newPassword}
                        placeholder="New password"
                      />
                      {errors.newPassword && (
                        <Text style={styles.errorText}>
                          {errors.newPassword.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Text style={styles.label}>Confirm New Password</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <PasswordInput
                      field={field}
                      error={errors.confirmPassword}
                      placeholder="Confirm new password"
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            </Animated.View>

            {/* Save Button */}
            <TouchableOpacity
              disabled={loading}
              onPress={handleSubmit(onSubmit)}
              style={styles.saveBtn}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
