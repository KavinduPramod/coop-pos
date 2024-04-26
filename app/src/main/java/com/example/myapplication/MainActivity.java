package com.example.myapplication;

import android.annotation.SuppressLint;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;


import com.sunmi.peripheral.printer.SunmiPrinterService;

public class MainActivity extends AppCompatActivity {
    private WebView mWebView;
    private SunmiPrinterService woyouService;
    private boolean isServiceConnected = false;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mWebView = findViewById(R.id.webView);
        mWebView.getSettings().setDefaultTextEncodingName("utf-8");
        mWebView.getSettings().setJavaScriptEnabled(true);
        mWebView.setWebChromeClient(new WebChromeClient());
        mWebView.setWebViewClient(new WebViewClientDemo()); // Use the custom WebViewClientDemo
        // Load the HTML file from assets
        mWebView.loadUrl("https://dynamic-bavarois-c43f31.netlify.app/");
        mWebView.addJavascriptInterface(new JsObject(), "lee");
    }

    // Custom WebViewClient to handle page loading and adding JavascriptInterface
    private class WebViewClientDemo extends WebViewClient {

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            // Register JavascriptInterface after page load finishes
            mWebView.addJavascriptInterface(new JsObject(), "lee");
        }
    }

    // JavaScript Interface class to be used in WebView
    public class JsObject {
        // Method to be called from JavaScript
        @JavascriptInterface
        public void funAndroid(String base64Data) {
            // This method will be called when the JavaScript function is invoked
            // Use this method to handle the data received from JavaScript
            Toast.makeText(getApplicationContext(), "Received data from JavaScript", Toast.LENGTH_SHORT).show();

            // Log the received Base64 string
            Log.d("Base64String", base64Data);

            // Convert Base64 string to Bitmap
            try {
                byte[] decodedString = Base64.decode(base64Data.substring(base64Data.indexOf(",") + 1), Base64.DEFAULT);
                Bitmap originalBitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);

                // Resize the bitmap to fit the paper width (48mm or 384 pixels)
                Bitmap resizedBitmap = Bitmap.createScaledBitmap(originalBitmap,384 , originalBitmap.getHeight(), true);

                if (resizedBitmap != null) {
                    Log.d("Bitmap", "Bitmap resized successfully.");
                } else {
                    Log.d("Bitmap", "Failed to resize bitmap.");
                }

                // Additional logic for printing via AIDL or Bluetooth can be implemented here
                if (isServiceConnected) {
                    initializePrintService(resizedBitmap);
                } else {
                    Toast.makeText(getApplicationContext(), "Printer service is not connected yet", Toast.LENGTH_SHORT).show();
                }
            } catch (IllegalArgumentException e) {
                e.printStackTrace();
                // Handle the invalid Base64 string here
                Toast.makeText(getApplicationContext(), "Invalid Base64 string", Toast.LENGTH_SHORT).show();
            }
        }
    }

    // Binding service for printer
    private ServiceConnection connService = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            woyouService = SunmiPrinterService.Stub.asInterface(iBinder);
            Log.d("PrinterService", "Service connected");
            isServiceConnected = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            woyouService = null;
            Log.d("PrinterService", "Service disconnected");
            isServiceConnected = false;
        }
    };

    // Method to initialize print service and print the receipt
    private void initializePrintService(Bitmap receiptData) {
        if (woyouService == null) {
            Toast.makeText(getApplicationContext(), "Printer service is not available", Toast.LENGTH_SHORT).show();
            return;
        }
        try {
            Log.d("String", "Printing Initialized");
            // Advance the paper by 5 lines (adjust as needed)
            woyouService.printBitmap(receiptData, null);
            woyouService.lineWrap(5, null);
            // Disconnect the service after printing
            unbindService(connService);
            bindPrinterService();
        } catch (RemoteException e) {
            e.printStackTrace();
            Log.e("PrintingException", "Error occurred while printing", e);
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        bindPrinterService();
    }

    @Override
    protected void onStop() {
        super.onStop();
        unbindService(connService);
    }

    private void bindPrinterService() {
        Intent intent = new Intent();
        intent.setPackage("woyou.aidlservice.jiuiv5");
        intent.setAction("woyou.aidlservice.jiuiv5.IWoyouService");
        bindService(intent, connService, Context.BIND_AUTO_CREATE);
    }
}
