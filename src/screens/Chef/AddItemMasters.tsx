import { Alert, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { infoToast } from '../../utils/commonFunction';
import { strings } from '../../i18n/i18n';
import { getAsyncUserInfo } from '../../utils/asyncStorageManager';
import HomeHeader from '../../compoment/HomeHeader';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';
import Spacer from '../../compoment/Spacer';
import { commonFontStyle, hp, wp } from '../../theme/fonts';

const AddItemMasters = () => {
    const { colors } = useTheme();
    // const route = useRoute();
    // const { selectList } = route?.params;
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const navigation = useNavigation();
    const [unitName, setUnitName] = useState('');
    const [materialName, setMaterialName] = useState('');
    const [inWeightNmae, setInWeightNmae] = useState('');
    const [loading, setLoading] = useState(false);
    const { isDarkTheme } = useAppSelector(state => state.common);
    const dispatch = useAppDispatch();

    // const onPressEdit = async () => {
    //     if (cuisineName == '') {
    //         infoToast(strings('addFoodList.error_enter'));
    //     } else {
    //         setLoading(true)
    //         const userDetails = await getAsyncUserInfo();
    //         let obj = {
    //             id: selectList?.id,
    //             data: {
    //                 name: cuisineName,
    //                 parent_id: userDetails?.id,
    //             },
    //             onSuccess: (response: any) => {
    //                 navigation.goBack()
    //                 seCuisineName('');
    //                 setLoading(false)
    //             },
    //             onFailure: (Err: any) => {
    //                 if (Err != undefined) {
    //                     Alert.alert('Warning', Err?.message);
    //                 }
    //                 setLoading(false)
    //             },
    //         };
    //         dispatch(editCuisinesAction(obj));
    //     }
    // };

    const goback = () => {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
                backgroundColor={colors.white}
            />
            <HomeHeader
                onBackPress={goback}
                mainShow={true}
                title={strings('itemMastersList.add_item_masters')}
                extraStyle={styles.headerContainer}
                isShowIcon={false}
            />
            <View style={styles.contentContainer}>
                <Input
                    value={materialName}
                    placeholder={strings('recipesMaster.e_material_name')}
                    label={strings('recipesMaster.material_name')}
                    onChangeText={(t: string) => setMaterialName(t)}
                    isShowLabel={true}
                />
                <Input
                    value={unitName}
                    placeholder={strings('recipesMaster.e_unit')}
                    label={strings('recipesMaster.unit')}
                    onChangeText={(t: string) => setUnitName(t)}
                    isShowLabel={true}
                />
                <Input
                    value={inWeightNmae}
                    placeholder={strings('itemMastersList.e_weight')}
                    label={strings('itemMastersList.in_weight')}
                    onChangeText={(t: string) => setInWeightNmae(t)}
                    keyboardType="number-pad"
                    isShowLabel={true}
                />
            </View>

            <View style={styles.buttonContainer}>
                <PrimaryButton
                    extraStyle={styles.submitButton}
                    // onPress={onPressEdit}
                    title={strings('CuisinesNameList.submit')}
                    titleStyle={styles.submitText}
                    isLoading={loading}
                />
                <Spacer width={16} />
                <PrimaryButton
                    extraStyle={styles.cancelBtn}
                    onPress={goback}
                    title={strings('CuisinesNameList.cancel')}
                    titleStyle={styles.cancelText}
                />
            </View>
        </View>
    );

}
export default AddItemMasters

const getGlobalStyles = (props: any) => {
    const { colors } = props;
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.bg_white,
        },
        headerContainer: {
            paddingBottom: hp(4)
        },
        contentContainer: {
            flex: 1,
            marginHorizontal: wp(20),
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
