package com.reactlibrary;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.HashMap;
import java.util.Map;

import es.dmoral.toasty.Toasty;

public class MobikulToastModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    public MobikulToastModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "MobikulToast";
    }

    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
        // TODO: Implement some actually useful functionality
        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
    }

    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }
    @ReactMethod
    public void success(String message, int duration) {
        Toasty.success(getReactApplicationContext(),message, duration, true).show();
    }
    @ReactMethod
    public void error(String message, int duration) {
        Toasty.error(getReactApplicationContext(),message, duration, true).show();
    }

    @ReactMethod
    public void info(String message, int duration) {
        Toasty.info(getReactApplicationContext(),message, duration, true).show();
    }

    @ReactMethod
    public void warning(String message, int duration) {
        Toasty.warning(getReactApplicationContext(),message, duration, true).show();
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }
}
