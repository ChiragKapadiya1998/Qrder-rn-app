import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { commonFontStyle, hp, SCREEN_HEIGHT, SCREEN_WIDTH, wp } from '../theme/fonts';
import CCModal from './CCModal';
import PrimaryButton from './PrimaryButton';
import { Icons } from '../utils/images';
import { strings } from '../i18n/i18n';
import Spacer from './Spacer';
import Input from './Input';
import { waterBottleAction } from '../actions/commonAction';
import { errorToast } from '../utils/commonFunction';
import { useAppDispatch } from '../redux/hooks';
type Props = {
    data: { label: string; value: string }[];
    selectedValue: string;
    onSelect: (value: string) => void;
    dropdownWidth?: number
};

const DropdownComponent = ({
    data,
    selectedValue,
    onSelect,
    dropdownWidth = 0.25 }: Props) => {
    const { colors, isDark } = useTheme();
    const dispatch = useAppDispatch();
    const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleSelect = (value: string) => {
        onSelect(value);
        setDropdownVisible(false);
    };

    return (
        <View>
            <TouchableOpacity
                style={[styles.dropdownButton]}
                onPress={toggleDropdown}
            >
                <Text style={styles.selectedText}>{data.find(item => item.value === selectedValue)?.label}</Text>
                <Image source={Icons.drop_down} style={styles.dwonIcon} />
            </TouchableOpacity>

            {dropdownVisible && (
                <View style={[styles.dropdownContainer, { width: SCREEN_WIDTH * dropdownWidth }]}>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.dropdownItem, { backgroundColor: item.value === selectedValue ? colors.border : colors.cards_bg }]}
                                onPress={() => handleSelect(item.value)}
                            >
                                <Text style={styles.itemText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

export default DropdownComponent;

const getGlobalStyles = (props: any) => {
    const { colors } = props;
    return StyleSheet.create({
        dropdownButton: {
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            flexDirection: 'row'
        },
        selectedText: {
            marginRight: wp(10),
            ...commonFontStyle(400, 12, colors.text_orange),
        },
        dwonIcon: {
            marginTop: 2,
            width: 10, height: 10, resizeMode: 'contain',
            tintColor: colors.text_orange
        },
        dropdownContainer: {
            position: 'absolute',
            top: SCREEN_HEIGHT * 0.03,
            right: SCREEN_WIDTH * (-0.05),
            backgroundColor: colors.cards_bg,
            borderRadius: 12,
            elevation: 2,
        },
        dropdownItem: {
            paddingHorizontal: 10,
            paddingVertical: 15,
        },
        itemText: {
            textAlign: 'center',
            ...commonFontStyle(400, 14, colors.black),
        },
    });
};
