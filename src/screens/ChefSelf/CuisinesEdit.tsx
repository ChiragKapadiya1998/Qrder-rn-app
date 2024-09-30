import { Alert, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import HomeHeader from '../../compoment/HomeHeader';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { strings } from '../../i18n/i18n';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import Input from '../../compoment/Input';
import { Icons } from '../../utils/images';
import ImageCropPicker from 'react-native-image-crop-picker';
import PrimaryButton from '../../compoment/PrimaryButton';
import Spacer from '../../compoment/Spacer';
import { infoToast } from '../../utils/commonFunction';
import { addCuisinesAction } from '../../actions/cuisinesAction';
import { getAsyncUserInfo } from '../../utils/asyncStorageManager';

export interface ListObj {
    title: string;
    iconName?: any;
    images?: string[];
    name?: string;
    cuisine_name?: string;
    price?: number;
}
type ItemProps = {
    item: ListObj;
};


const CuisinesEdit = ({ item }: ItemProps) => {
    const { colors } = useTheme();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [cuisineName, seCuisineName] = useState('');
    const [photoUri, setPhotoUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isDarkTheme } = useAppSelector(state => state.common);
    const dispatch = useAppDispatch();

    const onPressNewAdd = async () => {
        if (cuisineName == '') {
            infoToast(strings("addFoodList.error_enter"))
        } else {
            setLoading(true)
            const userDetails = await getAsyncUserInfo()

            let data = new FormData();
            data.append('name', cuisineName);
            data.append('parent_id', userDetails?.id);

            let obj = {
                data,
                onSuccess: (response: any) => {
                    navigation.goBack()
                    seCuisineName("")
                    setLoading(false)
                },
                onFailure: (Err: any) => {
                    if (Err != undefined) {
                        Alert.alert('Warning', Err?.message);
                    }
                    setLoading(false)
                },
            };
            dispatch(addCuisinesAction(obj));
        }
    };


    const hideMenu = () => setVisible(false);

    const showMenu = () => setVisible(true);

    const onPressDelete = () => {
        setDelete(true);
    };


    const selectImage = () => {
        setLoading(true);
        ImageCropPicker.openPicker({
            width: 100,
            height: 100,
            cropping: true,
        })
            .then(image => {
                setPhotoUri(image.path);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
                backgroundColor={colors.white}
            />
            <HomeHeader
                onBackPress={() => {
                    navigation.goBack();
                }}
                mainShow={true}
                title={strings('CuisinesNameList.add_cuisines')}
                extraStyle={styles.headerContainer}
                isShowIcon={false}
            />
            <View style={styles.contentContainer}>
                <Input
                    value={cuisineName}
                    placeholder={strings('CuisinesNameList.add_cuisines')}
                    label={strings('CuisinesNameList.cuisines_name')}
                    onChangeText={(t: string) => seCuisineName(t)}
                    isShowLabel={true}
                    inputStyle={styles.inputStyle}
                />
                <View style={styles.profileContainer}>
                    <View>
                        <Image
                            source={photoUri ? { uri: photoUri } : Icons.profileImage}
                            style={styles.profilImage}
                        />
                        <TouchableOpacity activeOpacity={0.9} onPress={selectImage} style={styles.editImage}>
                            <Image source={Icons.editPencial} style={styles.profileIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <PrimaryButton
                    extraStyle={styles.submitButton}
                    onPress={onPressNewAdd}
                    title={strings('CuisinesNameList.submit')}
                    titleStyle={styles.submitText}
                    isLoading={loading}
                />
                <Spacer width={16} />
                <PrimaryButton
                    extraStyle={styles.cancelBtn}
                    // onPress={onPressEditDone}
                    title={strings('CuisinesNameList.cancel')}
                    titleStyle={styles.cancelText}
                />
            </View>
        </View>
    );

}
export default CuisinesEdit

const getGlobalStyles = (props: any) => {
    const { colors } = props;
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.bg_white,
        },
        contentContainer: {
            flex: 1,
            marginHorizontal: wp(20),
        },
        profileContainer: {
            justifyContent: 'flex-start',
            alignSelf: 'flex-start',
            alignItems: 'center',
            marginTop: hp(13)
        },
        profilImage: {
            width: wp(99),
            height: wp(99),
            borderRadius: wp(99),
            borderColor: colors.text_orange,
            borderWidth: 1,
            backgroundColor: colors.bg_orange200,
        },
        editImage: {
            width: wp(30),
            height: wp(30),
            borderRadius: wp(15),
            backgroundColor: colors.Primary_Orange,
            borderColor: colors.white,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 2,
            right: 0
        },
        profileIcon: {
            width: 16,
            height: 16,
            resizeMode: 'contain',
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: wp(20),
            paddingBottom: hp(10),
        },
        submitButton: {
            flex: 1,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
        },
        cancelBtn: {
            flex: 1,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.white,
            borderColor: colors.text_gray,
            borderWidth: 1
        },
        submitText: {
            ...commonFontStyle(600, 18, colors.defult_white),
        },
        cancelText: {
            ...commonFontStyle(600, 18, colors.title_dec100),
        },
    });
};
