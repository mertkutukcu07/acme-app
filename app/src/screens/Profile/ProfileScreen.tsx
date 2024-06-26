import { StyleSheet } from "react-native";
import React from "react";
import { DateTimePicker, Message, ProfileForm, Screen } from "@/components";
import { TabStackScreenProps } from "@/navigation/stacks/TabStack";
import { RouteNames } from "@/navigation/RouteNames";
import { useLanguage } from "@/providers/LanguageProvider";
import moment from "moment";
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfile } from "@/api/services/profile";
import { ProfileUpdateData } from "@/api/services/profile/types";
import { goBack } from "@/navigation/navigationUtilities";
import { verticalScale } from "@/utils/WindowSize";

interface ProfileScreenProps extends TabStackScreenProps<RouteNames.PROFILE> {}

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { t } = useLanguage();
  const [date, setDate] = React.useState(new Date());
  const [isVisible, setDatePickerVisibility] = React.useState(false);
  const userInfo = useAuthStore((state) => state.userInfo);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile({
    onError: (error) => {
      Message({
        type: "error",
        // @ts-ignore
        message: error.response?.data.message,
      });
    },
    onSuccess: async (data) => {
      setUserInfo(data);
      goBack();
      Message({
        type: "success",
        message: t("profile.updateSuccess"),
      });
    },
  });
  const onSubmit = (data: ProfileUpdateData) => {
    updateProfile({
      dateOfBirth: moment(date).format("YYYY-MM-DD"),
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      address: {
        city: data.city,
        country: data.country,
        details: data.address,
      },
      profileImage: data.profileImage,
    });
  };

  const onConfirm = (date: Date) => {
    setDate(date);
    setDatePickerVisibility(false);
  };

  return (
    <Screen edges={[]} preset="scroll">
      <ProfileForm
        onSubmit={onSubmit}
        onDateOfBirthPress={() => setDatePickerVisibility(true)}
        dateOfBirth={date}
        userInfo={userInfo}
        isPending={isPending}
      />

      {isVisible && (
        <DateTimePicker
          isVisible={isVisible}
          setDatePickerVisibility={setDatePickerVisibility}
          onConfirm={(date: Date) => {
            onConfirm(date);
          }}
          mode="date"
        />
      )}
    </Screen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  sectionHeader: {
    marginVertical: verticalScale(20),
  },
});
