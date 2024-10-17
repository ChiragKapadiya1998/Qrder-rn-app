import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef } from 'react';
import { useTheme } from '@react-navigation/native';
import { commonFontStyle, hp } from '../theme/fonts';
import NoDataFound from './NoDataFound';
import { useAppSelector } from '../redux/hooks';
import Loader from './Loader';
import CartMenuItems from './CartMenuItems';
import { strings } from '../i18n/i18n';

type Props = {
  onRefresh?: () => void;
  refreshing: boolean;
  loadMoreData: () => void;
  loadingMore: boolean;
  onMomentumScrollBegin: () => void;
  loading: boolean
};

const CartMenuCardList = ({ onRefresh, refreshing, loadMoreData, loadingMore, onMomentumScrollBegin, loading }: Props) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const { getCanteenMenuData, canteenMenuCount } = useAppSelector(state => state.data);
  const currentData = useRef();
  currentData.current = getCanteenMenuData;

  const hasMoreItems = currentData.current?.length < canteenMenuCount;

  return (
    <View>

      {currentData.current && (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={currentData.current}
          onMomentumScrollBegin={onMomentumScrollBegin}
          numColumns={2}
          windowSize={10}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapperStyle}
          contentContainerStyle={{ gap: 11 }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListFooterComponent={() => (
            <View>
              {hasMoreItems && !loadingMore && (
                <TouchableOpacity
                  onPress={loadMoreData}
                  style={[styles.seeMoreButton]}
                >
                  <Text style={styles.seeMoreText}>
                    {strings('CardMenuList.see_more')}
                  </Text>
                </TouchableOpacity>
              )}
              {loadingMore && (
                <View style={styles.seeMoreButton}>
                  <ActivityIndicator size={'small'} color={colors.black} />
                </View>

              )}
              <View style={{ height: hp(30) }} />
            </View>
          )}
          ListEmptyComponent={!loading && (
            <NoDataFound />
          )}
          renderItem={({ item, index }) => (
            <CartMenuItems
              item={item}
              index={index}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default CartMenuCardList;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    itemsText: {
      ...commonFontStyle(400, 14, colors.gray_400),
    },
    containerContain: {
      alignSelf: 'center',
      ...commonFontStyle(400, 16, colors.black),
    },
    btnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    columnWrapperStyle: {
      justifyContent: 'center',
    },
    seeMoreButton: {
      alignItems: 'center',
      paddingVertical: 10,
    },
    seeMoreText: {
      color: colors.black,
    },
  });
};
