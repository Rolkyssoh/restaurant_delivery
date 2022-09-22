import {View, Text} from 'react-native';
import React, {useMemo, useRef} from 'react';
import {BottomSheet} from '@gorhom/bottom-sheet';

export const BottomSheetDetails = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['15%', '95%'], []);

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={0}>
      <Text>Bottom Sheet Details</Text>
    </BottomSheet>
  );
};
