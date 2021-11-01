package com.reactlibrary;

import com.facebook.react.ReactPackage;

import java.util.ArrayList;
import java.util.List;

public class MainApplication {

    protected List<ReactPackage> getPackages() {
        @SuppressWarnings("UnnecessaryLocalVariable")
//        List<ReactPackage> packages = new PackageList(this).getPackages();
                List<ReactPackage> packages = new ArrayList<ReactPackage>();
        // Packages that cannot be autolinked yet can be added manually here, for example:
        // packages.add(new MyReactNativePackage());
        packages.add(new MobikulToastPackage()); // <-- Add this line with your package name.
        return packages;
    }


}
