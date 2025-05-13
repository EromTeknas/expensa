import COLORS from 'src/constants/colors';

const HeaderStyles = () => {
  return {
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    headerTintColor: COLORS.accent,
    headerTitleStyle: {color: COLORS.grey[100]},
    headerStyle: {backgroundColor: COLORS.grey[800]},
    contentStyle: {
      backgroundColor: COLORS.grey[200],
    },
  };
};

export default HeaderStyles;
