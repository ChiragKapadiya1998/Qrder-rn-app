import { Alert, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { infoToast } from '../../utils/commonFunction';
import { strings } from '../../i18n/i18n';
import HomeHeader from '../../compoment/HomeHeader';
import Input from '../../compoment/Input';
import PrimaryButton from '../../compoment/PrimaryButton';
import Spacer from '../../compoment/Spacer';
import { commonFontStyle, hp, wp } from '../../theme/fonts';
import { Icons } from '../../utils/images';

const AddRecipesMasters = () => {
    const { colors } = useTheme();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const navigation = useNavigation();
    const [recipesList, setRecipesList] = useState([{ recipesName: '', materialName: '', stockName: '', unitName: '' }]);
    const [loading, setLoading] = useState(false);
    const { isDarkTheme } = useAppSelector(state => state.common);
    const dispatch = useAppDispatch();

    const goback = () => {
        navigation.goBack();
    }

    const onPressAdd = () => {
        setRecipesList([...recipesList, { recipesName: '', materialName: '', stockName: '', unitName: '' }]);
    }

    const handleInputChange = (index, field, value) => {
        const newList = [...recipesList];
        newList[index][field] = value;
        setRecipesList(newList);
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
                title={strings('profileScreen.recipes_master')}
                extraStyle={styles.headerContainer}
                isShowIcon={false}
            />
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View>
                    {recipesList.map((recipe, index) => (
                        <View key={index}>
                            <Input
                                value={recipe.recipesName}
                                placeholder={strings('recipesMaster.e_recipes_name')}
                                label={strings('recipesMaster.recipes_Name')}
                                onChangeText={(t) => handleInputChange(index, 'recipesName', t)}
                                isShowLabel={true}
                            />
                            <Input
                                value={recipe.materialName}
                                placeholder={strings('recipesMaster.e_material_name')}
                                label={strings('recipesMaster.material_name')}
                                onChangeText={(t) => handleInputChange(index, 'materialName', t)}
                                isShowLabel={true}
                            />
                            <Input
                                value={recipe.stockName}
                                placeholder={strings('recipesMaster.e_stock')}
                                label={strings('recipesMaster.stock')}
                                onChangeText={(t) => handleInputChange(index, 'stockName', t)}
                                isShowLabel={true}
                            />
                            <Input
                                value={recipe.unitName}
                                placeholder={strings('recipesMaster.e_unit')}
                                label={strings('recipesMaster.unit')}
                                onChangeText={(t) => handleInputChange(index, 'unitName', t)}
                                isShowLabel={true}
                            />
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addBtnView} onPress={onPressAdd}>
                        <Image source={Icons.plus} style={styles.plusIcon} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

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
export default AddRecipesMasters

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
        addBtnView: {
            height: hp(52),
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.bg_white,
            borderColor: colors.image_bg,
            borderWidth: 1,
            marginTop: hp(24),
            marginBottom: hp(24),
        },
        plusIcon: {
            width: 14,
            height: 14,
            resizeMode: 'contain',
            tintColor:colors.black
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
