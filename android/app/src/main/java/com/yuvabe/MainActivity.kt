package com.yuvabe

import android.os.Bundle                          // 👈 added
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash     // 👈 added

class MainActivity : ReactActivity() {

  // 👇 add this onCreate
  override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this, R.style.BootTheme)  // 👈 show native splash
    super.onCreate(savedInstanceState)
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Yuvabe"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
