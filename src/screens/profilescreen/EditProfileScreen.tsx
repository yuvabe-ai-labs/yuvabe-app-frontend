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
  LayoutChangeEvent,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);

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
    const [year, month, day] = iso.split('-');
    return `${day}-${month}-${year}`;
  };

  const toDDMMYYYY = (dob: string | null) => {
    if (!dob) return null;
    const [day, month, year] = dob.split('-');
    return `${day}.${month}.${year}`;
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
    const iso = selectedDate.toISOString().split('T')[0];
    onChange(iso);
  };

  const ddmmyyyyToISO = (dob: string) => {
    const [day, month, year] = dob.split('-');
    return `${year}-${month}-${day}`;
  };

  const onSubmit = async (data: EditProfileForm) => {
    setLoading(true);
    try {
      const dobForBackend = data.dob ? toDDMMYYYY(data.dob) : null;

      const payload: any = {
        name: data.name,
        email: data.email,
        dob: dobForBackend,
        current_password: data.currentPassword || null,
        new_password: data.newPassword || null,
      };

      const updatedUser = await updateProfile(payload);
      setUser(updatedUser);
      showToast('Success', 'Profile updated successfully!',"success");

      navigation.goBack();
    } catch (err: any) {
      showToast('Update failed', err.message || 'Something went wrong',"error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* SAFE AREA HEADER */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: '#fff',
        }}
      >
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '600',
          }}
        >
          Edit Profile
        </Text>

        {/* Logo */}
        {/* <Image
          source={require('../../assets/logo/yuvabe-logo.png')}
          style={{ width: 35, height: 35, resizeMode: 'contain' }}
        /> */}
      </View>

      <ScrollView
        style={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Image */}
        <View style={styles.header}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../../assets/logo/yuvabe-logo.png')
            }
            style={styles.profileImage}
          />

          <TouchableOpacity style={styles.changePhotoBtn} onPress={pickImage}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name */}
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
                    placeholder="YYYY-MM-DD"
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
                    display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
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
          <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
            <View onLayout={onPasswordLayout} style={{ paddingTop: 8 }}>
              <Text style={styles.label}>Current Password</Text>
              <Controller
                control={control}
                name="currentPassword"
                render={({ field }) => (
                  <PasswordInput
                    field={field}
                    error={errors.currentPassword}
                    placeholder="Current password"
                  />
                )}
              />

              <Text style={styles.label}>New Password</Text>
              <Controller
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <PasswordInput
                    field={field}
                    error={errors.newPassword}
                    placeholder="New password"
                  />
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
    </SafeAreaView>
  );
};

export default EditProfileScreen;
