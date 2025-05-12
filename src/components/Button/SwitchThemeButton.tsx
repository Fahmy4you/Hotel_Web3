"use client"
import { FiSun } from "react-icons/fi";
import { LuMoon } from "react-icons/lu";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../../../libs/store';
import { toggleTheme } from "../../../libs/slices/themeSlices";

const SwitchThemeButton = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);


  return (
    <button className={`iconMode ${darkMode && 'active'}`} onClick={() => dispatch(toggleTheme())}>
      <LuMoon/>
      <FiSun/>
    </button>
  )
}

export default SwitchThemeButton
