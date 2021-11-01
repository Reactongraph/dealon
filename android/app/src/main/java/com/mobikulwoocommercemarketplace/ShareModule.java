package com.mobikulwoocommercemarketplace;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ShareModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;
    private int INTENT_CHECK = 100;

    public ShareModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @ReactMethod
    public void shareProduct(String uri) {

        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.putExtra(Intent.EXTRA_TEXT,uri);
        intent.setType("text/plain");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
            reactContext.startActivityForResult(Intent.createChooser(intent, "Share product:", null), INTENT_CHECK,null);
        } else {
            reactContext.startActivityForResult(intent, INTENT_CHECK,null);
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "ShareNative";
    }
}
