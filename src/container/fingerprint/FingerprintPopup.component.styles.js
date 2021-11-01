import ThemeConstant from "../../app_constant/ThemeConstant";

export default {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, .3)",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: ThemeConstant.MARGIN_NORMAL,
  }, 
  logo: {
    marginVertical: 45,
  },
  heading: {
    textAlign: 'center',
    color: '#00a4de',
    fontSize: 21,
  },
  description: (error) => ({
    textAlign: 'center',
    color: error ? '#ea3d13' : ThemeConstant.DEFAULT_TEXT_COLOR,
    height: 65,
    fontSize:ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginVertical: ThemeConstant.MARGIN_GENERIC,
    marginHorizontal: ThemeConstant.MARGIN_LARGE,
  }),
  buttonContainer: {
    padding: 20,
  },
  buttonText: {
    color: ThemeConstant.ACCENT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: 'bold',
  },
};
