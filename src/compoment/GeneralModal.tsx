import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../theme/fonts';
import CCModal from './CCModal';
import PrimaryButton from './PrimaryButton';
import {Icons} from '../utils/images';
import {strings} from '../i18n/i18n';
import Spacer from './Spacer';
import Input from './Input';
import {waterBottleAction} from '../actions/commonAction';
import {errorToast} from '../utils/commonFunction';
import {useAppDispatch} from '../redux/hooks';
type Props = {
  visible?: boolean;
  closeModal: () => void;
  onPressDelete: () => void;
  title?: string;
  leftText: string;
  rightText: string;
  isShowDiscount?: boolean;
  isShowLogOut?: boolean;
  isShowLotSize?: boolean;
  setDiscountText?: any;
  discountText?: string;
  loading?: boolean;
  setLoading?: boolean;
};

const GeneralModal = ({
  visible,
  closeModal,
  title,
  onPressDelete,
  leftText,
  rightText,
  isShowDiscount = false,
  isShowLogOut = false,
  isShowLotSize = false,
  setDiscountText,
  discountText,
  loading,
  setLoading,
}: Props) => {
  const {colors, isDark} = useTheme();
  const dispatch = useAppDispatch();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  const [lotSizeText, setLotSizeText] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState('500ml');

  const options = ['500ml', '1000ml'];

  const onOrderBottle = () => {
    if (lotSizeText.trim().length === 0) {
      errorToast(strings('supportText.e_lot_size'));
    } else {
      setLoading(true);
      //   let data = new FormData();
      //   data.append('lot_size', lotSizeText);
      //   data.append('size', selectedOption);

      let userInfo = {
        data: {
          lot_size: Number(lotSizeText),
          size: selectedOption,
        },
        onSuccess: res => {
          setLotSizeText('');
          setSelectedIndex('');
          setLoading(false);
          setTimeout(() => {
            closeModal();
          }, 200);
        },
        onFailure: (Err: any) => {
          if (Err !== undefined) {
            setLoading(false);
            errorToast(Err?.message);
          }
          setLoading(false);
        },
      };
      dispatch(waterBottleAction(userInfo));
    }
  };

  return (
    <View>
      <CCModal
        visible={visible}
        close={closeModal}
        containStyle={{
          alignItems: 'center',
          paddingVertical: hp(16),
          backgroundColor: colors.cards_bg,
        }}
        contain={
          <View>
            {isShowDiscount && (
              <Input
                value={discountText}
                placeholder={strings('supportText.enter_discount')}
                label={strings('supportText.enter_discount')}
                onChangeText={(t: string) => setDiscountText(t)}
                isShowLabel={true}
                keyboardType={'number-pad'}
                inputStyle={styles.inputStyle}
              />
            )}
            {isShowLogOut && (
              <>
                <View style={styles.logoIcon}>
                  <Image source={Icons.ic_log} style={styles.logoutIcon} />
                  <Text style={styles.logoutText}>
                    {strings('profileScreen.log_out')}
                  </Text>
                </View>

                <Text style={styles.containerContain}>{title}</Text>
              </>
            )}
            {isShowLotSize && (
              <View>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedOption(option)} // Set the option value on press
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: index > 0 ? 16 : 0,
                      gap: 10,
                    }}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor:
                          selectedOption === option
                            ? colors.white
                            : colors.title_dec, // Check if the current option is selected
                        backgroundColor:
                          selectedOption === option
                            ? colors.blue
                            : colors.input_bg,
                      }}>
                      {selectedOption === option && (
                        <Image
                          source={Icons.ic_check}
                          style={styles.ic_check}
                        /> // Show check icon if option is selected
                      )}
                    </View>
                    <Text style={styles.text1}>{option}</Text>
                  </TouchableOpacity>
                ))}
                <Input
                  value={lotSizeText}
                  placeholder={strings('supportText.enter_lot_size')}
                  label={strings('supportText.enter_lot_size')}
                  onChangeText={(t: string) => setLotSizeText(t)}
                  isShowLabel={true}
                  inputStyle={styles.inputStyle}
                />
              </View>
            )}
            <View style={styles.underLine} />
            <View style={styles.btnContainer}>
              <PrimaryButton
                extraStyle={styles.cancelBtn}
                title={leftText}
                titleStyle={styles.cancelText}
                onPress={closeModal}
              />
              <Spacer width={16} />
              <PrimaryButton
                extraStyle={styles.accpetBtn}
                title={rightText}
                titleStyle={styles.accpetText}
                onPress={() =>
                  isShowLotSize ? onOrderBottle() : onPressDelete()
                }
                isLoading={loading}
              />
            </View>
          </View>
        }
      />
    </View>
  );
};

export default GeneralModal;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    containerContain: {
      alignSelf: 'center',
      marginTop: hp(8),
      ...commonFontStyle(400, 14, colors.text_gray),
    },
    logoIcon: {
      alignItems: 'center',
      paddingTop: hp(16),
    },
    btnContainer: {
      flexDirection: 'row',
    },
    logoutIcon: {
      width: wp(60),
      height: hp(60),
      resizeMode: 'contain',
    },
    logoutText: {
      marginTop: hp(10),
      ...commonFontStyle(700, 18, colors.black),
    },
    cancelBtn: {
      width: SCREEN_WIDTH * 0.39,
      height: hp(50),
      backgroundColor: colors.cards_bg,
      borderColor: colors.text_orange,
      borderWidth: 1,
      borderRadius: 50,
    },
    cancelText: {
      ...commonFontStyle(600, 16, colors?.text_orange),
      textTransform: 'none',
    },
    accpetBtn: {
      width: SCREEN_WIDTH * 0.39,
      height: hp(50),
      backgroundColor: colors.text_orange,
      borderColor: colors.text_orange,
      borderWidth: 1,
      borderRadius: 50,
    },
    accpetText: {
      ...commonFontStyle(600, 16, colors?.defult_white),
      textTransform: 'none',
    },
    underLine: {
      marginTop: hp(24),
      marginBottom: hp(16),
      height: 1,
      backgroundColor: colors.border,
    },
    inputStyle: {
      borderColor: colors.title_dec100,
    },
    ic_check: {
      width: 11,
      height: 11,
      resizeMode: 'contain',
    },
    text1: {
      ...commonFontStyle(500, 14, colors?.title_dec100),
    },
  });
};
