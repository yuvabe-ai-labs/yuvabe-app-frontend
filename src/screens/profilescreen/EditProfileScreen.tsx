import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
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
import Icon from 'react-native-vector-icons/Feather';
import { updateProfile } from '../../api/profile-api/profileApi';
import {
  EditProfileForm,
  editProfileSchema,
} from '../../schemas/profileSchema';
import { useUserStore } from '../../store/useUserStore';
import { styles } from './EditProfileStyles';
import { showToast } from '../../utils/ToastHelper';

// ---------- Password input with eye inside right edge ----------
const PasswordInput = ({
  field,
  error,
  placeholder,
}: {
  field: any;
  error?: any;
  placeholder?: string;
}) => {
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
        onPress={() => setShow(s => !s)}
        style={{
          position: 'absolute',
          right: 12,
          top: 12,
          height: 36,
          width: 36,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <Icon name={show ? 'eye' : 'eye-off'} size={20} color="#6b6b6b" />
      </TouchableOpacity>
    </View>
  );
};

const EditProfileScreen = ({ navigation }: any) => {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);

  console.log('🔥 EditProfileScreen mounted');

  //   useEffect(() => {
  //     console.log('📌 Zustand user on first render:', user);
  //   }, []);

  // image local preview
  const [profileImage, setProfileImage] = useState<string | undefined>(
    typeof user?.profile_picture === 'string'
      ? user?.profile_picture
      : undefined,
  );

  // DOB picker
  const [showDobPicker, setShowDobPicker] = useState(false);

  // Password section animation
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
    // Convert DD-MM-YYYY → DD.MM.YYYY
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
      // user.dob expected to be ISO from backend like 1998-05-28
      dob: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  useEffect(() => {
    console.log("🟦 useEffect triggered because 'user' changed");
    console.log('➡️ Current user:', user);

    if (user) {
      console.log('🟩 user.dob BEFORE convert:', user.dob);

      const formattedDob = user.dob ? isoToDDMMYYYY(user.dob) : '';
      reset({
        name: user.name || '',
        email: user.email || '',
        dob: formattedDob, // show DD-MM-YYYY in UI
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      console.log('✅ reset() CALLED with:', {
        name: user.name,
        email: user.email,
        dob: formattedDob,
      });
    } else {
      console.log('❌ user is NULL in useEffect');
    }
  }, [user, reset]);

  console.log('🟧 defaultValues used:', {
    name: user?.name,
    email: user?.email,
    dob: '',
  });

  // ---------- Image picker (local only) ----------
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.log('Image Picker Error:', response.errorMessage);
          showToast(
            'Image Error',
            response.errorMessage || 'Failed to pick image',
          );
          return;
        }

        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setProfileImage(uri);

          // update Zustand only (we are not sending profile picture to backend)
          setUser({
            ...user!,
            profile_picture: uri,
          });
        }
      },
    );
  };

  // ---------- Toggle password dropdown (animate) ----------
  const togglePasswordSection = () => {
    const toValue = showPasswordSection ? 0 : contentHeightRef.current || 160;
    setShowPasswordSection(prev => !prev);

    Animated.timing(animatedHeight, {
      toValue,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const onPasswordLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    contentHeightRef.current = h;
    if (showPasswordSection) {
      animatedHeight.setValue(h);
    }
  };

  // ---------- Date change handler ----------
  const onDobChange =
    (onChange: (v: string) => void) => (event: any, selectedDate?: Date) => {
      setShowDobPicker(false);
      if (!selectedDate) return;
      // store ISO for display and form value (YYYY-MM-DD)
      const iso = selectedDate.toISOString().split('T')[0];
      onChange(iso);
    };

  // ---------- Submit ----------
  const onSubmit = async (data: EditProfileForm) => {
    setLoading(true);
    try {
      // backend expects DD.MM.YYYY (your service parses that format)
      const dobForBackend = data.dob ? toDDMMYYYY(data.dob) : null;

      const payload: any = {
        name: data.name,
        email: data.email,
        dob: dobForBackend,
        current_password: data.currentPassword || null,
        new_password: data.newPassword || null,
      };

      const updatedUser = await updateProfile(payload);
      // update Zustand store with returned user (assumed shape matches)
      setUser(updatedUser);

      navigation.goBack();
    } catch (err: any) {
      console.error('Update profile failed', err);
      showToast('Update failed', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
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

      <View style={styles.formContainer}>
        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={value}
              onChangeText={onChange}
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
          render={({ field: { value, onChange } }) => (
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, errors.email && styles.inputError]}
              value={value}
              editable={false}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        {/* DOB (touchable input to open date picker) */}
        <Text style={styles.label}>Date of Birth</Text>
        <Controller
          control={control}
          name="dob"
          render={({ field: { value, onChange } }) => (
            <>
              <TouchableOpacity onPress={() => setShowDobPicker(true)}>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  style={[styles.input, errors.dob && styles.inputError]}
                  value={value}
                  editable={false}
                />
              </TouchableOpacity>

              {showDobPicker && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date(1998, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
                  onChange={onDobChange(onChange)}
                  maximumDate={new Date()}
                />
              )}
            </>
          )}
        />
        {errors.dob && (
          <Text style={styles.errorText}>{errors.dob.message}</Text>
        )}

        {/* Password section header (toggle) */}
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={togglePasswordSection}
        >
          <Text style={styles.dropdownHeaderText}>Change Password</Text>
          <Icon
            name={showPasswordSection ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#444"
          />
        </TouchableOpacity>

        {/* Animated password content */}
        <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
          <View onLayout={onPasswordLayout} style={{ paddingTop: 6 }}>
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

        {/* Save */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;
